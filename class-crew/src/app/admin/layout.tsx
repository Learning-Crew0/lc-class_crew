"use client";

import Sidebar from "@/components/AdminSidebar/page";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true} redirectTo="/admin-login">
      <div className="flex h-screen bg-white text-black">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
