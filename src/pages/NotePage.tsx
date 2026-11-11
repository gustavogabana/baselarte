import { BackLink } from "../components/layout/BackLink.tsx";
import { DiagramViewer } from "../components/note/DiagramViewer.tsx";
import { localizedAttribute } from "../i18n/attributes.ts";
import { ui } from "../i18n/ui.ts";
import { Text } from "../components/ui/T.tsx";
import { localizedDate } from "../i18n/dates.ts";
import { locate } from "../notes/catalog.ts";
import type { Note, TocGroup } from "../notes/types.ts";

export function NotePage({ note }: { note: Note }) {
  const { Body } = note;
  const { area, group } = locate(note.slug);
  const articleClass = note.variant === "aws" ? "aws-guide reading-column" : "reading-column ds-guide";
  return (
    <article className={articleClass}>
      <BackLink href="/notas/" label={ui.notes} />
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero-kicker">
          <a href={`/notas/#${area.id}-${group.id}`}>
            <Text value={group.title} />
          </a>
          <span aria-hidden="true"> · </span>
          <Text value={note.kicker} />
        </p>
        <h1 id="hero-title" className="hero-title">
          <Text value={note.heroTitle} />
        </h1>
        <p className="hero-lede">
          <Text value={note.heroLede} />
        </p>
        <p className="hero-meta">
          <span>
            <Text value={ui.updatedOn} />{" "}
            <time dateTime={note.updated}>
              <Text value={localizedDate(note.updated)} />
            </time>
          </span>
        </p>
        <figure className="hero-cover">
          <img src={`/assets/aesthetic/${area.cover.file}`} alt="" width={1200} height={750} decoding="async" />
          <figcaption>
            <Text value={ui.photoBy} />: {area.cover.credit}
          </figcaption>
        </figure>
      </section>
      <TableOfContents groups={note.toc} />
      <Body />
      <DiagramViewer />
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
