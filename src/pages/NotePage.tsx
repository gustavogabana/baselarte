import { BackLink } from "../components/layout/BackLink.tsx";
import { formatDate } from "../components/layout/dates.ts";
import { groupOf } from "../notes/registry.ts";
import { PhotoImage } from "../components/ui/PhotoImage.tsx";
import { groupPhoto } from "../components/ui/photos.ts";
import { Arrow } from "../components/ui/Arrow.tsx";
import { site } from "../site.ts";
import { DiagramViewer } from "../components/note/DiagramViewer.tsx";
import { localizedAttribute } from "../i18n/attributes.ts";
import { ui } from "../i18n/ui.ts";
import { Text } from "../components/ui/T.tsx";
import type { Note, TocGroup } from "../notes/types.ts";

export function NotePage({ note }: { note: Note }) {
  const { Body } = note;
  const group = groupOf(note.slug);
  const photo = groupPhoto(group.id);
  const articleClass = note.variant === "aws" ? "aws-guide reading-column" : "reading-column ds-guide";
  return (
    <article className={articleClass}>
      <BackLink href="/" label={ui.notes} />
      <header className="hero" aria-labelledby="hero-title">
        <p className="hero-meta">
          <span className="hero-category">
            <Text value={group.title} />
          </span>
          <span className="hero-kicker">
            <Text value={note.kicker} />
          </span>
        </p>
        <h1 id="hero-title" className="hero-title">
          <Text value={note.heroTitle} />
        </h1>
        <p className="hero-lede">
          <Text value={note.heroLede} />
        </p>
        <figure className="hero-photo">
          <PhotoImage photo={photo} eager sizes="(min-width: 760px) 44rem, 100vw" />
          <figcaption>
            <Text value={ui.photoBy} />{" "}
            <a href={photo.page} rel="noopener">
              {photo.photographer}
            </a>{" "}
            / Unsplash
          </figcaption>
        </figure>
        <dl className="hero-facts">
          <div>
            <dt>
              <Text value={ui.author} />
            </dt>
            <dd>{site.name}</dd>
          </div>
          <div>
            <dt>
              <Text value={ui.published} />
            </dt>
            <dd>
              <time dateTime={note.published}>
                <Text value={formatDate(note.published)} />
              </time>
            </dd>
          </div>
          <div>
            <dt>
              <Text value={ui.updated} />
            </dt>
            <dd>
              <time dateTime={note.updated}>
                <Text value={formatDate(note.updated)} />
              </time>
            </dd>
          </div>
        </dl>
      </header>
      <TableOfContents groups={note.toc} />
      <div className="post-body">
        <Body />
      </div>
      <DiagramViewer />
      <div id="scroll-progress" className="requires-js" aria-hidden="true" />
      <button type="button" className="back-to-top requires-js" data-back-to-top="">
        <Arrow direction="up" />
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
