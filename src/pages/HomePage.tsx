import { NoteList } from "../components/layout/NoteList.tsx";
import { ui } from "../ui.ts";
import { catalog } from "../notes/catalog.ts";
import { site } from "../site.ts";

const noteCount = catalog.reduce((total, group) => total + group.notes.length, 0);

/** The opening: two short lines in large serif, what the site is in grey text, the IBM quote and
 *  the counts in paler type. */
function Hero() {
  return (
    <section className="pb-16" aria-labelledby="home-title">
      <h1 id="home-title" className="font-display text-[clamp(2.5rem,6vw,3.25rem)] leading-[1.12] text-ink">
        {site.name}.
        <br />
        {ui.studyNotes}.
      </h1>
      <p className="mt-7 text-fg">
        {ui.siteDescription}{" "}
        Cada nota é escrita para ser entendida.
      </p>
      <figure className="mt-5 text-sm text-faint">
        <blockquote className="inline">
          <p className="inline">
            “{ui.quote}”
          </p>
        </blockquote>{" "}
        <figcaption className="inline text-ghost">
          — {ui.quoteCitation}
        </figcaption>
      </figure>
      <p className="mt-5 text-sm text-ghost tabular-nums">
        {`${noteCount} notas · ${catalog.length} séries`}
      </p>
    </section>
  );
}

export function HomePage() {
  return (
    <div className="mx-auto max-w-(--page-max)">
      <Hero />
      <div className="border-t border-line pt-16">
        <NoteList />
      </div>
    </div>
  );
}
