"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { authApi } from "@/lib/api/endpoints";

function VerifyInner() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) { setState("err"); setMessage("Missing token."); return; }
    authApi.verifyEmail(token).then(
      () => setState("ok"),
      (e: unknown) => { setState("err"); setMessage(e instanceof Error ? e.message : "Verification failed"); },
    );
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fa] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-navy/5 text-center">
        {state === "loading" && <><Loader2 className="w-6 h-6 animate-spin mx-auto text-navy/40" /><p className="mt-3 text-sm text-navy/60">Verifying your email…</p></>}
        {state === "ok" && <><CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" /><h1 className="text-xl font-bold mt-3 text-navy">Email verified</h1><p className="mt-2 text-sm text-navy/60">You can now sign in.</p><Link href="/auth/login" className="mt-4 inline-block text-gold-dark font-semibold text-sm">Continue →</Link></>}
        {state === "err" && <><XCircle className="w-8 h-8 text-red-500 mx-auto" /><h1 className="text-xl font-bold mt-3 text-navy">Could not verify</h1><p className="mt-2 text-sm text-navy/60">{message}</p><Link href="/auth/login" className="mt-4 inline-block text-gold-dark font-semibold text-sm">Back to sign in →</Link></>}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return <Suspense fallback={<div className="min-h-screen grid place-items-center"><Loader2 className="w-4 h-4 animate-spin" /></div>}><VerifyInner /></Suspense>;
}
