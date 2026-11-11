import { allGroups } from "./catalog.ts";
import type { Note } from "./types.ts";

// Every folder in src/notes with an index.tsx is a note. The catalog decides where it is listed.
const modules = import.meta.glob<{ note: Note }>("./*/index.tsx", { eager: true });

export const notes: ReadonlyMap<string, Note> = new Map(Object.values(modules).map(({ note }) => [note.slug, note]));

// Fail the build, not the visitor: a note missing from the catalog would be unreachable, and a
// catalog entry without a note would be a broken link.
const listed = new Set(allGroups.flatMap((group) => group.notes));
for (const slug of notes.keys()) {
  if (!listed.has(slug)) throw new Error(`Note "${slug}" is not listed in src/notes/catalog.ts.`);
}
for (const slug of listed) {
  if (!notes.has(slug)) throw new Error(`src/notes/catalog.ts lists "${slug}", but src/notes/${slug}/index.tsx does not exist.`);
}

export function getNote(slug: string): Note {
  const note = notes.get(slug);
  if (!note) throw new Error(`Unknown note "${slug}".`);
  return note;
}

export function notePath(slug: string): string {
  return `/notas/${slug}/`;
}
