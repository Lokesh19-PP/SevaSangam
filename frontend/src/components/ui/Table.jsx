/**
 * Table Component — SevaSangam
 * Reusable data table with header and row formatting.
 */
const Table = ({ columns = [], data = [], emptyMessage = 'No records available' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/75">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className="px-4 py-3 font-semibold text-slate-700 text-xs uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length > 0 ? (
            data.map((row, rIdx) => (
              <tr key={row.id || rIdx} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((col, cIdx) => (
                  <td key={col.key || cIdx} className="px-4 py-3 text-slate-600">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
