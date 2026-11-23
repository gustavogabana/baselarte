import { useLocalize } from "../i18n/useLocalize.ts";
import type { Language } from "../i18n/localized.ts";
import { ui } from "../i18n/ui.ts";
import { language, usePreference } from "../preferences/store.ts";
import { toggleGroup, toggleOption } from "../components/ui/toggle.ts";

const OPTIONS: { value: Language; code: string; name: string }[] = [
  { value: "en", code: "en", name: "English" },
  { value: "pt-BR", code: "pt", name: "Português" },
];

/** "en / pt"; each code carries its language's own name for screen readers and on hover. */
export function LanguageSwitch() {
  const localize = useLocalize();
  const currentLanguage = usePreference(language);
  return (
    <div role="group" className={toggleGroup} aria-label={localize(ui.language)}>
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.value}
          className={toggleOption}
          title={option.name}
          aria-label={option.name}
          aria-pressed={option.value === currentLanguage}
          onClick={() => language.set(option.value)}
        >
          {option.code}
        </button>
      ))}
    </div>
  );
}
