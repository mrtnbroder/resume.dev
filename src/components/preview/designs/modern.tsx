/**
 * "Modern" design — contemporary product look: tinted sidebar rail with
 * icon contact list, chip skills and compact education; main column with an
 * indigo accent bar, bold name and a timeline-style work history.
 */
import { Globe, Mail, MapPin, Phone } from "lucide-react";

import { useI18n } from "@/i18n/react";
import { formatRange, toBullets, type EducationEntry, type WorkExperience } from "@/lib/resume";

import { contactHref, useResumeSections, type ContactItem } from "./shared";
import type { DesignProps } from "./shared";

function SidebarLabel({ title }: { title: string }) {
  return (
    <h2 className="mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase break-after-avoid">
      {title}
    </h2>
  );
}

function MainLabel({ title }: { title: string }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-[13px] font-bold tracking-wide text-slate-900 uppercase break-after-avoid">
      <span aria-hidden="true" className="h-[3px] w-4 rounded-full bg-indigo-600" />
      {title}
    </h2>
  );
}

const CONTACT_ICONS = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
} as const;

function ContactLine({ contact }: { contact: ContactItem }) {
  const Icon = CONTACT_ICONS[contact.kind];
  const content =
    contact.kind === "location" ? (
      contact.value
    ) : (
      <a href={contactHref(contact.kind, contact.value)} className="hover:underline">
        {contact.value}
      </a>
    );
  return (
    <li className="flex items-start gap-2 text-xs leading-snug break-words text-slate-600">
      <Icon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-indigo-500" />
      {content}
    </li>
  );
}

function EducationCard({ entry }: { entry: EducationEntry }) {
  const degreeLine = [entry.degree.trim(), entry.field.trim()].filter(Boolean).join(", ");
  const { t, locale } = useI18n();
  const range = formatRange(entry.startDate, entry.endDate, false, locale);
  return (
    <div className="resume-entry break-inside-avoid">
      <p className="text-xs leading-snug font-semibold text-slate-700">
        {degreeLine || entry.school.trim() || t("preview.fallbackProgram")}
      </p>
      {degreeLine && entry.school.trim() && (
        <p className="text-[11px] leading-snug text-slate-500">{entry.school.trim()}</p>
      )}
      {range && <p className="mt-0.5 text-[11px] text-slate-400 tabular-nums">{range}</p>}
    </div>
  );
}

function WorkEntry({ entry }: { entry: WorkExperience }) {
  const bullets = toBullets(entry.description);
  const { t, locale } = useI18n();
  const range = formatRange(entry.startDate, entry.endDate, entry.current, locale);
  return (
    <li className="resume-entry relative break-inside-avoid">
      <span
        aria-hidden="true"
        className="absolute top-1 -left-[27px] size-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100"
      />
      <h3 className="text-sm font-bold text-slate-900">
        {entry.position.trim() || t("preview.fallbackPosition")}
        {entry.company.trim() && (
          <span className="font-semibold text-indigo-600"> · {entry.company.trim()}</span>
        )}
      </h3>
      {range && <p className="mt-0.5 text-xs text-slate-400 tabular-nums">{range}</p>}
      {bullets.length > 0 && (
        <ul className="mt-1.5 list-disc space-y-1 pl-4 marker:text-indigo-300">
          {bullets.map((bullet, index) => (
            <li key={index} className="text-[13px] leading-relaxed text-slate-600">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function ModernDesign({ data }: DesignProps) {
  const { personal } = data;
  const { t, contacts, jobs, schools } = useResumeSections(data);

  return (
    <article className="design-modern resume-sheet">
      <div className="grid grid-cols-[220px_1fr] gap-8">
        <aside className="flex flex-col gap-6 rounded-xl bg-slate-100 p-5">
          {contacts.length > 0 && (
            <section className="resume-section">
              <SidebarLabel title={t("section.personal")} />
              <ul className="space-y-1.5">
                {contacts.map((contact) => (
                  <ContactLine key={contact.kind} contact={contact} />
                ))}
              </ul>
            </section>
          )}

          {data.skills.length > 0 && (
            <section className="resume-section">
              <SidebarLabel title={t("preview.section.skills")} />
              <ul className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, index) => (
                  <li
                    key={`${skill.toLowerCase()}-${index}`}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] text-slate-600"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {schools.length > 0 && (
            <section className="resume-section">
              <SidebarLabel title={t("preview.section.education")} />
              <div className="space-y-3">
                {schools.map((entry) => (
                  <EducationCard key={entry.id} entry={entry} />
                ))}
              </div>
            </section>
          )}
        </aside>

        <main className="min-w-0">
          <header className="mb-6">
            <div aria-hidden="true" className="mb-3 h-1.5 w-12 rounded-full bg-indigo-600" />
            {personal.fullName.trim() && (
              <h1 className="text-[30px] leading-tight font-extrabold tracking-tight text-slate-900">
                {personal.fullName.trim()}
              </h1>
            )}
            {personal.headline.trim() && (
              <p className="mt-1 text-sm font-semibold text-indigo-600">{personal.headline.trim()}</p>
            )}
          </header>

          {personal.summary.trim() && (
            <section className="resume-section mb-6">
              <MainLabel title={t("preview.section.summary")} />
              <p className="text-[13px] leading-relaxed whitespace-pre-line text-slate-600">
                {personal.summary.trim()}
              </p>
            </section>
          )}

          {jobs.length > 0 && (
            <section className="resume-section">
              <MainLabel title={t("preview.section.work")} />
              <ul className="relative space-y-5 border-l-2 border-indigo-100 pl-5">
                {jobs.map((entry) => (
                  <WorkEntry key={entry.id} entry={entry} />
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </article>
  );
}
