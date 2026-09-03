import { useId } from "react";
import type { Dispatch } from "react";

import { Field } from "./field";
import { SectionCard } from "./section-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeAction } from "@/hooks/use-resume";
import type { PersonalInfo } from "@/lib/resume";

import { useI18n } from "@/i18n/react";

interface PersonalSectionProps {
  personal: PersonalInfo;
  dispatch: Dispatch<ResumeAction>;
}

export function PersonalSection({ personal, dispatch }: PersonalSectionProps) {
  const uid = useId();
  const { t } = useI18n();
  const fieldId = (key: keyof PersonalInfo) => `${uid}-${key}`;
  const update = (field: keyof PersonalInfo, value: string) =>
    dispatch({ type: "update_personal", field, value });

  return (
    <SectionCard id="personal" title={t("section.personal")}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("label.fullName")} htmlFor={fieldId("fullName")} className="sm:col-span-2">
          <Input
            id={fieldId("fullName")}
            value={personal.fullName}
            onChange={(event) => update("fullName", event.target.value)}
            placeholder={t("placeholder.fullName")}
            autoComplete="name"
          />
        </Field>

        <Field label={t("label.headline")} htmlFor={fieldId("headline")} className="sm:col-span-2">
          <Input
            id={fieldId("headline")}
            value={personal.headline}
            onChange={(event) => update("headline", event.target.value)}
            placeholder={t("placeholder.headline")}
          />
        </Field>

        <Field label={t("label.email")} htmlFor={fieldId("email")}>
          <Input
            id={fieldId("email")}
            type="email"
            value={personal.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder={t("placeholder.email")}
            autoComplete="email"
          />
        </Field>

        <Field label={t("label.phone")} htmlFor={fieldId("phone")}>
          <Input
            id={fieldId("phone")}
            type="tel"
            value={personal.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder={t("placeholder.phone")}
            autoComplete="tel"
          />
        </Field>

        <Field label={t("label.location")} htmlFor={fieldId("location")}>
          <Input
            id={fieldId("location")}
            value={personal.location}
            onChange={(event) => update("location", event.target.value)}
            placeholder={t("placeholder.location")}
          />
        </Field>

        <Field label={t("label.website")} htmlFor={fieldId("website")}>
          <Input
            id={fieldId("website")}
            type="url"
            value={personal.website}
            onChange={(event) => update("website", event.target.value)}
            placeholder={t("placeholder.website")}
          />
        </Field>

        <Field label={t("label.summary")} htmlFor={fieldId("summary")} className="sm:col-span-2">
          <Textarea
            id={fieldId("summary")}
            rows={4}
            value={personal.summary}
            onChange={(event) => update("summary", event.target.value)}
            placeholder={t("placeholder.summary")}
          />
        </Field>
      </div>
    </SectionCard>
  );
}
