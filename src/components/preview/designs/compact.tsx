/**
 * "Compact" design — dense, one-page-friendly layout: split header (name left,
 * stacked contacts right), teal section rules, and a fixed date column so
 * every entry scans down a single timeline edge. Smaller type throughout.
 */
import type { ReactNode } from "react";

import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { contactHref, useResumeSections, type DesignProps } from "./shared";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section mb-4 last:mb-0">
      <h2 className="mb-2 flex items-center gap-3 text-[11px] font-bold tracking-[0.14em] text-teal-700 uppercase break-after-avoid">
        {title}
        <span aria-hidden="true" className="h-px flex-1 bg-teal-200" />
      </h2>
      {children}
    </section>
  );
}

/** Two-column row: fixed-width date gutter + content. */
function Row({ range, children }: { range: string | null; children: ReactNode }) {
  return (
    <div className="resume-entry grid grid-cols-[120px_1fr] gap-x-4 break-inside-avoid">
      <span className="pt-px text-[11px] leading-snug text-neutral-500 tabular-nums">{range}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function WorkEntry({ entry }: { entry: WorkExperience }) {
  const bullets = toBullets(entry.description);
  const { t, locale } = useI18n();
  return (
    <Row range={formatRange(entry.startDate, entry.endDate, entry.current, locale)}>
      <h3 className="text-[13px] leading-snug font-semibold text-neutral-900">
        {entry.position.trim() || t("preview.fallbackPosition")}
        {entry.company.trim() && (
          <span className="font-normal text-neutral-600">, {entry.company.trim()}</span>
        )}
      </h3>
      {bullets.length > 0 && (
        <ul className="mt-0.5 list-disc space-y-px pl-3.5 marker:text-teal-600">
          {bullets.map((bullet, index) => (
            <li key={index} className="text-[12px] leading-snug text-neutral-700">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </Row>
  );
}

function EducationView({ entry }: { entry: EducationEntry }) {
  const degreeLine = [entry.degree.trim(), entry.field.trim()].filter(Boolean).join(", ");
  const { locale } = useI18n();
  return (
    <Row range={formatRange(entry.startDate, entry.endDate, false, locale)}>
      <h3 className="text-[13px] leading-snug font-semibold text-neutral-900">
        {degreeLine || entry.school.trim()}
        {degreeLine && entry.school.trim() && (
          <span className="font-normal text-neutral-600">, {entry.school.trim()}</span>
        )}
      </h3>
    </Row>
  );
}

export function CompactDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, contacts, jobs, schools, qualifications } = useResumeSections(data);

  return (
    <article className="design-compact resume-sheet">
      <header className="mb-5 flex items-end justify-between gap-6 border-b-2 border-teal-700 pb-3">
        <div className="min-w-0">
          {personal.fullName.trim() && (
            <h1 className="text-[26px] leading-tight font-bold tracking-tight text-neutral-900">
              {personal.fullName.trim()}
            </h1>
          )}
          {personal.headline.trim() && (
            <p className="text-[13px] font-medium text-teal-700">{personal.headline.trim()}</p>
          )}
        </div>
        {contacts.length > 0 && (
          <ul className="shrink-0 text-right text-[11px] leading-snug text-neutral-600">
            {contacts.map((contact) => (
              <li key={contact.kind}>
                {contact.kind === "location" ? (
                  contact.value
                ) : (
                  <a href={contactHref(contact.kind, contact.value)} className="hover:underline">
                    {contact.value}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </header>

      {personal.summary.trim() && (
        <Section title={t("preview.section.summary")}>
          <p className="text-[12px] leading-snug whitespace-pre-line text-neutral-700">
            {personal.summary.trim()}
          </p>
        </Section>
      )}

      {jobs.length > 0 && (
        <Section title={t("preview.section.work")}>
          <div className="space-y-2.5">
            {jobs.map((entry) => (
              <WorkEntry key={entry.id} entry={entry} />
            ))}
          </div>
        </Section>
      )}

      {schools.length > 0 && (
        <Section title={t("preview.section.education")}>
          <div className="space-y-1.5">
            {schools.map((entry) => (
              <EducationView key={entry.id} entry={entry} />
            ))}
          </div>
        </Section>
      )}

      {(data.skills.length > 0 || qualifications.length > 0) && (
        <div className="grid grid-cols-2 gap-x-8">
          {data.skills.length > 0 && (
            <Section title={t("preview.section.skills")}>
              <p className="text-[12px] leading-snug text-neutral-700">
                {data.skills.join(" · ")}
              </p>
            </Section>
          )}
          {qualifications.length > 0 && (
            <Section title={t("preview.section.qualifications")}>
              <ul className="space-y-px">
                {qualifications.map((entry) => (
                  <li key={entry.id} className="text-[12px] leading-snug text-neutral-700">
                    <span className="font-semibold text-neutral-900">{entry.title.trim()}</span>
                    {entry.detail.trim() && <span> · {entry.detail.trim()}</span>}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}
    </article>
  );
}
