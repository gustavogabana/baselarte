import type { ReactNode } from "react";

interface TableProps {
  head: ReactNode[];
  rows: ReactNode[][];
}

/** A data table. Each row is an array of cells, in the same order as `head`. */
export function Table({ head, rows }: TableProps) {
  return (
    <div className="scroll-x">
      <table className="ds-table">
        <thead>
          <tr>
            {head.map((heading, column) => (
              <th key={column}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, row) => (
            <tr key={row}>
              {cells.map((cell, column) => (
                <td key={column}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
