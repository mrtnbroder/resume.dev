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
import { emptyEducation, formatRange, type EducationEntry } from "@/lib/resume";

interface EducationSectionProps {
  entries: EducationEntry[];
  dispatch: Dispatch<ResumeAction>;
}

export function EducationSection({ entries, dispatch }: EducationSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const uid = useId();
  const { t, locale } = useI18n();

  const addEntry = () => {
    const entry = emptyEducation();
    dispatch({ type: "add_education", entry });
    setExpandedId(entry.id);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= entries.length) return;
    const ids = entries.map((entry) => entry.id);
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    dispatch({ type: "set_education_order", ids });
  };

  return (
    <SectionCard
      id="education"
      title={t("section.education")}
      count={entries.length}
      action={
        <Button variant="outline" size="sm" onClick={addEntry}>
          <Plus className="size-3.5" /> {t("action.add")}
        </Button>
      }
    >
      {entries.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-muted-foreground">
          {t("empty.education")}
        </p>
      ) : (
        <SortableList
          items={entries}
          getId={(entry) => entry.id}
          label={t("section.education")}
          onReorder={(ids) => dispatch({ type: "set_education_order", ids })}
          renderItem={(entry, handleProps, index) => {
            const patch = (partial: Partial<Omit<EducationEntry, "id">>) =>
              dispatch({ type: "update_education", id: entry.id, patch: partial });
            const dateRange = formatRange(entry.startDate, entry.endDate, false, locale);
            const subtitle = [entry.degree.trim(), dateRange].filter(Boolean).join(" \u00b7 ");

            return (
              <EntryShell
                handleProps={handleProps}
                expanded={expandedId === entry.id}
                onToggle={() =>
                  setExpandedId((current) => (current === entry.id ? null : entry.id))
                }
                title={entry.school.trim() || t("entry.newEducation")}
                subtitle={subtitle}
                isFirst={index === 0}
                isLast={index === entries.length - 1}
                onMoveUp={() => move(index, index - 1)}
                onMoveDown={() => move(index, index + 1)}
                onRemove={() => {
                  dispatch({ type: "remove_education", id: entry.id });
                  setExpandedId((current) => (current === entry.id ? null : current));
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={t("label.school")}
                    htmlFor={`${uid}-${entry.id}-school`}
                    className="sm:col-span-full"
                  >
                    <Input
                      id={`${uid}-${entry.id}-school`}
                      value={entry.school}
                      onChange={(event) => patch({ school: event.target.value })}
                      placeholder={t("placeholder.school")}
                    />
                  </Field>

                  <Field label={t("label.degree")} htmlFor={`${uid}-${entry.id}-degree`}>
                    <Input
                      id={`${uid}-${entry.id}-degree`}
                      value={entry.degree}
                      onChange={(event) => patch({ degree: event.target.value })}
                      placeholder="M.Sc."
                    />
                  </Field>

                  <Field label={t("label.fieldOfStudy")} htmlFor={`${uid}-${entry.id}-field`}>
                    <Input
                      id={`${uid}-${entry.id}-field`}
                      value={entry.field}
                      onChange={(event) => patch({ field: event.target.value })}
                      placeholder={t("placeholder.fieldOfStudy")}
                    />
                  </Field>

                  <Field label={t("label.startDate")} htmlFor={`${uid}-${entry.id}-start`}>
                    <Input
                      id={`${uid}-${entry.id}-start`}
                      type="month"
                      value={entry.startDate}
                      onChange={(event) => patch({ startDate: event.target.value })}
                    />
                  </Field>

                  <Field label={t("label.endDate")} htmlFor={`${uid}-${entry.id}-end`}>
                    <Input
                      id={`${uid}-${entry.id}-end`}
                      type="month"
                      value={entry.endDate}
                      onChange={(event) => patch({ endDate: event.target.value })}
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
