import { Suspense, useState } from "react";
import { StoreRegistry } from "@livestore/livestore";
import { StoreRegistryProvider } from "@livestore/react";
import { Download, Eye, FileText, PenLine } from "lucide-react";

import { DesignPicker } from "./design-picker";
import { FormPanel } from "./form-panel";
import { LanguageSwitcher } from "./language-switcher";
import { ResumeManager } from "./resume-manager";
import { ScaledSheet } from "./scaled-sheet";
import { ResumePreview } from "@/components/preview/resume-preview";
import { Button } from "@/components/ui/button";
import { useResume } from "@/hooks/use-resume";
import { I18nProvider, useI18n } from "@/i18n/react";
import { createTranslator, type Locale } from "@/i18n/ui";
import { cn } from "@/lib/utils";

type View = "edit" | "preview";

interface ResumeBuilderProps {
  locale: Locale;
  /** URL of this page in the other locale, computed by the Astro page. */
  altHref: string;
}

/**
 * Root island: sets up i18n and the LiveStore registry (SQLite via OPFS —
 * resumes are saved locally and restored on the next visit), then renders the
 * builder. The `print-only` copy is what the browser turns into a PDF.
 * Translations come serialized from the Astro page and reach every child
 * through `I18nProvider`.
 */
export default function ResumeBuilder({ locale, altHref }: ResumeBuilderProps) {
  const t = createTranslator(locale);
  const [storeRegistry] = useState(() => new StoreRegistry());

  return (
    <I18nProvider value={{ locale, altHref, t }}>
      <Suspense
        fallback={
          <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
            {t("app.loading")}
          </div>
        }
      >
        <StoreRegistryProvider storeRegistry={storeRegistry}>
          <BuilderApp />
        </StoreRegistryProvider>
      </Suspense>
    </I18nProvider>
  );
}

function BuilderApp() {
  const { data, dispatch, resumes, activeId, saveState, createResume, switchResume, renameResume, deleteResume } =
    useResume();
  const [view, setView] = useState<View>("edit");
  const { t } = useI18n();

  return (
    <>
      <div className="app-ui flex min-h-svh flex-col bg-muted/30">
        <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="size-4" aria-hidden="true" />
              </span>
              <span className="hidden text-sm font-semibold tracking-tight sm:inline">
                resume<span className="text-muted-foreground">.dev</span>
              </span>
              <ResumeManager
                resumes={resumes}
                activeId={activeId}
                saveState={saveState}
                onCreate={createResume}
                onSwitch={switchResume}
                onRename={renameResume}
                onDelete={deleteResume}
              />
            </div>

            <div className="flex items-center gap-2">
              <div
                className="flex rounded-lg border bg-muted p-0.5 lg:hidden"
                aria-label={t("app.switchView")}
              >
                <button
                  type="button"
                  aria-pressed={view === "edit"}
                  onClick={() => setView("edit")}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
                    view === "edit"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <PenLine className="size-3.5" aria-hidden="true" /> {t("app.edit")}
                </button>
                <button
                  type="button"
                  aria-pressed={view === "preview"}
                  onClick={() => setView("preview")}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
                    view === "preview"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Eye className="size-3.5" aria-hidden="true" /> {t("app.preview")}
                </button>
              </div>

              <LanguageSwitcher />

              <Button size="sm" onClick={() => window.print()}>
                <Download className="size-3.5" /> {t("app.downloadPdf")}
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-7xl flex-1 content-start gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,540px)]">
          <div className={cn("min-w-0", view !== "edit" && "hidden lg:block")}>
            <FormPanel data={data} dispatch={dispatch} />
          </div>

          <div className={cn("min-w-0", view !== "preview" && "hidden lg:block")}>
            <div className="lg:sticky lg:top-[72px]">
              <div className="mb-2 flex items-center justify-end gap-3 lg:justify-between">
                <p className="hidden text-xs font-medium text-muted-foreground lg:block">
                  {t("app.livePreview")}
                </p>
                <DesignPicker
                  value={data.design}
                  onChange={(design) => dispatch({ type: "set_design", design })}
                />
              </div>
              <ScaledSheet>
                <ResumePreview data={data} />
              </ScaledSheet>
            </div>
          </div>
        </main>
      </div>

      <div className="print-only" aria-hidden="true">
        <ResumePreview data={data} />
      </div>
    </>
  );
}
