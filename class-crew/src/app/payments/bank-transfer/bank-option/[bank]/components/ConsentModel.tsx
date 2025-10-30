"use client";

import React from "react";

interface ConsentModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function ConsentModal({ title, children }: ConsentModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[1245px] h-[472px] rounded-2xl shadow-2xl p-10 relative flex flex-col items-center justify-center overflow-y-auto">
        <div className="flex items-start bg-gray-100 justify-center p-8 flex-col border-b border-gray-300 w-[931px] h-[282px] pb-10">
          {/* Title */}
          <h2 className="text-[21px] font-semibold text-black mb-6">{title}</h2>

          {/* Content */}
          <div className="text-[#6D6D6D] leading-relaxed space-y-4 text-[21px] font-semibold">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
