import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { Island } from "../../islands/Island.tsx";
import { FlowerLogo } from "../ui/FlowerLogo.tsx";

/** The flower (link home) and, on the right, the theme switch so it is reachable without scrolling. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-wordmark" href="/" {...localizedAttribute("aria-label", ui.home)}>
        <FlowerLogo />
      </a>
      <div className="header-tools requires-js">
        <Island name="ThemeSwitch" props={{ placement: "header" }} />
      </div>
    </header>
  );
}
