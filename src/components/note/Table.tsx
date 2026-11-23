import type { ReactNode } from "react";

interface TableProps {
  /** Column headings; `null` for an empty corner cell. */
  head: ReactNode[];
  /** Each row is an array of cells, in the same order as `head`. */
  rows: ReactNode[][];
}

/** Cells: hairline rows; on phones each row becomes a card titled by its first cell. */
const cellStyle =
  "border-b border-line-faint py-2.5 pr-4 pl-3 text-left align-top max-sm:block max-sm:w-full max-sm:border-0 max-sm:px-0 max-sm:py-1 max-sm:whitespace-normal max-sm:first:mb-1.5 max-sm:first:border-b max-sm:first:border-line max-sm:first:pb-2 max-sm:first:font-semibold max-sm:first:text-ink max-sm:first:empty:hidden first:min-w-28";

/**
 * A data table. On narrow screens each row becomes a card: the first cell is its title and every
 * other cell shows its column heading above it (the label, hidden on wide screens and from
 * screen readers, which get the real table headers).
 */
export function Table({ head, rows }: TableProps) {
  return (
    <div className="scroll-x">
      <table className="my-6 w-full border-collapse text-[0.9375rem] max-sm:block">
        <thead className="max-sm:sr-only">
          <tr>
            {head.map((heading, column) => (
              <th
                key={column}
                scope="col"
                className="border-b border-line py-2.5 pr-4 pl-3 text-left align-top text-sm font-medium text-ink [&+th]:bg-[linear-gradient(var(--border),var(--border))] [&+th]:bg-size-[1px_1.1em] [&+th]:bg-left [&+th]:bg-no-repeat"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="max-sm:block">
          {rows.map((cells, row) => (
            <tr key={row} className="hover:[&>td]:bg-page-faint max-sm:mb-3 max-sm:block max-sm:rounded-md max-sm:bg-page-faint max-sm:px-4 max-sm:py-3.5 max-sm:hover:[&>td]:bg-transparent">
              {cells.map((cell, column) => (
                <td key={column} className={cellStyle}>
                  {column > 0 && head[column] != null && (
                    <span className="hidden text-xs font-semibold text-faint max-sm:block" aria-hidden="true">
                      {head[column]}
                    </span>
                  )}
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
