import { AreaNav, NoteList } from "../components/layout/NoteList.tsx";
import { Text } from "../components/ui/T.tsx";
import { ui } from "../i18n/ui.ts";

export function NotesIndexPage() {
  return (
    <div className="landing">
      <div className="section-heading section-heading--bar">
        <h1>
          <Text value={ui.allNotes} />
        </h1>
        <AreaNav />
      </div>
      <NoteList />
    </div>
  );
}
