"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/endpoints";
import { useToast } from "@/lib/toast";

function ResetInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checks = [
    ["At least 8 characters", password.length >= 8],
    ["One uppercase letter", /[A-Z]/.test(password)],
    ["One lowercase letter", /[a-z]/.test(password)],
    ["One number", /\d/.test(password)],
    ["Passwords match", Boolean(confirm) && password === confirm],
  ] as const;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError("Reset link is missing a token.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    setError("");
    try {
      await authApi.resetPassword(token, password);
      toast("Password reset. Please sign in.", "success");
      router.replace("/auth/login");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fa] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-navy/5">
        <h1 className="text-2xl font-bold text-navy mb-1">Reset password</h1>
        <p className="text-sm text-navy/60 mb-6">Choose a new password for your account.</p>
        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-navy/60">New password</label>
            <div className="relative mt-1">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full border rounded-lg px-3 py-2 pr-9 text-sm" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-navy/60">Confirm password</label>
            <div className="relative mt-1">
              <input type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} className="w-full border rounded-lg px-3 py-2 pr-9 text-sm" />
              <button type="button" onClick={() => setShowConfirm((value) => !value)} aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 rounded-lg bg-navy/[0.03] px-3 py-2.5">
            {checks.map(([label, valid]) => (
              <p key={label} className={`flex items-center gap-1.5 text-xs ${valid ? "text-emerald-600" : "text-red-500"}`}>
                {valid ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5 text-center font-bold">×</span>}
                {label}
              </p>
            ))}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading || checks.some(([, valid]) => !valid)}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <>Reset password <ArrowRight className="w-4 h-4" /></>}
          </Button>
        </form>
        <p className="mt-4 text-xs text-navy/50"><Link href="/auth/login" className="text-gold-dark font-semibold">Back to sign in</Link></p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center"><Loader2 className="w-4 h-4 animate-spin" /></div>}>
      <ResetInner />
    </Suspense>
  );
}
