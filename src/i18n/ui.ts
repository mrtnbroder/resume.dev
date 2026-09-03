/**
 * Single source of truth for supported locales and UI translations.
 * `de` is the canonical dictionary; every other locale must implement
 * `TranslationKey`, so a missing string is a type error, not a runtime gap.
 */

export const locales = ["de", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Narrows an untrusted locale string (e.g. `Astro.currentLocale`) to a configured locale. */
export function resolveLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

const de = {
  // Meta / chrome
  "meta.title": "resume.dev — Lebenslauf erstellen",
  "meta.description":
    "Erstellen Sie einen sauberen, professionellen Lebenslauf mit Live-Vorschau und Download als PDF.",
  "noscript.message":
    "resume.dev benötigt JavaScript, um Ihren Lebenslauf zu erstellen und in der Vorschau anzuzeigen.",
  "app.edit": "Bearbeiten",
  "app.preview": "Vorschau",
  "app.switchView": "Zwischen Formular und Vorschau wechseln",
  "app.downloadPdf": "PDF herunterladen",
  "app.livePreview": "Live-Vorschau – aktualisiert sich beim Eingeben",
  "app.switchLanguage": "Sprache wechseln",
  "app.loading": "Wird geladen…",
  "resumes.title": "Gespeicherte Lebensläufe",
  "resumes.new": "Neuer Lebenslauf",
  "app.design": "Design",
  "design.plain": "Schlicht",
  "design.minimal": "Minimal",
  "design.swiss": "Schweizer",
  "design.artsy": "Kreativ",
  "design.business": "Business",
  "design.modern": "Modern",
  "resumes.defaultName": "Unbenannter Lebenslauf",
  "resumes.rename": "Umbenennen",
  "resumes.delete": "Löschen",
  "resumes.confirmDelete": "Wirklich löschen?",
  "resumes.namePlaceholder": "Name des Lebenslaufs",
  "resumes.saved": "Gespeichert",
  "resumes.saving": "Speichern…",
  "resumes.edited": "Bearbeitet am {date}",
  "action.cancel": "Abbrechen",

  // Personal section
  "section.personal": "Persönliche Angaben",
  "label.fullName": "Vollständiger Name",
  "label.headline": "Berufsbezeichnung",
  "label.email": "E-Mail",
  "label.phone": "Telefon",
  "label.location": "Ort",
  "label.website": "Webseite",
  "label.summary": "Profil",
  "placeholder.fullName": "Ada Lovelace",
  "placeholder.email": "ada@beispiel.de",
  "placeholder.phone": "+49 170 1234567",
  "placeholder.location": "Berlin, Deutschland",
  "placeholder.website": "https://beispiel.de",
  "placeholder.headline": "Senior Frontendentwickler",
  "placeholder.summary": "Ein kurzes berufliches Profil, das oben im Lebenslauf erscheint.",

  // Work section
  "section.work": "Berufserfahrung",
  "action.add": "Hinzufügen",
  "empty.work": "Noch keine Positionen hinterlegt. Fügen Sie Ihre letzte Rolle hinzu.",
  "entry.newPosition": "Neue Position",
  "label.position": "Position",
  "label.company": "Unternehmen",
  "label.startDate": "Startdatum",
  "label.endDate": "Enddatum",
  "label.current": "Ich arbeite hier derzeit",
  "label.description": "Beschreibung",
  "placeholder.position": "Frontendentwickler",
  "placeholder.company": "Muster GmbH",
  "placeholder.description":
    "Designsystem eingeführt, das von 4 Teams genutzt wird\nCI-Laufzeiten um 40 % reduziert",
  "hint.description": "Ein Erfolg pro Zeile – jede Zeile wird zu einem Aufzählungspunkt.",

  // Education section
  "section.education": "Ausbildung",
  "empty.education":
    "Noch keine Einträge hinterlegt. Fügen Sie Ihren letzten Abschluss oder Studiengang hinzu.",
  "entry.newEducation": "Neuer Abschluss",
  "label.school": "Schule / Universität",
  "label.degree": "Abschluss",
  "label.fieldOfStudy": "Studienfach",
  "placeholder.school": "Technische Universität München",
  "placeholder.degree": "M.Sc.",
  "placeholder.fieldOfStudy": "Informatik",

  // Skills section
  "section.skills": "Kenntnisse",
  "aria.addSkill": "Kenntnis hinzufügen",
  "aria.skillsList": "Kenntnisse",
  "placeholder.skills": "React, TypeScript…",
  "aria.removeSkill": "{skill} entfernen",
  "empty.skills": "Noch keine Kenntnisse hinterlegt. Fügen Sie Technologien, Werkzeuge oder Stärken hinzu.",
  "hint.skills":
    "Zum Hinzufügen Enter oder Komma drücken; Backspace entfernt den letzten Eintrag. Duplikate werden ignoriert.",

  // Entry shell
  "aria.moveUp": "Nach oben verschieben",
  "aria.moveDown": "Nach unten verschieben",
  "aria.remove": "Entfernen",

  // Preview
  "preview.empty": "Hier erscheint die Vorschau Ihres Lebenslaufs.",
  "preview.emptyHint": "Beginnen Sie mit der Eingabe Ihres Namens im Formular.",
  "preview.fallbackPosition": "Position",
  "preview.fallbackProgram": "Studiengang",
  "preview.section.summary": "Profil",
  "preview.section.work": "Berufserfahrung",
  "preview.section.education": "Ausbildung",
  "preview.section.skills": "Kenntnisse",

  // Dates
  "range.present": "Heute",
} as const;

export type TranslationKey = keyof typeof de;
export type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  "meta.title": "resume.dev — Resume Builder",
  "meta.description":
    "Build a clean, professional resume with a live preview and download it as a PDF.",
  "noscript.message": "resume.dev needs JavaScript to build and preview your resume.",
  "app.edit": "Edit",
  "app.preview": "Preview",
  "app.switchView": "Switch between form and preview",
  "app.downloadPdf": "Download PDF",
  "app.livePreview": "Live preview — updates as you type",
  "app.switchLanguage": "Switch language",
  "app.loading": "Loading…",
  "app.design": "Design",
  "design.plain": "Plain",
  "design.minimal": "Minimal",
  "design.swiss": "Swiss",
  "design.artsy": "Artsy",
  "design.business": "Business",
  "design.modern": "Modern",
  "resumes.title": "Saved resumes",
  "resumes.new": "New resume",
  "resumes.defaultName": "Untitled resume",
  "resumes.rename": "Rename",
  "resumes.delete": "Delete",
  "resumes.confirmDelete": "Delete for good?",
  "resumes.namePlaceholder": "Resume name",
  "resumes.saved": "Saved",
  "resumes.saving": "Saving…",
  "resumes.edited": "Edited {date}",
  "action.cancel": "Cancel",

  "section.personal": "Personal details",
  "label.fullName": "Full name",
  "label.headline": "Headline",
  "label.email": "Email",
  "label.phone": "Phone",
  "label.location": "Location",
  "label.website": "Website",
  "label.summary": "Summary",
  "placeholder.fullName": "Ada Lovelace",
  "placeholder.headline": "Senior Frontend Engineer",
  "placeholder.summary": "A short professional summary shown at the top of your resume.",

  "placeholder.email": "ada@example.com",
  "placeholder.phone": "+1 555 010 2030",
  "placeholder.location": "Berlin, Germany",
  "placeholder.website": "https://example.com",
  "section.work": "Work experience",
  "action.add": "Add",
  "empty.work": "No positions yet. Add your most recent role.",
  "entry.newPosition": "New position",
  "label.position": "Position",
  "label.company": "Company",
  "label.startDate": "Start date",
  "label.endDate": "End date",
  "label.current": "I currently work here",
  "label.description": "Description",
  "placeholder.position": "Frontend Engineer",
  "placeholder.company": "Acme Inc.",
  "placeholder.description":
    "Shipped the design system used by 4 teams\nCut CI times by 40%",
  "hint.description": "One achievement per line — each line becomes a bullet point.",

  "section.education": "Education",
  "empty.education": "No education entries yet. Add your latest degree or program.",
  "entry.newEducation": "New education",
  "label.school": "School / University",
  "label.degree": "Degree",
  "label.fieldOfStudy": "Field of study",
  "placeholder.school": "Technical University of Munich",
  "placeholder.degree": "M.Sc.",
  "placeholder.fieldOfStudy": "Computer Science",

  "section.skills": "Skills",
  "aria.addSkill": "Add a skill",
  "placeholder.skills": "React, TypeScript…",
  "aria.skillsList": "Skills",
  "aria.removeSkill": "Remove {skill}",
  "empty.skills": "No skills yet. Add technologies, tools or strengths.",
  "hint.skills": "Press Enter or comma to add; Backspace removes the last one. Duplicates are ignored.",

  "aria.moveUp": "Move up",
  "aria.moveDown": "Move down",
  "aria.remove": "Remove",

  "preview.empty": "Your resume preview appears here.",
  "preview.emptyHint": "Start by entering your name in the form.",
  "preview.fallbackPosition": "Position",
  "preview.fallbackProgram": "Program",
  "preview.section.summary": "Summary",
  "preview.section.work": "Work experience",
  "preview.section.education": "Education",
  "preview.section.skills": "Skills",

  "range.present": "Present",
};

export const ui: Record<Locale, Dictionary> = { de, en };

/** Resolves a translation key for `locale` with `{name}` interpolation. */
export function createTranslator(locale: Locale) {
  const dictionary = ui[locale];
  return function t(key: TranslationKey, params?: Record<string, string | number>): string {
    const template = dictionary[key];
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, name: string) =>
      name in params ? String(params[name]) : `{${name}}`,
    );
  };
}

export type Translator = ReturnType<typeof createTranslator>;
