import { NoteList } from "../components/layout/NoteList.tsx";
import { Text } from "../components/ui/T.tsx";
import { ui } from "../i18n/ui.ts";
import { groupArt } from "../notes/catalog.ts";

/** Four group illustrations in a bento mosaic beside the quote. */
const MOSAIC = ["ai", "cloud", "security", "web"];

export function HomePage() {
  return (
    <div className="landing">
      <h1 className="sr-only">Baselarte</h1>
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
        <div className="home-mosaic" aria-hidden="true">
          {MOSAIC.map((id) => (
            <img key={id} src={groupArt(id)} alt="" width="1200" height="675" decoding="async" />
          ))}
        </div>
      </div>
      <NoteList />
    </div>
  );
}
