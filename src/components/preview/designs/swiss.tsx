/**
 * "Swiss" design — International Typographic Style: huge flush-left uppercase
 * name over a heavy rule, strict two-column grid (detail rail + content),
 * red square section markers, tracked micro-labels.
 */
import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { contactHref, useResumeSections, type DesignProps } from "./shared";

function RailLabel({ title }: { title: string }) {
  return (
    <h2 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase break-after-avoid">
      <span aria-hidden="true" className="size-1.5 shrink-0 bg-red-600" />
      {title}
    </h2>
  );
}

export function SwissDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, locale, contacts, jobs, schools, qualifications } = useResumeSections(data);
  const range = (entry: WorkExperience) =>
    formatRange(entry.startDate, entry.endDate, entry.current, locale);

  return (
    <article className="design-swiss resume-sheet">
      <header className="mb-8 border-b-4 border-neutral-900 pb-5">
        {personal.fullName.trim() && (
          <h1 className="text-[40px] leading-none font-bold tracking-tighter text-neutral-900 uppercase">
            {personal.fullName.trim()}
          </h1>
        )}
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          {personal.headline.trim() && (
            <p className="text-xs font-bold tracking-[0.2em] text-red-600 uppercase">
              {personal.headline.trim()}
            </p>
          )}
          {contacts.length > 0 && (
            <p className="flex flex-wrap items-baseline gap-x-1.5 text-right text-[11px] leading-snug text-neutral-600">
              {contacts.map((contact, index) => (
                <span key={`${contact.kind}-${index}`} className="flex items-baseline gap-1.5">
                  {index > 0 && <span aria-hidden="true">·</span>}
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
        </div>
      </header>

      <div className="grid grid-cols-[168px_1fr] gap-x-10">
        {/* Detail rail */}
        <aside className="space-y-7">
          {contacts.length > 0 && (
            <section className="resume-section">
              <RailLabel title={t("section.personal")} />
              <ul className="space-y-1 text-xs leading-snug break-words text-neutral-700">
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
            </section>
          )}

          {data.skills.length > 0 && (
            <section className="resume-section">
              <RailLabel title={t("preview.section.skills")} />
              <ul className="divide-y divide-neutral-200 text-xs text-neutral-700">
                {data.skills.map((skill, index) => (
                  <li key={`${skill.toLowerCase()}-${index}`} className="py-1 first:pt-0 last:pb-0">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {qualifications.length > 0 && (
            <section className="resume-section">
              <RailLabel title={t("preview.section.qualifications")} />
              <ul className="divide-y divide-neutral-200 text-xs text-neutral-700">
                {qualifications.map((entry) => (
                  <li key={entry.id} className="py-1 first:pt-0 last:pb-0">
                    <span className="font-bold">{entry.title.trim()}</span>
                    {entry.detail.trim() && (
                      <span className="block text-neutral-500">{entry.detail.trim()}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {schools.length > 0 && (
            <section className="resume-section">
              <RailLabel title={t("preview.section.education")} />
              <div className="space-y-3">
                {schools.map((entry) => (
                  <EducationRailEntry key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* Main column */}
        <div className="min-w-0 space-y-7">
          {personal.summary.trim() && (
            <section className="resume-section">
              <RailLabel title={t("preview.section.summary")} />
              <p className="text-[13px] leading-relaxed whitespace-pre-line text-neutral-700">
                {personal.summary.trim()}
              </p>
            </section>
          )}

          {jobs.length > 0 && (
            <section className="resume-section">
              <RailLabel title={t("preview.section.work")} />
              {jobs.map((entry) => (
                <WorkEntry key={entry.id} entry={entry} range={range(entry)} />
              ))}
            </section>
          )}
        </div>
      </div>
    </article>
  );
}

function EducationRailEntry({ entry }: { entry: EducationEntry }) {
  const { locale } = useI18n();
  const degreeLine = [entry.degree.trim(), entry.field.trim()].filter(Boolean).join(", ");
  const range = formatRange(entry.startDate, entry.endDate, false, locale);
  return (
    <div className="resume-entry break-inside-avoid">
      <p className="text-xs leading-snug font-semibold text-neutral-900">
        {degreeLine || entry.school.trim()}
      </p>
      {degreeLine && entry.school.trim() && (
        <p className="text-xs leading-snug text-neutral-600">{entry.school.trim()}</p>
      )}
      {range && <p className="mt-0.5 text-[11px] text-neutral-500 tabular-nums">{range}</p>}
    </div>
  );
}

function WorkEntry({
  entry,
  range,
}: {
  entry: WorkExperience;
  range: string | null;
}) {
  const { t } = useI18n();
  const bullets = toBullets(entry.description);
  return (
    <div className="resume-entry mt-4 mb-4 break-inside-avoid border-t border-neutral-300 pt-3 first:mt-0 last:mb-0">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-bold tracking-tight text-neutral-900 uppercase">
          {entry.position.trim() || t("preview.fallbackPosition")}
          {entry.company.trim() && (
            <span className="font-normal text-neutral-600 normal-case"> · {entry.company.trim()}</span>
          )}
        </h3>
        {range && <span className="shrink-0 text-[11px] text-neutral-500 tabular-nums">{range}</span>}
      </div>
      {bullets.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex gap-2 text-[13px] leading-relaxed text-neutral-700">
              <span aria-hidden="true" className="shrink-0 text-red-600">
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
