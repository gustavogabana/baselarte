import { BackLink } from "../components/layout/BackLink.tsx";
import { localizedAttribute } from "../i18n/attributes.ts";
import { ui } from "../i18n/ui.ts";
import { Text } from "../components/ui/T.tsx";
import type { Note, TocGroup } from "../notes/types.ts";

export function NotePage({ note }: { note: Note }) {
  const { Body } = note;
  const articleClass = note.variant === "aws" ? "aws-guide reading-column" : "reading-column ds-guide";
  return (
    <article className={articleClass}>
      <BackLink href="/notas/" label={ui.notes} />
      <section className="hero" aria-labelledby="hero-title">
        <p className="monospace-label hero-kicker">
          <Text value={note.kicker} />
        </p>
        <h1 id="hero-title" className="hero-title">
          <Text value={note.heroTitle} />
        </h1>
        <p className="hero-lede">
          <Text value={note.heroLede} />
        </p>
      </section>
      <TableOfContents groups={note.toc} />
      <Body />
      <div id="scroll-progress" className="requires-js" aria-hidden="true" />
      <button type="button" className="back-to-top requires-js" data-back-to-top="">
        <span aria-hidden="true">↑ </span>
        <Text value={ui.backToTop} />
      </button>
    </article>
  );
}

function TableOfContents({ groups }: { groups: TocGroup[] }) {
  return (
    <aside className="side-nav" id="side-nav">
      <nav {...localizedAttribute("aria-label", ui.onThisPage)}>
        <h2>
          <Text value={ui.onThisPage} />
        </h2>
        {groups.map((group, index) => (
          <div key={index}>
            {group.label && <h2>{group.label}</h2>}
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
