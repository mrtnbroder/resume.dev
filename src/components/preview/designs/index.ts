/**
 * Registry mapping each resume design id to its React implementation.
 * Adding a design: create the component, add it here and to `RESUME_DESIGNS`
 * in `src/lib/resume.ts`, plus its label keys in `src/i18n/ui.ts`.
 */
import type { ComponentType } from "react";

import type { ResumeDesign } from "@/lib/resume";

import { ArtsyDesign } from "./artsy";
import { BusinessDesign } from "./business";
import { MinimalDesign } from "./minimal";
import { ModernDesign } from "./modern";
import { PlainDesign } from "./plain";
import { SwissDesign } from "./swiss";
import type { DesignProps } from "./shared";

export type DesignComponent = ComponentType<DesignProps>;

export const designComponents: Record<ResumeDesign, DesignComponent> = {
  plain: PlainDesign,
  minimal: MinimalDesign,
  swiss: SwissDesign,
  artsy: ArtsyDesign,
  business: BusinessDesign,
  modern: ModernDesign,
};
