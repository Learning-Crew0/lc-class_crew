"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SearchModal from "@/components/My page/LearningCrewStore/SearchModal/page";

export default function Page() {
  const router = useRouter();
  return <SearchModal onClose={() => router.back()} />;
}
