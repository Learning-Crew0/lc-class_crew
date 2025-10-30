"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  const banks = [
    "카카오뱅크",
    "농협은행",
    "국민은행",
    "신한은행",
    "우리은행",
    "기업은행",
    "하나은행",
    "새마을금고",
    "우체국",
    "SC제일은행",
    "신협",
    "토스뱅크",
    "수협은행",
    "케이뱅크",
  ];

  const handleBankClick = (bank: string) => {
    router.push(
      `/payments/bank-transfer/bank-option/${encodeURIComponent(bank)}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white w-[1245px] rounded-2xl shadow-2xl h-[657px]">
        {/* Title */}
        <div className="px-20 py-10">
          <div className="text-[32px] w-full flex flex-col items-start font-bold text-black mb-6">
            <span className="font-extrabold text-black">
              오픈뱅킹 서비스 이용약관 바로가기
            </span>
          </div>

          <div className="h-[1px] w-full bg-gray-300 my-5"></div>

          {/* Grid Layout */}
          <div className="grid grid-cols-3 gap-6">
            {banks.map((bank) => (
              <button
                key={bank}
                onClick={() => handleBankClick(bank)}
                className="bg-gray-100 py-4 rounded-md text-[21px] font-semibold hover:bg-gray-200 transition"
              >
                {bank}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
