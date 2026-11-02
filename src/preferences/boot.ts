import { LANGUAGES, DEFAULT_LANGUAGE } from "../i18n/localized.ts";
import { THEME_MODES, STORAGE_KEYS, resolveTheme, readStorage } from "./settings.ts";

interface BootConfig {
  keys: typeof STORAGE_KEYS;
  themeModes: readonly string[];
  languages: readonly string[];
  defaultLanguage: string;
}

/**
 * Runs inline in <head>, before the first paint, so the page never flashes the wrong theme or
 * language. It receives its helpers as arguments because it is serialised with
 * Function.prototype.toString() and cannot import anything.
 */
function boot(config: BootConfig, resolve: typeof resolveTheme, read: typeof readStorage): void {
  const root = document.documentElement;
  const storedMode = read(config.keys.themeMode);
  const mode = config.themeModes.includes(storedMode ?? "") ? (storedMode as Parameters<typeof resolve>[0]) : "auto";
  root.dataset.theme = resolve(mode, new Date().getHours());

  const storedLanguage = read(config.keys.language);
  const browserLanguage = /^pt\b/i.test(navigator.language) ? "pt-BR" : config.defaultLanguage;
  root.lang = config.languages.includes(storedLanguage ?? "") ? (storedLanguage as string) : browserLanguage;

  root.classList.add("js-enabled");
}

const config: BootConfig = {
  keys: STORAGE_KEYS,
  themeModes: THEME_MODES,
  languages: LANGUAGES,
  defaultLanguage: DEFAULT_LANGUAGE,
};

/** The inline <script> body. */
export const bootScript = `(${boot.toString()})(${JSON.stringify(config)}, ${resolveTheme.toString()}, ${readStorage.toString()});`;
