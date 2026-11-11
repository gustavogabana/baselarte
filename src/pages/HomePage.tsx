import { NoteList } from "../components/layout/NoteList.tsx";
import { Text } from "../components/ui/T.tsx";
import { ui } from "../i18n/ui.ts";

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
        <figcaption className="monospace-label">
          <Text value={ui.quoteCitation} />
        </figcaption>
      </figure>
      <div className="home-art" aria-hidden="true" />
      </div>
      <NoteList />
    </div>
  );
}
