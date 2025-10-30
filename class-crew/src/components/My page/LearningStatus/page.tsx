"use client";

import Image from "next/image";
import ReusableTable from "@/components/ui/TableProps/Table";
import type { ReactNode } from "react";
import downloadIcon from "../../../../public/My page/symbols_download.svg";
import dropdown from "../../../../public/My page/drop-down.svg";

type Row = {
  no: number;
  course: string;
  type: string;
  period: string;
  status: string;
  certificate: ReactNode;
};

export default function LearningStatus() {
  const columns: { key: keyof Row; label: string }[] = [
    { key: "no", label: "No." },
    { key: "course", label: "과정명" },
    { key: "type", label: "유형" },
    { key: "period", label: "기간" },
    { key: "status", label: "상태" },
    { key: "certificate", label: "수료증 발급" },
  ];

  const rows: Row[] = [
    {
      no: 5,
      course: "[중분류] 교육 과정명",
      type: "비환급",
      period: "2025.00.00 ~ 2025.00.00",
      status: "수강예정",
      certificate: "-",
    },
    {
      no: 4,
      course: "[중분류] 교육 과정명",
      type: "비환급",
      period: "2025.00.00 ~ 2025.00.00",
      status: "수강중",
      certificate: "-",
    },
    {
      no: 3,
      course: "[중분류] 교육 과정명",
      type: "비환급",
      period: "2025.00.00 ~ 2025.00.00",
      status: "미수료",
      certificate: "-",
    },
    {
      no: 2,
      course: "[중분류] 교육 과정명",
      type: "비환급",
      period: "2025.00.00 ~ 2025.00.00",
      status: "수료",
      certificate: (
        <Image src={downloadIcon} alt="Download" width={18} height={18} />
      ),
    },
    {
      no: 1,
      course: "[중분류] 교육 과정명",
      type: "비환급",
      period: "2025.00.00 ~ 2025.00.00",
      status: "수료",
      certificate: (
        <Image src={downloadIcon} alt="Download" width={18} height={18} />
      ),
    },
  ];

  return (
    <>
      {/* Dropdown aligned right */}
      <div className="w-full flex justify-end mt-14 pr-4">
        <span className="text-[14px] font-bold">조회기간 설정</span>
        <Image
          src={dropdown}
          alt="Dropdown"
          width={16}
          height={20}
          className="ml-1 h-[20px]"
        />
      </div>

      {/* Table with right-side icons */}
      <div className="w-[1320px] flex mt-10 ml-10">
        <div className="flex-1">
          <ReusableTable<Row> columns={columns} rows={rows} />
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
