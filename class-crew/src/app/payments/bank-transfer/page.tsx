"use client";

import React, { useState } from "react";
import { HiOutlineCreditCard } from "react-icons/hi";
import Navbar from "@/components/payments/Navbar";
import { useRouter } from "next/navigation";

export default function BankTransfer() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [agreed2, setAgreed2] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white w-[1245px] rounded-2xl shadow-2xl h-[657px]">
        {/* Navbar */}
        <Navbar title="카드결제" sequence={3} />

        {/* Content */}
        <div className="px-20">
          {/* Title */}
          <div className="flex items-center space-x-2 mb-6 mt-3">
            <span className="text-[32px] font-extrabold text-black">
              계좌이체 은행선택
            </span>
          </div>

          {/* Card Select */}
          <div className="p-5 flex flex-col space-y-4">
            <select
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              className="w-[436px] px-4 py-3 border rounded-md bg-gray-100 focus:outline-none"
            >
              <option value="">선택</option>
              <option value="samsung">삼성카드</option>
              <option value="lotte">롯데카드</option>
              <option value="shinhan">신한카드</option>
            </select>
          </div>

          {/* Divider */}
          <hr className="border-gray-300" />

          {/* Payment Summary */}
          <div className="border-b border-gray-300text-gray-800 p-5">
            <h3 className="font-bold mb-3 text-lg">총 결제금액</h3>
            <div className="flex justify-between py-1">
              <span>총 n개의 상품금액</span>
              <span>150,000원</span>
            </div>
            <div className="flex justify-between py-1">
              <span>할인금액</span>
              <span>15,000원</span>
            </div>
            <div className="flex justify-between py-2 font-extrabold text-xl">
              <span>총 합계</span>
              <span className="text-black font-extrabold text-[32px]">
                135,000원
              </span>
            </div>
          </div>

          {/* Agreement */}
          <div className="flex items-start flex-col space-x-3 space-y-3 mt-6">
            <div className="flex gap-5 items-center">
              <input
                type="radio"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded-full accent-black cursor-pointer"
              />
              <label htmlFor="agree" className="text-black text-[24px]">
                OO은행 오픈뱅킹 서비스 이용 약관 동의
              </label>
            </div>
            <div className="flex gap-5 items-center">
              <input
                type="radio"
                id="agree"
                checked={agreed2}
                onChange={(e) => setAgreed2(e.target.checked)}
                className="w-5 h-5 rounded-full accent-black cursor-pointer"
              />
              <label htmlFor="agree" className="text-black text-[24px]">
                위 구매조건 확인 및 결제진행에 동의
              </label>
            </div>
          </div>

          {/* Pay Button */}
          <button
            disabled={!agreed || !selectedCard}
            className={`mt-6 w-full flex items-center justify-center space-x-2 py-3 rounded-md font-medium text-lg mb-20
              ${
                !agreed || !selectedCard
                  ? "bg-gray-200 text-black cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-black cursor-pointer"
              }
            `}
            onClick={() => router.push("/payments/bank-transfer/bank-option")}
          >
            <HiOutlineCreditCard className="text-2xl" />
            <span>결제하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
