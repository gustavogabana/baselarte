import type { JSX } from "react";
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

/** The site's own theme glyphs: an open ring (light), a full disc (dark), half of each (auto). */
const GLYPHS: Record<ThemeMode, JSX.Element> = {
  auto: (
    <>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 2.5a5.5 5.5 0 0 1 0 11z" className="theme-glyph__fill" />
    </>
  ),
  light: <circle cx="8" cy="8" r="5.5" />,
  dark: <circle cx="8" cy="8" r="5.5" className="theme-glyph__fill" />,
};

/** auto / light / dark. */
export function ThemeSwitch({ placement }: ThemeSwitchProps) {
  const localize = useLocalize();
  const currentMode = usePreference(themeMode);
  const modes: ThemeMode[] = ["auto", "light", "dark"];

  return (
    <div role="group" className={`theme-switch theme-switch--${placement}`} aria-label={localize(ui.theme)}>
      {modes.map((mode) => (
        <button key={mode} type="button" aria-pressed={mode === currentMode} onClick={() => themeMode.set(mode)}>
          <svg className="theme-glyph" viewBox="0 0 16 16" aria-hidden="true">
            {GLYPHS[mode]}
          </svg>
          <span className="theme-switch__label">
            <Text value={LABELS[mode]} />
          </span>
        </button>
      ))}
    </div>
  );
}
