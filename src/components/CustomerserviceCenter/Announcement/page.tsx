"use client";

import { useState } from "react";

export default function NoticeTable() {
  const [notices] = useState([
    { id: 31, title: "2025년 하반기 공개교육 안내", date: "2025.07.10", isNew: true },
    { id: 30, title: "성수 러닝센터 대관 안내", date: "2025.06.10" },
    { id: 29, title: "66 챌린지 Kit 출시, 얼리버드 할인 받으세요!", date: "2025.06.10" },
    { id: 28, title: "도심 속 학습 놀이터, 누구에게나 열려 있습니다", date: "2025.07.10" },
    { id: 27, title: "7월 공개교육 라인업", date: "2025.06.10" },
  ]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Table */}
      <table className="w-full border-t border-black">
        <thead>
          <tr className="bg-black text-white text-center">
            <th className="w-20 py-3 font-semibold">NO.</th>
            <th className="py-3 font-semibold">제목</th>
            <th className="w-40 py-3 font-semibold">등록일</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr key={notice.id} className="border-b hover:bg-gray-100 text-center">
              <td className="py-3">{notice.id}</td>
              <td className="py-3 text-left px-4">
                <span>{notice.title}</span>
                {notice.isNew && (
                  <span className="ml-2 bg-black text-white text-xs px-2 py-0.5 rounded">
                    NEW
                  </span>
                )}
              </td>
              <td className="py-3">{notice.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Load More Button */}
      <div className="flex justify-center mt-6">
        <button className="border rounded px-4 py-2 flex items-center gap-1">
          더보기 <span className="text-xs">▼</span>
        </button>
      </div>
    </div>
  );
}
