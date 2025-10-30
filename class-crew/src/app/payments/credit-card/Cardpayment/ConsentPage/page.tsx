"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsentPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white w-[1245px] rounded-2xl shadow-2xl h-[657px] px-20 py-10">
        <h2 className="text-xl font-bold text-black mb-3.5 text-[32px]">
          카드결제
        </h2>
        <p className="text-black font-bold mb-4 text-[32px]">
          (주)러닝크루에서 <br />{" "}
          <span className="font-extrabold">135,000원</span>을 결제합니다
        </p>

        <div className="border p-4 rounded-md bg-gray-50 text-sm text-black mb-6 my-5">
          <p className="mb-2 text-[21px] font-semibold">
            개인정보 제3자 제공 동의
          </p>
          <p className="text-[21px] text-[#6D6D6D] font-bold">
            원활한 결제 처리와 부정 거래 방지를 위해 아래와 같이 개인정보를
            카드사 및 결제대행사 <br />에 제공합니다.
            <br />
            1. 제공되는 항목: 카드번호, 유효기간, 성명, 생년월일, 연락처
            <br />
            2. 제공받는 자: 카드사 및 PG사
            <br />
            3. 보유기간: 결제 완료 후 5년
          </p>
        </div>

        {/* Radio button */}
        <div className="flex items-center space-x-3 mt-6">
          <input
            type="radio"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded-full accent-black cursor-pointer"
          />
          <label htmlFor="agree" className="text-black text-[24px]">
            카드사 개인정보 제3자 제공 동의
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
            disabled={!agreed}
            className={`w-1/2 py-3 rounded-md font-bold text-white ${
              !agreed
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 cursor-pointer"
            }`}
            onClick={() => router.push("/payments/credit-card/processing")}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
