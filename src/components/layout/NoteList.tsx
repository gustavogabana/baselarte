import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { catalog } from "../../notes/catalog.ts";
import { getNote, noteNumber, notePath, seriesNumber } from "../../notes/registry.ts";
import { T, Text } from "../ui/T.tsx";

/** The index: a large centred heading, then every series as a pale grey tile with 18px corners
 *  (number, title, count, then its notes as blue links), flowing in up to three columns. */
export function NoteList() {
  return (
    <section id="indice" className="scroll-mt-16" {...localizedAttribute("aria-label", ui.index)}>
      <h2 className="mb-10 text-center text-[clamp(2rem,4.4vw,3rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-ink tab:mb-14">
        <T en="Every note, by series." pt="Todas as notas, por série." />
      </h2>
      <div className="columns-1 gap-x-5 sm:columns-2 desk:columns-3">
        {catalog.map((group) => (
          <section
            key={group.id}
            id={`series-${group.id}`}
            className="mb-5 scroll-mt-16 break-inside-avoid rounded-[18px] bg-page-faint px-6 pt-6 pb-5 tab:px-7 tab:pt-7"
            aria-labelledby={`series-title-${group.id}`}
          >
            <p className="flex items-baseline justify-between text-xs font-semibold text-faint tabular-nums">
              <span>
                <T en="Series" pt="Série" /> {seriesNumber(group.id)}
              </span>
              <span className="font-normal">{group.notes.length}</span>
            </p>
            <h3 id={`series-title-${group.id}`} className="mt-1 mb-3 text-[1.3125rem] leading-tight font-semibold tracking-[-0.02em] text-ink">
              <Text value={group.title} />
            </h3>
            <ol>
              {group.notes.map((slug) => (
                <li key={slug} className="border-t border-line-faint first:border-t-0">
                  <a
                    href={notePath(slug)}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline py-2 text-[0.9375rem] leading-snug"
                  >
                    <span className="text-xs text-faint tabular-nums">{noteNumber(slug)}</span>
                    <Text value={getNote(slug).title} />
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
