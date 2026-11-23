import { localizedAttribute } from "../../i18n/attributes.ts";
import { ui } from "../../i18n/ui.ts";
import { catalog } from "../../notes/catalog.ts";
import { getNote, noteNumber, notePath, seriesNumber } from "../../notes/registry.ts";
import { Chevron } from "../ui/Chevron.tsx";
import { Text } from "../ui/T.tsx";

/** The index, one series after another: its title in large pale serif, then its notes as rows
 *  (title in serif, a one-line summary in small grey type, a chevron) over hairlines. On hover
 *  the title and the chevron turn navy. */
export function NoteList() {
  return (
    <section id="indice" className="scroll-mt-20" {...localizedAttribute("aria-label", ui.index)}>
      {catalog.map((group) => (
        <section
          key={group.id}
          id={`series-${group.id}`}
          className="scroll-mt-20 border-t border-line py-16 first:border-t-0 first:pt-0"
          aria-labelledby={`series-title-${group.id}`}
        >
          <h2 id={`series-title-${group.id}`} className="mb-6 font-display text-[2.125rem] leading-[1.1] text-ghost">
            <Text value={group.title} />
            <span className="ml-3 align-[0.35em] font-sans text-xs tabular-nums">{seriesNumber(group.id)}</span>
          </h2>
          <ol>
            {group.notes.map((slug) => {
              const note = getNote(slug);
              return (
                <li key={slug} className="border-b border-line last:border-b-0">
                  <a href={notePath(slug)} className="group flex items-center gap-4 py-4 hover:text-inherit">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[1.5rem] leading-[1.2] text-ink transition-colors duration-150 group-hover:text-accent">
                        <Text value={note.title} />
                      </span>
                      <span className="mt-1 block truncate text-sm text-faint">
                        <span className="tabular-nums">{noteNumber(slug)}</span>
                        <span className="mx-1.5 text-ghost" aria-hidden="true">·</span>
                        <Text value={note.seo.description} />
                      </span>
                    </span>
                    <Chevron className="size-4 flex-none text-ghost transition-[color,translate] duration-150 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </a>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </section>
  );
}
