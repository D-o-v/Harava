import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Premium Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-navy via-navy to-navy-dark p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/[0.06] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/[0.04] rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-24 right-16 w-20 h-20 border border-gold/10 rounded-2xl rotate-45" />
        <div className="absolute bottom-28 left-12 w-14 h-14 border border-gold/10 rounded-full" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Harava" width={40} height={40} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10" />
            <span className="text-2xl font-bold text-white tracking-tight">Harava<span className="text-gold">.</span></span>
          </div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[11px] font-medium text-white/60 uppercase tracking-wider">Get Started</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight leading-tight">
            Join the future of intelligent<br />business advisory
          </h2>
          <p className="text-white/45 text-[15px] leading-relaxed max-w-sm">
            Financial Intelligence. Accreditation Compliance. Professional Education. All AI-powered.
          </p>
        </div>

        <p className="relative text-white/25 text-[13px]">&copy; 2026 Harava Group. All rights reserved.</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-white relative">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative w-full max-w-[420px] animate-fade-in">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-xl object-cover ring-1 ring-navy/[0.06]" />
            <span className="text-xl font-bold text-navy tracking-tight">Harava<span className="text-gold">.</span></span>
          </div>

          <h1 className="text-2xl font-bold text-navy mb-2 tracking-tight">Create your account</h1>
          <p className="text-navy/45 mb-8 text-[15px]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-gold-dark font-semibold hover:text-gold transition-colors">
              Sign in
            </Link>
          </p>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Input id="firstName" label="First name" placeholder="John" required />
              <Input id="lastName" label="Last name" placeholder="Doe" required />
            </div>
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@company.com"
              required
            />
            <Input
              id="company"
              label="Company / Organization"
              placeholder="Harava Group"
            />
            <div>
              <label className="block text-sm font-medium text-navy/70 mb-2">
                I want to use
              </label>
              <div className="grid grid-cols-1 gap-2">
                <label className="flex items-center gap-3 p-3.5 border-[1.5px] border-navy/[0.06] rounded-xl cursor-pointer hover:border-gold/30 hover:bg-gold/[0.02] transition-all duration-200 group">
                  <input type="checkbox" className="rounded border-navy/20 text-gold focus:ring-gold/30 w-4 h-4" />
                  <span className="text-[13px] text-navy/70 group-hover:text-navy transition-colors">FinSight AI — Financial Intelligence</span>
                </label>
                <label className="flex items-center gap-3 p-3.5 border-[1.5px] border-navy/[0.06] rounded-xl cursor-pointer hover:border-gold/30 hover:bg-gold/[0.02] transition-all duration-200 group">
                  <input type="checkbox" className="rounded border-navy/20 text-gold focus:ring-gold/30 w-4 h-4" />
                  <span className="text-[13px] text-navy/70 group-hover:text-navy transition-colors">AccrediAI — Accreditation Compliance</span>
                </label>
                <label className="flex items-center gap-3 p-3.5 border-[1.5px] border-navy/[0.06] rounded-xl cursor-pointer hover:border-gold/30 hover:bg-gold/[0.02] transition-all duration-200 group">
                  <input type="checkbox" className="rounded border-navy/20 text-gold focus:ring-gold/30 w-4 h-4" />
                  <span className="text-[13px] text-navy/70 group-hover:text-navy transition-colors">ProEd AI — Professional Education</span>
                </label>
              </div>
            </div>
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Create a strong password"
              required
            />
            <Button variant="default" size="lg" className="w-full" type="submit">
              Create Account
            </Button>
          </form>

          <p className="mt-5 text-[11px] text-navy/35 text-center leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-gold-dark hover:text-gold transition-colors">Terms of Service</Link> and{" "}
            <Link href="#" className="text-gold-dark hover:text-gold transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
