import { createContext, useContext } from "react";
import { icons, type IconName } from "./icons.tsx";

/**
 * Icons are <use> references into one <svg> sprite per page. Each <Icon> records its name while
 * the page renders, and <IconSprite> (placed after the content) emits only the symbols the page
 * used. This relies on the static render visiting the tree in document order, which it does.
 */
const IconUsage = createContext<Set<IconName> | null>(null);

export const IconUsageProvider = IconUsage.Provider;

export function Icon({ name }: { name: IconName }) {
  useContext(IconUsage)?.add(name);
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function IconSprite({ used }: { used: ReadonlySet<IconName> }) {
  if (used.size === 0) return null;
  return (
    <svg className="icon-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      {[...used].sort().map((name) => (
        <symbol key={name} id={`i-${name}`} viewBox="0 0 32 32">
          {icons[name]}
        </symbol>
      ))}
    </svg>
  );
}
