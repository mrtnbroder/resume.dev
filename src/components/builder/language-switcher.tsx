import { Languages } from "lucide-react";

import { useI18n } from "@/i18n/react";
import { cn } from "@/lib/utils";

/**
 * Link to the same page in the other locale. The label shows the target
 * language's own code ("EN" on the German site, "DE" on the English one),
 * as users scan for their language, not the current one.
 */
export function LanguageSwitcher() {
  const { locale, altHref, t } = useI18n();
  return (
    <a
      href={altHref}
      hrefLang={locale === "de" ? "en" : "de"}
      aria-label={t("app.switchLanguage")}
      className={cn(
        "flex items-center gap-1 rounded-lg border bg-muted px-2.5 py-1.5",
        "text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
      )}
    >
      <Languages className="size-3.5" aria-hidden="true" />
      {locale === "de" ? "EN" : "DE"}
    </a>
  );
}
