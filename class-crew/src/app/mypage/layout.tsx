"use client";

import MyPageLayout from "@/components/My page/layout";
import Navbar from "@/components/layout/navbar/page";
import Footer from "@/components/layout/footer/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-[67px] flex-1">
        <MyPageLayout>{children}</MyPageLayout>
      </div>
      <Footer />
    </div>
  );
}
