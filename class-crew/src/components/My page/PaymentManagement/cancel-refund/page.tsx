"use client";

import ReusableTable from "@/components/ui/TableProps/Table";
import Image from "next/image";
import dropdown from "../../../../../public/My page/drop-down.svg";

type Row = {
  no: number;
  course: string;
  cancelDate: string;
  fee: string;
  refundTotal: string;
  status: string;
};

export default function CancelRefundPage() {
  const columns: { key: keyof Row; label: string }[] = [
    { key: "no", label: "No." },
    { key: "course", label: "과정명" },
    { key: "cancelDate", label: "취소/환불일" },
    { key: "fee", label: "위약금" },
    { key: "refundTotal", label: "총 환불금액" },
    { key: "status", label: "상태" },
  ];

  const rows: Row[] = [
    {
      no: 1,
      course: "[중분류] 교육 과정명",
      cancelDate: "2025.00.00",
      fee: "30,000 원",
      refundTotal: "270,000 원",
      status: "환불완료",
    },
  ];

  return (
    <div className="w-[1270px] mx-auto mt-10">
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
      <div className="w-[1270px] mx-auto flex items-center mt-10">
        <div className="flex-1">
          <ReusableTable<Row> columns={columns} rows={rows} />
        </div>

        {/* Right-side icons */}
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
    </div>
  );
}
