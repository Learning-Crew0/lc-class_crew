"use client";

import Image from "next/image";
import Link from "next/link";
import ReusableTable from "@/components/ui/TableProps/Table";
import dropdown from "../../../../public/My page/drop-down.svg";

export default function InquiryPage() {
  const columns = [
    { key: "no", label: "No." },
    { key: "title", label: "제목" },
    { key: "date", label: "등록일시" },
    { key: "status", label: "상태" },
  ];

  const rows = [
    {
      no: 2,
      title: "환불문의 드립니다.",
      date: "2025.00.00",
      status: "미확인",
    },
    {
      no: 1,
      title: "수강신청을 변경하고 싶습니다.",
      date: "2025.00.00",
      status: "답변완료",
    },
  ];

  const tableRows = rows.map((row) => ({
    ...row,
    title: (
      <Link
        href={`/mypage/inquiry/${row.no}`}
        className="text-blue-600 hover:underline"
      >
        {row.title}
      </Link>
    ),
  }));

  return (
    <>
      <div className="flex justify-between items-center w-[1270px] mx-auto mt-8 px-2">
        <Link href="/mypage/inquiry/new">
          <button className="bg-black text-white text-sm px-4 py-2">
            문의하기
          </button>
        </Link>
        <div className="flex items-center">
          <span className="text-[14px] font-bold">조회기간 설정</span>
          <Image
            src={dropdown}
            alt="Dropdown"
            width={16}
            height={20}
            className="ml-1 h-[20px]"
          />
        </div>
      </div>

      <div className="w-[1270px] mx-auto mt-10">
        <ReusableTable columns={columns} rows={tableRows} />
      </div>
    </>
  );
}
