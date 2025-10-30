"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [frontDigits, setFrontDigits] = useState("");
  const [backDigits, setBackDigits] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [discount, setDiscount] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white w-[1245px] rounded-2xl shadow-2xl h-[657px]">
        {/* Content */}
        <div className="px-20 py-10">
          {/* Title */}
          <div className="text-[32px] w-full flex flex-col items-start font-bold text-black mb-6">
            <span className="font-extrabold">(주)러닝크루 에서</span>
            <span className="font-extrabold text-black">
              135,000원을 결제합니다
            </span>
          </div>

          <div className="h-[1px] w-full bg-gray-300 my-5"></div>
          {/* Form */}
          <div className="space-y-6">
            {/* 카드번호 */}
            <div className="flex items-center justify-between">
              <span className="w-32 text-gray-700 text-[24px]">
                총 결제금액
              </span>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={frontDigits}
                  onChange={(e) => setFrontDigits(e.target.value)}
                  placeholder="앞4자리"
                  maxLength={4}
                  className="border w-28 px-3 py-2 rounded-md text-center"
                />
                <span className="text-2xl">•••• ••••</span>
                <input
                  type="text"
                  value={backDigits}
                  onChange={(e) => setBackDigits(e.target.value)}
                  placeholder="뒤4자리"
                  maxLength={4}
                  className="border w-28 px-3 py-2 rounded-md text-center"
                />
              </div>
            </div>

            <div className="h-[1px] w-full bg-gray-300 my-5"></div>

            {/* 유효기간 */}
            <div className="flex items-center justify-between">
              <span className="w-28 text-gray-700 text-[24px]">유효기간</span>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  placeholder="MM"
                  maxLength={2}
                  className="border w-20 px-3 py-2 rounded-md text-center"
                />
                <input
                  type="text"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  placeholder="YY"
                  maxLength={2}
                  className="border w-20 px-3 py-2 rounded-md text-center"
                />
              </div>
            </div>

            <div className="h-[1px] w-full bg-gray-300 my-5"></div>

            {/* 할인금액 */}
            <div className="flex items-center justify-between">
              <span className="w-28 text-gray-700 text-[24px]">할인금액</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  className="border w-32 px-3 py-2 rounded-md text-right"
                />
                <span>원</span>
              </div>
            </div>
          </div>

          {/* Agreement */}
          <div className="flex items-center space-x-3 mt-8">
            <input
              type="radio"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded-full accent-black cursor-pointer"
            />
            <label htmlFor="agree" className="text-black text-[24px]">
              카드사 개인정보 제3자 제공
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-10">
            <button
              className="w-1/2 mr-4 py-3 rounded-md bg-gray-100 text-black font-bold"
              onClick={() => router.back()}
            >
              취소
            </button>
            <button
              disabled={!agreed || !frontDigits || !backDigits}
              className={`w-1/2 py-3 rounded-md font-bold text-white ${
                !agreed || !frontDigits || !backDigits
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900 cursor-pointer"
              }`}
              onClick={() =>
                router.push("/payments/credit-card/Cardpayment/ConsentPage")
              }
            >
              결제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
