import { catalog } from "../../notes/catalog.ts";
import { getNote, notePath } from "../../notes/registry.ts";
import { Arrow } from "../ui/Arrow.tsx";
import { PhotoImage } from "../ui/PhotoImage.tsx";
import { groupPhoto } from "../ui/photos.ts";
import { Text } from "../ui/T.tsx";

const pad = (value: number) => String(value).padStart(2, "0");

/** The index: every post, grouped by topic, in catalog order, each group with its photo. */
export function NoteList() {
  return (
    <div className="note-index">
      {catalog.map((group, groupIndex) => (
        <section key={group.id} className="index-group" aria-labelledby={`group-${group.id}`}>
          <div className="index-group__head">
            <PhotoImage className="index-group__photo" photo={groupPhoto(group.id)} sizes="(min-width: 800px) 18rem, 96px" />
            <p className="index-group__number">{pad(groupIndex + 1)}</p>
            <h2 id={`group-${group.id}`}>
              <Text value={group.title} />
            </h2>
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
