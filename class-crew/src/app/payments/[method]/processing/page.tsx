"use client";

import React, { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { dotSpinner } from "ldrs";

// Register the web component
dotSpinner.register();

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      const method = params?.method as string;
      const next = search.get("next");
      const successPath = next || `/payments/${method}/success`;
      router.replace(successPath);
    }, 2000);

    return () => clearTimeout(timer);
  }, [params, router, search]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white w-[1245px] h-[600px] rounded-2xl shadow-2xl flex flex-col gap-[30px] justify-center items-center">
        <div className="flex flex-col items-center">
          <p className="text-black text-[32px] font-bold mb-4">
            안전하게 결제 진행중입니다
          </p>
          <p className="text-gray-600 mb-8 text-[32px] font-bold">잠시만</p>
        </div>

        {/* Dot Spinner Loader */}
        {/* <l-dot-spinner size="90" speed="0.9" color="gray"></l-dot-spinner> */}
      </div>
    </div>
  );
}
