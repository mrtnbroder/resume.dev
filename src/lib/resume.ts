/**
 * Core resume domain model: types, factories and small pure helpers.
 * Kept framework-free so it can be unit-tested and reused anywhere.
 */
import { defaultLocale, ui, type Locale } from "@/i18n/ui";

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}

export const RESUME_DESIGNS = ["plain", "minimal", "swiss", "artsy", "business", "modern"] as const;
export type ResumeDesign = (typeof RESUME_DESIGNS)[number];

/** Coerces an unknown persisted value to a valid design; legacy documents fall back to "plain". */
export function normalizeDesign(value: unknown): ResumeDesign {
  return typeof value === "string" && (RESUME_DESIGNS as readonly string[]).includes(value)
    ? (value as ResumeDesign)
    : "plain";
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  /** Month input value, e.g. "2021-06". Free text also accepted. */
  startDate: string;
  endDate: string;
  current: boolean;
  /** Multiline; every non-empty line becomes a bullet point. */
  description: string;
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface QualificationEntry {
  id: string;
  /** Short name, e.g. a language, hobby or certification. */
  title: string;
  /** Optional level, issuer, year, … */
  detail: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  work: WorkExperience[];
  education: EducationEntry[];
  qualifications: QualificationEntry[];
  skills: string[];
  /** Visual design of the rendered PDF. */
  design: ResumeDesign;
}

export const MAX_SKILLS = 30;
export const MAX_SKILL_LENGTH = 40;

export function emptyPersonal(): PersonalInfo {
  return { fullName: "", headline: "", email: "", phone: "", location: "", website: "", summary: "" };
}

export function emptyWork(): WorkExperience {
  return {
    id: crypto.randomUUID(),
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

export function emptyEducation(): EducationEntry {
  return {
    id: crypto.randomUUID(),
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
  };
}

export function emptyQualification(): QualificationEntry {
  return { id: crypto.randomUUID(), title: "", detail: "" };
}

export function emptyResume(): ResumeData {
  return {
    personal: emptyPersonal(),
    work: [],
    education: [],
    qualifications: [],
    skills: [],
    design: "plain",
  };
}

/** Reorders `items` to match `ids`. Unknown/missing ids keep their relative order at the end. */
export function orderById<T extends { id: string }>(items: T[], ids: string[]): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered: T[] = [];
  for (const id of ids) {
    const item = byId.get(id);
    if (item) {
      ordered.push(item);
      byId.delete(id);
    }
  }
  return [...ordered, ...byId.values()];
}

export function isResumeData(value: unknown): value is ResumeData {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.personal === "object" &&
    record.personal !== null &&
    Array.isArray(record.work) &&
    Array.isArray(record.education) &&
    Array.isArray(record.skills) &&
    record.work.every((entry) => typeof entry === "object" && entry !== null) &&
    record.education.every((entry) => typeof entry === "object" && entry !== null) &&
    record.skills.every((skill) => typeof skill === "string") &&
    // `design`/`qualifications` were added after the first release; absent
    // values are normalized by callers.
    (record.design === undefined ||
      (typeof record.design === "string" &&
        (RESUME_DESIGNS as readonly string[]).includes(record.design))) &&
    (record.qualifications === undefined ||
      (Array.isArray(record.qualifications) &&
        record.qualifications.every((entry) => typeof entry === "object" && entry !== null)))
  );
}

/** Formats "2021-06" as "Jun 2021" in `locale`; passthrough for anything else. */
export function formatMonth(value: string, locale: Locale = defaultLocale): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value.trim());
  if (!match) return value.trim();
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return value.trim();
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthIndex, 1)));
}

export function formatRange(
  startDate: string,
  endDate: string,
  current = false,
  locale: Locale = defaultLocale,
): string | null {
  const start = formatMonth(startDate, locale);
  const end = current ? ui[locale]["range.present"] : formatMonth(endDate, locale);
  if (start && end) return `${start} \u2013 ${end}`;
  return start || end || null;
}

/** Splits a multiline description into clean bullet lines (strips leading "- ", "*", "\u2022"). */
export function toBullets(description: string): string[] {
  return description
    .split("\n")
    .map((line) => line.trim().replace(/^[-\u2022*]\s+/, ""))
    .filter(Boolean);
}

export function normalizeSkill(raw: string): string {
  return raw.trim().slice(0, MAX_SKILL_LENGTH);
}
