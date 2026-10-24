/**
 * "Executive" design — full-height dark sidebar carrying identity, contact,
 * skills, education and qualifications in light type; airy white main column
 * for summary and experience with a warm copper accent. The sheet's own
 * padding is removed so the sidebar bleeds to the sheet edge on screen.
 */
import type { ReactNode } from "react";

import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { contactHref, useResumeSections, type DesignProps } from "./shared";

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section">
      <h2 className="mb-2 border-b border-white/15 pb-1 text-[10px] font-semibold tracking-[0.22em] text-orange-300 uppercase break-after-avoid">
        {title}
      </h2>
      {children}
    </section>
  );
}

function MainSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section mb-7 last:mb-0">
      <h2 className="mb-3 text-[12px] font-semibold tracking-[0.22em] text-orange-700 uppercase break-after-avoid">
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
        <h3 className="text-[15px] font-semibold text-stone-900">
          {entry.position.trim() || t("preview.fallbackPosition")}
        </h3>
        {range && (
          <span className="shrink-0 text-xs whitespace-nowrap text-stone-500 tabular-nums">
            {range}
          </span>
        )}
      </div>
      {entry.company.trim() && (
        <p className="text-[13px] font-medium text-orange-700">{entry.company.trim()}</p>
      )}
      {bullets.length > 0 && (
        <ul className="mt-1.5 list-disc space-y-1 pl-4 marker:text-orange-400">
          {bullets.map((bullet, index) => (
            <li key={index} className="text-[13px] leading-relaxed text-stone-600">
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
    <div className="resume-entry break-inside-avoid">
      <p className="text-xs leading-snug font-semibold text-white">
        {degreeLine || entry.school.trim()}
      </p>
      {degreeLine && entry.school.trim() && (
        <p className="text-[11px] leading-snug text-stone-300">{entry.school.trim()}</p>
      )}
      {range && <p className="mt-0.5 text-[11px] text-stone-400 tabular-nums">{range}</p>}
    </div>
  );
}

export function ExecutiveDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, contacts, jobs, schools, qualifications } = useResumeSections(data);

  return (
    <article className="design-executive resume-sheet grid grid-cols-[236px_1fr] overflow-hidden p-0">
      <aside className="flex flex-col gap-6 bg-stone-800 px-7 py-10 text-stone-200">
        <header>
          {personal.fullName.trim() && (
            <h1 className="resume-font-serif text-[26px] leading-tight text-white">
              {personal.fullName.trim()}
            </h1>
          )}
          {personal.headline.trim() && (
            <p className="mt-1.5 text-xs leading-snug font-medium tracking-wide text-orange-300">
              {personal.headline.trim()}
            </p>
          )}
        </header>

        {data.summaryInSidebar && personal.summary.trim() && (
          <SidebarSection title={t("preview.section.summary")}>
            <p className="resume-font-serif text-[13px] leading-relaxed whitespace-pre-line text-stone-200">
              {personal.summary.trim()}
            </p>
          </SidebarSection>
        )}

        {contacts.length > 0 && (
          <SidebarSection title={t("section.personal")}>
            <ul className="space-y-1 text-[11px] leading-snug break-words">
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
          </SidebarSection>
        )}

        {data.skills.length > 0 && (
          <SidebarSection title={t("preview.section.skills")}>
            <ul className="space-y-1 text-xs">
              {data.skills.map((skill, index) => (
                <li key={`${skill.toLowerCase()}-${index}`}>{skill}</li>
              ))}
            </ul>
          </SidebarSection>
        )}

        {schools.length > 0 && (
          <SidebarSection title={t("preview.section.education")}>
            <div className="space-y-3">
              {schools.map((entry) => (
                <EducationView key={entry.id} entry={entry} />
              ))}
            </div>
          </SidebarSection>
        )}

        {qualifications.length > 0 && (
          <SidebarSection title={t("preview.section.qualifications")}>
            <ul className="space-y-1.5">
              {qualifications.map((entry) => (
                <li key={entry.id} className="text-[11px] leading-snug">
                  <span className="font-semibold text-white">{entry.title.trim()}</span>
                  {entry.detail.trim() && (
                    <span className="block text-stone-300">{entry.detail.trim()}</span>
                  )}
                </li>
              ))}
            </ul>
          </SidebarSection>
        )}
      </aside>

      <main className="min-w-0 px-10 py-10">
        {!data.summaryInSidebar && personal.summary.trim() && (
          <MainSection title={t("preview.section.summary")}>
            <p className="resume-font-serif text-[15px] leading-relaxed whitespace-pre-line text-stone-700">
              {personal.summary.trim()}
            </p>
          </MainSection>
        )}

        {jobs.length > 0 && (
          <MainSection title={t("preview.section.work")}>
            {jobs.map((entry) => (
              <WorkEntry key={entry.id} entry={entry} />
            ))}
          </MainSection>
        )}
      </main>
    </article>
  );
}
