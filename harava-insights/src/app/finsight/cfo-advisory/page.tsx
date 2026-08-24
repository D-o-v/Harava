"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CfoAdvisoryPage() {
  const router = useRouter();

  useEffect(() => router.replace("/finsight"), [router]);
  return null;
}
