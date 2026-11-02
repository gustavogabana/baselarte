import { language, usePreference } from "../preferences/store.ts";
import { pick, type Localized } from "./localized.ts";

/**
 * For islands whose attributes change while the page is open (a Play label turning into Pause):
 * returns a function that picks the visitor's current language.
 */
export function useLocalize(): (text: Localized) => string {
  const current = usePreference(language);
  return (text) => pick(text, current);
}
