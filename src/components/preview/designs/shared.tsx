/**
 * Shared plumbing for the resume designs: the props every design takes and
 * the derived view model (contacts, filtered jobs/schools) they all start from.
 * Layout and styling stay fully per-design.
 */
import { useI18n } from "@/i18n/react";

import { toBullets, type EducationEntry, type ResumeData, type WorkExperience } from "@/lib/resume";

export interface DesignProps {
  data: ResumeData;
}

export interface ContactItem {
  kind: "email" | "phone" | "location" | "website";
  value: string;
}

export function contactHref(kind: ContactItem["kind"], value: string): string {
  if (kind === "email") return `mailto:${value}`;
  if (kind === "phone") return `tel:${value.replace(/[^\d+]/g, "")}`;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function useResumeSections(data: ResumeData) {
  const { t, locale } = useI18n();

  const contacts: ContactItem[] = [
    data.personal.email.trim() && { kind: "email" as const, value: data.personal.email.trim() },
    data.personal.phone.trim() && { kind: "phone" as const, value: data.personal.phone.trim() },
    data.personal.location.trim() &&
    { kind: "location" as const, value: data.personal.location.trim() },
    data.personal.website.trim() &&
    { kind: "website" as const, value: data.personal.website.trim() },
  ].filter((contact): contact is ContactItem => Boolean(contact));

  const jobs: WorkExperience[] = data.work.filter(
    (entry) =>
      entry.position.trim() !== "" ||
      entry.company.trim() !== "" ||
      toBullets(entry.description).length > 0,
  );
  const schools: EducationEntry[] = data.education.filter(
    (entry) => entry.school.trim() !== "" || entry.degree.trim() !== "" || entry.field.trim() !== "",
  );
  const qualifications = data.qualifications.filter(
    (entry) => entry.title.trim() !== "" || entry.detail.trim() !== "",
  );

  return { t, locale, contacts, jobs, schools, qualifications };
}
