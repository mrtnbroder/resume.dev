import { useState } from "react";
import type { Dispatch } from "react";
import { useId } from "react";
import { Plus } from "lucide-react";

import { EntryShell } from "./entry-shell";
import { Field } from "./field";
import { SectionCard } from "./section-card";
import { SortableList } from "./sortable-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ResumeAction } from "@/hooks/use-resume";
import { useI18n } from "@/i18n/react";
import { emptyQualification, type QualificationEntry } from "@/lib/resume";

interface QualificationSectionProps {
  entries: QualificationEntry[];
  dispatch: Dispatch<ResumeAction>;
}

/** Free-form credentials: languages, hobbies, certifications, licenses, … */
export function QualificationSection({ entries, dispatch }: QualificationSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const uid = useId();
  const { t } = useI18n();

  const addEntry = () => {
    const entry = emptyQualification();
    dispatch({ type: "add_qualification", entry });
    setExpandedId(entry.id);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= entries.length) return;
    const ids = entries.map((entry) => entry.id);
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    dispatch({ type: "set_qualification_order", ids });
  };

  return (
    <SectionCard
      id="qualifications"
      title={t("section.qualifications")}
      count={entries.length}
      action={
        <Button variant="outline" size="sm" onClick={addEntry}>
          <Plus className="size-3.5" /> {t("action.add")}
        </Button>
      }
    >
      {entries.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-muted-foreground">
          {t("empty.qualifications")}
        </p>
      ) : (
        <SortableList
          items={entries}
          getId={(entry) => entry.id}
          label={t("section.qualifications")}
          onReorder={(ids) => dispatch({ type: "set_qualification_order", ids })}
          renderItem={(entry, handleProps, index) => {
            const patch = (partial: Partial<Omit<QualificationEntry, "id">>) =>
              dispatch({ type: "update_qualification", id: entry.id, patch: partial });

            return (
              <EntryShell
                handleProps={handleProps}
                expanded={expandedId === entry.id}
                onToggle={() =>
                  setExpandedId((current) => (current === entry.id ? null : entry.id))
                }
                title={entry.title.trim() || t("entry.newQualification")}
                subtitle={entry.detail.trim()}
                isFirst={index === 0}
                isLast={index === entries.length - 1}
                onMoveUp={() => move(index, index - 1)}
                onMoveDown={() => move(index, index + 1)}
                onRemove={() => {
                  dispatch({ type: "remove_qualification", id: entry.id });
                  setExpandedId((current) => (current === entry.id ? null : current));
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("label.title")} htmlFor={`${uid}-${entry.id}-title`}>
                    <Input
                      id={`${uid}-${entry.id}-title`}
                      value={entry.title}
                      onChange={(event) => patch({ title: event.target.value })}
                      placeholder={t("placeholder.title")}
                    />
                  </Field>

                  <Field label={t("label.detail")} htmlFor={`${uid}-${entry.id}-detail`}>
                    <Input
                      id={`${uid}-${entry.id}-detail`}
                      value={entry.detail}
                      onChange={(event) => patch({ detail: event.target.value })}
                      placeholder={t("placeholder.detail")}
                    />
                  </Field>
                </div>
              </EntryShell>
            );
          }}
        />
      )}
    </SectionCard>
  );
}
