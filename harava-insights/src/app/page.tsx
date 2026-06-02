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
  ChevronRight,
  Zap,
  Globe,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="border-b border-navy/[0.04] bg-white/70 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Harava" width={36} height={36} className="w-9 h-9 rounded-xl object-cover ring-1 ring-navy/[0.06]" />
              <span className="text-xl font-bold text-navy tracking-tight">
                Harava<span className="text-gold">.</span>
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#products" className="text-[13px] text-navy/50 hover:text-navy transition-colors font-medium">Products</a>
              <a href="#features" className="text-[13px] text-navy/50 hover:text-navy transition-colors font-medium">Features</a>
              <a href="#about" className="text-[13px] text-navy/50 hover:text-navy transition-colors font-medium">About</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="gold" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/[0.015] via-white to-gold/[0.02]" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-gold/[0.04] to-transparent rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-navy/[0.03] to-transparent rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        {/* Floating decorative elements */}
        <div className="absolute top-32 right-[15%] w-3 h-3 rounded-full bg-gold/20 animate-float" />
        <div className="absolute top-48 left-[20%] w-2 h-2 rounded-full bg-navy/10 animate-float-slow" />
        <div className="absolute bottom-40 right-[30%] w-2.5 h-2.5 rounded-full bg-gold/15 animate-float" style={{ animationDelay: "1s" }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold/[0.08] to-navy/[0.04] border border-gold/[0.15] rounded-full px-5 py-2.5 mb-8 animate-fade-in shadow-[var(--shadow-xs)]">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-[11px] font-semibold text-navy/70 tracking-wider uppercase">AI-Powered Advisory Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-display text-navy animate-fade-in-up">
              Transforming Business
              <br />
              <span className="text-gradient-brand">Intelligence & Operations</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 lg:mt-8 text-base sm:text-lg text-navy/50 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              A unified platform combining Financial Intelligence, Accreditation Compliance,
              and Professional Education — all powered by advanced AI.
            </p>

            {/* CTAs */}
            <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <Link href="/auth/register">
                <Button variant="gold" size="lg" className="shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 px-8">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#products">
                <Button variant="outline" size="lg" className="px-8">
                  Explore Products <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
              <div className="flex items-center gap-2 text-navy/30">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-medium">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 text-navy/30">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium">Cloud Native</span>
              </div>
              <div className="flex items-center gap-2 text-navy/30">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-medium">Real-time Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 lg:py-32 bg-gradient-to-b from-white via-[var(--background)] to-white relative">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-gold uppercase tracking-[0.15em] mb-3">
              <span className="w-8 h-[1.5px] bg-gold/40" />
              Our Products
              <span className="w-8 h-[1.5px] bg-gold/40" />
            </span>
            <h2 className="text-headline text-navy">Three Powerful Modules</h2>
            <p className="mt-4 text-navy/45 max-w-xl mx-auto">Each module is a standalone product within the Harava Insights ecosystem</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 stagger-children">
            {/* FinSight AI */}
            <div className="group relative rounded-2xl border border-navy/[0.06] p-8 lg:p-9 hover:border-gold/20 transition-all duration-500 bg-white hover:shadow-[var(--shadow-card-hover)]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-navy to-navy-light rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3 tracking-tight">FinSight AI</h3>
                <p className="text-navy/50 mb-5 leading-relaxed text-[15px]">
                  Accounting operations, Fractional CFO advisory, tax compliance, payroll management, and AI-powered financial intelligence.
                </p>
                <ul className="space-y-2.5 text-sm text-navy/45 mb-8">
                  <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Financial Reporting & Analytics</li>
                  <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> CFO Advisory Dashboard</li>
                  <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Tax & Compliance Automation</li>
                </ul>
                <Link href="/finsight" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/70 hover:text-gold group-hover:gap-2.5 transition-all duration-300">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* AccrediAI */}
            <div className="group relative rounded-2xl border border-navy/[0.06] p-8 lg:p-9 hover:border-gold/20 transition-all duration-500 bg-white hover:shadow-[var(--shadow-card-hover)]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-navy to-navy-light rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3 tracking-tight">AccrediAI</h3>
                <p className="text-navy/50 mb-5 leading-relaxed text-[15px]">
                  CARF & Joint Commission accreditation consulting workflows, gap analysis, mock surveys, and continuous compliance monitoring.
                </p>
                <ul className="space-y-2.5 text-sm text-navy/45 mb-8">
                  <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Readiness Assessment</li>
                  <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Gap Analysis & Action Plans</li>
                  <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Mock Survey Simulation</li>
                </ul>
                <Link href="/accrediai" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/70 hover:text-gold group-hover:gap-2.5 transition-all duration-300">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* ProEd AI */}
            <div className="group relative rounded-2xl border border-navy/[0.06] p-8 lg:p-9 hover:border-gold/20 transition-all duration-500 bg-white hover:shadow-[var(--shadow-card-hover)]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-navy to-navy-light rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3 tracking-tight">ProEd AI</h3>
                <p className="text-navy/50 mb-5 leading-relaxed text-[15px]">
                  AI-guided professional education with learning tracks, case studies, simulations, and certification pathways.
                </p>
                <ul className="space-y-2.5 text-sm text-navy/45 mb-8">
                  <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Personalized Learning Paths</li>
                  <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> AI Tutor & Coaching</li>
                  <li className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-gold" /> Certification & Badges</li>
                </ul>
                <Link href="/proed" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/70 hover:text-gold group-hover:gap-2.5 transition-all duration-300">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-premium-mesh" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-gold uppercase tracking-[0.15em] mb-3">
              <span className="w-8 h-[1.5px] bg-gold/40" />
              Why Choose Us
              <span className="w-8 h-[1.5px] bg-gold/40" />
            </span>
            <h2 className="text-headline text-navy">Built for Enterprise Excellence</h2>
            <p className="mt-4 text-navy/45 max-w-lg mx-auto">World-class technology that scales with your organization</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            <div className="text-center p-7 rounded-2xl bg-white border border-navy/[0.04] hover:border-gold/[0.15] hover:shadow-[var(--shadow-md)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-navy/[0.05] to-gold/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-[var(--shadow-glow-gold)] transition-all duration-300">
                <Brain className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy mb-2 tracking-tight">AI-First</h3>
              <p className="text-sm text-navy/45 leading-relaxed">Every workflow enhanced by intelligent automation</p>
            </div>
            <div className="text-center p-7 rounded-2xl bg-white border border-navy/[0.04] hover:border-gold/[0.15] hover:shadow-[var(--shadow-md)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-navy/[0.05] to-gold/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-[var(--shadow-glow-gold)] transition-all duration-300">
                <TrendingUp className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy mb-2 tracking-tight">Scalable</h3>
              <p className="text-sm text-navy/45 leading-relaxed">From small firms to enterprise organizations</p>
            </div>
            <div className="text-center p-7 rounded-2xl bg-white border border-navy/[0.04] hover:border-gold/[0.15] hover:shadow-[var(--shadow-md)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-navy/[0.05] to-gold/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-[var(--shadow-glow-gold)] transition-all duration-300">
                <ShieldCheck className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy mb-2 tracking-tight">Compliant</h3>
              <p className="text-sm text-navy/45 leading-relaxed">Built-in regulatory and security frameworks</p>
            </div>
            <div className="text-center p-7 rounded-2xl bg-white border border-navy/[0.04] hover:border-gold/[0.15] hover:shadow-[var(--shadow-md)] transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-navy/[0.05] to-gold/[0.05] rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-[var(--shadow-glow-gold)] transition-all duration-300">
                <Users className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy mb-2 tracking-tight">Collaborative</h3>
              <p className="text-sm text-navy/45 leading-relaxed">Multi-role access with approval workflows</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy via-navy to-navy-dark p-12 lg:p-20 text-center">
            {/* Decorative effects */}
            <div className="absolute inset-0 bg-dot-pattern opacity-30" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold/[0.06] rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/[0.04] rounded-full blur-3xl translate-y-1/3 translate-x-1/4" />
            <div className="absolute top-8 right-12 w-20 h-20 border border-gold/10 rounded-2xl rotate-12 opacity-40" />
            <div className="absolute bottom-12 left-16 w-16 h-16 border border-gold/10 rounded-full opacity-30" />
            
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">Ready to Transform Your Business?</h2>
              <p className="text-white/50 max-w-xl mx-auto mb-10 text-lg leading-relaxed">Join leading organizations using Harava to drive intelligent growth.</p>
              <Link href="/auth/register">
                <Button variant="gold" size="lg" className="shadow-xl shadow-gold/30 px-10">
                  Get Started Today <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white/35 py-16 border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Harava" width={28} height={28} className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/[0.06]" />
              <span className="text-white font-semibold tracking-tight">Harava<span className="text-gold">.</span></span>
            </div>
            <div className="flex items-center gap-6 text-[13px]">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/60 transition-colors">Support</a>
            </div>
            <p className="text-[13px]">&copy; 2026 Harava Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
