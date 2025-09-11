"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerserviceCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Banner config by route
 

 
  const tabs = [
    { href: "/customerservicecenter/announcement", label: "announcement" },
    { href: "/customerservicecenter/enquiry", label: "enquiry" },
    { href: "/customerservicecenter/faq", label: "faq" },
      { href: "/customerservicecenter/checkcoursehistory", label: "checkcoursehistory" },
  ];

  return (
    <main className="w-[1270px] mx-auto mt-20 flex flex-col items-center justify-center mb-10">
     
     <div className=" bg-white ">
        <div className="flex justify-center items-center h-[130px] ">
          <span className=" w-[145px] h-[40px] text-[36px] font-extrabold text-[var(--primary)]">
           고객센터
          </span>
        </div></div>

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
