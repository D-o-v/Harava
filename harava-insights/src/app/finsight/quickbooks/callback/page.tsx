"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api/client";

export default function QuickBooksCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Handle double-HTML-encoded params (e.g. &amp;realmId= → realmId=)
    const raw = window.location.search;
    const decoded = decodeURIComponent(raw.replace(/&amp;/g, "&"));
    const urlParams = new URLSearchParams(decoded.startsWith("?") ? decoded.slice(1) : decoded);

    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const realmId = urlParams.get("realmId");
    const error = urlParams.get("error");

    if (error) {
      setStatus("error");
      setMessage("QuickBooks authorization was denied.");
      return;
    }

    if (!code || !realmId) {
      setStatus("error");
      setMessage("Invalid callback — missing code or realmId.");
      return;
    }

    apiRequest("/api/v1/quickbooks/callback", {
      method: "POST",
      body: { code, state, realmId },
    })
      .then(() => {
        setStatus("success");
        setMessage("QuickBooks connected successfully!");
        setTimeout(() => router.push("/finsight"), 2000);
      })
      .catch((err: Error) => {
        setStatus("error");
        setMessage(err.message || "Failed to complete QuickBooks connection.");
      });
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-3">
        {status === "processing" && (
          <>
            <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600">Connecting QuickBooks...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-800 font-medium">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-800 font-medium">{message}</p>
            <button onClick={() => router.push("/finsight")} className="text-sm text-navy underline">
              Back to dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
