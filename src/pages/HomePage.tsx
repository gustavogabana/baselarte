import { NoteList } from "../components/layout/NoteList.tsx";
import { buttonPrimary } from "../components/ui/button.ts";
import { FlowerLogo } from "../components/ui/FlowerLogo.tsx";
import { T, Text } from "../components/ui/T.tsx";
import { ui } from "../i18n/ui.ts";
import { catalog } from "../notes/catalog.ts";
import { site } from "../site.ts";

const noteCount = catalog.reduce((total, group) => total + group.notes.length, 0);

/** The opening, centred like a product page: the magnolia, the name in large type, the IBM quote as
 *  the headline, one blue pill to the index and the counts in small grey type. */
function Hero() {
  return (
    <section className="mx-auto max-w-4xl pt-6 pb-16 text-center tab:pt-14 tab:pb-24" aria-labelledby="home-title">
      <FlowerLogo className="mx-auto size-16 tab:size-20 [&_path]:[vector-effect:non-scaling-stroke] [&_path]:[stroke-width:1.5px]" />
      <h1 id="home-title" className="mt-5 text-[clamp(2.75rem,7vw,5rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
        {site.name}
      </h1>
      <p className="mt-1 text-[clamp(1.25rem,2.6vw,1.75rem)] leading-tight tracking-[-0.02em] text-faint">
        <Text value={ui.studyNotes} />
      </p>
      <figure className="mx-auto mt-12 max-w-3xl">
        <blockquote>
          <p className="text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.025em] text-balance text-ink">
            <Text value={ui.quote} />
          </p>
        </blockquote>
        <figcaption className="mt-4 text-[1.0625rem] text-faint">
          <Text value={ui.quoteCitation} />
        </figcaption>
      </figure>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
        <a href="#indice" className={buttonPrimary}>
          <T en="Browse the notes" pt="Ver as notas" />
        </a>
        <a href="/llms.txt" className="text-[1.0625rem]">
          llms.txt <span aria-hidden="true">›</span>
        </a>
      </div>
      <p className="mt-6 text-sm text-faint tabular-nums">
        <T
          en={`${noteCount} notes · ${catalog.length} series · English and Portuguese`}
          pt={`${noteCount} notas · ${catalog.length} séries · português e inglês`}
        />
      </p>
    </section>
  );
}

export function HomePage() {
  return (
    <div>
      <Hero />
      <NoteList />
    </div>
  );
}
