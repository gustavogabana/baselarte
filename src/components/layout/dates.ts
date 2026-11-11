import type { Localized } from "../../i18n/localized.ts";

/** "2026-10-29" in both languages. Parsed as UTC so the day never shifts with the build machine's zone. */
export function formatDate(iso: string): Localized {
  const date = new Date(`${iso}T00:00:00Z`);
  const format = (locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(date);
  return { en: format("en-US"), pt: format("pt-BR") };
}
