"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const subTabs = [
    { href: "/mypage/payment-management/history", label: "결제내역" },
    {
      href: "/mypage/payment-management/cancel-refund",
      label: "취소/환불내역",
    },
    { href: "/mypage/payment-management/store", label: "STORE" },
  ];

  return (
    <div className="w-full">
      {/* Sub Tabs */}
      <div className="w-[1270px] mx-auto flex gap-4 mt-6 ml-20">
        {subTabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-6 py-2 font-bold rounded ${
              pathname === tab.href
                ? "bg-black text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
