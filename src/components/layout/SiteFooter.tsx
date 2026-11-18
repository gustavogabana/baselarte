import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { Island } from "../../islands/Island.tsx";
import { FlowerLogo } from "../ui/FlowerLogo.tsx";

const MACHINE_FILES = ["llms.txt", "sitemap.xml", "robots.txt"];

/** Apple's footer: the pale grey band, small grey type, links that only underline on hover. */
export function SiteFooter() {
  return (
    <footer className="site-footer flex flex-wrap items-center justify-between gap-x-6 gap-y-4 bg-page-faint px-[max(var(--gutter),calc((100vw-var(--page-max))/2))] pt-8 pb-[calc(env(safe-area-inset-bottom,0px)+40px)] text-xs leading-[1.33] text-faint in-[body:has(.music-player)]:max-[520px]:pb-24">
      <span aria-hidden="true">
        <FlowerLogo className="size-[22px]" />
      </span>
      <Island name="EasterEgg" props={{ year: new Date().getFullYear() }} />
      <nav className="ml-auto flex flex-wrap gap-x-5 gap-y-1" {...localizedAttribute("aria-label", ui.filesForMachines)}>
        {MACHINE_FILES.map((file) => (
          <a key={file} href={`/${file}`} className="text-label hover:text-ink">
            {file}
          </a>
        ))}
      </nav>
      <div className="requires-js flex flex-wrap gap-x-3 gap-y-2">
        <Island name="LanguageSwitch" props={{}} />
      </div>
    </footer>
  );
}
