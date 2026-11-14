import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { Island } from "../../islands/Island.tsx";
import { site } from "../../site.ts";
import { FlowerLogo } from "../ui/FlowerLogo.tsx";

/** A white bar over a hairline: the flower and name on the left, the theme switch on the right. */
export function SiteHeader() {
  return (
    <header
      className="site-header flex h-14 items-center justify-between gap-4 border-b border-line bg-page px-[max(var(--gutter),calc((100vw-var(--page-max))/2))]"
    >
      <a
        className="inline-flex items-center gap-2.5 text-[1.1875rem] leading-none font-bold tracking-[-0.015em] text-ink no-underline hover:text-ink"
        href="/"
        {...localizedAttribute("aria-label", ui.home)}
      >
        <FlowerLogo className="size-7" />
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
