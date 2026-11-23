import { ui } from "../ui.ts";
import { toggleGroup, toggleOption } from "../components/ui/toggle.ts";
import { themeMode, usePreference } from "../preferences/store.ts";
import type { ThemeMode } from "../preferences/settings.ts";

const LABELS: Record<ThemeMode, string> = {
  auto: ui.themeAuto,
  light: ui.themeLight,
  dark: ui.themeDark,
};

export interface ThemeSwitchProps {
  /** Where it sits; only changes the styling hook. */
  placement: "header" | "footer";
}

/** "auto / light / dark", as words in the footer. */
export function ThemeSwitch({ placement }: ThemeSwitchProps) {
  const currentMode = usePreference(themeMode);
  const modes: ThemeMode[] = ["auto", "light", "dark"];

  return (
    <div role="group" className={toggleGroup} data-placement={placement} aria-label={ui.theme}>
      {modes.map((mode) => (
        <button key={mode} type="button" aria-pressed={mode === currentMode} onClick={() => themeMode.set(mode)} className={toggleOption}>
          {LABELS[mode]}
        </button>
      ))}
    </div>
  );
}
