import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobePanel } from "@/components/auth/globe-panel";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-[#0a0f1a]">
      {/* Left Panel - Globe */}
      <GlobePanel variant="register" />

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-[#f6f7fa] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(193,155,63,0.03),transparent_60%)]" />
        <div className="relative w-full max-w-105 animate-fade-in">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-xl object-cover ring-1 ring-navy/6" />
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
                <label className="flex items-center gap-3 p-3.5 border-[1.5px] border-navy/6 rounded-xl cursor-pointer hover:border-gold/30 hover:bg-gold/2 transition-all duration-200 group">
                  <input type="checkbox" className="rounded border-navy/20 text-gold focus:ring-gold/30 w-4 h-4" />
                  <span className="text-[13px] text-navy/70 group-hover:text-navy transition-colors">FinSight AI — Financial Intelligence</span>
                </label>
                <label className="flex items-center gap-3 p-3.5 border-[1.5px] border-navy/6 rounded-xl cursor-pointer hover:border-gold/30 hover:bg-gold/2 transition-all duration-200 group">
                  <input type="checkbox" className="rounded border-navy/20 text-gold focus:ring-gold/30 w-4 h-4" />
                  <span className="text-[13px] text-navy/70 group-hover:text-navy transition-colors">AccrediAI — Accreditation Compliance</span>
                </label>
                <label className="flex items-center gap-3 p-3.5 border-[1.5px] border-navy/6 rounded-xl cursor-pointer hover:border-gold/30 hover:bg-gold/2 transition-all duration-200 group">
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
