import { catalog } from "../../notes/catalog.ts";

/** The three cover colours; black (the fourth) is reserved for details and never marks a series. */
export const INKS = ["petrol", "clay", "sand"] as const;
export type Ink = (typeof INKS)[number];

/** Each series takes the next cover colour in catalog order, so neighbours never share one. */
export function groupInk(groupId: string): Ink {
  const index = catalog.findIndex((group) => group.id === groupId);
  return INKS[Math.max(index, 0) % INKS.length] ?? "petrol";
}

/** Inline style that hands the series colour to its CSS (`var(--group-ink)`). */
export function inkStyle(ink: Ink): Record<string, string> {
  return { "--group-ink": `var(--${ink})`, "--on-group-ink": `var(--on-${ink})` };
}
