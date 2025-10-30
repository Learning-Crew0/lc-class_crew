"use client";

import React from "react";
import Navbar from "@/components/layout/navbar/page";
import Footer from "@/components/layout/footer/page";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

