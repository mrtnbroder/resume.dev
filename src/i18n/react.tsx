import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { createTranslator, defaultLocale, type Locale, type Translator } from "./ui";

export interface I18n {
  locale: Locale;
  /** URL of this page in the other locale, computed by the Astro layout. */
  altHref: string;
  t: Translator;
}

const I18nContext = createContext<I18n>({
  locale: defaultLocale,
  altHref: "/",
  t: createTranslator(defaultLocale),
});

interface I18nProviderProps {
  value: I18n;
  children: ReactNode;
}

/**
 * Bridges Astro's per-locale pages into the client island: the page resolves
 * the locale from the URL and passes serializable values via props.
 */
export function I18nProvider({ value, children }: I18nProviderProps) {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  return useContext(I18nContext);
}
