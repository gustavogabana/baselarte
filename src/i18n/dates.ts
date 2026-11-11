import type { Localized } from "./localized.ts";

const formatters = {
  en: new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }),
  pt: new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" }),
};

/** An ISO date (YYYY-MM-DD) written in both languages. Formatted at build time, so it is deterministic. */
export function localizedDate(iso: string): Localized {
  const date = new Date(`${iso}T00:00:00Z`);
  return { en: formatters.en.format(date), pt: formatters.pt.format(date) };
}
