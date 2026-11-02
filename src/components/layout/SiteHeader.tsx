import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { FlowerLogo } from "../ui/FlowerLogo.tsx";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-wordmark" href="/" {...localizedAttribute("aria-label", ui.home)}>
        <FlowerLogo />
      </a>
    </header>
  );
}
