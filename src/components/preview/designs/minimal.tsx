/**
 * "Minimal" design — airy left-aligned layout: light typography, no rules or
 * pills, muted micro-label section titles, dot-separated skill line.
 */
import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { useResumeSections, type DesignProps } from "./shared";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section mb-9 last:mb-0">
      <h2 className="mb-3 text-[10px] font-medium tracking-[0.25em] text-neutral-400 uppercase break-after-avoid">
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
    <div className="resume-entry mb-5 break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-normal text-neutral-900">
          {entry.position.trim() || t("preview.fallbackPosition")}
          {entry.company.trim() && (
            <span className="text-neutral-400"> — {entry.company.trim()}</span>
          )}
        </h3>
        {range && <span className="text-xs text-neutral-400 tabular-nums">{range}</span>}
      </div>
      {bullets.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex gap-2 text-[13px] leading-relaxed text-neutral-500">
              <span aria-hidden="true" className="text-neutral-300">
                –
              </span>
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
    <div className="resume-entry mb-4 break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm font-normal text-neutral-900">
          {degreeLine || entry.school.trim()}
          {degreeLine.trim() && entry.school.trim() && (
            <span className="text-neutral-400"> — {entry.school.trim()}</span>
          )}
        </h3>
        {range && <span className="text-xs text-neutral-400 tabular-nums">{range}</span>}
      </div>
    </div>
  );
}

export function MinimalDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, contacts, jobs, schools, qualifications } = useResumeSections(data);

  return (
    <article className="design-minimal resume-sheet">
      <header className="mb-10">
        {personal.fullName.trim() && (
          <h1 className="text-[26px] leading-tight font-light tracking-tight text-neutral-900">
            {personal.fullName.trim()}
          </h1>
        )}
        {personal.headline.trim() && (
          <p className="mt-1 text-sm text-neutral-400">{personal.headline.trim()}</p>
        )}
        {contacts.length > 0 && (
          <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-xs text-neutral-400">
            {contacts.map((contact, index) => (
              <span key={`${contact.kind}-${index}`} className="flex items-baseline gap-2">
                {index > 0 && <span aria-hidden="true">·</span>}
                {contact.value}
              </span>
            ))}
          </p>
        )}
      </header>

      {personal.summary.trim() && (
        <Section title={t("preview.section.summary")}>
          <p className="text-[13px] leading-relaxed whitespace-pre-line text-neutral-500">
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
          <p className="text-[13px] leading-relaxed text-neutral-500">
            {data.skills.join("  ·  ")}
          </p>
        </Section>
      )}

      {qualifications.length > 0 && (
        <Section title={t("preview.section.qualifications")}>
          <ul className="space-y-1">
            {qualifications.map((entry) => (
              <li key={entry.id} className="text-[13px] text-neutral-500">
                <span className="text-neutral-900">{entry.title.trim()}</span>
                {entry.detail.trim() && <span> — {entry.detail.trim()}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
