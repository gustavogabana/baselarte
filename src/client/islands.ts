import { createElement, type ComponentType } from "react";
import { hydrateRoot } from "react-dom/client";
import { islandLoaders, type IslandName } from "../islands/registry.ts";

function isIslandName(name: string): name is IslandName {
  return name in islandLoaders;
}

/** Wakes up every island the static HTML contains (see src/islands/Island.tsx). */
export function hydrateIslands(): void {
  document.querySelectorAll<HTMLElement>("[data-island]").forEach(async (container) => {
    const name = container.dataset.island ?? "";
    if (!isIslandName(name)) {
      console.error(`Unknown island "${name}"; it stays static.`);
      return;
    }
    try {
      const Component = await islandLoaders[name]();
      const props = JSON.parse(container.dataset.props ?? "{}") as object;
      hydrateRoot(container, createElement(Component as ComponentType<object>, props));
    } catch (hydrationError) {
      console.error(`Island "${name}" failed to start; it stays static.`, hydrationError);
    }
  });
}
