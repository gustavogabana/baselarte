import { catalog } from "../../notes/catalog.ts";
import { Text } from "../ui/T.tsx";
import { NoteCard } from "./NoteCard.tsx";

/** The areas, as in-page links. */
export function AreaNav() {
  return (
    <nav className="area-nav" aria-label="Areas">
      {catalog.map((area) => (
        <a key={area.id} href={`#${area.id}`}>
          <Text value={area.title} />
        </a>
      ))}
    </nav>
  );
}

/** Every note, by area and then group, in catalog order. Used by the home and the notes pages. */
export function NoteList() {
  return (
    <div className="note-index">
      {catalog.map((area) => (
        <section key={area.id} id={area.id} className="area">
          <header className="area__header">
            <h2>
              <Text value={area.title} />
            </h2>
            <p>
              <Text value={area.description} />
            </p>
          </header>
          {area.groups.map((group) => (
            <div key={group.id} className="group" id={`${area.id}-${group.id}`}>
              <h3>
                <Text value={group.title} />
              </h3>
              <p className="group__description">
                <Text value={group.description} />
              </p>
              <div className="card-grid">
                {group.notes.map((slug) => (
                  <NoteCard key={slug} slug={slug} showTopic={false} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
