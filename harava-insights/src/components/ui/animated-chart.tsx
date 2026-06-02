"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedChart() {
  const [mounted, setMounted] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Data points for the chart
  const points = [
    { x: 0, y: 78, label: "Jan", value: "$2.1M" },
    { x: 43, y: 65, label: "Feb", value: "$2.4M" },
    { x: 86, y: 58, label: "Mar", value: "$2.7M" },
    { x: 129, y: 70, label: "Apr", value: "$2.3M" },
    { x: 172, y: 48, label: "May", value: "$3.1M" },
    { x: 215, y: 35, label: "Jun", value: "$3.5M" },
    { x: 258, y: 25, label: "Jul", value: "$3.8M" },
    { x: 300, y: 10, label: "Aug", value: "$4.2M" },
  ];

  // Secondary line data
  const points2 = [
    { x: 0, y: 90 },
    { x: 43, y: 82 },
    { x: 86, y: 75 },
    { x: 129, y: 80 },
    { x: 172, y: 68 },
    { x: 215, y: 60 },
    { x: 258, y: 55 },
    { x: 300, y: 45 },
  ];

  const buildPath = (pts: { x: number; y: number }[]) => {
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      d += ` C${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
  };

  const mainPath = buildPath(points);
  const secondPath = buildPath(points2);
  const areaPath = mainPath + ` L300,100 L0,100 Z`;

  return (
    <div className="relative w-full">
      {/* Chart header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/40 font-medium">Revenue Analytics</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-0.5 rounded-full bg-gold" />
              <span className="text-[7px] text-white/30">Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-0.5 rounded-full bg-[#4A9EFF]" />
              <span className="text-[7px] text-white/30">Forecast</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[8px] text-gold font-medium">Live</span>
        </div>
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-10 bottom-2 flex flex-col justify-between pointer-events-none">
        {["$5M", "$4M", "$3M", "$2M", "$1M"].map((label) => (
          <span key={label} className="text-[6px] text-white/20 -ml-0.5">{label}</span>
        ))}
      </div>

      {/* SVG Chart */}
      <svg
        className="w-full h-30"
        viewBox="0 0 300 100"
        fill="none"
        preserveAspectRatio="none"
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <defs>
          <linearGradient id="chartGradientGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(193,155,63,0.3)" />
            <stop offset="100%" stopColor="rgba(193,155,63,0)" />
          </linearGradient>
          <linearGradient id="chartGradientBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(74,158,255,0.1)" />
            <stop offset="100%" stopColor="rgba(74,158,255,0)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[20, 40, 60, 80].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="300"
            y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}

        {/* Secondary line area */}
        <path
          d={secondPath + " L300,100 L0,100 Z"}
          fill="url(#chartGradientBlue)"
          opacity={mounted ? 0.4 : 0}
          className="transition-opacity duration-1000 delay-500"
        />

        {/* Secondary line */}
        <path
          d={secondPath}
          stroke="rgba(74,158,255,0.4)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray={mounted ? "0" : "600"}
          strokeDashoffset={mounted ? "0" : "600"}
          className="transition-all duration-[2s] delay-300 ease-out"
          style={{ strokeDasharray: 600, strokeDashoffset: mounted ? 0 : 600 }}
        />

        {/* Main area fill */}
        <path
          d={areaPath}
          fill="url(#chartGradientGold)"
          opacity={mounted ? 0.6 : 0}
          className="transition-opacity duration-1000 delay-700"
        />

        {/* Main line */}
        <path
          ref={pathRef}
          d={mainPath}
          stroke="rgba(193,155,63,0.9)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{ strokeDasharray: 600, strokeDashoffset: mounted ? 0 : 600, transition: "stroke-dashoffset 2s ease-out 0.5s" }}
        />

        {/* Data points */}
        {points.map((point, i) => (
          <g key={i}>
            {/* Hover area */}
            <rect
              x={point.x - 15}
              y={0}
              width={30}
              height={100}
              fill="transparent"
              onMouseEnter={() => setHoveredPoint(i)}
              className="cursor-pointer"
            />
            {/* Vertical line on hover */}
            {hoveredPoint === i && (
              <line
                x1={point.x}
                y1={0}
                x2={point.x}
                y2={100}
                stroke="rgba(193,155,63,0.3)"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
            )}
            {/* Point dot */}
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === i ? 4 : 2.5}
              fill="#C19B3F"
              opacity={mounted ? 1 : 0}
              className="transition-all duration-300"
              style={{ transitionDelay: `${800 + i * 100}ms` }}
            />
            {/* Outer ring on hover */}
            {hoveredPoint === i && (
              <circle
                cx={point.x}
                cy={point.y}
                r={7}
                fill="none"
                stroke="rgba(193,155,63,0.3)"
                strokeWidth="1"
              />
            )}
          </g>
        ))}

        {/* Animated trailing dot */}
        <circle cx="300" cy="10" r="3" fill="#C19B3F" className="animate-pulse" filter="url(#glow)" />
      </svg>

      {/* Tooltip */}
      {hoveredPoint !== null && (
        <div
          className="absolute top-6 px-2 py-1 rounded-md bg-[#1a2035] border border-white/10 shadow-xl pointer-events-none transition-all duration-150 z-10"
          style={{ left: `${(points[hoveredPoint].x / 300) * 100}%`, transform: "translateX(-50%)" }}
        >
          <p className="text-[8px] text-white/50">{points[hoveredPoint].label}</p>
          <p className="text-[10px] font-bold text-gold">{points[hoveredPoint].value}</p>
        </div>
      )}

      {/* X-axis labels */}
      <div className="flex justify-between mt-1.5 px-0.5">
        {points.map((p) => (
          <span key={p.label} className="text-[6px] text-white/20">{p.label}</span>
        ))}
      </div>
    </div>
  );
}
