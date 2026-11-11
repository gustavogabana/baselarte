import { ui } from "../../i18n/ui.ts";
import { getNote, groupOf, notePath } from "../../notes/registry.ts";
import { Text } from "../ui/T.tsx";
import { formatDate } from "./dates.ts";

const RELATED_COUNT = 3;

/** Other posts from the same category, as a card grid at the end of a post. */
export function RelatedPosts({ slug }: { slug: string }) {
  const group = groupOf(slug);
  const siblings = group.notes.filter((other) => other !== slug);
  // Start after the current post so neighbouring posts rotate instead of always showing the first ones.
  const position = group.notes.indexOf(slug);
  const ordered = [...siblings.slice(position), ...siblings.slice(0, position)].slice(0, RELATED_COUNT);
  if (ordered.length === 0) return null;

  return (
    <aside className="related" aria-labelledby="related-title">
      <h2 id="related-title">
        <Text value={ui.relatedPosts} />
      </h2>
      <ul>
        {ordered.map((other) => {
          const note = getNote(other);
          return (
            <li key={other}>
              <a href={notePath(other)}>
                <span className="related-category">
                  <Text value={group.title} />
                </span>
                <span className="related-title">
                  <Text value={note.title} />
                </span>
                <span className="related-date">
                  <Text value={formatDate(note.updated)} />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
