"use client";
import React, { useState } from "react";
import Image from "next/image";
import { HiOutlineCreditCard } from "react-icons/hi2";
import Navbar from "@/components/payments/Navbar";

export default function PaymentPage() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white  w-[1245px] rounded-2xl shadow-2xl h-[657px]">
        <Navbar title="간편결제" sequence={1} />

        <div className="px-20">
          <div className="flex items-center space-x-2 mb-6 mt-3">
            <span className="text-lg font-extrabold text-[32px] text-black">
              간편결제수단
            </span>
          </div>
          {/* Payment options */}
          <div className="flex space-x-3 mb-6">
            <div
              onClick={() => setSelectedPayment("kakao")}
              className={`flex flex-col items-center justify-center px-6 py-3 border rounded-md text-lg font-medium w-40 transition-all duration-200 cursor-pointer h-[59px] text-black
                ${selectedPayment === "kakao"
                  ? "border-black"
                  : "border-gray-300"
                }
                `}
            >
              <Image
                src="/simple-payment/image 15.png"
                alt="카카오페이"
                width={35}
                height={35}
              />
              <span className="mt-2">카카오페이</span>
            </div>
            <div
              onClick={() => setSelectedPayment("naver")}
              className={`flex flex-col items-center justify-center px-6 py-3 border rounded-md text-lg font-medium w-40 transition-all duration-200 cursor-pointer h-[59px] text-black
              ${selectedPayment === "naver" ? "border-black" : "border-gray-300"
                }
            `}
            >
              <Image
                src="/simple-payment/image 17.png"
                alt=""
                width={35}
                height={35}
              />{" "}
              <span className="mt-2">네이버페이</span>
            </div>
          </div>
          {/* Payment Summary */}
          <div className="border-t border-gray-300 border-b pb-4 pt-5 text-gray-800 p-5">
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
              <span>135,000원</span>
            </div>
          </div>
          {/* Agreement */}
          <div className="flex items-center space-x-2 mt-6 p-5">
            <input
              type="radio"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded- accent-black cursor-pointer"
            />
            <label htmlFor="agree" className="text-black text-m">
              위 구매조건 확인 및 결제진행에 동의
            </label>
          </div>
          {/* Payment Button */}
          <button
            disabled={!agreed || !selectedPayment}
            className={`mt-6 w-full flex items-center justify-center space-x-2 py-3 rounded-md font-medium text-lg mb-20
        ${!agreed || !selectedPayment
                ? "bg-gray-200 text-black cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-black cursor-pointer"
              }
        `}
          >
            <HiOutlineCreditCard className="text-2xl" />
            <span>결제하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
