import { useLocalize } from "../i18n/useLocalize.ts";
import type { Language } from "../i18n/localized.ts";
import { ui } from "../i18n/ui.ts";
import { language, usePreference } from "../preferences/store.ts";

const OPTIONS: { value: Language; name: string }[] = [
  { value: "en", name: "English" },
  { value: "pt-BR", name: "Português" },
];

/** Each language is named in itself, so a visitor can always find their own. */
export function LanguageSwitch() {
  const localize = useLocalize();
  const currentLanguage = usePreference(language);
  return (
    <div role="group" className="language-switch" aria-label={localize(ui.language)}>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.value}
          aria-pressed={option.value === currentLanguage}
          onClick={() => language.set(option.value)}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
}
