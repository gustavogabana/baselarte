/** "29 de outubro de 2026". Parsed as UTC so the day never shifts with the build machine's zone. */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(date);
}
