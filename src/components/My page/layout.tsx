"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Banner config by route
  const bannerConfig: Record<string, { image: string; text: string }> = {
    "/mypage/learning-status": {
      image: "/My page/banner.png",
      text: "안녕하세요,\n홍길동 님 마이페이지 입니다.",
    },
    "/mypage/payment-management": {
      image: "/My page/Rectangle 23864.png",
      text: "마이페이지",
    },
    "/mypage/inquiry": {
      image: "/My page/Rectangle 23864.png",
      text: "마이페이지",
    },
    "/mypage/account": {
      image: "/My page/Rectangle 23864.png",
      text: "마이페이지",
    },
  };

  // Pick correct banner (default fallback)
  const banner =
    bannerConfig[
      Object.keys(bannerConfig).find((key) => pathname.startsWith(key)) ??
        "/mypage/learning-status"
    ];

  const tabs = [
    { href: "/mypage/learning-status", label: "학습현황" },
    { href: "/mypage/payment-management/history", label: "결제관리" },
    { href: "/mypage/inquiry", label: "1:1문의내역" },
    { href: "/mypage/account", label: "계정설정" },
  ];

  return (
    <main className="w-[1270px] mx-auto mt-30 flex flex-col items-center justify-center mb-10">
      {/* Banner */}
      <div className="relative w-full">
        <Image
          src={banner.image}
          alt="Banner"
          width={1270}
          height={200}
          className="w-full"
        />
        <h1 className="absolute top-6 left-6 whitespace-pre-line text-white text-xl font-semibold">
          {banner.text}
        </h1>
      </div>

      {/* Tabs */}
      <nav className="flex justify-between gap-8 border-b border-gray-300 w-[1270px] mt-8">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`pb-2 text-[20px] font-bold ${
              pathname.startsWith(tab.href) ? "border-b-2 border-black" : ""
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* Page Content */}
      {children}
    </main>
  );
}
