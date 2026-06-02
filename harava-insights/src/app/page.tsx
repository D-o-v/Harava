import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Brain,
  TrendingUp,
  Users,
  Sparkles,
  Zap,
  CheckCircle2,
  Star,
  Play,
  ArrowUpRight,
  Shield,
  Workflow,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedChart } from "@/components/ui/animated-chart";
import { MonitorCarousel, PhoneCarousel } from "@/components/ui/screen-carousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-[#f6f7fa]">
      {/* Navigation - blends into dark hero */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Harava" width={36} height={36} className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10" />
              <span className="text-xl font-bold text-white tracking-tight">
                Harava<span className="text-gold">.</span>
              </span>
            </div>
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#products" className="text-[13px] text-white/50 hover:text-white/90 transition-colors font-medium">Products</a>
              <a href="#features" className="text-[13px] text-white/50 hover:text-white/90 transition-colors font-medium">Platform</a>
              <a href="#testimonials" className="text-[13px] text-white/50 hover:text-white/90 transition-colors font-medium">Customers</a>
              <a href="#pricing" className="text-[13px] text-white/50 hover:text-white/90 transition-colors font-medium">Pricing</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/6">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="gold" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-18">
        {/* Cinematic background layers */}
        <div className="absolute inset-0 bg-linear-to-b from-navy-900 via-navy to-navy-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(193,155,63,0.12),transparent)]" />
        {/* Animated orbs */}
        <div className="absolute top-[10%] left-[5%] w-125 h-125 bg-gold/6 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[10%] right-[5%] w-150 h-150 bg-navy-light/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-[40%] right-[20%] w-75 h-75 bg-gold/4 rounded-full blur-[80px] animate-glow-pulse" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(193,155,63,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(193,155,63,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Floating geometric elements */}
        <div className="absolute top-[18%] right-[10%] w-20 h-20 border border-gold/8 rounded-2xl rotate-12 animate-float opacity-40" />
        <div className="absolute top-[30%] left-[6%] w-12 h-12 border border-white/4 rounded-full animate-float-slow opacity-50" />
        <div className="absolute bottom-[25%] left-[12%] w-16 h-16 border border-gold/6 rounded-xl -rotate-6 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[35%] right-[6%] w-2.5 h-2.5 bg-gold/30 rounded-full animate-pulse-gold" />
        
        <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10 lg:gap-16">
            {/* Left - Copy */}
            <div className="text-left md:w-[42%] lg:w-[40%] shrink-0">
              {/* Announcement badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/[0.07] rounded-full px-4 py-2 mb-7 animate-fade-in backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" />
                <span className="text-[12px] font-medium text-white/60 tracking-wide">Now with GPT-4o Intelligence</span>
                <ArrowUpRight className="w-3 h-3 text-gold" />
              </div>

              {/* Headline */}
              <h1 className="text-[clamp(2.2rem,5vw,4rem)] leading-[1.08] font-bold text-white tracking-tight animate-fade-in-up">
                The Future of
                <br />
                <span className="relative inline-block">
                  <span className="text-gradient-gold">Business Intelligence</span>
                  <svg className="absolute -bottom-1.5 left-0 w-full h-2.5 text-gold/25" viewBox="0 0 200 8" fill="none"><path d="M1 5.5C47 2 77 2 99 3.5C121 5 153 6.5 199 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </span>
                <br />
                <span className="text-white/85">Is Here.</span>
              </h1>

              {/* Sub */}
              <p className="mt-5 text-base lg:text-lg text-white/40 max-w-md leading-relaxed animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                One platform unifying Financial Intelligence, Accreditation Compliance, and Professional Education — driven by AI that never sleeps.
              </p>

              {/* CTA */}
              <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <Link href="/auth/register">
                  <Button variant="gold" size="lg" className="shadow-2xl shadow-gold/25 hover:shadow-gold/40 px-7">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Realistic Monitor + Phone Mockups */}
            <div className="relative hidden md:block flex-1 min-w-0 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              {/* Glow behind devices */}
              <div className="absolute -inset-10 bg-linear-to-br from-gold/6 via-transparent to-navy-light/10 rounded-3xl blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
              
              <div className="relative flex items-end gap-5">
                {/* Desktop Monitor */}
                <div className="relative flex-1">
                  {/* Monitor Screen - thick realistic bezel */}
                  <div className="relative rounded-xl border-[6px] border-[#1a1a1e] bg-[#1a1a1e] shadow-[0_0_0_2px_rgba(60,60,65,0.8),0_40px_100px_-20px_rgba(0,0,0,0.7)]">
                    {/* Top bezel with camera */}
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#0a0a0e] border border-[#2a2a2e] z-10" />
                    
                    {/* Screen with subtle inner shadow */}
                    <div className="relative rounded-md overflow-hidden bg-[#0c1018] ring-1 ring-white/5">
                      {/* Screen reflection overlay */}
                      <div className="absolute inset-0 bg-linear-to-br from-white/2 via-transparent to-transparent pointer-events-none z-20" />
                      
                      {/* App header bar */}
                      <div className="bg-[#080c14] border-b border-white/5 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Window controls */}
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                          </div>
                          <div className="w-px h-4 bg-white/5 ml-2" />
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gold/15 flex items-center justify-center">
                              <BarChart3 className="w-3 h-3 text-gold" />
                            </div>
                            <span className="text-[10px] font-semibold text-white/60">Harava · Platform</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-white/4 rounded-md px-2 py-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[8px] text-white/40">Connected</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Carousel content */}
                      <MonitorCarousel />
                    </div>
                  </div>

                  {/* Monitor Stand - realistic neck and base */}
                  <div className="flex flex-col items-center">
                    {/* Neck */}
                    <div className="w-16 h-10 bg-linear-to-b from-[#2a2a2e] to-[#1e1e22] rounded-b-sm relative">
                      <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
                      {/* Metallic sheen */}
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/5" />
                    </div>
                    {/* Base */}
                    <div className="w-52 h-3 bg-linear-to-b from-[#3a3a3e] to-[#2a2a2e] rounded-[50%] shadow-lg relative">
                      <div className="absolute inset-x-0 top-0 h-px bg-white/8 rounded-[50%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
              <div className="absolute -left-8 top-[30%] rounded-xl bg-[#151b2d]/95 backdrop-blur-xl border border-white/8 p-2.5 shadow-2xl animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-[8px] font-semibold text-white/70">Compliance Pass</p>
                    <p className="text-[7px] text-white/35">47 standards met</p>
                  </div>
                </div>
              </div>

              {/* Revenue alert */}
              <div className="absolute -right-6 top-[20%] rounded-xl bg-[#151b2d]/95 backdrop-blur-xl border border-white/8 p-2.5 shadow-2xl animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gold/15 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <p className="text-[8px] font-semibold text-white/70">Revenue Up</p>
                    <p className="text-[7px] text-white/35">+24.5% this month</p>
                  </div>
                </div>
              </div>

              {/* AI Processing tag */}
              <div className="absolute -left-4 bottom-[25%] rounded-xl bg-[#151b2d]/95 backdrop-blur-xl border border-white/8 p-2.5 shadow-2xl animate-float" style={{ animationDelay: "3s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[8px] font-semibold text-white/70">AI Processing</p>
                    <p className="text-[7px] text-white/35">1,847 tasks active</p>
                  </div>
                </div>
              </div>

              {/* Security badge */}
              <div className="absolute -right-4 bottom-[35%] rounded-xl bg-[#151b2d]/95 backdrop-blur-xl border border-white/8 p-2.5 shadow-2xl animate-float" style={{ animationDelay: "4.5s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[8px] font-semibold text-white/70">SOC 2 Certified</p>
                    <p className="text-[7px] text-white/35">Bank-level security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade to body color */}
        <div className="absolute bottom-0 left-0 right-0 h-0" />
      </section>

      {/* ============ PRODUCTS ============ */}
      <section id="products" className="py-20 lg:py-24 relative">
        <div className="absolute inset-0 bg-linear-to-b from-[#f6f7fa] to-[#f0f2f7]" />
        <div className="absolute inset-0 bg-radial-glow" />
        {/* Logo watermark */}
        <div className="absolute left-[3%] bottom-[8%] pointer-events-none">
          <Image src="/logo.png" alt="" width={200} height={200} className="w-40 h-40 object-contain opacity-[0.025]" />
        </div>
        <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-gold uppercase tracking-[0.15em] mb-4">
              <span className="w-8 h-[1.5px] bg-gold/40" />
              Our Suite
              <span className="w-8 h-[1.5px] bg-gold/40" />
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight">Three Modules. One Platform.</h2>
            <p className="mt-4 text-navy/45 max-w-2xl mx-auto text-base leading-relaxed">Each module is a powerful standalone product, seamlessly unified by a shared AI intelligence layer.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 stagger-children">
            {/* FinSight AI */}
            <div className="group relative rounded-3xl border border-navy/6 p-8 lg:p-10 hover:border-gold/20 transition-all duration-500 bg-white hover:shadow-(--shadow-xl) overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-gold/3 via-transparent to-navy/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-linear-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gold/4 rounded-full blur-3xl group-hover:bg-gold/8 transition-colors duration-700" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-navy via-navy to-navy-light rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-2xl font-bold text-navy tracking-tight">FinSight AI</h3>
                  <span className="text-[9px] font-bold bg-gold/10 text-gold px-2 py-0.5 rounded-full uppercase tracking-wider">Popular</span>
                </div>
                <p className="text-navy/50 mb-6 leading-relaxed text-[15px]">
                  Enterprise-grade financial operations — from bookkeeping to CFO advisory, powered by real-time AI insights.
                </p>
                <ul className="space-y-3 text-sm text-navy/55 mb-8">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Financial Reporting & Analytics</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Fractional CFO Advisory</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Tax & Payroll Automation</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Intelligent Reconciliation</li>
                </ul>
                <Link href="/finsight" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold transition-colors duration-300 group/link">
                  Explore FinSight <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* AccrediAI - featured */}
            <div className="group relative rounded-3xl border-2 border-gold/20 p-8 lg:p-10 hover:border-gold/40 transition-all duration-500 bg-white shadow-(--shadow-lg) hover:shadow-(--shadow-2xl) overflow-hidden lg:scale-[1.02]">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-gold/4 via-transparent to-navy/3 opacity-100" />
              <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-gold/60 via-gold to-gold/60" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gold/6 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors duration-700" />
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-navy/4 rounded-full blur-3xl" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-gold via-gold to-gold-light rounded-2xl flex items-center justify-center mb-7 shadow-lg shadow-gold/25 group-hover:shadow-xl group-hover:shadow-gold/30 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-2xl font-bold text-navy tracking-tight">AccrediAI</h3>
                  <span className="text-[9px] font-bold bg-gold/15 text-gold-dark px-2 py-0.5 rounded-full uppercase tracking-wider">Featured</span>
                </div>
                <p className="text-navy/50 mb-6 leading-relaxed text-[15px]">
                  AI-powered accreditation consulting — CARF & Joint Commission compliance made effortless with predictive analytics.
                </p>
                <ul className="space-y-3 text-sm text-navy/55 mb-8">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Readiness Scoring & Gap Analysis</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Mock Survey Simulations</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Policy Generation & Review</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Continuous Compliance Monitoring</li>
                </ul>
                <Link href="/accrediai" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors duration-300 group/link">
                  Explore AccrediAI <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* ProEd AI */}
            <div className="group relative rounded-3xl border border-navy/6 p-8 lg:p-10 hover:border-gold/20 transition-all duration-500 bg-white hover:shadow-(--shadow-xl) overflow-hidden">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-navy/2 via-transparent to-gold/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-linear-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-navy/3 rounded-full blur-3xl group-hover:bg-navy/6 transition-colors duration-700" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-navy via-navy to-navy-light rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-2xl font-bold text-navy tracking-tight">ProEd AI</h3>
                  <span className="text-[9px] font-bold bg-navy/6 text-navy/60 px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                </div>
                <p className="text-navy/50 mb-6 leading-relaxed text-[15px]">
                  AI-guided professional education with adaptive learning tracks, real-time coaching, and industry certifications.
                </p>
                <ul className="space-y-3 text-sm text-navy/55 mb-8">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Personalized Learning Paths</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> AI Tutor & Real-time Coaching</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Case Studies & Simulations</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-gold shrink-0" /> Certification & Digital Badges</li>
                </ul>
                <Link href="/proed" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold transition-colors duration-300 group/link">
                  Explore ProEd <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES BENTO GRID ============ */}
      <section id="features" className="py-20 lg:py-24 bg-[#eef0f5] relative">
        <div className="absolute inset-0 bg-premium-mesh" />
        <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-gold uppercase tracking-[0.15em] mb-4">
              <span className="w-8 h-[1.5px] bg-gold/40" />
              Platform Capabilities
              <span className="w-8 h-[1.5px] bg-gold/40" />
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight">Enterprise-Grade by Design</h2>
            <p className="mt-4 text-navy/45 max-w-2xl mx-auto text-base leading-relaxed">Built with the same rigor as the world&apos;s leading fintech and SaaS platforms.</p>
          </div>

          {/* Phone Mockup Feature Showcase */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-navy/4 border border-navy/6 rounded-full px-3 py-1.5 mb-5">
                <Brain className="w-4 h-4 text-gold" />
                <span className="text-[10px] font-semibold text-navy/60 uppercase tracking-wider">AI Engine</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-navy mb-4 tracking-tight">AI That Actually Works</h3>
              <p className="text-navy/50 leading-relaxed text-base mb-8 max-w-md">Not just chatbots — our AI performs real analytical work. Financial forecasting, compliance risk scoring, personalized learning — all running autonomously.</p>
              
              {/* AI capabilities */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: Sparkles, title: "Predictive Intelligence", desc: "Forecast revenue, detect anomalies, and surface insights before they matter." },
                  { icon: ShieldCheck, title: "Compliance Automation", desc: "Auto-scan against 47+ regulatory standards with continuous monitoring." },
                  { icon: GraduationCap, title: "Adaptive Learning", desc: "Personalized paths that adjust to each learner's pace and performance." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-navy/5 hover:border-gold/15 hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg bg-gold/8 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy mb-0.5">{item.title}</p>
                      <p className="text-[12px] text-navy/45 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["GPT-4o Powered", "Real-time Analysis", "Predictive Models", "Autonomous Agents", "Multi-modal"].map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold bg-navy/4 border border-navy/8 text-navy/55 px-3.5 py-1.5 rounded-full">{tag}</span>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="relative p-4 rounded-2xl bg-white border border-navy/6 text-center overflow-hidden group hover:border-gold/15 transition-colors">
                  <div className="absolute inset-0 bg-linear-to-b from-gold/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="relative text-2xl font-bold text-navy tracking-tight">&lt;100ms</p>
                  <p className="relative text-[11px] text-navy/40 mt-1 font-medium">Response Time</p>
                </div>
                <div className="relative p-4 rounded-2xl bg-white border border-navy/6 text-center overflow-hidden group hover:border-gold/15 transition-colors">
                  <div className="absolute inset-0 bg-linear-to-b from-gold/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="relative text-2xl font-bold text-navy tracking-tight">99.9%</p>
                  <p className="relative text-[11px] text-navy/40 mt-1 font-medium">Uptime SLA</p>
                </div>
                <div className="relative p-4 rounded-2xl bg-white border border-navy/6 text-center overflow-hidden group hover:border-gold/15 transition-colors">
                  <div className="absolute inset-0 bg-linear-to-b from-gold/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="relative text-2xl font-bold text-navy tracking-tight">50+</p>
                  <p className="relative text-[11px] text-navy/40 mt-1 font-medium">Integrations</p>
                </div>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex justify-center">
              <div className="relative w-70 animate-fade-in-up">
                {/* Glow behind phone */}
                <div className="absolute -inset-8 bg-radial-[at_center] from-gold/8 via-transparent to-transparent rounded-full blur-2xl" />
                
                {/* Phone frame - modern flat edge design */}
                <div className="relative rounded-[2.8rem] border-4 border-[#1a1a1e] bg-[#1a1a1e] p-0.75 shadow-[0_0_0_1px_rgba(60,60,65,0.6),0_40px_80px_-10px_rgba(0,0,0,0.4)]">
                  {/* Dynamic Island */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#0a0a0e] rounded-full z-10 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a1e] border border-[#2a2a2e]" />
                  </div>
                  
                  {/* Screen */}
                  <div className="rounded-[2.4rem] overflow-hidden bg-[#0c1018] ring-1 ring-white/5">
                    {/* Screen reflection */}
                    <div className="absolute inset-0 rounded-[2.4rem] bg-linear-to-br from-white/2 via-transparent to-transparent pointer-events-none z-20" />
                    
                    {/* Status bar */}
                    <div className="px-7 pt-10 pb-2 flex items-center justify-between">
                      <span className="text-[10px] text-white/50 font-semibold">9:41</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-3" viewBox="0 0 16 12" fill="rgba(255,255,255,0.3)">
                          <rect x="0" y="6" width="3" height="6" rx="0.5" />
                          <rect x="4.5" y="4" width="3" height="8" rx="0.5" />
                          <rect x="9" y="1.5" width="3" height="10.5" rx="0.5" />
                          <rect x="13" y="0" width="3" height="12" rx="0.5" />
                        </svg>
                        <div className="w-6 h-3 rounded-sm border border-white/30 relative">
                          <div className="absolute inset-0.5 rounded-[1px] bg-white/40 w-[70%]" />
                        </div>
                      </div>
                    </div>

                    {/* Carousel content */}
                    <PhoneCarousel />
                  </div>
                </div>

                {/* Side buttons */}
                <div className="absolute -right-1 top-[25%] w-0.5 h-10 bg-[#2a2a2e] rounded-l" />
                <div className="absolute -left-1 top-[20%] w-0.5 h-6 bg-[#2a2a2e] rounded-r" />
                <div className="absolute -left-1 top-[30%] w-0.5 h-12 bg-[#2a2a2e] rounded-r" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ METRICS SECTION ============ */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-navy-900 via-navy to-navy-900" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(193,155,63,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 left-1/4 w-125 h-125 bg-gold/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-navy-light/20 rounded-full blur-[100px]" />
        {/* Logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image src="/logo.png" alt="" width={400} height={400} className="w-75 h-75 object-contain opacity-[0.03]" />
        </div>
        
        <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Numbers That Speak</h2>
            <p className="mt-3 text-white/30 text-base">Real impact across hundreds of organizations</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 stagger-children">
            <div className="text-center p-6 rounded-2xl bg-white/3 border border-white/6 backdrop-blur-sm">
              <p className="text-4xl lg:text-5xl font-bold text-white tracking-tight">$2.4B</p>
              <p className="mt-2 text-sm text-white/35 font-medium">Transactions Processed</p>
              <div className="mt-3 w-12 h-0.5 bg-gold/40 mx-auto rounded-full" />
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/3 border border-white/6 backdrop-blur-sm">
              <p className="text-4xl lg:text-5xl font-bold text-white tracking-tight">500+</p>
              <p className="mt-2 text-sm text-white/35 font-medium">Enterprise Clients</p>
              <div className="mt-3 w-12 h-0.5 bg-gold/40 mx-auto rounded-full" />
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/3 border border-white/6 backdrop-blur-sm">
              <p className="text-4xl lg:text-5xl font-bold text-white tracking-tight">98.2%</p>
              <p className="mt-2 text-sm text-white/35 font-medium">Compliance Success Rate</p>
              <div className="mt-3 w-12 h-0.5 bg-gold/40 mx-auto rounded-full" />
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/3 border border-white/6 backdrop-blur-sm">
              <p className="text-4xl lg:text-5xl font-bold text-white tracking-tight">40%</p>
              <p className="mt-2 text-sm text-white/35 font-medium">Time Saved on Average</p>
              <div className="mt-3 w-12 h-0.5 bg-gold/40 mx-auto rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="py-20 lg:py-24 relative">
        <div className="absolute inset-0 bg-linear-to-b from-[#f6f7fa] to-[#eef0f5]" />
        {/* Logo watermark faded */}
        <div className="absolute right-[5%] top-[10%] pointer-events-none">
          <Image src="/logo.png" alt="" width={280} height={280} className="w-55 h-55 object-contain opacity-[0.03]" />
        </div>
        <div className="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-gold uppercase tracking-[0.15em] mb-4">
              <span className="w-8 h-[1.5px] bg-gold/40" />
              Customer Stories
              <span className="w-8 h-[1.5px] bg-gold/40" />
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight">Loved by Finance Leaders</h2>
            <p className="mt-4 text-navy/45 max-w-xl mx-auto text-base">See how organizations are transforming with Harava.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              {
                quote: "Harava's AI reduced our month-end close from 12 days to 3. The FinSight module pays for itself in the first week.",
                author: "Sarah Mitchell",
                role: "CFO, MedVista Healthcare",
                metric: "75% faster close",
              },
              {
                quote: "We achieved CARF accreditation on our first attempt using AccrediAI. The gap analysis alone saved us 6 months of consulting fees.",
                author: "Dr. James Chen",
                role: "Director of Quality, Haven Recovery",
                metric: "First-attempt pass",
              },
              {
                quote: "ProEd AI transformed how we train our 200+ staff. Personalized paths mean everyone learns at their pace with measurable outcomes.",
                author: "Rachel Torres",
                role: "VP of Learning, Axis Financial",
                metric: "3x engagement",
              },
            ].map((t, i) => (
              <div key={i} className="group relative rounded-2xl border border-navy/6 bg-white p-7 lg:p-8 hover:border-gold/15 hover:shadow-(--shadow-lg) transition-all duration-300">
                <div className="absolute top-0 left-6 right-6 h-0.5 bg-linear-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-0.5 mb-5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <blockquote className="text-[15px] text-navy/70 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-navy">{t.author}</p>
                    <p className="text-[12px] text-navy/40 mt-0.5">{t.role}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-gold/8 text-gold-dark px-2.5 py-1 rounded-full">{t.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-navy-900 text-white/35 pt-14 pb-8 border-t border-white/3">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/6" />
                <span className="text-white text-lg font-bold tracking-tight">Harava<span className="text-gold">.</span></span>
              </div>
              <p className="text-[13px] text-white/30 leading-relaxed max-w-60">AI-powered platform for financial intelligence, accreditation, and professional education.</p>
            </div>
            {/* Links */}
            <div>
              <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">Products</h4>
              <ul className="space-y-2.5 text-[13px]">
                <li><Link href="/finsight" className="hover:text-white/60 transition-colors">FinSight AI</Link></li>
                <li><Link href="/accrediai" className="hover:text-white/60 transition-colors">AccrediAI</Link></li>
                <li><Link href="/proed" className="hover:text-white/60 transition-colors">ProEd AI</Link></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5 text-[13px]">
                <li><a href="#" className="hover:text-white/60 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2.5 text-[13px]">
                <li><a href="#" className="hover:text-white/60 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5 text-[13px]">
                <li><a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="border-t border-white/4 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-white/25">&copy; 2026 Harava Group. All rights reserved.</p>
            <div className="flex items-center gap-5 text-white/25">
              <a href="#" className="hover:text-white/50 transition-colors text-[12px]">Twitter</a>
              <a href="#" className="hover:text-white/50 transition-colors text-[12px]">LinkedIn</a>
              <a href="#" className="hover:text-white/50 transition-colors text-[12px]">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
