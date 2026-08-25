import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Files, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/react";
import type { SaveState, SavedResume } from "@/hooks/use-resume";
import { cn } from "@/lib/utils";

interface ResumeManagerProps {
  resumes: SavedResume[];
  activeId: string | null;
  saveState: SaveState;
  onCreate: (name: string) => void;
  onSwitch: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Header control for the local resume library: switches the edited document,
 * creates, renames and deletes resumes. All data comes from and goes back to
 * LiveStore; this component only renders and dispatches.
 */
export function ResumeManager({
  resumes,
  activeId,
  saveState,
  onCreate,
  onSwitch,
  onRename,
  onDelete,
}: ResumeManagerProps) {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const active = resumes.find((resume) => resume.id === activeId) ?? null;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setRenamingId(null);
    setConfirmingId(null);
  };

  const startRename = (resume: SavedResume) => {
    setConfirmingId(null);
    setRenamingId(resume.id);
    setRenameDraft(resume.name);
  };

  const commitRename = () => {
    if (renamingId) onRename(renamingId, renameDraft);
    setRenamingId(null);
  };

  const handleCreate = () => {
    const name =
      resumes.length === 0
        ? t("resumes.defaultName")
        : `${t("resumes.defaultName")} ${resumes.length + 1}`;
    onCreate(name);
    close();
  };

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => (open ? close() : setOpen(true))}
        >
          <Files className="size-3.5" aria-hidden="true" />
          <span className="hidden max-w-40 truncate sm:inline">{active?.name}</span>
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </Button>
        {saveState !== "idle" && (
          <span
            className={cn(
              "hidden text-xs text-muted-foreground sm:inline",
              saveState === "dirty" && "animate-pulse",
            )}
            aria-live="polite"
          >
            {saveState === "dirty" ? t("resumes.saving") : t("resumes.saved")}
          </span>
        )}
      </div>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("resumes.title")}
          className="absolute top-[calc(100%+8px)] left-0 z-30 w-76 max-w-[calc(100vw-2rem)] rounded-lg border bg-popover p-1.5 text-popover-foreground shadow-lg"
        >
          <ul className="max-h-80 overflow-y-auto" role="presentation">
            {resumes.map((resume) => {
              const isActive = resume.id === activeId;
              const isRenaming = resume.id === renamingId;
              const isConfirming = resume.id === confirmingId;

              return (
                <li key={resume.id} role="presentation">
                  {isRenaming ? (
                    <div className="flex items-center gap-1 p-1">
                      <Input
                        autoFocus
                        value={renameDraft}
                        placeholder={t("resumes.namePlaceholder")}
                        aria-label={t("resumes.rename")}
                        onChange={(event) => setRenameDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") commitRename();
                          if (event.key === "Escape") setRenamingId(null);
                        }}
                        className="h-7"
                      />
                      <Button variant="ghost" size="icon-xs" aria-label={t("resumes.rename")} onClick={commitRename}>
                        <Check className="size-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={t("action.cancel")}
                        onClick={() => setRenamingId(null)}
                      >
                        <X className="size-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  ) : (
                    <div className="group flex items-center gap-0.5 rounded-md pr-1 hover:bg-muted">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onSwitch(resume.id);
                          close();
                        }}
                        className="min-w-0 flex-1 px-2.5 py-2 text-left"
                      >
                        <span className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "truncate text-sm",
                              isActive ? "font-medium" : "text-foreground",
                            )}
                          >
                            {resume.name}
                          </span>
                          {isActive && (
                            <Check className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                          )}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {t("resumes.edited", {
                            date: resume.updatedAt.toLocaleDateString(locale, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }),
                          })}
                        </span>
                      </button>

                      {isConfirming ? (
                        <div className="flex shrink-0 items-center gap-1 pr-1">
                          <span className="text-xs font-medium text-destructive">
                            {t("resumes.confirmDelete")}
                          </span>
                          <Button
                            variant="destructive"
                            size="icon-xs"
                            aria-label={t("resumes.delete")}
                            onClick={() => {
                              onDelete(resume.id);
                              setConfirmingId(null);
                            }}
                          >
                            <Check className="size-3.5" aria-hidden="true" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={t("action.cancel")}
                            onClick={() => setConfirmingId(null)}
                          >
                            <X className="size-3.5" aria-hidden="true" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex shrink-0 items-center">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={t("resumes.rename")}
                            onClick={() => startRename(resume)}
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={t("resumes.delete")}
                            onClick={() => setConfirmingId(resume.id)}
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-1 border-t pt-1.5">
            <Button variant="ghost" size="sm" className="w-full" onClick={handleCreate}>
              <Plus className="size-3.5" aria-hidden="true" /> {t("resumes.new")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
