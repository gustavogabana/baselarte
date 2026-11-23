import type { ReactNode } from "react";
import { ui } from "../../i18n/ui.ts";
import { Island } from "../../islands/Island.tsx";
import { Text } from "../ui/T.tsx";
import { IconSprite, IconUsageProvider } from "../ui/Icon.tsx";
import type { IconName } from "../ui/icons.tsx";
import { Head, type PageAssets, type PageHead } from "./Head.tsx";
import { SiteFooter } from "./SiteFooter.tsx";
import { SiteHeader, type HeaderSection } from "./SiteHeader.tsx";

interface DocumentProps {
  head: PageHead;
  assets: PageAssets;
  /** Icons added by client scripts after load (they are not visible to the static render). */
  runtimeIcons?: IconName[];
  children: ReactNode;
}

/** The whole HTML document every page shares: head, header, main, footer. */
/** The header item a path belongs to: the home page, a note, or neither (404). */
function headerSection(path: string): HeaderSection {
  if (path === "/") return "home";
  if (path.startsWith("/notas/")) return "notes";
  return "none";
}

export function Document({ head, assets, runtimeIcons = [], children }: DocumentProps) {
  const usedIcons = new Set<IconName>(runtimeIcons);
  return (
    <html lang="en" data-theme="light">
      <Head head={head} assets={assets} />
      <body>
        <IconUsageProvider value={usedIcons}>
          <a
            className="fixed top-3 left-3 z-200 -translate-y-[200%] rounded-sm bg-primary px-4 py-2 text-on-primary focus:translate-y-0"
            href="#main"
          >
            <Text value={ui.skipLink} />
          </a>
          <SiteHeader current={headerSection(head.path)} />
          {/* Full width: each page sets its own column (the note page needs room for its contents). */}
          <main id="main" className="w-full flex-1 px-(--gutter) pt-14 pb-24 tab:pt-20">
            {children}
          </main>
          <SiteFooter />
          <IconSprite used={usedIcons} />
          {assets.song && <Island name="MusicPlayer" props={{ src: assets.song }} />}
        </IconUsageProvider>
      </body>
    </html>
  );
}
