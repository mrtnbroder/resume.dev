import { useState } from "react";
import type { Dispatch, KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

import { SectionCard } from "./section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ResumeAction } from "@/hooks/use-resume";

import { useI18n } from "@/i18n/react";

interface SkillsSectionProps {
  skills: string[];
  dispatch: Dispatch<ResumeAction>;
}

/** Tag-style skill input: Enter/comma commits, Backspace removes the last tag. */
export function SkillsSection({ skills, dispatch }: SkillsSectionProps) {
  const [draft, setDraft] = useState("");
  const { t } = useI18n();

  const commitDraft = () => {
    if (!draft.trim()) return;
    for (const part of draft.split(",")) {
      dispatch({ type: "add_skill", skill: part });
    }
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
    } else if (event.key === "Backspace" && draft === "" && skills.length > 0) {
      dispatch({ type: "remove_skill", skill: skills[skills.length - 1] });
    }
  };

  return (
    <SectionCard id="skills" title={t("section.skills")} count={skills.length}>
      <div className="grid gap-4">
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitDraft}
            placeholder={t("placeholder.skills")}
            aria-label={t("aria.addSkill")}
            enterKeyHint="done"
          />
          <Button variant="outline" onClick={commitDraft} disabled={!draft.trim()}>
            <Plus className="size-3.5" /> {t("action.add")}
          </Button>
        </div>

        {skills.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label={t("aria.skillsList")}>
            {skills.map((skill) => (
              <li key={skill.toLowerCase()}>
                <Badge variant="secondary" className="gap-1 py-1 pr-1 text-xs">
                  {skill}
                  <button
                    type="button"
                    aria-label={t("aria.removeSkill", { skill })}
                    className="-m-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                    onClick={() => dispatch({ type: "remove_skill", skill })}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-1 text-center text-sm text-muted-foreground">
            {t("empty.skills")}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Press Enter or comma to add; Backspace removes the last one. Duplicates are ignored.
        </p>
      </div>
    </SectionCard>
  );
}
