import { useLocalize } from "../i18n/useLocalize.ts";
import type { Localized } from "../i18n/localized.ts";
import { ui } from "../i18n/ui.ts";
import { Text } from "../components/ui/T.tsx";
import { themeMode, usePreference } from "../preferences/store.ts";
import type { ThemeMode } from "../preferences/settings.ts";

const LABELS: Record<ThemeMode, Localized> = {
  auto: ui.themeAuto,
  light: ui.themeLight,
  dark: ui.themeDark,
};

export interface ThemeSwitchProps {
  /** Where it sits; only changes the styling hook. */
  placement: "header" | "footer";
}

/** auto / light / dark. */
export function ThemeSwitch({ placement }: ThemeSwitchProps) {
  const localize = useLocalize();
  const currentMode = usePreference(themeMode);
  const modes: ThemeMode[] = ["auto", "light", "dark"];

  return (
    <div role="group" className={`theme-switch theme-switch--${placement}`} aria-label={localize(ui.theme)}>
      {modes.map((mode) => (
        <button key={mode} type="button" aria-pressed={mode === currentMode} onClick={() => themeMode.set(mode)}>
          <Text value={LABELS[mode]} />
        </button>
      ))}
    </div>
  );
}
