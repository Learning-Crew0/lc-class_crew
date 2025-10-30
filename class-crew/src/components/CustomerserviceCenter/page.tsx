"use client";

import Link from "next/link";

export default function MyPage() {
  return (
    <main className="w-[1270px] mx-auto mt-6 flex flex-col items-center mb-10">
      <nav className="flex justify-between gap-8 border-b border-gray-300 w-full mt-8">
        <Link
          href="/customerservicecenter/announcement"
          className="pb-2 text-[20px] font-bold"
        >
          announcement
        </Link>
        <Link
          href="/customerservicecenter/enquiry"
          className="pb-2 text-[20px] font-bold"
        >
          enquiry
        </Link>
        <Link
          href="/customerservicecenter/faq"
          className="pb-2 text-[20px] font-bold"
        >
          faq
        </Link>
        <Link
          href="/customerservicecenter/checkcoursehistory"
          className="pb-2 text-[20px] font-bold"
        >
          계정설정
        </Link>
      </nav>
    </main>
  );
}
