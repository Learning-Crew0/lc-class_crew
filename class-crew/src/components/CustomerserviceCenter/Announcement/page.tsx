"use client";

import { useState } from "react";
import { FaCaretDown } from 'react-icons/fa';

export default function NoticeTable() {
  const [notices] = useState([
    { id: 31, title: "2025년 하반기 공개교육 안내", date: "2025.07.10", isNew: true },
    { id: 30, title: "성수 러닝센터 대관 안내", date: "2025.06.10" },
    { id: 29, title: "66 챌린지 Kit 출시, 얼리버드 할인 받으세요!", date: "2025.06.10" },
    { id: 28, title: "도심 속 학습 놀이터, 누구에게나 열려 있습니다", date: "2025.07.10" },
    { id: 27, title: "7월 공개교육 라인업", date: "2025.06.10" },
  ]);

  return (
    <div className="w-full mx-auto mt-15">
      {/* Table */}
      <table className="w-full border-t border-black">
        <thead>
          <tr className="bg-black text-white text-center">
            <th className="w-20 py-3 font-bold text-[18px]">NO.</th>
            <th className="w-96 py-3 font-bold text-[18px]">제목</th>
            <th className="w-20 py-3 font-bold text-[18px]">등록일</th>
          </tr>
        </thead>
        <tbody >
          {notices.map((notice) => (
            <tr key={notice.id} className="border-b hover:bg-gray-100 text-center">
              <td className="py-3 font-bold text-[18px] text-black">{notice.id}</td>
              <td className="py-3  px-4 font-bold text-[18px] text-black">
                <span>{notice.title}</span>
                {notice.isNew && (
                  <span className="w-[51px] h-[19px] ml-3  bg-black text-white text-xs px-2 py-1 ">
                    NEW
                  </span>
                )}
              </td>
              <td className="py-3 font-bold text-[18px] text-black">{notice.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

    <div className="flex justify-center mt-6">
  <div className="relative w-[134px]">
    <select
      className="border w-full h-[44px] text-black rounded px-3 text-[18px] font-semibold appearance-none bg-white cursor-pointer"
    >
      <option>더보기</option>
      <option>옵션 1</option>
      <option>옵션 2</option>
      <option>옵션 3</option>
    </select>

    {/* Custom dropdown arrow */}
    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[18px] font-semibold pointer-events-none">
      <FaCaretDown/>
    </span>
  </div>
</div>


    </div>
  );
}
