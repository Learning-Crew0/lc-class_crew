"use client";

import React from "react";

interface TableProps {
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
}

const ReusableTable: React.FC<TableProps> = ({ columns, rows }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black text-white text-center">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font">
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
                <td key={col.key} className="px-4 py-3 text-[18px] font-medium">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
