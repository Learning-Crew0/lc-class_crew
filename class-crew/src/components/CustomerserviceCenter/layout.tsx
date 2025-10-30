"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerserviceCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { href: "/customerservicecenter/announcement", label: "공지사항" },
    { href: "/customerservicecenter/enquiry", label: "1:1 문의" },
    { href: "/customerservicecenter/faq", label: "FAQ" },
    {
      href: "/customerservicecenter/checkcoursehistory",
      label: "수강 이력 조회",
    },
  ];

  return (
    <main className="w-[1270px] mx-auto mt-20 flex flex-col items-center justify-center mb-10 ">
      <div className=" bg-white ">
        <div className="flex justify-center items-center h-[130px] ">
          <span className=" w-[145px] h-[40px] text-[36px] font-extrabold text-[var(--primary)]">
            고객센터
          </span>
        </div>
      </div>

      <nav className="flex justify-between gap-8  border-[#D9D9D9] w-[1200px] mt-8">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`pb-2 text-[18px] font-bold text-gray-500 ${
              pathname.startsWith(tab.href) ? "border-b-2 border-black" : ""
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="border-b border-[2px] text-[#D9D9D9] w-full "></div>

      {children}
    </main>
  );
}
