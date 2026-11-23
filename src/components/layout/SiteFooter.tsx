import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { Island } from "../../islands/Island.tsx";
import { site } from "../../site.ts";
import { FlowerLogo } from "../ui/FlowerLogo.tsx";

const MACHINE_FILES = ["llms.txt", "sitemap.xml", "robots.txt"];

/** The footer of an editorial page, on the reading column: the motto in small italic serif and the
 *  copyright on the left, language and theme as words on the right; below, the files for
 *  machines and, in the corner, the magnolia as a small detail with its name under it. */
export function SiteFooter() {
  const domain = new URL(site.url).host;
  return (
    <footer className="site-footer mx-auto w-full max-w-[calc(var(--page-max)+2*var(--gutter))] px-(--gutter) pb-[calc(env(safe-area-inset-bottom,0px)+32px)] text-[0.9375rem] text-ghost in-[body:has(.music-player)]:max-[520px]:pb-24">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t border-line pt-10">
        <div>
          <p className="font-display text-base text-ghost italic">{site.slogan}</p>
          <div className="mt-1 flex gap-1.5 text-faint">
            <Island name="EasterEgg" props={{ year: new Date().getFullYear() }} />
            <span aria-hidden="true">·</span>
            <span>{domain}</span>
          </div>
        </div>
        <div className="requires-js flex flex-col items-end gap-1">
          <Island name="LanguageSwitch" props={{}} />
          <Island name="ThemeSwitch" props={{ placement: "footer" }} />
        </div>
      </div>
      <div className="mt-10 flex items-end justify-between gap-6">
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-xs" {...localizedAttribute("aria-label", ui.filesForMachines)}>
          {MACHINE_FILES.map((file) => (
            <a key={file} href={`/${file}`} className="text-ghost hover:text-accent">
              {file}
            </a>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-1 text-ghost" aria-hidden="true">
          <FlowerLogo className="size-5 [&_circle]:fill-ghost [&_path]:stroke-ghost" />
          <span className="text-[0.625rem] leading-none tracking-[0.04em] lowercase">baselarte magnolia</span>
        </div>
      </div>
    </footer>
  );
}
