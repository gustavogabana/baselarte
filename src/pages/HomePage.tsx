import { NoteList } from "../components/layout/NoteList.tsx";
import { PhotoCredit } from "../components/ui/PhotoCredit.tsx";
import { InkedPhoto } from "../components/ui/PhotoImage.tsx";
import { homePhoto } from "../components/ui/photos.ts";
import { T, Text } from "../components/ui/T.tsx";
import { ui } from "../i18n/ui.ts";

/** The IBM quote, with two phrases set on ink bars (same words as ui.quote). */
function Quote() {
  return (
    <T
      en={
        <>
          A computer can never be held <mark className="ink-mark ink-mark--magenta">accountable</mark>, therefore a computer must never make a{" "}
          <mark className="ink-mark ink-mark--cyan">management decision</mark>.
        </>
      }
      pt={
        <>
          Um computador nunca pode ser <mark className="ink-mark ink-mark--magenta">responsabilizado</mark>; portanto, um computador nunca deve tomar uma{" "}
          <mark className="ink-mark ink-mark--cyan">decisão de gestão</mark>.
        </>
      }
    />
  );
}

export function HomePage() {
  return (
    <div className="landing">
      <h1 className="sr-only">Baselarte</h1>
      <div className="landing-top">
        <figure className="pull-quote">
          <blockquote>
            <p>
              <Quote />
            </p>
          </blockquote>
          <figcaption>
            <Text value={ui.quoteCitation} />
          </figcaption>
        </figure>
        <figure className="landing-photo">
          <InkedPhoto photo={homePhoto} eager sizes="(min-width: 900px) 34vw, 100vw" />
          <PhotoCredit photo={homePhoto} />
        </figure>
      </div>
      <NoteList />
    </div>
  );
}
