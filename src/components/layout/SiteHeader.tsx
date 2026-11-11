import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { Island } from "../../islands/Island.tsx";
import { site } from "../../site.ts";
import { Text } from "../ui/T.tsx";
import { FlowerLogo } from "../ui/FlowerLogo.tsx";

/** Flower and name on the left; the posts link and the theme switch on the right. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-wordmark" href="/" {...localizedAttribute("aria-label", ui.home)}>
        <FlowerLogo />
        <span>{site.name}</span>
      </a>
      <nav className="header-nav">
        <a href="/notas/">
          <Text value={ui.notes} />
        </a>
        <div className="header-tools requires-js">
          <Island name="ThemeSwitch" props={{ placement: "header" }} />
        </div>
      </nav>
    </header>
  );
}
