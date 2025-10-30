"use client";

import React from "react";

export default function PaymentConfirm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white w-[1245px] h-[600px] rounded-2xl shadow-2xl flex flex-col justify-start items-center p-12">
        {/* Header */}
        <h2 className="text-[32px] font-bold text-[#FF0000] mb-2">
          입금을 진행해주세요.
        </h2>
        <p className="text-[32px] font-medium text-black mb-8">감사합니다.</p>

        {/* Account Info Box */}
        <div className="w-full max-w-[900px] border rounded-md mb-6">
          <div className="p-6 text-center">
            <p className="text-[32px] text-black font-medium">
              ○○은행{" "}
              <span className="font-bold text-black text-[30px]">
                123456789101
              </span>
            </p>
            <p className="text-xl font-bold text-black mt-2 text-[30px]">
              135,000 원
            </p>
          </div>
          <div className="bg-gray-100 text-center py-4 text-[21px] font-semibold text-gray-700">
            입금 계좌번호 복사하기
          </div>
        </div>

        {/* Expiry Notice */}
        <p className="text-red-600 font-semibold text-[21px] mb-10">
          내일(9/10) 14:45분 까지 미입금 시 취소
        </p>

        {/* Buttons */}
        <div className="flex gap-6 w-full max-w-[600px]">
          <button className="flex-1 bg-gray-100 text-black font-semibold py-4 rounded-md">
            결제내역 바로가기
          </button>
          <button className="flex-1 bg-black text-white font-semibold py-4 rounded-md">
            홈페이지 바로가기
          </button>
        </div>
      </div>
    </div>
  );
}
