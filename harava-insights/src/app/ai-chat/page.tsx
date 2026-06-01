"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AiChatRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const product = user?.products?.[0] || "finsight";
    router.replace(`/${product}/ai-chat`);
  }, [user, router]);

  return null;
}
