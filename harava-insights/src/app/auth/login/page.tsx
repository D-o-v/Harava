"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/lib/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // If already logged in, redirect
  if (user) {
    const defaultRoute = user.products.includes("finsight")
      ? "/finsight"
      : user.products.includes("accrediai")
        ? "/accrediai"
        : user.products.includes("proed")
          ? "/proed"
          : "/finsight";
    router.replace(defaultRoute);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast("Welcome back! Redirecting...", "success");
      setTimeout(() => {
        const stored = localStorage.getItem("harava_user");
        if (stored) {
          const u = JSON.parse(stored);
          const route = u.products.includes("finsight")
            ? "/finsight"
            : u.products.includes("accrediai")
              ? "/accrediai"
              : "/proed";
          router.push(route);
        }
      }, 500);
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Premium Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-navy via-navy to-navy-dark p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/[0.06] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/[0.04] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-20 right-20 w-24 h-24 border border-gold/10 rounded-2xl rotate-12" />
        <div className="absolute bottom-32 left-20 w-16 h-16 border border-gold/10 rounded-full" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Harava" width={40} height={40} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10" />
            <span className="text-2xl font-bold text-white tracking-tight">Harava<span className="text-gold">.</span></span>
          </div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[11px] font-medium text-white/60 uppercase tracking-wider">AI-Powered Platform</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight leading-tight">
            Welcome back to your<br />intelligent workspace
          </h2>
          <p className="text-white/45 text-[15px] leading-relaxed max-w-sm">
            Access FinSight AI, AccrediAI, and ProEd AI from one unified dashboard.
          </p>
          <div className="mt-8 bg-white/[0.04] border border-white/[0.06] rounded-xl p-5">
            <p className="text-white/50 text-xs font-semibold mb-3 uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-2 text-white/40 text-[12px] font-mono">
              <p><span className="text-gold/70">jay@harava.com</span> / admin123 <span className="text-white/20">— All products</span></p>
              <p><span className="text-gold/70">accountant@demo.com</span> / demo123 <span className="text-white/20">— FinSight</span></p>
              <p><span className="text-gold/70">consultant@demo.com</span> / demo123 <span className="text-white/20">— AccrediAI</span></p>
              <p><span className="text-gold/70">learner@demo.com</span> / demo123 <span className="text-white/20">— ProEd</span></p>
            </div>
          </div>
        </div>

        <p className="relative text-white/25 text-[13px]">&copy; 2026 Harava Group. All rights reserved.</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-white relative">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative w-full max-w-[420px] animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-xl object-cover ring-1 ring-navy/[0.06]" />
            <span className="text-xl font-bold text-navy tracking-tight">Harava<span className="text-gold">.</span></span>
          </div>

          <h1 className="text-2xl font-bold text-navy mb-2 tracking-tight">Sign in to your account</h1>
          <p className="text-navy/45 mb-8 text-[15px]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-gold-dark font-semibold hover:text-gold transition-colors">
              Create one
            </Link>
          </p>

          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200/60 text-red-700 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-navy/70">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full border-[1.5px] border-navy/[0.08] rounded-xl px-4 py-3 text-sm text-navy placeholder:text-navy/25 focus:ring-[3px] focus:ring-gold/[0.08] focus:border-gold outline-none transition-all duration-200 hover:border-navy/[0.15]"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-navy/70">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full border-[1.5px] border-navy/[0.08] rounded-xl px-4 py-3 text-sm text-navy placeholder:text-navy/25 focus:ring-[3px] focus:ring-gold/[0.08] focus:border-gold outline-none transition-all duration-200 hover:border-navy/[0.15]"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-navy/20 text-gold focus:ring-gold/30 w-4 h-4" />
                <span className="text-sm text-navy/50">Remember me</span>
              </label>
              <button type="button" className="text-sm text-gold-dark font-medium hover:text-gold transition-colors">
                Forgot password?
              </button>
            </div>
            <Button variant="default" size="lg" className="w-full" type="submit" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In"}
            </Button>
          </form>

          {/* Quick login buttons for demo */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-navy/[0.08] to-transparent" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="px-3 bg-white text-navy/35 font-medium uppercase tracking-wider">Quick demo login</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={() => { setEmail("jay@harava.com"); setPassword("admin123"); }}>
                Super Admin
              </Button>
              <Button variant="secondary" size="sm" onClick={() => { setEmail("accountant@demo.com"); setPassword("demo123"); }}>
                Accountant
              </Button>
              <Button variant="secondary" size="sm" onClick={() => { setEmail("consultant@demo.com"); setPassword("demo123"); }}>
                Consultant
              </Button>
              <Button variant="secondary" size="sm" onClick={() => { setEmail("learner@demo.com"); setPassword("demo123"); }}>
                Learner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
