interface TableProps<T extends Record<string, React.ReactNode>> {
  columns: { key: keyof T; label: string }[];
  rows: T[];
}

function ReusableTable<T extends Record<string, React.ReactNode>>({
  columns,
  rows,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black text-white text-center">
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 font">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="text-center border-b border-gray-200 hover:bg-gray-50 transition"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-4 py-3 text-[18px] font-medium"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReusableTable;
