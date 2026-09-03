/**
 * "Plain" design — the original resume.dev layout: centered header,
 * hairline-ruled uppercase section titles, gray skill pills.
 */
import type { ReactNode } from "react";

import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { contactHref, useResumeSections, type DesignProps } from "./shared";

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section mb-6 last:mb-0">
      <h2 className="mb-3 border-b border-neutral-200 pb-1 text-[13px] font-semibold tracking-wider text-neutral-900 uppercase break-after-avoid">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DateRange({ range }: { range: string | null }) {
  if (!range) return null;
  return (
    <span className="shrink-0 text-xs whitespace-nowrap text-neutral-500 tabular-nums">
      {range}
    </span>
  );
}

function WorkEntry({ entry }: { entry: WorkExperience }) {
  const bullets = toBullets(entry.description);
  const { t, locale } = useI18n();
  return (
    <div className="resume-entry mb-4 break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">
          {entry.position.trim() || t("preview.fallbackPosition")}
          {entry.company.trim() ? (
            <span className="font-normal text-neutral-700"> · {entry.company.trim()}</span>
          ) : null}
        </h3>
        <DateRange range={formatRange(entry.startDate, entry.endDate, entry.current, locale)} />
      </div>
      {bullets.length > 0 && (
        <ul className="mt-1.5 list-disc space-y-1 pl-4 marker:text-neutral-400">
          {bullets.map((bullet, index) => (
            <li key={index} className="text-[13px] leading-relaxed text-neutral-700">
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
  return (
    <div className="resume-entry mb-3 break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold">
          {degreeLine || entry.school.trim()}
          {degreeLine.trim() && entry.school.trim() ? (
            <span className="font-normal text-neutral-700"> · {entry.school.trim()}</span>
          ) : null}
        </h3>
        <DateRange range={formatRange(entry.startDate, entry.endDate, false, locale)} />
      </div>
    </div>
  );
}

export function PlainDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, contacts, jobs, schools, qualifications } = useResumeSections(data);

  return (
    <article className="resume-sheet design-plain">
      <header className="mb-6 text-center">
        {personal.fullName.trim() && (
          <h1 className="text-3xl font-bold tracking-tight">{personal.fullName.trim()}</h1>
        )}
        {personal.headline.trim() && (
          <p className="mt-1 text-base text-neutral-600">{personal.headline.trim()}</p>
        )}
        {contacts.length > 0 && (
          <p className="mt-2 flex flex-wrap items-baseline justify-center gap-x-1.5 text-[13px] text-neutral-600">
            {contacts.map((contact, index) => (
              <span key={`${contact.kind}-${index}`} className="flex items-baseline gap-1.5">
                {index > 0 && <span aria-hidden="true">{"\u00b7"}</span>}
                {contact.kind === "location" ? (
                  <span>{contact.value}</span>
                ) : (
                  <a href={contactHref(contact.kind, contact.value)} className="hover:underline">
                    {contact.value}
                  </a>
                )}
              </span>
            ))}
          </p>
        )}
      </header>

      {personal.summary.trim() && (
        <PreviewSection title={t("preview.section.summary")}>
          <p className="text-[13px] leading-relaxed whitespace-pre-line text-neutral-700">
            {personal.summary.trim()}
          </p>
        </PreviewSection>
      )}

      {jobs.length > 0 && (
        <PreviewSection title={t("preview.section.work")}>
          {jobs.map((entry) => (
            <WorkEntry key={entry.id} entry={entry} />
          ))}
        </PreviewSection>
      )}

      {schools.length > 0 && (
        <PreviewSection title={t("preview.section.education")}>
          {schools.map((entry) => (
            <EducationView key={entry.id} entry={entry} />
          ))}
        </PreviewSection>
      )}

      {data.skills.length > 0 && (
        <PreviewSection title={t("preview.section.skills")}>
          <ul className="flex flex-wrap gap-1.5">
            {data.skills.map((skill, index) => (
              <li
                key={`${skill.toLowerCase()}-${index}`}
                className="rounded-md border border-neutral-300 px-2 py-0.5 text-xs text-neutral-700"
              >
                {skill}
              </li>
            ))}
          </ul>
        </PreviewSection>
      )}

      {qualifications.length > 0 && (
        <PreviewSection title={t("preview.section.qualifications")}>
          <ul className="space-y-1">
            {qualifications.map((entry) => (
              <li key={entry.id} className="text-[13px] text-neutral-700">
                <span className="font-medium text-neutral-900">{entry.title.trim()}</span>
                {entry.detail.trim() && <span> · {entry.detail.trim()}</span>}
              </li>
            ))}
          </ul>
        </PreviewSection>
      )}
    </article>
  );
}
