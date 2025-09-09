"use client";

import Image from "next/image";
import ReusableTable from "@/components/ui/TableProps/Table";

import downloadIcon from "../../../../public/My page/symbols_download.svg";
import dropdown from "../../../../public/My page/drop-down.svg";

export default function PaymentManagement() {
  const columns = [
    { key: "no", label: "No." },
    { key: "course", label: "과정명" },
    { key: "date", label: "결제일" },
    { key: "mypage", label: "마이페이지" },
    { key: "price", label: "정가" },
    { key: "discount", label: "할인금액" },
    { key: "total", label: "총 결제금액" },
    { key: "status", label: "상태" },
    { key: "receipt", label: "영수증 발급" },
  ];

  const rows = [
    {
      no: 2,
      course: "[중분류] 교육 과정명",
      date: "2025.00.00",
      mypage: "-", // empty column
      price: "300,000 원",
      discount: "270,000 원",
      total: "270,000 원",
      status: "결제완료",
      receipt: (
        <Image src={downloadIcon} alt="Download" width={18} height={18} />
      ),
    },
    {
      no: 1,
      course: "[중분류] 교육 과정명",
      date: "2025.00.00",
      mypage: "-", // empty column
      price: "300,000 원",
      discount: "300,000 원",
      total: "300,000 원",
      status: "결제확인중",
      receipt: "-",
    },
  ];

  return (
    <main className="w-[1270px] mt-6 flex flex-col items-center mb-10">
      {/* Banner with heading */}
      <div className="relative w-full">
        <Image
          src="/My page/Rectangle 23864.png"
          alt="Banner"
          width={1270}
          height={200}
          className="w-full"
        />
        <h1 className="absolute top-6 left-6 text-white text-xl font-semibold">
          안녕하세요, <br />
          홍길동 님 마이페이지 입니다.
        </h1>
      </div>

      {/* Tabs */}
      <nav className="flex justify-between gap-8 border-b border-gray-300 w-[1270px] mt-8">
        <button className="pb-2 text-[20px] font-bold cursor-pointer">
          학습현황
        </button>
        <button className="pb-2 border-b-2 border-black text-[20px] font-bold cursor-pointer">
          결제관리
        </button>
        <button className="pb-2 text-[20px] font-bold cursor-pointer">
          1:1문의내역
        </button>
        <button className="pb-2 text-[20px] font-bold cursor-pointer">
          계정설정
        </button>
      </nav>

      {/* Sub buttons */}
      <div className="flex w-full gap-3 mt-6 justify-start">
        <button className="px-6 py-2 bg-black text-white font-bold">
          결제내역
        </button>
        <button className="px-6 py-2 bg-gray-100 font-bold">
          취소/환불내역
        </button>
        <button className="px-6 py-2 bg-gray-100 font-bold">STORE</button>
      </div>

      {/* Dropdown */}
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

      {/* Table + right-side icons */}
      <div className="w-[1320px] flex mt-10 ml-10">
        {/* Table */}
        <div className="flex-1">
          <ReusableTable columns={columns} rows={rows} />
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
    </main>
  );
}
