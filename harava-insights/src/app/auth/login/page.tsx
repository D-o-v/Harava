"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobePanel } from "@/components/auth/globe-panel";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
    <div className="min-h-screen flex bg-[#0a0f1a]">
      {/* Left Panel - Globe & Map */}
      <GlobePanel variant="login" />

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[#f6f7fa] dark:bg-[#080d1a] relative">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(193,155,63,0.03),transparent_60%)]" />
        <div className="relative w-full max-w-100 animate-fade-in">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-xl object-cover ring-1 ring-navy/6" />
            <span className="text-xl font-bold text-navy tracking-tight">Harava<span className="text-gold">.</span></span>
          </Link>

          <h1 className="text-2xl font-bold text-navy mb-1.5 tracking-tight">Welcome back</h1>
          <p className="text-navy/40 mb-7 text-[14px]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-gold-dark font-semibold hover:text-gold transition-colors">
              Create one
            </Link>
          </p>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200/60 text-red-700 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[13px] font-medium text-navy/60">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-3 text-sm text-navy placeholder:text-navy/25 focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none transition-all duration-200 hover:border-navy/15 shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[13px] font-medium text-navy/60">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-white border-[1.5px] border-navy/8 rounded-xl px-4 py-3 text-sm text-navy placeholder:text-navy/25 focus:ring-[3px] focus:ring-gold/8 focus:border-gold outline-none transition-all duration-200 hover:border-navy/15 shadow-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-navy/20 text-gold focus:ring-gold/30 w-4 h-4" />
                <span className="text-[13px] text-navy/45">Remember me</span>
              </label>
              <button type="button" className="text-[13px] text-gold-dark font-medium hover:text-gold transition-colors">
                Forgot password?
              </button>
            </div>
            <Button variant="default" size="lg" className="w-full" type="submit" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          {/* Quick login buttons */}
          <div className="mt-7">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-navy/6" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-3 bg-[#f6f7fa] text-navy/30 font-medium uppercase tracking-wider">Quick demo login</span>
              </div>
            </div>
            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <button onClick={() => { setEmail("jay@harava.com"); setPassword("admin123"); }} className="text-[12px] font-medium text-navy/50 bg-white border border-navy/6 rounded-lg px-3 py-2 hover:border-gold/20 hover:text-navy transition-all shadow-sm">
                Super Admin
              </button>
              <button onClick={() => { setEmail("accountant@demo.com"); setPassword("demo123"); }} className="text-[12px] font-medium text-navy/50 bg-white border border-navy/6 rounded-lg px-3 py-2 hover:border-gold/20 hover:text-navy transition-all shadow-sm">
                Accountant
              </button>
              <button onClick={() => { setEmail("consultant@demo.com"); setPassword("demo123"); }} className="text-[12px] font-medium text-navy/50 bg-white border border-navy/6 rounded-lg px-3 py-2 hover:border-gold/20 hover:text-navy transition-all shadow-sm">
                Consultant
              </button>
              <button onClick={() => { setEmail("learner@demo.com"); setPassword("demo123"); }} className="text-[12px] font-medium text-navy/50 bg-white border border-navy/6 rounded-lg px-3 py-2 hover:border-gold/20 hover:text-navy transition-all shadow-sm">
                Learner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
