import type { ReactNode } from "react";
import { ui } from "../../i18n/ui.ts";
import { Text } from "../ui/T.tsx";

interface SourceLink {
  label: string;
  href: string;
}

type SourcesProps = {
  /** Defaults to "Sources"; some notes add when the links were last checked. */
  title?: ReactNode;
} & ({ links: SourceLink[]; children?: never } | { links?: never; children: ReactNode });

/** The official references a note is based on, listed at its end. */
export function Sources({ title, links, children }: SourcesProps) {
  return (
    <div className="sources">
      <b>{title ?? <Text value={ui.sources} />}</b>
      {links ? (
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} rel="noopener">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}
