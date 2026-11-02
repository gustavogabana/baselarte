import { localizedAttribute } from "../i18n/attributes.ts";
import type { Localized } from "../i18n/localized.ts";
import { ui } from "../i18n/ui.ts";
import { Text } from "../components/ui/T.tsx";
import { hurricaneUnlocked, themeMode, usePreference } from "../preferences/store.ts";
import type { ThemeMode } from "../preferences/settings.ts";

const LABELS: Record<ThemeMode, Localized> = {
  auto: ui.themeAuto,
  light: ui.themeLight,
  dark: ui.themeDark,
  hurricane: ui.themeHurricane,
};

export interface ThemeSwitchProps {
  /** Where it sits; only changes the styling hook. */
  placement: "header" | "footer";
}

/** auto / light / dark, plus the hidden theme once it has been unlocked. */
export function ThemeSwitch({ placement }: ThemeSwitchProps) {
  const currentMode = usePreference(themeMode);
  const isHurricaneUnlocked = usePreference(hurricaneUnlocked) === "yes";
  const modes: ThemeMode[] = isHurricaneUnlocked ? ["auto", "light", "dark", "hurricane"] : ["auto", "light", "dark"];

  return (
    <div role="group" className={`theme-switch theme-switch--${placement}`} {...localizedAttribute("aria-label", ui.theme)}>
      {modes.map((mode) => (
        <button key={mode} type="button" aria-pressed={mode === currentMode} onClick={() => themeMode.set(mode)}>
          <Text value={LABELS[mode]} />
        </button>
      ))}
    </div>
  );
}
