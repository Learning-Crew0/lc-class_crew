import React from "react";

const TrainingTable: React.FC = () => {
  const data = [
    {
      no: 10,
      date: "2025.07.10~2025.07.13",
      title: "[중분류] 교육 과정명",
      status: "수료",
      download: true,
    },
    {
      no: 9,
      date: "2025.06.10",
      title: "[중분류] 교육 과정명",
      status: "수료",
      download: true,
    },
    {
      no: 8,
      date: "2025.06.10",
      title: "[중분류] 교육 과정명",
      status: "수료",
      download: true,
    },
    {
      no: 7,
      date: "2025.06.10",
      title: "[중분류] 교육 과정명",
      status: "미수료",
      download: false,
    },
    {
      no: 6,
      date: "2025.06.10",
      title: "[중분류] 교육 과정명",
      status: "수료",
      download: true,
    },
  ];

  return (
    <div className="w-full mt-10 flex justify-center">
      <table className="w-full border-t border-gray-200 text-center">
        <thead className=" text-white font-bold text-[18px] bg-black ">
          <tr>
            <th className="py-3 w-[8%]">NO.</th>
            <th className="py-3 w-[22%]">교육일</th>
            <th className="py-3 w-[40%]">교육 과정명</th>
            <th className="py-3 w-[15%]">수료여부</th>
            <th className="py-3 w-[15%]">수료증</th>
          </tr>
        </thead>
        <tbody className="text-[18px] font-bold text-black ">
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-gray-200 hover:bg-gray-50 transition "
            >
              <td className="py-3">{row.no}</td>
              <td className="py-3">{row.date}</td>
              <td className="py-3">{row.title}</td>
              <td className="py-3">{row.status}</td>
              <td className="py-3">
                {row.download ? (
                  <button className="px-4 py-1 border border-black rounded text-[16[x]] hover:bg-gray-100">
                    다운로드
                  </button>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainingTable;
