"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyProcessingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/payments/credit-card/processing");
  }, [router]);
  return null;
}
