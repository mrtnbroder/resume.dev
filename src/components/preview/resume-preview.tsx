import { FileText } from "lucide-react";

import { useI18n } from "@/i18n/react";
import { toBullets, type ResumeData } from "@/lib/resume";

import { designComponents } from "./designs";

interface ResumePreviewProps {
  data: ResumeData;
}

/**
 * Print-faithful rendering of the resume. Dispatches to the per-design
 * layout selected by `data.design`; screen styling lives on `.resume-sheet`,
 * `global.css` strips chrome under `@media print`.
 */
export function ResumePreview({ data }: ResumePreviewProps) {
  const { t } = useI18n();

  const isEmpty =
    data.personal.fullName.trim() === "" &&
    data.work.every(
      (entry) =>
        entry.position.trim() === "" &&
        entry.company.trim() === "" &&
        toBullets(entry.description).length === 0,
    ) &&
    data.education.every(
      (entry) => entry.school.trim() === "" && entry.degree.trim() === "" && entry.field.trim() === "",
    ) &&
    data.skills.length === 0;

  if (isEmpty) {
    return (
      <div className="resume-sheet flex min-h-[600px] flex-col items-center justify-center gap-3 rounded-lg text-center text-neutral-400">
        <FileText className="size-8" aria-hidden="true" />
        <p className="text-sm">
          {t("preview.empty")}
          <br />
          {t("preview.emptyHint")}
        </p>
      </div>
    );
  }

  const Design = designComponents[data.design];
  return <Design data={data} />;
}
