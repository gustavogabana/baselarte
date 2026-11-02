import type { ReactNode } from "react";

interface TableProps {
  /** Column headings; `null` for an empty corner cell. */
  head: ReactNode[];
  /** Each row is an array of cells, in the same order as `head`. */
  rows: ReactNode[][];
}

/**
 * A data table. On narrow screens each row becomes a card: the first cell is its title and every
 * other cell shows its column heading above it (the `cell-label`, hidden on wide screens and from
 * screen readers, which get the real table headers).
 */
export function Table({ head, rows }: TableProps) {
  return (
    <div className="scroll-x">
      <table className="ds-table ds-table--stack">
        <thead>
          <tr>
            {head.map((heading, column) => (
              <th key={column} scope="col">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, row) => (
            <tr key={row}>
              {cells.map((cell, column) => (
                <td key={column}>
                  {column > 0 && head[column] != null && (
                    <span className="cell-label" aria-hidden="true">
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
