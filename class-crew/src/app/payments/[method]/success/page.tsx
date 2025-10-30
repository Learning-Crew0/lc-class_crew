"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();
  const method = (params?.method as string) || "";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white w-[1245px] rounded-2xl shadow-2xl h-[600px] flex flex-col gap-[60px] justify-center items-center">
        {/* Success text */}
        <div className="flex flex-col items-center">
          <p className="text-black text-xl mb-2 text-[32px] font-bold">
            결제가 완료되었습니다.
          </p>
          <p className="text-gray-600 text-[32px] font-bold">
            감사합니다. ({method})
          </p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/mypage/payment-management/history")}
            className="px-16 py-3 rounded-md bg-gray-200 text-black font-bold  hover:bg-gray-300"
          >
            결제내역 확인하기
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-16 py-3 rounded-md bg-black text-white font-bold hover:bg-gray-900"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
