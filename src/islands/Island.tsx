import type { ComponentType } from "react";
import { EasterEgg } from "./EasterEgg.tsx";
import { LanguageSwitch } from "./LanguageSwitch.tsx";
import { MusicPlayer } from "./MusicPlayer.tsx";
import { ThemeSwitch } from "./ThemeSwitch.tsx";
import type { IslandName, IslandProps } from "./registry.ts";

const serverComponents: { [Name in IslandName]: ComponentType<IslandProps[Name]> } = {
  ThemeSwitch,
  LanguageSwitch,
  EasterEgg,
  MusicPlayer,
};

interface IslandElementProps<Name extends IslandName> {
  name: Name;
  props: IslandProps[Name];
}

/** Renders an island's static HTML and marks it for hydration (see src/client/islands.ts). */
export function Island<Name extends IslandName>({ name, props }: IslandElementProps<Name>) {
  const Component = serverComponents[name] as ComponentType<IslandProps[Name]>;
  return (
    <div className="island" data-island={name} data-props={JSON.stringify(props)}>
      <Component {...props} />
    </div>
  );
}
