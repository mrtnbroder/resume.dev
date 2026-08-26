/**
 * "Business" design — conservative corporate: navy header band with a gold
 * base rule, serif display type for name and section titles, structured
 * single-column body.
 */
import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { contactHref, useResumeSections, type DesignProps } from "./shared";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section mb-6 last:mb-0">
      <h2 className="resume-font-serif text-sm font-bold tracking-[0.12em] text-slate-800 uppercase break-after-avoid">
        {title}
      </h2>
      <div aria-hidden="true" className="mt-1 mb-3 h-[3px] w-10 bg-amber-500" />
      {children}
    </section>
  );
}

function WorkEntry({ entry }: { entry: WorkExperience }) {
  const bullets = toBullets(entry.description);
  const { t, locale } = useI18n();
  const range = formatRange(entry.startDate, entry.endDate, entry.current, locale);
  return (
    <div className="resume-entry mb-4 break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm text-slate-900">
          <span className="font-bold">{entry.company.trim()}</span>
          {(entry.position.trim() || !entry.company.trim()) && (
            <span className="text-slate-600">
              {" "}
              — {entry.position.trim() || t("preview.fallbackPosition")}
            </span>
          )}
        </h3>
        {range && <span className="shrink-0 text-xs text-slate-500 tabular-nums">{range}</span>}
      </div>
      {bullets.length > 0 && (
        <ul className="mt-1.5 list-disc space-y-1 pl-4 marker:text-slate-400">
          {bullets.map((bullet, index) => (
            <li key={index} className="text-[13px] leading-relaxed text-slate-700">
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
  const { t, locale } = useI18n();
  const range = formatRange(entry.startDate, entry.endDate, false, locale);
  return (
    <div className="resume-entry mb-3 break-inside-avoid last:mb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-sm text-slate-900">
          <span className="font-bold">{degreeLine || t("preview.fallbackProgram")}</span>
          {entry.school.trim() && <span className="font-normal text-slate-600"> — {entry.school.trim()}</span>}
        </h3>
        {range && <span className="shrink-0 text-xs text-slate-500 tabular-nums">{range}</span>}
      </div>
    </div>
  );
}

export function BusinessDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, contacts, jobs, schools } = useResumeSections(data);

  return (
    <article className="design-business resume-sheet">
      <header className="mb-7 border-b-4 border-amber-500 bg-slate-800 px-7 py-6 text-center text-white">
        {personal.fullName.trim() && (
          <h1 className="resume-font-serif text-[28px] font-bold tracking-tight">
            {personal.fullName.trim()}
          </h1>
        )}
        {personal.headline.trim() && (
          <p className="mt-1 text-sm text-slate-300">{personal.headline.trim()}</p>
        )}
        {contacts.length > 0 && (
          <p className="mt-3 flex flex-wrap items-baseline justify-center gap-x-2 text-xs text-slate-300">
            {contacts.map((contact, index) => (
              <span key={`${contact.kind}-${index}`} className="flex items-baseline gap-2">
                {index > 0 && <span aria-hidden="true">•</span>}
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
          <p className="text-[13px] leading-relaxed whitespace-pre-line text-slate-700">
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
          <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            {data.skills.map((skill, index) => (
              <li key={`${skill.toLowerCase()}-${index}`} className="flex items-center gap-2 text-[13px] text-slate-700">
                <span aria-hidden="true" className="size-1.5 shrink-0 bg-slate-700" />
                {skill}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}
