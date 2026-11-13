import { NoteList } from "../components/layout/NoteList.tsx";
import { PhotoImage } from "../components/ui/PhotoImage.tsx";
import { homePhotos } from "../components/ui/photos.ts";
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
          <figcaption>
            <Text value={ui.quoteCitation} />
          </figcaption>
        </figure>
        <div className="home-photos" aria-hidden="true">
          {homePhotos.map((photo, index) => (
            <PhotoImage key={photo.id} photo={photo} eager sizes={index === 0 ? "(min-width: 900px) 30vw, 60vw" : "(min-width: 900px) 18vw, 40vw"} />
          ))}
        </div>
      </div>
      <NoteList />
    </div>
  );
}
