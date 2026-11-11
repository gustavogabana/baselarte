import { localizedDate } from "../../i18n/dates.ts";
import { locate } from "../../notes/catalog.ts";
import { getNote, notePath } from "../../notes/registry.ts";
import { Text } from "../ui/T.tsx";

/** A note with its area's cover photo (a small WebP, lazy-loaded below the fold). */
export function FeaturedCard({ slug, cover, eager = false }: { slug: string; cover: string; eager?: boolean }) {
  const note = getNote(slug);
  const { group } = locate(slug);
  return (
    <a className="feature-card" href={notePath(slug)}>
      <span className="feature-card__media">
        <img
          src={`/assets/aesthetic/${cover}`}
          alt=""
          width={1200}
          height={750}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </span>
      <span className="feature-card__body">
        <span className="note-card__topic">
          <Text value={group.title} />
        </span>
        <span className="note-card__title">
          <Text value={note.title} />
        </span>
        <time className="note-card__date" dateTime={note.updated}>
          <Text value={localizedDate(note.updated)} />
        </time>
      </span>
    </a>
  );
}
