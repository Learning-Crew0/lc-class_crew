"use client";

import ReusableTable from "@/components/ui/TableProps/Table";
import Image from "next/image";
import dropdown from "../../../../../public/My page/drop-down.svg";

export default function StorePage() {
  const columns = [
    { key: "no", label: "No." },
    { key: "product", label: "상품명" },
    { key: "date", label: "결제일" },
    { key: "amount", label: "결제금액" },
    { key: "status", label: "상태" },
    { key: "tracking", label: "" },
  ];

  const rows = [
    {
      no: 4,
      product: "상품명",
      date: "2025.00.00",
      amount: "100,000 원",
      status: "배송중",
      tracking: (
        <button className="px-6 py-2 bg-black text-white font-bold rounded-lg">
          배송조회
        </button>
      ),
    },
    {
      no: 3,
      product: "상품명",
      date: "2025.00.00",
      amount: "100,000 원",
      status: "결제확인중",
      tracking: "-",
    },
    {
      no: 2,
      product: "상품명",
      date: "2025.00.00",
      amount: "100,000 원",
      status: "입금완료",
      tracking: "-",
    },
    {
      no: 1,
      product: "상품명",
      date: "2025.00.00",
      amount: "50,000 원",
      status: "배송/수령완료",
      tracking: "-",
    },
  ];

  return (
    <div className="w-[1270px] mx-auto mt-10">
      {/* Dropdown aligned right */}
      <div className="w-full flex justify-end mb-6 pr-4">
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
          <ReusableTable columns={columns} rows={rows} />
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
    </div>
  );
}
