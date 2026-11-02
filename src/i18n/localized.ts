// The site speaks English and Brazilian Portuguese. Every page carries both languages and
// CSS shows the active one (see `html[lang]` in base.css), so crawlers read everything and
// switching language needs no re-render.

export const LANGUAGES = ["en", "pt-BR"] as const;
export const DEFAULT_LANGUAGE: Language = "en";

export type Language = (typeof LANGUAGES)[number];

/** A value written once per language. `T` is a string for plain copy, a ReactNode for rich copy. */
export interface Localized<T = string> {
  en: T;
  pt: T;
}

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}

export function pick<T>(text: Localized<T>, language: Language): T {
  return language === "pt-BR" ? text.pt : text.en;
}
