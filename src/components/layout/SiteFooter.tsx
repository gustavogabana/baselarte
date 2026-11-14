import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { Island } from "../../islands/Island.tsx";
import { FlowerLogo } from "../ui/FlowerLogo.tsx";

const MACHINE_FILES = ["llms.txt", "sitemap.xml", "robots.txt"];

/** A pale bar under a hairline, quiet and small. */
export function SiteFooter() {
  return (
    <footer className="site-footer flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line-faint bg-page-faint px-[max(var(--gutter),calc((100vw-var(--page-max))/2))] pt-7 pb-[calc(env(safe-area-inset-bottom,0px)+36px)] text-[0.8125rem] text-faint in-[body:has(.music-player)]:max-[520px]:pb-24">
      <span aria-hidden="true">
        <FlowerLogo className="size-[22px]" />
      </span>
      <Island name="EasterEgg" props={{ year: new Date().getFullYear() }} />
      <nav className="ml-auto flex flex-wrap gap-x-5 gap-y-1" {...localizedAttribute("aria-label", ui.filesForMachines)}>
        {MACHINE_FILES.map((file) => (
          <a key={file} href={`/${file}`} className="text-label decoration-transparent hover:text-blue hover:decoration-current">
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
