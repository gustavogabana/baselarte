import { catalog } from "../../notes/catalog.ts";
import { getNote, notePath } from "../../notes/registry.ts";
import { Text } from "../ui/T.tsx";

/** Every note, grouped by topic, in catalog order. Used by the home and the notes pages. */
export function NoteList() {
  return (
    <div className="note-index">
      {catalog.map((group) => (
        <div key={group.id}>
          <h2>
            <Text value={group.title} />
          </h2>
          <ul>
            {group.notes.map((slug) => (
              <li key={slug}>
                <a href={notePath(slug)}>
                  <Text value={getNote(slug).title} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
