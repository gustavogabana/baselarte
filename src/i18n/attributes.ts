import type { Localized } from "./localized.ts";

/**
 * Attributes cannot hold two languages the way text does (see `T`), so a localized attribute
 * ships English plus both values as data attributes; the language switch copies the right one in.
 */
export function localizedAttribute(name: "aria-label" | "title", text: Localized) {
  return {
    [name]: text.en,
    [`data-${name}-en`]: text.en,
    [`data-${name}-pt`]: text.pt,
  };
}

export const LOCALIZED_ATTRIBUTES = ["aria-label", "title"] as const;
