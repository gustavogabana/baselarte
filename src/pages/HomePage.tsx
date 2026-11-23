import { NoteList } from "../components/layout/NoteList.tsx";
import { T, Text } from "../components/ui/T.tsx";
import { ui } from "../i18n/ui.ts";
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
        <Text value={ui.studyNotes} />.
      </h1>
      <p className="mt-7 text-fg">
        <Text value={ui.siteDescription} />{" "}
        <T
          en="Each note is written to be understood, in English and Portuguese."
          pt="Cada nota é escrita para ser entendida, em português e inglês."
        />
      </p>
      <figure className="mt-5 text-sm text-faint">
        <blockquote className="inline">
          <p className="inline">
            “<Text value={ui.quote} />”
          </p>
        </blockquote>{" "}
        <figcaption className="inline text-ghost">
          — <Text value={ui.quoteCitation} />
        </figcaption>
      </figure>
      <p className="mt-5 text-sm text-ghost tabular-nums">
        <T
          en={`${noteCount} notes · ${catalog.length} series`}
          pt={`${noteCount} notas · ${catalog.length} séries`}
        />
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
