import type { ReactNode } from "react";
import { ui } from "../../i18n/ui.ts";
import { Text } from "../ui/T.tsx";
import { IconSprite, IconUsageProvider } from "../ui/Icon.tsx";
import type { IconName } from "../ui/icons.tsx";
import { Head, type PageAssets, type PageHead } from "./Head.tsx";
import { SiteFooter } from "./SiteFooter.tsx";
import { SiteHeader } from "./SiteHeader.tsx";

interface DocumentProps {
  head: PageHead;
  assets: PageAssets;
  /** Icons added by client scripts after load (they are not visible to the static render). */
  runtimeIcons?: IconName[];
  children: ReactNode;
}

/** The whole HTML document every page shares: head, header, main, footer. */
export function Document({ head, assets, runtimeIcons = [], children }: DocumentProps) {
  const usedIcons = new Set<IconName>(runtimeIcons);
  return (
    <html lang="en" data-theme="light">
      <Head head={head} assets={assets} />
      <body>
        <IconUsageProvider value={usedIcons}>
          <a className="skip-link" href="#main">
            <Text value={ui.skipLink} />
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <IconSprite used={usedIcons} />
        </IconUsageProvider>
      </body>
    </html>
  );
}
