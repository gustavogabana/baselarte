import { THEME_MODES, STORAGE_KEYS, resolveTheme, readStorage } from "./settings.ts";

interface BootConfig {
  keys: typeof STORAGE_KEYS;
  themeModes: readonly string[];
}

/**
 * Runs inline in <head>, before the first paint, so the page never flashes the wrong theme. It
 * receives its helpers as arguments because it is serialised with Function.prototype.toString()
 * and cannot import anything.
 */
function boot(config: BootConfig, resolve: typeof resolveTheme, read: typeof readStorage): void {
  const root = document.documentElement;
  const storedMode = read(config.keys.themeMode);
  const mode = config.themeModes.includes(storedMode ?? "") ? (storedMode as Parameters<typeof resolve>[0]) : "auto";
  root.dataset.theme = resolve(mode, matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.add("js-enabled");
}

const config: BootConfig = {
  keys: STORAGE_KEYS,
  themeModes: THEME_MODES,
};

/** The inline <script> body. */
export const bootScript = `(${boot.toString()})(${JSON.stringify(config)}, ${resolveTheme.toString()}, ${readStorage.toString()});`;
