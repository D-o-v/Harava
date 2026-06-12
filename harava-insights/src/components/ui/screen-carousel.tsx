"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Users,
  Sparkles,
  Zap,
  FileText,
  GraduationCap,
  PieChart,
  Activity,
} from "lucide-react";
import FinSightLogo from "@/assets/4. FinSights AI Logo -TM.png";
import AccrediAILogo from "@/assets/3. Accredi AI logo -TM.png";
import ProEdLogo from "@/assets/2. ProEd AI logo -TM.png";

// ─── Monitor Carousel Screens ───────────────────────────────────────────────

const monitorScreens = [
  // Screen 1: FinSight Dashboard
  {
    tab: "FinSight",
    content: (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/3 border border-white/6 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[8px] text-white/30 uppercase tracking-wider">Revenue</p>
              <TrendingUp className="w-3 h-3 text-green-400" />
            </div>
            <p className="text-lg font-bold text-white mt-1.5">$4.2M</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[8px] text-green-400 font-semibold bg-green-400/10 px-1.5 py-0.5 rounded">+24.5%</span>
            </div>
          </div>
          <div className="rounded-xl bg-white/3 border border-white/6 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[8px] text-white/30 uppercase tracking-wider">Compliance</p>
              <ShieldCheck className="w-3 h-3 text-gold" />
            </div>
            <p className="text-lg font-bold text-white mt-1.5">98.2%</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[8px] text-gold font-semibold bg-gold/10 px-1.5 py-0.5 rounded">On Track</span>
            </div>
          </div>
          <div className="rounded-xl bg-white/3 border border-white/6 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[8px] text-white/30 uppercase tracking-wider">AI Tasks</p>
              <Zap className="w-3 h-3 text-green-400" />
            </div>
            <p className="text-lg font-bold text-white mt-1.5">1,847</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="text-[8px] text-green-400 font-semibold bg-green-400/10 px-1.5 py-0.5 rounded">Active</span>
            </div>
          </div>
        </div>

        {/* Chart area */}
        <div className="rounded-xl bg-white/2 border border-white/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] text-white/35 font-medium">Revenue Analytics</span>
            <span className="text-[8px] text-gold font-medium">Live</span>
          </div>
          <svg className="w-full h-20" viewBox="0 0 300 80" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mcg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(193,155,63,0.25)" />
                <stop offset="100%" stopColor="rgba(193,155,63,0)" />
              </linearGradient>
            </defs>
            <path d="M0,65 C30,58 60,45 90,40 C120,35 150,50 180,30 C210,15 240,20 270,10 C285,7 295,5 300,3" fill="url(#mcg1)" opacity="0.5" />
            <path d="M0,65 C30,58 60,45 90,40 C120,35 150,50 180,30 C210,15 240,20 270,10 C285,7 295,5 300,3" stroke="rgba(193,155,63,0.8)" strokeWidth="2" fill="none" />
            <circle cx="300" cy="3" r="3" fill="#C19B3F" className="animate-pulse" />
          </svg>
        </div>

        {/* Activity */}
        <div className="rounded-xl bg-white/2 border border-white/5 p-4">
          <p className="text-[9px] text-white/35 font-medium mb-2 uppercase tracking-wider">Recent Activity</p>
          <div className="space-y-2">
            {[
              { label: "Invoice #4521 processed", amount: "+$12,400", color: "text-green-400" },
              { label: "Payroll batch approved", amount: "-$84,200", color: "text-red-400" },
              { label: "Tax filing submitted", amount: "Pending", color: "text-gold" },
            ].map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-white/3 last:border-0">
                <span className="text-[8px] text-white/50">{tx.label}</span>
                <span className={`text-[8px] font-semibold ${tx.color}`}>{tx.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  // Screen 2: AccrediAI Compliance
  {
    tab: "AccrediAI",
    content: (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/3 border border-white/6 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[8px] text-white/30 uppercase tracking-wider">Standards Met</p>
              <ShieldCheck className="w-3 h-3 text-green-400" />
            </div>
            <p className="text-lg font-bold text-white mt-1.5">47/47</p>
            <div className="mt-2 w-full h-1.5 rounded-full bg-white/5">
              <div className="h-full w-full rounded-full bg-green-400/60" />
            </div>
          </div>
          <div className="rounded-xl bg-white/3 border border-white/6 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[8px] text-white/30 uppercase tracking-wider">Risk Score</p>
              <Activity className="w-3 h-3 text-gold" />
            </div>
            <p className="text-lg font-bold text-white mt-1.5">Low</p>
            <div className="mt-2 w-full h-1.5 rounded-full bg-white/5">
              <div className="h-full w-[15%] rounded-full bg-gold/60" />
            </div>
          </div>
        </div>

        {/* Compliance timeline */}
        <div className="rounded-xl bg-white/2 border border-white/5 p-4">
          <p className="text-[9px] text-white/35 font-medium mb-3 uppercase tracking-wider">Audit Timeline</p>
          <div className="space-y-3">
            {[
              { label: "SOC 2 Type II", status: "Passed", date: "May 28", color: "bg-green-400" },
              { label: "HIPAA Assessment", status: "Passed", date: "May 15", color: "bg-green-400" },
              { label: "GDPR Review", status: "In Progress", date: "Jun 2", color: "bg-gold" },
              { label: "ISO 27001", status: "Scheduled", date: "Jun 15", color: "bg-blue-400" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] text-white/60 font-medium">{item.label}</p>
                    <p className="text-[7px] text-white/25">{item.date}</p>
                  </div>
                  <span className="text-[7px] text-white/40 bg-white/5 rounded px-1.5 py-0.5">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className="rounded-xl bg-gold/4 border border-gold/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[8px] text-gold font-semibold uppercase tracking-wider">AI Recommendation</span>
          </div>
          <p className="text-[8px] text-white/45 leading-relaxed">3 documentation gaps detected in GDPR compliance. Auto-generating remediation plan.</p>
        </div>
      </div>
    ),
  },
  // Screen 3: ProEd AI Learning
  {
    tab: "ProEd AI",
    content: (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/3 border border-white/6 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[8px] text-white/30 uppercase tracking-wider">Courses</p>
              <GraduationCap className="w-3 h-3 text-blue-400" />
            </div>
            <p className="text-lg font-bold text-white mt-1.5">24</p>
            <span className="text-[7px] text-white/25">Active paths</span>
          </div>
          <div className="rounded-xl bg-white/3 border border-white/6 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[8px] text-white/30 uppercase tracking-wider">Progress</p>
              <PieChart className="w-3 h-3 text-green-400" />
            </div>
            <p className="text-lg font-bold text-white mt-1.5">78%</p>
            <span className="text-[7px] text-white/25">Avg completion</span>
          </div>
          <div className="rounded-xl bg-white/3 border border-white/6 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[8px] text-white/30 uppercase tracking-wider">Learners</p>
              <Users className="w-3 h-3 text-purple-400" />
            </div>
            <p className="text-lg font-bold text-white mt-1.5">342</p>
            <span className="text-[7px] text-white/25">This month</span>
          </div>
        </div>

        {/* Learning paths */}
        <div className="rounded-xl bg-white/2 border border-white/5 p-4">
          <p className="text-[9px] text-white/35 font-medium mb-3 uppercase tracking-wider">Top Learning Paths</p>
          <div className="space-y-3">
            {[
              { name: "Financial Analysis Mastery", progress: 92, enrolled: 84 },
              { name: "Compliance Fundamentals", progress: 78, enrolled: 156 },
              { name: "AI & Machine Learning", progress: 65, enrolled: 67 },
              { name: "Risk Management Pro", progress: 45, enrolled: 43 },
            ].map((path, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-white/55 font-medium">{path.name}</span>
                  <span className="text-[7px] text-white/30">{path.enrolled} enrolled</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-blue-400/60 transition-all duration-1000" style={{ width: `${path.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className="rounded-xl bg-gold/4 border border-gold/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[8px] text-gold font-semibold uppercase tracking-wider">AI Insight</span>
          </div>
          <p className="text-[8px] text-white/45 leading-relaxed">12 learners at risk of falling behind. Personalized nudges scheduled for tomorrow.</p>
        </div>
      </div>
    ),
  },
];

// ─── Phone Carousel Screens ────────────────────────────────────────────────

const phoneScreens = [
  // Screen 1: Dashboard Overview
  {
    content: (
      <div className="px-5 pb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
              <Image src={FinSightLogo} alt="FinSight" width={32} height={32} className="w-7 h-7 object-contain" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white/85 block">FinSight</span>
              <span className="text-[8px] text-white/35">Dashboard</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10">
            <Users className="w-3.5 h-3.5 text-white/40" />
          </div>
        </div>
        <div className="rounded-2xl bg-linear-to-br from-[#141c2e] to-[#0c1220] border border-white/6 p-5">
          <p className="text-[8px] text-white/40 uppercase tracking-wider">Total Revenue</p>
          <p className="text-2xl font-bold text-white mt-1.5">$4.2M</p>
          <div className="flex items-center gap-2 mt-2.5">
            <div className="flex items-center gap-1 bg-green-400/10 rounded-full px-2.5 py-1">
              <TrendingUp className="w-3 h-3 text-green-300" />
              <span className="text-[8px] text-green-300 font-semibold">+24.5%</span>
            </div>
            <span className="text-[8px] text-white/25">this month</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-white/3 border border-white/6 p-3.5">
            <p className="text-[7px] text-white/30 uppercase tracking-wider">Compliance</p>
            <p className="text-base font-bold text-white mt-1">98.2%</p>
          </div>
          <div className="rounded-xl bg-white/3 border border-white/6 p-3.5">
            <p className="text-[7px] text-white/30 uppercase tracking-wider">AI Tasks</p>
            <p className="text-base font-bold text-white mt-1">1,847</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: "Invoice processed", time: "2m ago", color: "bg-green-400" },
            { label: "Tax report ready", time: "5m ago", color: "bg-gold" },
            { label: "Payroll approved", time: "12m ago", color: "bg-blue-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-white/2 border border-white/4 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[9px] text-white/50">{item.label}</span>
              </div>
              <span className="text-[8px] text-white/25">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  // Screen 2: Compliance View
  {
    content: (
      <div className="px-5 pb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
              <Image src={AccrediAILogo} alt="AccrediAI" width={32} height={32} className="w-7 h-7 object-contain" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white/85 block">AccrediAI</span>
              <span className="text-[8px] text-white/35">Compliance</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10">
            <FileText className="w-3.5 h-3.5 text-white/40" />
          </div>
        </div>
        <div className="rounded-2xl bg-linear-to-br from-[#0c2018] to-[#0c1220] border border-white/6 p-5">
          <p className="text-[8px] text-white/40 uppercase tracking-wider">Compliance Score</p>
          <p className="text-2xl font-bold text-white mt-1.5">98.2%</p>
          <div className="flex items-center gap-2 mt-2.5">
            <div className="flex items-center gap-1 bg-green-400/10 rounded-full px-2.5 py-1">
              <ShieldCheck className="w-3 h-3 text-green-300" />
              <span className="text-[8px] text-green-300 font-semibold">47/47 Met</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: "SOC 2 Type II", status: "Passed", color: "bg-green-400" },
            { label: "HIPAA", status: "Passed", color: "bg-green-400" },
            { label: "GDPR", status: "Review", color: "bg-gold" },
            { label: "ISO 27001", status: "Pending", color: "bg-blue-400" },
            { label: "PCI DSS", status: "Passed", color: "bg-green-400" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-white/2 border border-white/4 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[9px] text-white/50">{item.label}</span>
              </div>
              <span className="text-[8px] text-white/30 bg-white/5 rounded px-2 py-0.5">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  // Screen 3: Learning
  {
    content: (
      <div className="px-5 pb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
              <Image src={ProEdLogo} alt="ProEd AI" width={32} height={32} className="w-7 h-7 object-contain" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-white/85 block">ProEd AI</span>
              <span className="text-[8px] text-white/35">Learning</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10">
            <Users className="w-3.5 h-3.5 text-white/40" />
          </div>
        </div>
        <div className="rounded-2xl bg-linear-to-br from-[#1a142e] to-[#0c1220] border border-white/6 p-5">
          <p className="text-[8px] text-white/40 uppercase tracking-wider">Your Progress</p>
          <p className="text-2xl font-bold text-white mt-1.5">78%</p>
          <div className="mt-2.5 w-full h-2 rounded-full bg-white/5">
            <div className="h-full w-[78%] rounded-full bg-purple-400/70" />
          </div>
        </div>
        <div className="space-y-2.5">
          {[
            { name: "Financial Analysis", progress: 92 },
            { name: "Risk Management", progress: 65 },
            { name: "AI Fundamentals", progress: 45 },
            { name: "Compliance Law", progress: 88 },
          ].map((course, i) => (
            <div key={i} className="rounded-xl bg-white/2 border border-white/4 px-4 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] text-white/55 font-medium">{course.name}</span>
                <span className="text-[8px] text-white/30">{course.progress}%</span>
              </div>
              <div className="w-full h-1 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-purple-400/50" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// ─── Monitor Carousel Component ─────────────────────────────────────────────

export function MonitorCarousel() {
  const [activeScreen, setActiveScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % monitorScreens.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-6 py-2 border-b border-white/5 bg-[#060a12]">
        {monitorScreens.map((screen, i) => (
          <button
            key={i}
            onClick={() => setActiveScreen(i)}
            className={`text-[8px] font-medium px-3 py-1.5 rounded-md transition-all duration-300 ${
              i === activeScreen
                ? "bg-white/8 text-white/80"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            {screen.tab}
          </button>
        ))}
        {/* Progress dots */}
        <div className="ml-auto flex items-center gap-1">
          {monitorScreens.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeScreen ? "w-4 bg-gold" : "w-1 bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Screen content with crossfade */}
      <div className="relative overflow-hidden">
        {monitorScreens.map((screen, i) => (
          <div
            key={i}
            className={`transition-all duration-700 ease-in-out ${
              i === activeScreen
                ? "opacity-100 translate-y-0 relative"
                : "opacity-0 translate-y-2 absolute inset-0 pointer-events-none"
            }`}
          >
            {screen.content}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Phone Carousel Component ───────────────────────────────────────────────

export function PhoneCarousel() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayScreen, setDisplayScreen] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      // Halfway through the flip, swap content
      setTimeout(() => {
        setDisplayScreen((prev) => (prev + 1) % phoneScreens.length);
        setActiveScreen((prev) => (prev + 1) % phoneScreens.length);
      }, 300);
      // End flip
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full" style={{ perspective: "1200px" }}>
      {/* Screen content with 3D flip */}
      <div
        className="relative transition-transform duration-600 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipping ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div style={{ backfaceVisibility: "hidden" }}>
          {phoneScreens[displayScreen].content}
        </div>
      </div>

      {/* Bottom indicator dots */}
      <div className="flex items-center justify-center gap-1.5 pb-4">
        {phoneScreens.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (i !== activeScreen) {
                setIsFlipping(true);
                setTimeout(() => {
                  setDisplayScreen(i);
                  setActiveScreen(i);
                }, 300);
                setTimeout(() => {
                  setIsFlipping(false);
                }, 600);
              }
            }}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === activeScreen ? "w-4 bg-gold" : "w-1.5 bg-white/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
