import { catalog } from "../../notes/catalog.ts";
import { getNote, noteNumber, notePath, seriesNumber } from "../../notes/registry.ts";
import { Arrow } from "../ui/Arrow.tsx";
import { groupInk, inkStyle } from "../ui/inks.ts";
import { TonedPhoto } from "../ui/PhotoImage.tsx";
import { groupPhoto } from "../ui/photos.ts";
import { T, Text } from "../ui/T.tsx";

/** The index: every note, by series, in catalog order. Each series carries its colour, number and photo. */
export function NoteList() {
  return (
    <div className="note-index">
      {catalog.map((group) => (
        <section
          key={group.id}
          id={`series-${group.id}`}
          className="series"
          style={inkStyle(groupInk(group.id))}
          aria-labelledby={`series-title-${group.id}`}
        >
          <div className="series__head">
            <h2 id={`series-title-${group.id}`}>
              <span className="series-num series-num--large">{seriesNumber(group.id)}</span>
              <span className="series__title">
                <Text value={group.title} />
              </span>
            </h2>
            <p className="series__count">
              <T en={`${group.notes.length} notes`} pt={`${group.notes.length} notas`} />
            </p>
            <TonedPhoto photo={groupPhoto(group.id)} className="series__photo" sizes="(min-width: 800px) 17rem, 92vw" />
          </div>
          <ol className="series__notes">
            {group.notes.map((slug) => (
              <li key={slug}>
                <a href={notePath(slug)}>
                  <span className="note-num">{noteNumber(slug)}</span>
                  <span className="note-title">
                    <Text value={getNote(slug).title} />
                  </span>
                  <Arrow className="arrow note-arrow" />
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
