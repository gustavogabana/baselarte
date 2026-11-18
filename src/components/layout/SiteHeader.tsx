import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { Island } from "../../islands/Island.tsx";
import { site } from "../../site.ts";
import { FlowerLogo } from "../ui/FlowerLogo.tsx";

/** A thin translucent bar that stays on top while reading (blurred page behind it, a hairline
 *  under it): the flower and name on the left, the theme switch on the right. */
export function SiteHeader() {
  return (
    <header
      className="site-header sticky top-0 z-90 flex h-12 items-center justify-between gap-4 border-b border-line-faint bg-page/80 px-[max(var(--gutter),calc((100vw-var(--page-max))/2))] backdrop-blur-xl backdrop-saturate-180"
    >
      <a
        className="inline-flex items-center gap-2 text-[1.0625rem] leading-none font-semibold tracking-[-0.02em] text-ink no-underline hover:text-ink hover:no-underline"
        href="/"
        {...localizedAttribute("aria-label", ui.home)}
      >
        <FlowerLogo className="size-6" />
        <span>{site.name}</span>
      </a>
      <nav className="flex items-center gap-6 text-sm">
        <div className="requires-js">
          <Island name="ThemeSwitch" props={{ placement: "header" }} />
        </div>
      </nav>
    </header>
  );
}
