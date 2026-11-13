import { NoteList } from "../components/layout/NoteList.tsx";
import { FlowerLogo } from "../components/ui/FlowerLogo.tsx";
import { groupInk, inkStyle } from "../components/ui/inks.ts";
import { PhotoCredit } from "../components/ui/PhotoCredit.tsx";
import { TonedPhoto } from "../components/ui/PhotoImage.tsx";
import { homePhoto } from "../components/ui/photos.ts";
import { T, Text } from "../components/ui/T.tsx";
import { localizedAttribute } from "../i18n/attributes.ts";
import { ui } from "../i18n/ui.ts";
import { catalog } from "../notes/catalog.ts";
import { seriesNumber } from "../notes/registry.ts";
import { site } from "../site.ts";

const noteCount = catalog.reduce((total, group) => total + group.notes.length, 0);

/** The cover of the series: the flower, the name, the counts and one toned photograph. */
function Cover() {
  return (
    <figure className="cover">
      <div className="cover__sheet">
        <div className="cover__title">
          <FlowerLogo className="cover__mark" />
          <h1>
            {site.name}
            <span className="cover__subtitle">
              <Text value={ui.studyNotes} />
            </span>
          </h1>
        </div>
        <TonedPhoto photo={homePhoto} eager className="cover__photo" sizes="(min-width: 900px) 26rem, 90vw" />
        <p className="cover__facts">
          <T
            en={`${noteCount} notes · ${catalog.length} series · English and Portuguese`}
            pt={`${noteCount} notas · ${catalog.length} séries · português e inglês`}
          />
        </p>
      </div>
      <PhotoCredit photo={homePhoto} />
    </figure>
  );
}

/** The series at a glance: number and name, each a jump to its place in the index. */
function SeriesNav() {
  return (
    <nav className="series-nav" {...localizedAttribute("aria-label", ui.series)}>
      <ol>
        {catalog.map((group) => (
          <li key={group.id} style={inkStyle(groupInk(group.id))}>
            <a href={`#series-${group.id}`}>
              <span className="series-num">{seriesNumber(group.id)}</span>
              <Text value={group.title} />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function HomePage() {
  return (
    <div className="landing">
      <div className="landing-top">
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
        <Cover />
      </div>
      <SeriesNav />
      <NoteList />
    </div>
  );
}
