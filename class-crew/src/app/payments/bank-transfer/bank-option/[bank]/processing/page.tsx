"use client";

import React, { useEffect, useState } from "react";
import { dotSpinner } from "ldrs";
import { useRouter, useParams } from "next/navigation";



dotSpinner.register();

export default function ProcessingPage() {
  const router = useRouter();
  const params = useParams();
  const bankName = params.bank ? decodeURIComponent(params.bank as string) : "";
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResult(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white w-[1245px] h-[600px] rounded-2xl shadow-2xl flex flex-col justify-center items-center p-10">
        {!showResult ? (
          <>
            <p className="text-black text-[32px] font-bold mb-4">
              계좌를 확인하고 있습니다.
            </p>
            <p className="text-gray-600 text-[32px] font-bold mb-8">잠시만</p>
            <div 
              dangerouslySetInnerHTML={{
                __html: '<l-dot-spinner size="90" speed="0.9" color="gray"></l-dot-spinner>'
              }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center w-full max-w-[1000px]">
            {/* Title */}
            <h2 className="text-[28px] text-black font-bold text-center mb-3">
              입력하신 계좌로{" "}
            </h2>
            <span className="text-[28px] text-black font-bold text-center ">
              1원을 입금했습니다.
            </span>
            <p className="text-[#6D6D6D] text-[24px] font-semibold text-center mt-2.5 mb-10">
              계좌의 거래내역에서 <br />
              1원의 ‘입금자명 4글자’를 확인 후 입력하세요.
            </p>

            {/* Input Section */}
            <div className="w-full bg-gray-100 rounded-md p-6 flex items-center justify-between mb-10">
              <div>
                <p className="font-semibold mb-4">입금자</p>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-16 h-16 bg-gray-300 rounded-md border-2 border-red-400"
                    ></div>
                  ))}
                  <span className="text-red-500 font-bold text-lg flex items-center">
                    네글자
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">입금자</p>
                <p className="text-[60px] text-black font-medium ">1원</p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() =>
                router.push(
                  `/payments/bank-transfer/bank-option/${encodeURIComponent(
                    bankName
                  )}/AccountVerification`
                )
              }
              className="bg-black text-white text-lg font-semibold px-50 py-3 rounded-md"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
