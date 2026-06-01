"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
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
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-emerald-600 to-emerald-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Harava" width={40} height={40} className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-2xl font-bold text-white">Harava Insights</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome back to your AI-powered workspace
          </h2>
          <p className="text-emerald-100 text-lg">
            Access FinSight AI, AccrediAI, and ProEd AI from one unified dashboard.
          </p>
          <div className="mt-6 bg-white/10 rounded-lg p-4">
            <p className="text-emerald-100 text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-emerald-200 text-xs font-mono">
              <p>jay@harava.com / admin123 (Super Admin — all products)</p>
              <p>accountant@demo.com / demo123 (FinSight only)</p>
              <p>consultant@demo.com / demo123 (AccrediAI only)</p>
              <p>learner@demo.com / demo123 (ProEd only)</p>
              <p>corporate@demo.com / demo123 (ProEd + FinSight)</p>
            </div>
          </div>
        </div>
        <p className="text-emerald-200 text-sm">&copy; 2026 Harava Group</p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Image src="/logo.png" alt="Harava" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-xl font-bold text-gray-900">Harava Insights</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to your account</h1>
          <p className="text-gray-600 mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-emerald-600 font-medium hover:text-emerald-700">
              Create one
            </Link>
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-emerald-600 hover:text-emerald-700">
                Forgot password?
              </button>
            </div>
            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In"}
            </Button>
          </form>

          {/* Quick login buttons for demo */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick demo login</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => { setEmail("jay@harava.com"); setPassword("admin123"); }}>
                Super Admin
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setEmail("accountant@demo.com"); setPassword("demo123"); }}>
                Accountant
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setEmail("consultant@demo.com"); setPassword("demo123"); }}>
                Consultant
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setEmail("learner@demo.com"); setPassword("demo123"); }}>
                Learner
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
