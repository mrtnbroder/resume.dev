/**
 * "Bold" design — high-contrast statement layout: oversized black-weight name
 * beside an emerald block, highlighter-underlined section titles, uppercase
 * company kickers, date chips and solid skill pills.
 */
import type { ReactNode } from "react";

import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { contactHref, useResumeSections, type DesignProps } from "./shared";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section mb-7 last:mb-0">
      <h2 className="mb-3 break-after-avoid">
        <span className="bg-[linear-gradient(transparent_58%,var(--color-emerald-200)_58%)] px-0.5 text-lg font-black tracking-tight text-neutral-900">
          {title}
        </span>
      </h2>
      {children}
    </section>
  );
}

function DateChip({ range }: { range: string | null }) {
  if (!range) return null;
  return (
    <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-neutral-600 tabular-nums">
      {range}
    </span>
  );
}

function WorkEntry({ entry }: { entry: WorkExperience }) {
  const bullets = toBullets(entry.description);
  const { t, locale } = useI18n();
  return (
    <div className="resume-entry mb-5 break-inside-avoid last:mb-0">
      {entry.company.trim() && (
        <p className="text-[11px] font-bold tracking-[0.14em] text-emerald-700 uppercase">
          {entry.company.trim()}
        </p>
      )}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base leading-snug font-extrabold text-neutral-900">
          {entry.position.trim() || t("preview.fallbackPosition")}
        </h3>
        <DateChip range={formatRange(entry.startDate, entry.endDate, entry.current, locale)} />
      </div>
      {bullets.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex gap-2.5 text-[13px] leading-relaxed text-neutral-700">
              <span aria-hidden="true" className="mt-[9px] size-1.5 shrink-0 bg-emerald-600" />
              <span>{bullet}</span>
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
      {degreeLine && entry.school.trim() && (
        <p className="text-[11px] font-bold tracking-[0.14em] text-emerald-700 uppercase">
          {entry.school.trim()}
        </p>
      )}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[15px] leading-snug font-extrabold text-neutral-900">
          {degreeLine || entry.school.trim()}
        </h3>
        <DateChip range={formatRange(entry.startDate, entry.endDate, false, locale)} />
      </div>
    </div>
  );
}

export function BoldDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, contacts, jobs, schools, qualifications } = useResumeSections(data);

  return (
    <article className="design-bold resume-sheet">
      <header className="mb-8 flex gap-5">
        <div aria-hidden="true" className="w-3 shrink-0 bg-emerald-600" />
        <div className="min-w-0">
          {personal.fullName.trim() && (
            <h1 className="text-[46px] leading-[0.95] font-black tracking-tighter text-neutral-900">
              {personal.fullName.trim()}
            </h1>
          )}
          {personal.headline.trim() && (
            <p className="mt-2 text-lg font-bold text-emerald-700">{personal.headline.trim()}</p>
          )}
          {contacts.length > 0 && (
            <p className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-0.5 text-[13px] font-medium text-neutral-600">
              {contacts.map((contact) =>
                contact.kind === "location" ? (
                  <span key={contact.kind}>{contact.value}</span>
                ) : (
                  <a
                    key={contact.kind}
                    href={contactHref(contact.kind, contact.value)}
                    className="hover:underline"
                  >
                    {contact.value}
                  </a>
                ),
              )}
            </p>
          )}
        </div>
      </header>

      {personal.summary.trim() && (
        <Section title={t("preview.section.summary")}>
          <p className="text-[14px] leading-relaxed font-medium whitespace-pre-line text-neutral-800">
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
          <ul className="flex flex-wrap gap-1.5">
            {data.skills.map((skill, index) => (
              <li
                key={`${skill.toLowerCase()}-${index}`}
                className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-xs font-semibold text-white"
              >
                {skill}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {qualifications.length > 0 && (
        <Section title={t("preview.section.qualifications")}>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            {qualifications.map((entry) => (
              <li key={entry.id} className="text-[13px] leading-snug text-neutral-700">
                <span className="font-extrabold text-neutral-900">{entry.title.trim()}</span>
                {entry.detail.trim() && <span className="block">{entry.detail.trim()}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
