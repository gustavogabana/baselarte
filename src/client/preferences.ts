import { resolveTheme } from "../preferences/settings.ts";
import { themeMode } from "../preferences/store.ts";

const systemDarkQuery = matchMedia("(prefers-color-scheme: dark)");
const root = document.documentElement;

function applyTheme(): void {
  root.dataset.theme = resolveTheme(themeMode.get(), systemDarkQuery.matches);
  // The mobile address bar follows the page colour.
  const pageColor = getComputedStyle(root).getPropertyValue("--page").trim();
  const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColorMeta && pageColor) themeColorMeta.content = pageColor;
}

/** Applies the theme now, whenever it changes, and when the system switches between light and dark. */
export function keepPreferencesApplied(): void {
  applyTheme();
  themeMode.subscribe(applyTheme);
  systemDarkQuery.addEventListener("change", applyTheme);
}
