import type { Dispatch } from "react";

import { EducationSection } from "./education-section";
import { PersonalSection } from "./personal-section";
import { QualificationSection } from "./qualification-section";
import { SkillsSection } from "./skills-section";
import { WorkSection } from "./work-section";
import type { ResumeAction } from "@/hooks/use-resume";
import type { ResumeData } from "@/lib/resume";

interface FormPanelProps {
  data: ResumeData;
  dispatch: Dispatch<ResumeAction>;
}

/** Left column: every editable section in reading order. */
export function FormPanel({ data, dispatch }: FormPanelProps) {
  return (
    <div className="space-y-5">
      <PersonalSection personal={data.personal} dispatch={dispatch} />
      <WorkSection entries={data.work} dispatch={dispatch} />
      <EducationSection entries={data.education} dispatch={dispatch} />
      <SkillsSection skills={data.skills} dispatch={dispatch} />
      <QualificationSection entries={data.qualifications} dispatch={dispatch} />
    </div>
  );
}
