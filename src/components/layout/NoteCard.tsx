import { localizedDate } from "../../i18n/dates.ts";
import { locate } from "../../notes/catalog.ts";
import { getNote, notePath } from "../../notes/registry.ts";
import { Text } from "../ui/T.tsx";

/** One note as a card: its topic, title, description and last update. */
export function NoteCard({ slug, showTopic = true }: { slug: string; showTopic?: boolean }) {
  const note = getNote(slug);
  const { group } = locate(slug);
  return (
    <a className="note-card" href={notePath(slug)}>
      {showTopic && (
        <span className="note-card__topic">
          <Text value={group.title} />
        </span>
      )}
      <span className="note-card__title">
        <Text value={note.title} />
      </span>
      <span className="note-card__description">
        <Text value={note.seo.description} />
      </span>
      <time className="note-card__date" dateTime={note.updated}>
        <Text value={localizedDate(note.updated)} />
      </time>
    </a>
  );
}
