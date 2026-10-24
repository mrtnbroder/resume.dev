/**
 * Registry mapping each resume design id to its React implementation.
 * Adding a design: create the component, add it here, to `RESUME_DESIGNS`
 * in `src/lib/resume.ts` and to `ResumeDesignSchema` in
 * `src/livestore/schema.ts`, plus its label keys in `src/i18n/ui.ts`.
 */
import type { ComponentType } from "react";

import type { ResumeDesign } from "@/lib/resume";

import { ArtsyDesign } from "./artsy";
import { BoldDesign } from "./bold";
import { BusinessDesign } from "./business";
import { ClassicDesign } from "./classic";
import { CompactDesign } from "./compact";
import { ExecutiveDesign } from "./executive";
import { MinimalDesign } from "./minimal";
import { ModernDesign } from "./modern";
import { MonoDesign } from "./mono";
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
  classic: ClassicDesign,
  compact: CompactDesign,
  bold: BoldDesign,
  mono: MonoDesign,
  executive: ExecutiveDesign,
};
