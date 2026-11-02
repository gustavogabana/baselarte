import { LOCALIZED_ATTRIBUTES } from "../i18n/attributes.ts";
import { pick, type Language, type Localized } from "../i18n/localized.ts";
import { resolveTheme } from "../preferences/settings.ts";
import { language, themeMode } from "../preferences/store.ts";

const CLOCK_CHECK_MS = 60_000;
const root = document.documentElement;

function applyTheme(): void {
  root.dataset.theme = resolveTheme(themeMode.get(), new Date().getHours());
  // The mobile address bar follows the page colour.
  const pageColor = getComputedStyle(root).getPropertyValue("--page").trim();
  const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColorMeta && pageColor) themeColorMeta.content = pageColor;
}

interface PageText {
  title: Localized;
  description?: Localized;
}

function readPageText(): PageText | null {
  const source = document.getElementById("page-text")?.textContent;
  if (!source) return null;
  try {
    return JSON.parse(source) as PageText;
  } catch (parseError) {
    console.error("The page's translated title could not be read.", parseError);
    return null;
  }
}

/** Text is already in both languages (CSS picks one); only <title> and attributes need swapping. */
function applyLanguage(pageText: PageText | null): void {
  const current: Language = language.get();
  root.lang = current;
  const suffix = current === "pt-BR" ? "pt" : "en";

  if (pageText) {
    document.title = pick(pageText.title, current);
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (descriptionMeta && pageText.description) descriptionMeta.content = pick(pageText.description, current);
  }

  for (const attribute of LOCALIZED_ATTRIBUTES) {
    document.querySelectorAll<HTMLElement>(`[data-${attribute}-${suffix}]`).forEach((element) => {
      element.setAttribute(attribute, element.getAttribute(`data-${attribute}-${suffix}`) ?? "");
    });
  }
}

/** Applies theme and language now, whenever they change, and when the clock crosses 06:00 / 18:00. */
export function keepPreferencesApplied(): void {
  const pageText = readPageText();
  applyTheme();
  applyLanguage(pageText);
  themeMode.subscribe(applyTheme);
  language.subscribe(() => applyLanguage(pageText));
  setInterval(applyTheme, CLOCK_CHECK_MS);
}
