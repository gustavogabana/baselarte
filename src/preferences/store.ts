import { useSyncExternalStore } from "react";
import { DEFAULT_LANGUAGE, isLanguage, type Language } from "../i18n/localized.ts";
import { STORAGE_KEYS, THEME_MODES, readStorage, type ThemeMode } from "./settings.ts";

/**
 * A preference saved in localStorage that any island can read and change. Islands on the same page
 * share it (one in the header, one in the footer), and other tabs follow through the storage event.
 */
export interface Preference<T> {
  get(): T;
  set(value: T): void;
  subscribe(listener: () => void): () => void;
  /** The value the static HTML was rendered with; used while hydrating. */
  readonly initial: T;
}

function createPreference<T extends string>(key: string, initial: T, parse: (raw: string | null) => T): Preference<T> {
  const listeners = new Set<() => void>();
  let current: T | undefined;
  const notify = () => listeners.forEach((listener) => listener());

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key !== key) return;
      current = parse(event.newValue);
      notify();
    });
  }

  return {
    initial,
    get: () => (current ??= parse(readStorage(key))),
    set(value) {
      current = value;
      try {
        localStorage.setItem(key, value);
      } catch (storageError) {
        console.warn(`Preference "${key}" could not be saved; it lasts until the page closes.`, storageError);
      }
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export const themeMode = createPreference<ThemeMode>(STORAGE_KEYS.themeMode, "auto", (raw) =>
  THEME_MODES.includes(raw as ThemeMode) ? (raw as ThemeMode) : "auto",
);

export const language = createPreference<Language>(STORAGE_KEYS.language, DEFAULT_LANGUAGE, (raw) =>
  isLanguage(raw) ? raw : isLanguage(document.documentElement.lang) ? (document.documentElement.lang as Language) : DEFAULT_LANGUAGE,
);

export const hurricaneUnlocked = createPreference<"yes" | "no">(STORAGE_KEYS.hurricaneUnlocked, "no", (raw) =>
  raw === "yes" ? "yes" : "no",
);

/** React binding: re-renders when the preference changes, and hydrates with the static value. */
export function usePreference<T>(preference: Preference<T>): T {
  return useSyncExternalStore(preference.subscribe, preference.get, () => preference.initial);
}
