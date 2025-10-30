"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { dotSpinner } from "ldrs";

// Register the spinner
dotSpinner.register();

export default function AccountVerification() {
  const router = useRouter();
  const params = useParams();
  // const bankName = params.bank ? decodeURIComponent(params.bank as string) : "";
  const [isLoading, setIsLoading] = useState(false);

  const handleNextClick = () => {
    setIsLoading(true);
    // Add a delay to show the loading spinner
    setTimeout(() => {
      router.push(`/payments/bank-transfer/success`);
    }, 2000); // 2 seconds delay
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white w-[1245px] h-[600px] rounded-2xl shadow-2xl flex flex-col justify-start items-start p-12">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="text-black text-[32px] font-bold mb-4">
              처리 중입니다.
            </p>
            <p className="text-gray-600 text-[32px] font-bold mb-8">잠시만</p>
            {/* <l-dot-spinner size="90" speed="0.9" color="gray"></l-dot-spinner> */}
          </div>
        ) : (
          <>
            {/* Title */}
            <h2 className="text-[32px] text-black font-bold mb-10">
              OOO님, 본인계좌 확인
            </h2>

            {/* Account Number */}
            <div className="w-full bg-gray-100 rounded-md flex items-center justify-between px-6 py-5 mb-6">
              <div>
                <p className="font-semibold mb-2">계좌번호(숫자만입력)</p>
                <p className="text-gray-600">0000000000000000</p>
              </div>
              <button className="bg-black text-white px-6 py-2 rounded-md font-semibold">
                신한
              </button>
            </div>

            {/* Depositor Name */}
            <div className="w-full bg-gray-100 rounded-md px-6 py-5 mb-16">
              <p className="font-semibold mb-2">입금자명</p>
              <p className="text-gray-600">4글자 입력</p>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextClick}
              className="max-w-4xl w-full mx-auto bg-gray-200 text-black font-semibold py-4 rounded-md text-lg hover:bg-gray-300"
            >
              다음
            </button>
          </>
        )}
      </div>
    </div>
  );
}
