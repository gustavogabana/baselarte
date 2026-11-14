import { NoteList } from "../components/layout/NoteList.tsx";
import { FlowerLogo } from "../components/ui/FlowerLogo.tsx";
import { T, Text } from "../components/ui/T.tsx";
import { ui } from "../i18n/ui.ts";
import { catalog } from "../notes/catalog.ts";
import { site } from "../site.ts";

const noteCount = catalog.reduce((total, group) => total + group.notes.length, 0);

/** The opening: the name, the IBM quote and the counts beside the magnolia drawn large (above it
 *  on phones), closed by a hairline. Then straight to the list. */
function Hero() {
  return (
    <section
      className="mb-10 grid items-center gap-x-14 gap-y-6 border-b border-line pb-10 tab:mb-12 tab:grid-cols-[minmax(0,1fr)_auto] tab:pb-12"
      aria-labelledby="home-title"
    >
      <div className="max-w-2xl">
        <h1 id="home-title" className="text-[1.75rem] leading-tight font-bold tracking-[-0.012em] text-ink">
          {site.name} <span className="font-normal text-faint">· <Text value={ui.studyNotes} /></span>
        </h1>
        <figure className="mt-6">
          <blockquote>
            <p className="text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.18] font-medium tracking-[-0.01em] text-balance text-ink">
              <Text value={ui.quote} />
            </p>
          </blockquote>
          <figcaption className="mt-3 text-base text-faint">
            <Text value={ui.quoteCitation} />
          </figcaption>
        </figure>
        <p className="mt-6 text-sm text-label tabular-nums">
          <T
            en={`${noteCount} notes · ${catalog.length} series · English and Portuguese`}
            pt={`${noteCount} notas · ${catalog.length} séries · português e inglês`}
          />
        </p>
      </div>
      <FlowerLogo className="order-first size-36 justify-self-start tab:order-none tab:size-72 tab:justify-self-end [&_path]:[vector-effect:non-scaling-stroke] [&_path]:[stroke-width:2.5px]" />
    </section>
  );
}

export function HomePage() {
  return (
    <div className="pt-2 tab:pt-6">
      <Hero />
      <NoteList />
    </div>
  );
}
