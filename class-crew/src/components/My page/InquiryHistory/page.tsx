"use client";

import Image from "next/image";
import Link from "next/link";
import ReusableTable from "@/components/ui/TableProps/Table";
import type { ReactNode } from "react";
import dropdown from "../../../../public/My page/drop-down.svg";

type Row = {
  no: number;
  title: ReactNode;
  date: string;
  status: string;
};

export default function InquiryPage() {
  const columns: { key: keyof Row; label: string }[] = [
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

  const tableRows: Row[] = rows.map((row) => ({
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
          <button className="bg-black text-white text-sm px-10 cursor-pointer py-2 rounded-xl">
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

      <div className="w-[1270px] mx-auto flex items-center mt-10">
        <div className="flex-1">
          <ReusableTable<Row> columns={columns} rows={tableRows} />
        </div>

        <div className="flex flex-col items-center justify-center gap-4 ml-6">
          <Image
            src="/My page/up-arrow.svg"
            alt="Up Arrow"
            width={20}
            height={20}
          />
          <Image
            src="/My page/search.svg"
            alt="Search"
            width={20}
            height={20}
          />
          <Image src="/My page/chat.svg" alt="Chat" width={20} height={20} />
        </div>
      </div>
    </>
  );
}
