import { catalog } from "../../notes/catalog.ts";

/** The three colour inks; black (the fourth) is reserved for details and never marks a group. */
export const INKS = ["cyan", "magenta", "yellow"] as const;
export type Ink = (typeof INKS)[number];

/** Each note group takes the next ink in catalog order, so neighbours never share one. */
export function groupInk(groupId: string): Ink {
  const index = catalog.findIndex((group) => group.id === groupId);
  return INKS[Math.max(index, 0) % INKS.length] ?? "cyan";
}

/** Inline style that hands the group's ink to its CSS (`var(--group-ink)`). */
export function inkStyle(ink: Ink): Record<string, string> {
  return { "--group-ink": `var(--${ink})`, "--on-group-ink": `var(--on-${ink})` };
}
