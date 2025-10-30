"use client";

import Image from "next/image";
import Link from "next/link";

export default function MyPage() {
  return (
    <main className="w-[1270px] mx-auto mt-6 flex flex-col items-center mb-10">
      {/* Banner */}
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

      <nav className="flex justify-between gap-8 border-b border-gray-300 w-full mt-8">
        <Link
          href="/mypage/learning-status"
          className="pb-2 text-[20px] font-bold"
        >
          학습현황
        </Link>
        <Link
          href="/mypage/payment-management/history"
          className="pb-2 text-[20px] font-bold"
        >
          결제관리
        </Link>
        <Link href="/mypage/inquiry" className="pb-2 text-[20px] font-bold">
          1:1문의내역
        </Link>
        <Link href="/mypage/account" className="pb-2 text-[20px] font-bold">
          계정설정
        </Link>
      </nav>

      <div className="mt-10 text-gray-600 text-lg text-center">
        마이페이지에 오신 것을 환영합니다. 상단 탭에서 항목을 선택하세요.
      </div>
    </main>
  );
}
