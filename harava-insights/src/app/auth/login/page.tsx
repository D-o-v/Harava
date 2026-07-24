"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobePanel } from "@/components/auth/globe-panel";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

const ENABLE_DEMO = process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === "true";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scope, setScope] = useState<"auto" | "platform">("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // MFA step
  const [mfa, setMfa] = useState<{ token: string; channels?: string[] } | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  const { login, verifyMfa, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const routeAfterLogin = () => {
    // Prefer stored active scope
    const target =
      user?.scope === "platform" ? "/admin"
      : user?.scope === "portal" ? "/finsight"
      : "/finsight";
    router.replace(target);
  };

  if (user) {
    routeAfterLogin();
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password, { scope });
    setLoading(false);
    if (!result.success) return setError(result.error);
    if ("mfa" in result && result.mfa) {
      setMfa({ token: result.mfaToken, channels: result.channels });
      toast("Enter the code from your authenticator", "info");
      return;
    }
    toast("Welcome back!", "success");
    setTimeout(routeAfterLogin, 200);
  };

  const handleMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfa) return;
    setError("");
    setLoading(true);
    const r = await verifyMfa(mfa.token, mfaCode);
    setLoading(false);
    if (!r.success) return setError(r.error);
    toast("Signed in", "success");
    setTimeout(routeAfterLogin, 200);
  };

  return (
    <div className="min-h-screen flex bg-[#0a0f1a]">
      <GlobePanel variant="login" />
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[#f6f7fa] dark:bg-[#080d1a] relative">
        <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>
        <div className="relative w-full max-w-100 animate-fade-in">
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-xl object-cover ring-1 ring-navy/6" />
            <span className="text-xl font-bold text-navy tracking-tight">Harava<span className="text-gold">.</span></span>
          </Link>

          {!mfa ? (
            <>
              <h1 className="text-2xl font-bold text-navy mb-1.5 tracking-tight">Welcome back</h1>
              <p className="text-navy/40 mb-6 text-[14px]">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-gold-dark font-semibold hover:text-gold">Create one</Link>
              </p>

              <div className="mb-4 flex items-center gap-1.5 bg-white border border-navy/8 rounded-xl p-1 w-fit">
                {(["auto", "platform"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScope(s)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors ${scope === s ? "bg-navy text-white" : "text-navy/50 hover:text-navy"}`}
                  >
                    {s === "auto" ? "Firm / Client" : "Platform Admin"}
                  </button>
                ))}
              </div>

              {error && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200/60 text-red-700 text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-navy/60">Email address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required
                    className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-3 text-sm text-navy focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-navy/60">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                    className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-3 text-sm text-navy focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-navy/20 text-gold focus:ring-gold/30 w-4 h-4" />
                    <span className="text-[13px] text-navy/45">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-[13px] text-gold-dark font-medium hover:text-gold">Forgot password?</Link>
                </div>
                <Button size="lg" className="w-full" type="submit" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </form>

              {ENABLE_DEMO && (
                <div className="mt-7">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-navy/6" /></div>
                    <div className="relative flex justify-center text-[10px]"><span className="px-3 bg-[#f6f7fa] text-navy/30 font-medium uppercase tracking-wider">Quick demo login</span></div>
                  </div>
                  <div className="mt-3.5 grid grid-cols-2 gap-2">
                    <button onClick={() => { setEmail("sandbox-admin@harava.com.ng"); setPassword("Password!2026"); setScope("platform"); }} className="text-[12px] font-medium text-navy/50 bg-white border border-navy/6 rounded-lg px-3 py-2 hover:border-gold/20 hover:text-navy">
                      Platform Admin
                    </button>
                    <button onClick={() => { setEmail("owner@dju.example"); setPassword("ChangeMe123"); setScope("auto"); }} className="text-[12px] font-medium text-navy/50 bg-white border border-navy/6 rounded-lg px-3 py-2 hover:border-gold/20 hover:text-navy">
                      Firm Owner
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-2"><ShieldCheck className="w-4 h-4" /> Two-factor required</div>
              <h1 className="text-2xl font-bold text-navy mb-1.5 tracking-tight">Enter your code</h1>
              <p className="text-navy/40 mb-6 text-[14px]">
                {mfa.channels?.includes("EMAIL") ? "Check your email" : mfa.channels?.includes("SMS") ? "Check your SMS" : "Open your authenticator app"} and enter the 6-digit code.
              </p>
              {error && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200/60 text-red-700 text-sm">{error}</div>}
              <form onSubmit={handleMfa} className="space-y-4">
                <input
                  autoFocus
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-3 text-lg tracking-widest font-mono text-navy focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none text-center"
                />
                <Button size="lg" className="w-full" type="submit" disabled={loading || mfaCode.length < 6}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : <>Verify & sign in <ArrowRight className="w-4 h-4" /></>}
                </Button>
                <button type="button" onClick={() => { setMfa(null); setMfaCode(""); }} className="text-[13px] text-navy/45 hover:text-navy w-full text-center">
                  ← Use a different account
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
