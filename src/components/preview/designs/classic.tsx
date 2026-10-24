/**
 * "Classic" design — academic/LaTeX-style resume: serif throughout, small-caps
 * name and section titles over full-width hairlines, two-line entries with an
 * italic organisation row, inline comma-separated skills.
 */
import type { ReactNode } from "react";

import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { contactHref, useResumeSections, type DesignProps } from "./shared";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section mb-5 last:mb-0">
      <h2 className="mb-2.5 border-b border-neutral-900 pb-0.5 text-[17px] text-neutral-900 [font-variant:small-caps] break-after-avoid">
        {title}
      </h2>
      {children}
    </section>
  );
}

function WorkEntry({ entry }: { entry: WorkExperience }) {
  const bullets = toBullets(entry.description);
  const { t, locale } = useI18n();
  const range = formatRange(entry.startDate, entry.endDate, entry.current, locale);
  return (
    <div className="resume-entry mb-3.5 break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[15px] font-bold text-neutral-900">
          {entry.position.trim() || t("preview.fallbackPosition")}
        </h3>
        {range && <span className="shrink-0 text-[13px] text-neutral-700 tabular-nums">{range}</span>}
      </div>
      {entry.company.trim() && (
        <p className="text-[14px] text-neutral-700 italic">{entry.company.trim()}</p>
      )}
      {bullets.length > 0 && (
        <ul className="mt-1 list-disc space-y-0.5 pl-5 marker:text-neutral-500">
          {bullets.map((bullet, index) => (
            <li key={index} className="text-[13.5px] leading-snug text-neutral-800">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EducationView({ entry }: { entry: EducationEntry }) {
  const degreeLine = [entry.degree.trim(), entry.field.trim()].filter(Boolean).join(", ");
  const { locale } = useI18n();
  const range = formatRange(entry.startDate, entry.endDate, false, locale);
  return (
    <div className="resume-entry mb-2.5 break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[15px] font-bold text-neutral-900">
          {entry.school.trim() || degreeLine}
        </h3>
        {range && <span className="shrink-0 text-[13px] text-neutral-700 tabular-nums">{range}</span>}
      </div>
      {entry.school.trim() && degreeLine && (
        <p className="text-[14px] text-neutral-700 italic">{degreeLine}</p>
      )}
    </div>
  );
}

export function ClassicDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, contacts, jobs, schools, qualifications } = useResumeSections(data);

  return (
    <article className="design-classic resume-sheet resume-font-serif">
      <header className="mb-6 text-center">
        {personal.fullName.trim() && (
          <h1 className="text-[34px] leading-tight text-neutral-900 [font-variant:small-caps]">
            {personal.fullName.trim()}
          </h1>
        )}
        {personal.headline.trim() && (
          <p className="text-[15px] text-neutral-700 italic">{personal.headline.trim()}</p>
        )}
        {contacts.length > 0 && (
          <p className="mt-1.5 flex flex-wrap items-baseline justify-center gap-x-2 text-[13px] text-neutral-800">
            {contacts.map((contact, index) => (
              <span key={`${contact.kind}-${index}`} className="flex items-baseline gap-2">
                {index > 0 && <span aria-hidden="true">|</span>}
                {contact.kind === "location" ? (
                  <span>{contact.value}</span>
                ) : (
                  <a href={contactHref(contact.kind, contact.value)} className="underline underline-offset-2">
                    {contact.value}
                  </a>
                )}
              </span>
            ))}
          </p>
        )}
      </header>

      {personal.summary.trim() && (
        <Section title={t("preview.section.summary")}>
          <p className="text-[13.5px] leading-snug whitespace-pre-line text-neutral-800">
            {personal.summary.trim()}
          </p>
        </Section>
      )}

      {jobs.length > 0 && (
        <Section title={t("preview.section.work")}>
          {jobs.map((entry) => (
            <WorkEntry key={entry.id} entry={entry} />
          ))}
        </Section>
      )}

      {schools.length > 0 && (
        <Section title={t("preview.section.education")}>
          {schools.map((entry) => (
            <EducationView key={entry.id} entry={entry} />
          ))}
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title={t("preview.section.skills")}>
          <p className="text-[13.5px] leading-snug text-neutral-800">{data.skills.join(", ")}</p>
        </Section>
      )}

      {qualifications.length > 0 && (
        <Section title={t("preview.section.qualifications")}>
          <ul className="space-y-0.5">
            {qualifications.map((entry) => (
              <li key={entry.id} className="text-[13.5px] leading-snug text-neutral-800">
                <span className="font-bold">{entry.title.trim()}</span>
                {entry.detail.trim() && <span>: {entry.detail.trim()}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
