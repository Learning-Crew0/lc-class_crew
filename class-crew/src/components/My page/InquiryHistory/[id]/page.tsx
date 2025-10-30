"use client";

import { useParams } from "next/navigation";

export default function InquiryDetail() {
  const { id } = useParams();

  return (
    <div className="w-[1270px] mx-auto">
      <h1 className="text-xl font-bold mb-4">문의 상세 페이지</h1>
      <p>문의 번호: {id}</p>
      <div className="mt-4 p-4 border rounded">
        <p>여기에 문의 상세 내용이 표시됩니다.</p>
      </div>
    </div>
  );
}
