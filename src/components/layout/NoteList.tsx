import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { catalog } from "../../notes/catalog.ts";
import { getNote, noteNumber, notePath, seriesNumber } from "../../notes/registry.ts";
import { Text } from "../ui/T.tsx";

/** The index, like a classifieds front page: every series as a short headed list of plain blue
 *  links, flowing in up to four columns. No cards, no pictures. */
export function NoteList() {
  return (
    <section
      id="indice"
      className="scroll-mt-4 columns-1 gap-x-10 sm:columns-2 desk:columns-3 xl:columns-4"
      {...localizedAttribute("aria-label", ui.index)}
    >
      {catalog.map((group) => (
        <section key={group.id} id={`series-${group.id}`} className="mb-9 scroll-mt-4 break-inside-avoid" aria-labelledby={`series-title-${group.id}`}>
          <h2
            id={`series-title-${group.id}`}
            className="mb-1.5 flex items-baseline gap-2 border-b border-line pb-1.5 text-[0.9375rem] leading-snug font-bold text-ink"
          >
            <span className="text-faint tabular-nums">{seriesNumber(group.id)}</span>
            <Text value={group.title} />
            <span className="ml-auto text-xs font-medium text-faint tabular-nums">{group.notes.length}</span>
          </h2>
          <ol>
            {group.notes.map((slug) => (
              <li key={slug}>
                <a
                  href={notePath(slug)}
                  className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline py-[3px] text-[0.9375rem] leading-snug no-underline hover:underline"
                >
                  <span className="text-[0.8125rem] text-faint tabular-nums">{noteNumber(slug)}</span>
                  <Text value={getNote(slug).title} />
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </section>
  );
}
