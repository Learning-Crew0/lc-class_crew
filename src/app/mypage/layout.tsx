"use client";

import MyPageLayout from "@/components/My page/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MyPageLayout>{children}</MyPageLayout>;
}

