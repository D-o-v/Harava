"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight, ShieldCheck, Mail, Smartphone, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobePanel } from "@/components/auth/globe-panel";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { tokens } from "@/lib/api/tokens";

const ENABLE_DEMO = process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === "true";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // MFA step
  const [mfa, setMfa] = useState<{ token: string; method?: string; channels?: string[] } | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  const { login, verifyMfa, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  function routeForScope(scope?: string) {
    if (scope === "platform") return "/admin";
    if (scope === "portal") return "/finsight";
    return "/finsight";
  }

  if (user) {
    router.replace(routeForScope(user.scope));
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) return setError(result.error);
    if ("mfa" in result && result.mfa) {
      setMfa({ token: result.mfaToken, method: result.mfaMethod, channels: result.channels });
      return;
    }
    toast("Welcome back!", "success");
    // tokens.getActive() is set synchronously by finalizeFromLoginResponse
    router.replace(routeForScope(tokens.getActive() ?? undefined));
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
    router.replace(routeForScope(tokens.getActive() ?? undefined));
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




              {error && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200/60 text-red-700 text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-navy/60">Email address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required
                    className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-3 text-sm text-navy focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-navy/60">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                      className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-3 pr-11 text-sm text-navy focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-navy/35 hover:text-navy focus:outline-none focus:ring-2 focus:ring-gold/30"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                    <button onClick={() => { setEmail("sandbox-admin@harava.com.ng"); setPassword("Password!2026"); }} className="text-[12px] font-medium text-navy/50 bg-white border border-navy/6 rounded-lg px-3 py-2 hover:border-gold/20 hover:text-navy">
                      Platform Admin
                    </button>
                    <button onClick={() => { setEmail("owner@dju.example"); setPassword("ChangeMe123"); }} className="text-[12px] font-medium text-navy/50 bg-white border border-navy/6 rounded-lg px-3 py-2 hover:border-gold/20 hover:text-navy">
                      Firm Owner
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            (() => {
              const method = mfa.method ?? (mfa.channels?.[0] ?? "TOTP");
              const isEmail = method === "EMAIL";
              const isSms = method === "SMS";
              const icon = isEmail ? <Mail className="w-5 h-5" /> : isSms ? <Smartphone className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />;
              const label = isEmail ? "Check your email" : isSms ? "Check your SMS" : "Open your authenticator app";
              const hint = isEmail ? "We sent a 6-digit code to your email address."
                : isSms ? "We sent a 6-digit code to your phone number."
                : "Enter the 6-digit code from your authenticator app.";
              return (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">{icon}</div>
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Two-factor authentication</p>
                      <h1 className="text-xl font-bold text-navy tracking-tight">{label}</h1>
                    </div>
                  </div>
                  <p className="text-navy/45 mb-6 text-[13px]">{hint}</p>
                  {error && <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200/60 text-red-700 text-sm">{error}</div>}
                  <form onSubmit={handleMfa} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-navy/60">Verification code</label>
                      <input
                        autoFocus
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={8}
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-3.5 text-2xl tracking-[0.5em] font-mono text-navy focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none text-center"
                      />
                    </div>
                    <Button size="lg" className="w-full" type="submit" disabled={loading || mfaCode.length < 6}>
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : <>Verify &amp; sign in <ArrowRight className="w-4 h-4" /></>}
                    </Button>
                    <button type="button" onClick={() => { setMfa(null); setMfaCode(""); setError(""); }} className="text-[13px] text-navy/40 hover:text-navy w-full text-center transition-colors">
                      ← Back to sign in
                    </button>
                  </form>
                </>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
