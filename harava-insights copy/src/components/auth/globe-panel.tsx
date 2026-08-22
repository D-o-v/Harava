"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, BarChart3, ShieldCheck, GraduationCap } from "lucide-react";
import { LoginGlobe } from "./login-globe";

interface GlobePanelProps {
  variant?: "login" | "register";
}

export function GlobePanel({ variant = "login" }: GlobePanelProps) {
  return (
    <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-[#040a16] via-[#050d1a] to-[#071020]" />

      {/* Animated radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(24,41,84,0.15)_0%,transparent_70%)] animate-[pulse_6s_ease-in-out_infinite]" />

      {/* Floating orbs */}
      <div className="absolute top-[20%] left-[15%] w-32 h-32 rounded-full bg-gold/4 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[25%] right-[10%] w-40 h-40 rounded-full bg-blue-500/3 blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />

      {/* 3D Globe */}
      <div className="absolute inset-0 opacity-80">
        <LoginGlobe />
      </div>

      {/* Floating product tags */}
      <div className="absolute top-[12%] right-[8%] z-10 rounded-xl bg-white/4 backdrop-blur-md border border-white/8 px-3 py-2 animate-[float_6s_ease-in-out_infinite] shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-linear-to-br from-gold/20 to-gold/5 flex items-center justify-center">
            <BarChart3 className="w-3 h-3 text-gold" />
          </div>
          <span className="text-[10px] font-medium text-white/70">FinSight AI</span>
        </div>
      </div>
      <div className="absolute bottom-[28%] left-[6%] z-10 rounded-xl bg-white/4 backdrop-blur-md border border-white/8 px-3 py-2 animate-[float_8s_ease-in-out_infinite_reverse] shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-linear-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="text-[10px] font-medium text-white/70">AccrediAI</span>
        </div>
      </div>
      <div className="absolute top-[18%] left-[8%] z-10 rounded-xl bg-white/4 backdrop-blur-md border border-white/8 px-3 py-2 animate-[float_7s_ease-in-out_infinite] shadow-xl" style={{ animationDelay: "2s" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-linear-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
            <GraduationCap className="w-3 h-3 text-blue-400" />
          </div>
          <span className="text-[10px] font-medium text-white/70">ProEd AI</span>
        </div>
      </div>

      {/* Logo - top left with fade in */}
      <Link href="/" className="absolute top-8 left-8 z-10 animate-[fadeInDown_0.8s_ease-out_both]">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Harava" width={36} height={36} className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10" />
          <span className="text-lg font-bold text-white tracking-tight">Harava<span className="text-gold">.</span></span>
        </div>
      </Link>

      {/* Center content — animated entrance */}
      <div className="relative z-10 text-center max-w-75 px-6">
        <div className="inline-flex items-center gap-2 bg-white/4 border border-white/6 rounded-full px-3.5 py-1.5 mb-5 backdrop-blur-sm animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
          <Globe className="w-3 h-3 text-gold/80 animate-[spin_12s_linear_infinite]" />
          <span className="text-[9px] font-medium text-white/50 uppercase tracking-[0.12em]">Global AI Platform</span>
        </div>
        <h2 className="text-[22px] font-bold text-white mb-3 tracking-tight leading-[1.3] animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
          {variant === "login" ? "Intelligent operations for modern enterprises" : "Join the future of intelligent business advisory"}
        </h2>
        <p className="text-white/35 text-[13px] leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.6s_both]">
          Access FinSight AI, AccrediAI, and ProEd AI — all from one unified platform.
        </p>
      </div>

      {/* Bottom — minimal trust indicator */}
      <div className="absolute bottom-8 inset-x-0 z-10 flex justify-center animate-[fadeInUp_0.6s_ease-out_0.8s_both]">
        <div className="flex items-center gap-2.5 bg-white/3 border border-white/5 rounded-full px-4 py-2 backdrop-blur-sm">
          <div className="flex -space-x-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-linear-to-br from-white/10 to-white/3 border border-white/8" style={{ animationDelay: `${1 + i * 0.15}s` }} />
            ))}
          </div>
          <span className="text-white/35 text-[10px]">Trusted by <span className="text-white/60 font-medium">500+</span> organizations</span>
        </div>
      </div>
    </div>
  );
}
