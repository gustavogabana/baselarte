import { catalog } from "../../notes/catalog.ts";
import { getNote, notePath } from "../../notes/registry.ts";
import { Text } from "../ui/T.tsx";

const pad = (value: number) => String(value).padStart(2, "0");

/** The index: every post, grouped by topic, in catalog order. Used by the home and posts pages. */
export function NoteList() {
  return (
    <div className="note-index">
      {catalog.map((group, groupIndex) => (
        <section key={group.id} className="index-group">
          <h2>
            <span className="index-number">{pad(groupIndex + 1)}</span>
            <Text value={group.title} />
          </h2>
          <ol>
            {group.notes.map((slug, noteIndex) => (
              <li key={slug}>
                <a href={notePath(slug)}>
                  <span className="index-number">
                    {pad(groupIndex + 1)}.{pad(noteIndex + 1)}
                  </span>
                  <span className="index-title">
                    <Text value={getNote(slug).title} />
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
