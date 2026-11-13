// Theme and language settings shared by the boot script (runs in <head>, before paint) and the
// interactive islands. Keep the functions below self-contained: the boot script inlines their
// source text, so they cannot reach anything outside their own body.

export const THEME_MODES = ["auto", "light", "dark"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];
export type Theme = Exclude<ThemeMode, "auto">;

export const STORAGE_KEYS = {
  themeMode: "baselarte:theme",
  language: "baselarte:language",
  hurricaneUnlocked: "baselarte:hurricane",
} as const;

/** "auto" follows the visitor's system setting (prefers-color-scheme). */
export function resolveTheme(mode: ThemeMode, systemPrefersDark: boolean): Theme {
  if (mode !== "auto") return mode;
  return systemPrefersDark ? "dark" : "light";
}

/** Reads localStorage without ever throwing (private windows and blocked storage throw). */
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (storageError) {
    console.warn(`Saved preference "${key}" is unavailable.`, storageError);
    return null;
  }
}
