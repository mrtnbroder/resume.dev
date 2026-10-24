/**
 * "Mono" design — developer-flavoured monospace layout: Markdown-style `##`
 * section titles, `key: value` contact block, dash bullets, comment-style
 * date ranges and bracketed skill tags. Restrained single green accent.
 */
import type { ReactNode } from "react";

import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { contactHref, useResumeSections, type DesignProps } from "./shared";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section mb-6 last:mb-0">
      <h2 className="mb-2 text-[13px] font-bold text-neutral-900 break-after-avoid">
        <span aria-hidden="true" className="text-green-700">
          ##{" "}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function RangeComment({ range }: { range: string | null }) {
  if (!range) return null;
  return <p className="text-[11px] text-neutral-400">{`// ${range}`}</p>;
}

function WorkEntry({ entry }: { entry: WorkExperience }) {
  const bullets = toBullets(entry.description);
  const { t, locale } = useI18n();
  return (
    <div className="resume-entry mb-4 break-inside-avoid last:mb-0">
      <h3 className="text-[13px] font-bold text-neutral-900">
        {entry.position.trim() || t("preview.fallbackPosition")}
        {entry.company.trim() && (
          <span className="font-normal text-green-700"> @ {entry.company.trim()}</span>
        )}
      </h3>
      <RangeComment range={formatRange(entry.startDate, entry.endDate, entry.current, locale)} />
      {bullets.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex gap-2 text-[12px] leading-relaxed text-neutral-700">
              <span aria-hidden="true" className="text-neutral-400">
                -
              </span>
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
      <h3 className="text-[13px] font-bold text-neutral-900">
        {degreeLine || entry.school.trim()}
        {degreeLine && entry.school.trim() && (
          <span className="font-normal text-green-700"> @ {entry.school.trim()}</span>
        )}
      </h3>
      <RangeComment range={formatRange(entry.startDate, entry.endDate, false, locale)} />
    </div>
  );
}

export function MonoDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, contacts, jobs, schools, qualifications } = useResumeSections(data);

  return (
    <article className="design-mono resume-sheet font-mono">
      <header className="mb-7 border-b border-dashed border-neutral-300 pb-5">
        {personal.fullName.trim() && (
          <h1 className="text-[26px] leading-tight font-bold tracking-tight text-neutral-900">
            {personal.fullName.trim()}
            <span aria-hidden="true" className="text-green-700">
              _
            </span>
          </h1>
        )}
        {personal.headline.trim() && (
          <p className="mt-0.5 text-[13px] text-neutral-500">{personal.headline.trim()}</p>
        )}
        {contacts.length > 0 && (
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 text-[12px] leading-relaxed">
            {contacts.map((contact) => (
              <div key={contact.kind} className="contents">
                <dt className="text-neutral-400">{t(`label.${contact.kind}`).toLowerCase()}:</dt>
                <dd className="min-w-0 break-words text-neutral-800">
                  {contact.kind === "location" ? (
                    contact.value
                  ) : (
                    <a href={contactHref(contact.kind, contact.value)} className="hover:underline">
                      {contact.value}
                    </a>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {personal.summary.trim() && (
        <Section title={t("preview.section.summary")}>
          <p className="text-[12px] leading-relaxed whitespace-pre-line text-neutral-700">
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
          <ul className="flex flex-wrap gap-x-2 gap-y-1 text-[12px] text-neutral-700">
            {data.skills.map((skill, index) => (
              <li key={`${skill.toLowerCase()}-${index}`}>
                <span aria-hidden="true" className="text-neutral-400">
                  [
                </span>
                {skill}
                <span aria-hidden="true" className="text-neutral-400">
                  ]
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {qualifications.length > 0 && (
        <Section title={t("preview.section.qualifications")}>
          <ul className="space-y-0.5">
            {qualifications.map((entry) => (
              <li key={entry.id} className="flex gap-2 text-[12px] leading-relaxed text-neutral-700">
                <span aria-hidden="true" className="text-neutral-400">
                  -
                </span>
                <span>
                  <span className="font-bold text-neutral-900">{entry.title.trim()}</span>
                  {entry.detail.trim() && <span>: {entry.detail.trim()}</span>}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
