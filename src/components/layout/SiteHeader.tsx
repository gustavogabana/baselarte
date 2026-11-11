import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { Island } from "../../islands/Island.tsx";
import { site } from "../../site.ts";
import { Text } from "../ui/T.tsx";
import { FlowerLogo } from "../ui/FlowerLogo.tsx";

/** The flower in its black square (link home), the notes link and, on the right, the theme switch. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-wordmark" href="/" {...localizedAttribute("aria-label", ui.home)}>
          <FlowerLogo />
          <span className="site-wordmark__name">{site.name}</span>
        </a>
        <nav className="site-nav">
          <a href="/notas/">
            <Text value={ui.notes} />
          </a>
        </nav>
        <div className="header-tools requires-js">
          <Island name="ThemeSwitch" props={{ placement: "header" }} />
        </div>
      </div>
    </header>
  );
}
