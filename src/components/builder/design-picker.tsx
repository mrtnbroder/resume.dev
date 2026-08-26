import { RESUME_DESIGNS, type ResumeDesign } from "@/lib/resume";
import { useI18n } from "@/i18n/react";
import { cn } from "@/lib/utils";

interface DesignPickerProps {
  value: ResumeDesign;
  onChange: (design: ResumeDesign) => void;
}

/** Segmented radio group over the six available PDF designs. */
export function DesignPicker({ value, onChange }: DesignPickerProps) {
  const { t } = useI18n();
  return (
    <div
      role="radiogroup"
      aria-label={t("app.design")}
      className="flex flex-wrap items-center gap-1 rounded-lg border bg-muted p-0.5"
    >
      {RESUME_DESIGNS.map((design) => (
        <button
          key={design}
          type="button"
          role="radio"
          aria-checked={value === design}
          onClick={() => onChange(design)}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap transition-colors",
            value === design
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t(`design.${design}`)}
        </button>
      ))}
    </div>
  );
}
