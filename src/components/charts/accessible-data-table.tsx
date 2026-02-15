'use client';

/**
 * Visually hidden data table companion for charts.
 * Renders a <table> that screen readers can navigate while sighted users
 * see the graphical chart.  The table is absolutely positioned off-screen
 * but remains in the accessibility tree.
 */

interface Column {
  key: string;
  label: string;
}

interface AccessibleDataTableProps {
  caption: string;
  columns: Column[];
  rows: Record<string, string | number>[];
}

export function AccessibleDataTable({
  caption,
  columns,
  rows,
}: AccessibleDataTableProps) {
  return (
    <table
      className="sr-only"
      role="table"
    >
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
