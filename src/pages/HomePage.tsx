import { AreaNav, NoteList } from "../components/layout/NoteList.tsx";
import { FeaturedCard } from "../components/layout/FeaturedCard.tsx";
import { Text } from "../components/ui/T.tsx";
import { ui } from "../i18n/ui.ts";
import { catalog } from "../notes/catalog.ts";
import { notes } from "../notes/registry.ts";

const FEATURED_COUNT = 3;

/** Newest first; notes updated the same day keep their registry order. */
function latestSlugs(): string[] {
  return [...notes.values()]
    .map((note, order) => ({ note, order }))
    .sort((a, b) => b.note.updated.localeCompare(a.note.updated) || a.order - b.order)
    .slice(0, FEATURED_COUNT)
    .map(({ note }) => note.slug);
}

export function HomePage() {
  return (
    <div className="landing">
      <section className="home-hero">
        <p className="eyebrow">Baselarte / Engineering</p>
        <h1>
          <Text value={ui.heroTitle} />
        </h1>
        <p className="home-hero__lede">
          <Text value={ui.heroLede} />
        </p>
      </section>

      <section className="latest" aria-labelledby="latest-title">
        <div className="section-heading">
          <h2 id="latest-title">
            <Text value={ui.latest} />
          </h2>
          <p>
            <Text value={ui.latestLede} />
          </p>
        </div>
        <div className="feature-grid">
          {latestSlugs().map((slug, index) => (
            <FeaturedCard key={slug} slug={slug} cover={catalog[index % catalog.length]?.cover.file ?? "city-night.webp"} eager={index === 0} />
          ))}
        </div>
      </section>

      <div className="section-heading section-heading--bar">
        <h2>
          <Text value={ui.allNotes} />
        </h2>
        <AreaNav />
      </div>
      <NoteList />

      <figure className="pull-quote">
        <blockquote>
          <p>
            <Text value={ui.quote} />
          </p>
        </blockquote>
        <figcaption>
          <Text value={ui.quoteCitation} />
        </figcaption>
      </figure>
    </div>
  );
}
