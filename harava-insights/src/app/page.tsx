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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xl font-bold text-gray-900">
                Harava <span className="text-emerald-600">Insights</span>
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#products" className="text-sm text-gray-600 hover:text-gray-900">Products</a>
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
              <a href="#about" className="text-sm text-gray-600 hover:text-gray-900">About</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center bg-linear-to-br from-gray-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-emerald-700">AI-Powered Advisory Platform</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Transforming Business<br />
              <span className="text-emerald-600">Intelligence & Operations</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              A unified platform combining Financial Intelligence, Accreditation Compliance,
              and Professional Education — all powered by advanced AI.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button variant="primary" size="lg">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#products">
                <Button variant="outline" size="lg">Explore Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Three Powerful Products</h2>
            <p className="mt-3 text-gray-600">Each module is a standalone product within the Harava Insights ecosystem</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* FinSight AI */}
            <div className="group relative rounded-2xl border border-gray-200 p-8 hover:border-emerald-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">FinSight AI</h3>
              <p className="text-gray-600 mb-4">
                Accounting operations, Fractional CFO advisory, tax compliance, payroll management, and AI-powered financial intelligence.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Financial Reporting & Analytics</li>
                <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> CFO Advisory Dashboard</li>
                <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Tax & Compliance Automation</li>
              </ul>
              <Link href="/finsight" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Learn more <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* AccrediAI */}
            <div className="group relative rounded-2xl border border-gray-200 p-8 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AccrediAI</h3>
              <p className="text-gray-600 mb-4">
                CARF & Joint Commission accreditation consulting workflows, gap analysis, mock surveys, and continuous compliance monitoring.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-500" /> Readiness Assessment</li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-500" /> Gap Analysis & Action Plans</li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-500" /> Mock Survey Simulation</li>
              </ul>
              <Link href="/accrediai" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                Learn more <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* ProEd AI */}
            <div className="group relative rounded-2xl border border-gray-200 p-8 hover:border-violet-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ProEd AI</h3>
              <p className="text-gray-600 mb-4">
                AI-guided professional education with learning tracks, case studies, simulations, and certification pathways.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 mb-6">
                <li className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-violet-500" /> Personalized Learning Paths</li>
                <li className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-violet-500" /> AI Tutor & Coaching</li>
                <li className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-violet-500" /> Certification & Badges</li>
              </ul>
              <Link href="/proed" className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
                Learn more <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Harava Insights?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI-First</h3>
              <p className="text-sm text-gray-600">Every workflow enhanced by intelligent automation</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Scalable</h3>
              <p className="text-sm text-gray-600">From small firms to enterprise organizations</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Compliant</h3>
              <p className="text-sm text-gray-600">Built-in regulatory and security frameworks</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Collaborative</h3>
              <p className="text-sm text-gray-600">Multi-role access with approval workflows</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Harava" width={28} height={28} className="w-7 h-7 rounded-lg object-cover" />
              <span className="text-white font-semibold">Harava Insights</span>
            </div>
            <p className="text-sm">&copy; 2026 Harava Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
