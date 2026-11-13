import { catalog, groupArt } from "../../notes/catalog.ts";
import { getNote, notePath } from "../../notes/registry.ts";
import { Text } from "../ui/T.tsx";

/** The index: every post, grouped by topic, in catalog order, each group with its illustration. */
export function NoteList() {
  return (
    <div className="note-index">
      {catalog.map((group) => (
        <section key={group.id} className="index-group" aria-labelledby={`group-${group.id}`}>
          <div className="index-group__head">
            <img className="index-group__art" src={groupArt(group.id)} alt="" width="1200" height="675" loading="lazy" decoding="async" />
            <h2 id={`group-${group.id}`}>
              <Text value={group.title} />
            </h2>
            <p className="index-group__count">{group.notes.length} posts</p>
          </div>
          <ol>
            {group.notes.map((slug) => (
              <li key={slug}>
                <a href={notePath(slug)}>
                  <span className="index-title">
                    <Text value={getNote(slug).title} />
                  </span>
                  <svg className="index-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
