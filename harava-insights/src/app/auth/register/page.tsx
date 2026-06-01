import Link from "next/link";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-emerald-600 to-emerald-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Harava Insights</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the future of intelligent business advisory
          </h2>
          <p className="text-emerald-100 text-lg">
            Financial Intelligence. Accreditation Compliance. Professional Education. All AI-powered.
          </p>
        </div>
        <p className="text-emerald-200 text-sm">&copy; 2026 Harava Group</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Harava Insights</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600 mb-8">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-emerald-600 font-medium hover:text-emerald-700">
              Sign in
            </Link>
          </p>

          <form className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                I want to use
              </label>
              <div className="grid grid-cols-1 gap-2">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300">
                  <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm text-gray-700">FinSight AI — Financial Intelligence</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">AccrediAI — Accreditation Compliance</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-violet-300">
                  <input type="checkbox" className="rounded text-violet-600 focus:ring-violet-500" />
                  <span className="text-sm text-gray-700">ProEd AI — Professional Education</span>
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
            <Button variant="primary" size="lg" className="w-full" type="submit">
              Create Account
            </Button>
          </form>

          <p className="mt-4 text-xs text-gray-500 text-center">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-emerald-600">Terms of Service</Link> and{" "}
            <Link href="#" className="text-emerald-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
