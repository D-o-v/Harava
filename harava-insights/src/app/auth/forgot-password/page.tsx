"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/endpoints";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fa] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-navy/5">
        <h1 className="text-2xl font-bold text-navy mb-1">Forgot password</h1>
        <p className="text-sm text-navy/60 mb-6">Enter your email and we&apos;ll send you a reset link.</p>
        {sent ? (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            If that account exists, a reset link has been sent to <b>{email}</b>. Check your inbox.
          </div>
        ) : (
          <>
            {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="text-xs text-navy/60">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <>Send reset link <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>
          </>
        )}
        <p className="mt-4 text-xs text-navy/50"><Link href="/auth/login" className="text-gold-dark font-semibold">Back to sign in</Link></p>
      </div>
    </div>
  );
}
