import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAppStore } from "@/livestore/store";
import { resumes$, uiState$ } from "@/livestore/queries";
import { events } from "@/livestore/schema";
import { useI18n } from "@/i18n/react";
import {
  MAX_SKILLS,
  emptyResume,
  isResumeData,
  normalizeSkill,
  orderById,
  type EducationEntry,
  type PersonalInfo,
  type ResumeData,
  type WorkExperience,
} from "@/lib/resume";

export type ResumeAction =
  | { type: "update_personal"; field: keyof PersonalInfo; value: string }
  | { type: "add_work"; entry: WorkExperience }
  | { type: "update_work"; id: string; patch: Partial<Omit<WorkExperience, "id">> }
  | { type: "remove_work"; id: string }
  | { type: "set_work_order"; ids: string[] }
  | { type: "add_education"; entry: EducationEntry }
  | { type: "update_education"; id: string; patch: Partial<Omit<EducationEntry, "id">> }
  | { type: "remove_education"; id: string }
  | { type: "set_education_order"; ids: string[] }
  | { type: "add_skill"; skill: string }
  | { type: "remove_skill"; skill: string };

/** A resume document as persisted by LiveStore (one row of the `resumes` table). */
export interface SavedResume {
  id: string;
  name: string;
  data: ResumeData;
  createdAt: Date;
  updatedAt: Date;
}

export type SaveState = "idle" | "dirty" | "saved";

function updateById<T extends { id: string }>(
  items: T[],
  id: string,
  patch: Partial<Omit<T, "id">>,
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case "update_personal":
      return { ...state, personal: { ...state.personal, [action.field]: action.value } };
    case "add_work":
      return { ...state, work: [...state.work, action.entry] };
    case "update_work":
      return { ...state, work: updateById(state.work, action.id, action.patch) };
    case "remove_work":
      return { ...state, work: state.work.filter((entry) => entry.id !== action.id) };
    case "set_work_order":
      return { ...state, work: orderById(state.work, action.ids) };
    case "add_education":
      return { ...state, education: [...state.education, action.entry] };
    case "update_education":
      return { ...state, education: updateById(state.education, action.id, action.patch) };
    case "remove_education":
      return { ...state, education: state.education.filter((entry) => entry.id !== action.id) };
    case "set_education_order":
      return { ...state, education: orderById(state.education, action.ids) };
    case "add_skill": {
      const skill = normalizeSkill(action.skill);
      if (!skill || state.skills.length >= MAX_SKILLS) return state;
      const isDuplicate = state.skills.some(
        (existing) => existing.toLowerCase() === skill.toLowerCase(),
      );
      return isDuplicate ? state : { ...state, skills: [...state.skills, skill] };
    }
    case "remove_skill":
      return { ...state, skills: state.skills.filter((skill) => skill !== action.skill) };
  }
}

/** Key of the pre-LiveStore localStorage persistence; migrated once on first boot. */
const LEGACY_STORAGE_KEY = "resume.dev:data:v1";

function takeLegacyResume(): ResumeData | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    const parsed: unknown = JSON.parse(raw);
    return isResumeData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Saves are debounced so typing produces one event per pause, not per keystroke. */
const SAVE_DEBOUNCE_MS = 400;

/**
 * Single source of truth for the builder, backed by LiveStore (SQLite/OPFS).
 *
 * Editing stays in local component state for instant updates; every change is
 * committed to the store as a debounced `resumeSaved` snapshot and flushed on
 * switch, unmount and page hide. The hook also exposes the document registry
 * (list, create, rename, delete, switch) for the header's resume manager.
 */
