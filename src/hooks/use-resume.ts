import { useEffect, useReducer } from "react";

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

const STORAGE_KEY = "resume.dev:data:v1";

function loadInitialData(): ResumeData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyResume();
    const parsed: unknown = JSON.parse(raw);
    if (isResumeData(parsed)) return parsed;
  } catch {
    // Corrupted JSON or unavailable storage: fall through to a fresh resume.
  }
  return emptyResume();
}

/**
 * Single source of truth for the builder. Returns the resume data plus a
 * dispatch for the actions above, and mirrors every change to localStorage.
 */
export function useResume() {
  const [data, dispatch] = useReducer(resumeReducer, null, loadInitialData);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Private browsing or quota exceeded: persistence is best-effort.
    }
  }, [data]);

  return { data, dispatch } as const;
}
