import type { ComponentType } from "react";
import type { ThemeSwitchProps } from "./ThemeSwitch.tsx";

/**
 * Islands are the only interactive React on the site: the page itself is static HTML, and each
 * island is rendered into it at build time and hydrated in the browser. Their props must be
 * JSON, since they travel inside the HTML.
 */
export interface IslandProps {
  ThemeSwitch: ThemeSwitchProps;
  LanguageSwitch: Record<string, never>;
}

export type IslandName = keyof IslandProps;

/** Loaded on demand in the browser, so a page only downloads the islands it contains. */
export const islandLoaders: { [Name in IslandName]: () => Promise<ComponentType<IslandProps[Name]>> } = {
  ThemeSwitch: () => import("./ThemeSwitch.tsx").then((module) => module.ThemeSwitch),
  LanguageSwitch: () => import("./LanguageSwitch.tsx").then((module) => module.LanguageSwitch),
};
