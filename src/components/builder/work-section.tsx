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
import { Textarea } from "@/components/ui/textarea";
import type { ResumeAction } from "@/hooks/use-resume";
import { useI18n } from "@/i18n/react";
import { emptyWork, formatRange, type WorkExperience } from "@/lib/resume";

interface WorkSectionProps {
  entries: WorkExperience[];
  dispatch: Dispatch<ResumeAction>;
}

export function WorkSection({ entries, dispatch }: WorkSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const uid = useId();
  const { t, locale } = useI18n();

  const addEntry = () => {
    const entry = emptyWork();
    dispatch({ type: "add_work", entry });
    setExpandedId(entry.id);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= entries.length) return;
    const ids = entries.map((entry) => entry.id);
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    dispatch({ type: "set_work_order", ids });
  };

  return (
    <SectionCard
      id="work-experience"
      title={t("section.work")}
      count={entries.length}
      action={
        <Button variant="outline" size="sm" onClick={addEntry}>
          <Plus className="size-3.5" /> {t("action.add")}
        </Button>
      }
    >
      {entries.length === 0 ? (
        <p className="px-1 py-6 text-center text-sm text-muted-foreground">
          {t("empty.work")}
        </p>
      ) : (
        <SortableList
          items={entries}
          getId={(entry) => entry.id}
          label={t("section.work")}
          onReorder={(ids) => dispatch({ type: "set_work_order", ids })}
          renderItem={(entry, handleProps, index) => {
            const patch = (partial: Partial<Omit<WorkExperience, "id">>) =>
              dispatch({ type: "update_work", id: entry.id, patch: partial });
            const dateRange = formatRange(entry.startDate, entry.endDate, entry.current, locale);
            const subtitle = [entry.company.trim(), dateRange].filter(Boolean).join(" \u00b7 ");

            return (
              <EntryShell
                handleProps={handleProps}
                expanded={expandedId === entry.id}
                onToggle={() =>
                  setExpandedId((current) => (current === entry.id ? null : entry.id))
                }
                title={entry.position.trim() || t("entry.newPosition")}
                subtitle={subtitle}
                isFirst={index === 0}
                isLast={index === entries.length - 1}
                onMoveUp={() => move(index, index - 1)}
                onMoveDown={() => move(index, index + 1)}
                onRemove={() => {
                  dispatch({ type: "remove_work", id: entry.id });
                  setExpandedId((current) => (current === entry.id ? null : current));
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("label.position")} htmlFor={`${uid}-${entry.id}-position`}>
                    <Input
                      id={`${uid}-${entry.id}-position`}
                      value={entry.position}
                      onChange={(event) => patch({ position: event.target.value })}
                      placeholder={t("placeholder.position")}
                    />
                  </Field>

                  <Field label={t("label.company")} htmlFor={`${uid}-${entry.id}-company`}>
                    <Input
                      id={`${uid}-${entry.id}-company`}
                      value={entry.company}
                      onChange={(event) => patch({ company: event.target.value })}
                      placeholder={t("placeholder.company")}
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
                      disabled={entry.current}
                    />
                  </Field>

                  <label className="flex items-center gap-2 text-sm sm:col-span-full">
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={entry.current}
                      onChange={(event) => patch({ current: event.target.checked })}
                    />
                    {t("label.current")}
                  </label>

                  <Field
                    label={t("label.description")}
                    htmlFor={`${uid}-${entry.id}-description`}
                    className="sm:col-span-full"
                  >
                    <Textarea
                      id={`${uid}-${entry.id}-description`}
                      rows={4}
                      value={entry.description}
                      onChange={(event) => patch({ description: event.target.value })}
                      placeholder={t("placeholder.description")}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("hint.description")}
                    </p>
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