export function useResume() {
  const store = useAppStore();
  const { t } = useI18n();
  const rows = store.useQuery(resumes$);
  const resumes = useMemo<SavedResume[]>(
    () =>
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        data: {
          personal: { ...row.data.personal },
          work: row.data.work.map((entry) => ({ ...entry })),
          education: row.data.education.map((entry) => ({ ...entry })),
          skills: [...row.data.skills],
        },
      })),
    [rows],
  );
  const uiState = store.useQuery(uiState$);

  const activeId = useMemo(
    () =>
      uiState.activeResumeId && resumes.some((r) => r.id === uiState.activeResumeId)
        ? uiState.activeResumeId
        : (resumes[0]?.id ?? null),
    [resumes, uiState.activeResumeId],
  );
  const active = resumes.find((resume) => resume.id === activeId) ?? null;

  const [editor, setEditor] = useState<{ id: string | null; data: ResumeData }>(() => ({
    id: null,
    data: emptyResume(),
  }));
  const editorRef = useRef(editor);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const pendingRef = useRef<{ id: string; data: ResumeData } | null>(null);
  const timerRef = useRef(0);

  const flush = useCallback(() => {
    window.clearTimeout(timerRef.current);
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (!pending) return;
    store.commit(events.resumeSaved({ id: pending.id, data: pending.data, savedAt: new Date() }));
    setSaveState("saved");
  }, [store]);

  const scheduleSave = useCallback(
    (id: string, data: ResumeData) => {
      pendingRef.current = { id, data };
      setSaveState("dirty");
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(flush, SAVE_DEBOUNCE_MS);
    },
    [flush],
  );

  /** Hydrates the editor whenever the edited document changes (boot, switch). */
  const hydratedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!active || hydratedRef.current === active.id) return;
    hydratedRef.current = active.id;
    const next = { id: active.id, data: active.data };
    editorRef.current = next;
    setEditor(next);
    setSaveState("idle");
  }, [active]);

  /** Seeds the very first resume, migrating legacy localStorage data if present. */
  const seededRef = useRef(false);
  useEffect(() => {
    if (resumes.length > 0) {
      seededRef.current = true;
      return;
    }
    if (seededRef.current) return;
    seededRef.current = true;
    const legacy = takeLegacyResume();
    const id = crypto.randomUUID();
    const name = legacy?.personal.fullName.trim() || t("resumes.defaultName");
    store.commit(
      events.resumeCreated({ id, name, data: legacy ?? emptyResume(), createdAt: new Date() }),
      events.uiStateSet({ activeResumeId: id }),
    );
  }, [resumes, store, t]);

  /** Keeps the session's selection valid when its resume disappears. */
  useEffect(() => {
    if (resumes.length === 0 || activeId === uiState.activeResumeId) return;
    store.commit(events.uiStateSet({ activeResumeId: activeId }));
  }, [activeId, resumes.length, store, uiState.activeResumeId]);

  const dispatch = useCallback(
    (action: ResumeAction) => {
      const current = editorRef.current;
      if (!current.id) return;
      const data = resumeReducer(current.data, action);
      if (data === current.data) return;
      editorRef.current = { id: current.id, data };
      setEditor(editorRef.current);
      scheduleSave(current.id, data);
    },
    [scheduleSave],
  );

  const createResume = useCallback(
    (name: string, data: ResumeData = emptyResume()) => {
      flush();
      const id = crypto.randomUUID();
      store.commit(
        events.resumeCreated({ id, name, data, createdAt: new Date() }),
        events.uiStateSet({ activeResumeId: id }),
      );
    },
    [flush, store],
  );

  const switchResume = useCallback(
    (id: string) => {
      if (id === activeId) return;
      flush();
      store.commit(events.uiStateSet({ activeResumeId: id }));
    },
    [activeId, flush, store],
  );

  const renameResume = useCallback(
    (id: string, name: string) => {
      store.commit(events.resumeRenamed({ id, name: name.trim() || t("resumes.defaultName") }));
    },
    [store, t],
  );

  const deleteResume = useCallback(
    (id: string) => {
      if (pendingRef.current?.id === id) pendingRef.current = null;
      store.commit(events.resumeDeleted({ id }));
    },
    [store],
  );

  /** Best effort: never lose the trailing debounce on unmount or tab close. */
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
      flush();
    };
  }, [flush]);

  return {
    data: editor.data,
    dispatch,
    resumes,
    activeId,
    saveState,
    createResume,
    switchResume,
    renameResume,
    deleteResume,
  } as const;
}
