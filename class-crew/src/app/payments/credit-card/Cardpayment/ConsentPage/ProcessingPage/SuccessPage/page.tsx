"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacySuccessRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/payments/credit-card/success");
  }, [router]);
  return null;
}
