"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickBooksCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Handle double-HTML-encoded params (e.g. &amp;realmId= → realmId=)
    const raw = window.location.search;
    const decoded = decodeURIComponent(raw.replace(/&amp;/g, "&"));
    const urlParams = new URLSearchParams(decoded.startsWith("?") ? decoded.slice(1) : decoded);

    const result = urlParams.get("status") || urlParams.get("result") || (urlParams.get("success") === "true" ? "success" : null);
    const resultMessage = urlParams.get("message");

    if (result === "success" || result === "connected") {
      setStatus("success");
      setMessage(resultMessage || "QuickBooks connected successfully!");
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "harava:quickbooks-connected" }, window.location.origin);
        setTimeout(() => window.close(), 600);
      } else {
        setTimeout(() => router.push("/finsight/clients"), 2000);
      }
      return;
    }

    if (result === "error" || result === "failed") {
      setStatus("error");
      setMessage(resultMessage || "Failed to connect QuickBooks.");
      return;
    }

    if (urlParams.get("error")) {
      setStatus("error");
      setMessage("QuickBooks authorization was denied.");
      return;
    }

    setStatus("error");
    setMessage("QuickBooks connection did not complete.");
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
            <button onClick={() => router.push("/finsight/clients")} className="text-sm text-navy underline">
              Back to clients
            </button>
          </>
        )}
      </div>
    </div>
  );
}
