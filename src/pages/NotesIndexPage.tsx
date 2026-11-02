import { NoteList } from "../components/layout/NoteList.tsx";
import { BackLink } from "../components/layout/BackLink.tsx";
import { ui } from "../i18n/ui.ts";

export function NotesIndexPage() {
  return (
    <>
      <BackLink href="/" label={ui.home} />
      <NoteList />
    </>
  );
}
