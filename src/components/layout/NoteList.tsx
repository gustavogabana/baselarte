import { catalog } from "../../notes/catalog.ts";
import { getNote, notePath } from "../../notes/registry.ts";
import { Arrow } from "../ui/Arrow.tsx";
import { groupInk, inkStyle } from "../ui/inks.ts";
import { PhotoImage } from "../ui/PhotoImage.tsx";
import { groupPhoto } from "../ui/photos.ts";
import { Text } from "../ui/T.tsx";

/** The index: every post, grouped by topic, in catalog order. Each topic carries its ink and photo. */
export function NoteList() {
  return (
    <div className="note-index">
      {catalog.map((group) => (
        <section key={group.id} className="index-group" style={inkStyle(groupInk(group.id))} aria-labelledby={`group-${group.id}`}>
          <div className="index-group__head">
            <h2 id={`group-${group.id}`}>
              <span className="index-group__title">
                <Text value={group.title} />
              </span>
            </h2>
            <div className="index-group__photo">
              <PhotoImage photo={groupPhoto(group.id)} sizes="(min-width: 800px) 22rem, 40vw" />
            </div>
          </div>
          <ol>
            {group.notes.map((slug) => (
              <li key={slug}>
                <a href={notePath(slug)}>
                  <span className="index-title">
                    <Text value={getNote(slug).title} />
                  </span>
                  <Arrow className="arrow index-arrow" />
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
