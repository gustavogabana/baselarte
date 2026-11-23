import { ui } from "../../ui.ts";

/** Which item of the header is the current page. */
export type HeaderSection = "home" | "notes" | "none";

const LINKS: { section: Exclude<HeaderSection, "none">; href: string; label: typeof ui.home }[] = [
  { section: "home", href: "/", label: ui.home },
  { section: "notes", href: "/#indice", label: ui.notes },
];

/** A quiet bar that stays on top: only "home / notes", lower case, at the right edge of the reading
 *  column; the current one is navy, the others grey and navy on hover. */
export function SiteHeader({ current }: { current: HeaderSection }) {
  return (
    <header className="site-header sticky top-0 z-90 bg-page/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-16 w-full max-w-[calc(var(--page-max)+2*var(--gutter))] items-center justify-end px-(--gutter) text-[0.9375rem] text-faint lowercase"
        aria-label={ui.siteNav}
      >
        {LINKS.map((link, index) => (
          <span key={link.section} className="inline-flex items-center">
            {index > 0 && (
              <span className="mx-1.5 text-ghost" aria-hidden="true">
                /
              </span>
            )}
            <a
              href={link.href}
              className={`py-2 hover:text-accent ${current === link.section ? "text-accent" : ""}`}
              aria-current={current === link.section ? "page" : undefined}
            >
              {link.label}
            </a>
          </span>
        ))}
      </nav>
    </header>
  );
}
