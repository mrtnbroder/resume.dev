/**
 * "Artsy" design — editorial serif layout with a double-rule frame (see
 * `.design-artsy` in global.css), oversized italic name, highlighter accent,
 * dotted section leaders and em-dash bullet markers.
 */
import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { contactHref, useResumeSections, type DesignProps } from "./shared";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section mb-8 last:mb-0">
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="text-lg break-after-avoid italic text-stone-800">{title}</h2>
        <span aria-hidden="true" className="flex-1 border-b border-dotted border-stone-400" />
      </div>
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
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h3 className="text-base italic text-stone-900">
          {entry.position.trim() || t("preview.fallbackPosition")}
          {entry.company.trim() && (
            <span className="ml-2 text-xs font-medium tracking-widest text-stone-500 uppercase not-italic">
              {entry.company.trim()}
            </span>
          )}
        </h3>
        {range && <span className="text-xs text-stone-400 italic tabular-nums">{range}</span>}
      </div>
      {bullets.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex gap-2 text-[13px] leading-relaxed text-stone-600">
              <span aria-hidden="true" className="shrink-0 text-orange-700">
                —
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
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h3 className="text-base italic text-stone-900">
          {degreeLine || entry.school.trim()}
          {degreeLine.trim() && entry.school.trim() && (
            <span className="ml-2 text-xs font-medium tracking-widest text-stone-500 uppercase not-italic">
              {entry.school.trim()}
            </span>
          )}
        </h3>
        {range && <span className="text-xs text-stone-400 italic tabular-nums">{range}</span>}
      </div>
    </div>
  );
}

export function ArtsyDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, contacts, jobs, schools, qualifications } = useResumeSections(data);

  return (
    <article className="design-artsy resume-sheet resume-font-serif">
      <header className="mb-9">
        {personal.fullName.trim() && (
          <h1 className="text-[44px] leading-[1.05] font-medium text-stone-900 italic">
            {personal.fullName.trim()}
          </h1>
        )}
        {personal.headline.trim() && (
          <p className="mt-2">
            <span className="inline-block -rotate-1 bg-orange-100 px-2 py-0.5 text-sm text-stone-700 italic">
              {personal.headline.trim()}
            </span>
          </p>
        )}
        {contacts.length > 0 && (
          <p className="mt-4 flex flex-wrap items-baseline gap-x-2 text-xs text-stone-500 italic">
            {contacts.map((contact, index) => (
              <span key={`${contact.kind}-${index}`} className="flex items-baseline gap-2">
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
      </header>

      {personal.summary.trim() && (
        <Section title={t("preview.section.summary")}>
          <p className="text-[14px] leading-loose whitespace-pre-line text-stone-600 first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:leading-[0.8] first-letter:font-medium first-letter:text-orange-700 first-letter:italic">
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
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-stone-600 italic">
            {data.skills.map((skill, index) => (
              <span key={`${skill.toLowerCase()}-${index}`} className="flex items-baseline gap-3">
                {index > 0 && <span aria-hidden="true" className="text-orange-700 not-italic">·</span>}
                {skill}
              </span>
            ))}
          </p>
        </Section>
      )}

      {qualifications.length > 0 && (
        <Section title={t("preview.section.qualifications")}>
          <ul className="space-y-1 text-[13px] text-stone-600 italic">
            {qualifications.map((entry) => (
              <li key={entry.id}>
                <span className="font-medium text-stone-900">{entry.title.trim()}</span>
                {entry.detail.trim() && (
                  <span>
                    <span aria-hidden="true" className="mx-2 text-orange-700 not-italic">·</span>
                    {entry.detail.trim()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
