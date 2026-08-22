"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

/* ===== Chart Color Palette (matches Harava design system) ===== */
const COLORS = {
  navy: "#182954",
  navyLight: "#1e3a6e",
  gold: "#C19B3F",
  goldLight: "#d4b366",
  blue: "#4A9EFF",
  emerald: "#059669",
  amber: "#d97706",
  rose: "#e11d48",
  violet: "#7c3aed",
  slate: "#64748b",
};

const CHART_PALETTE = [
  COLORS.navy,
  COLORS.gold,
  COLORS.blue,
  COLORS.emerald,
  COLORS.violet,
  COLORS.amber,
  COLORS.rose,
];

/* ===== Custom Tooltip ===== */
interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

function CustomTooltip({
  active,
  payload,
  label,
  valuePrefix = "",
  valueSuffix = "",
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white dark:bg-[#101830] border border-navy/8 dark:border-white/10 rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm">
      <p className="text-[11px] font-medium text-navy/50 dark:text-white/50 mb-1.5">{label}</p>
      {payload.map((entry: TooltipPayload, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[12px] text-navy/60 dark:text-white/60">{entry.name}:</span>
          <span className="text-[12px] font-semibold text-navy dark:text-white">
            {valuePrefix}{typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}{valueSuffix}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ===== Trend Area Chart ===== */
export interface TrendChartData {
  name: string;
  [key: string]: string | number;
}

interface TrendChartProps {
  data: TrendChartData[];
  dataKeys: { key: string; label: string; color?: string }[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  gradientFill?: boolean;
}

export function TrendChart({
  data,
  dataKeys,
  height = 280,
  valuePrefix = "",
  valueSuffix = "",
  showGrid = true,
  showLegend = true,
  gradientFill = true,
}: TrendChartProps) {
  const gradients = useMemo(
    () =>
      dataKeys.map((dk, i) => ({
        id: `gradient-${dk.key}`,
        color: dk.color || CHART_PALETTE[i % CHART_PALETTE.length],
      })),
    [dataKeys]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          {gradients.map((g) => (
            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={g.color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={g.color} stopOpacity={0.01} />
            </linearGradient>
          ))}
        </defs>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(24,41,84,0.06)"
            vertical={false}
          />
        )}
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          dx={-4}
        />
        <Tooltip
          content={
            <CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />
          }
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: 16, fontSize: 11 }}
            iconType="circle"
            iconSize={8}
          />
        )}
        {dataKeys.map((dk, i) => (
          <Area
            key={dk.key}
            type="monotone"
            dataKey={dk.key}
            name={dk.label}
            stroke={dk.color || CHART_PALETTE[i % CHART_PALETTE.length]}
            strokeWidth={2.5}
            fill={gradientFill ? `url(#gradient-${dk.key})` : "transparent"}
            dot={false}
            activeDot={{
              r: 5,
              stroke: dk.color || CHART_PALETTE[i % CHART_PALETTE.length],
              strokeWidth: 2,
              fill: "white",
            }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ===== Bar Chart ===== */
interface BarChartProps {
  data: TrendChartData[];
  dataKeys: { key: string; label: string; color?: string }[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  radius?: number;
}

export function MetricBarChart({
  data,
  dataKeys,
  height = 280,
  valuePrefix = "",
  valueSuffix = "",
  showGrid = true,
  showLegend = true,
  stacked = false,
  radius = 6,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(24,41,84,0.06)"
            vertical={false}
          />
        )}
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          dx={-4}
        />
        <Tooltip
          content={
            <CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />
          }
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: 16, fontSize: 11 }}
            iconType="circle"
            iconSize={8}
          />
        )}
        {dataKeys.map((dk, i) => (
          <Bar
            key={dk.key}
            dataKey={dk.key}
            name={dk.label}
            fill={dk.color || CHART_PALETTE[i % CHART_PALETTE.length]}
            radius={[radius, radius, 0, 0]}
            stackId={stacked ? "stack" : undefined}
            maxBarSize={48}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ===== Line Chart ===== */
interface LineChartProps {
  data: TrendChartData[];
  dataKeys: { key: string; label: string; color?: string }[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  curved?: boolean;
}

export function MetricLineChart({
  data,
  dataKeys,
  height = 280,
  valuePrefix = "",
  valueSuffix = "",
  showGrid = true,
  showLegend = true,
  curved = true,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(24,41,84,0.06)"
            vertical={false}
          />
        )}
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          dx={-4}
        />
        <Tooltip
          content={
            <CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />
          }
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: 16, fontSize: 11 }}
            iconType="circle"
            iconSize={8}
          />
        )}
        {dataKeys.map((dk, i) => (
          <Line
            key={dk.key}
            type={curved ? "monotone" : "linear"}
            dataKey={dk.key}
            name={dk.label}
            stroke={dk.color || CHART_PALETTE[i % CHART_PALETTE.length]}
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              stroke: dk.color || CHART_PALETTE[i % CHART_PALETTE.length],
              strokeWidth: 2,
              fill: "white",
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ===== Donut / Pie Chart ===== */
interface DonutChartData {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({
  data,
  height = 240,
  innerRadius = 60,
  outerRadius = 90,
  showLegend = true,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={entry.color || CHART_PALETTE[i % CHART_PALETTE.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip />}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-navy dark:text-white">{centerValue}</span>
          <span className="text-[11px] text-navy/45 dark:text-white/45">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}

/* ===== Progress Radial Chart ===== */
interface RadialProgressData {
  name: string;
  value: number;
  fill: string;
}

interface RadialProgressProps {
  data: RadialProgressData[];
  height?: number;
}

export function RadialProgress({ data, height = 200 }: RadialProgressProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="30%"
        outerRadius="100%"
        barSize={12}
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          background={{ fill: "rgba(24,41,84,0.04)" }}
          dataKey="value"
          cornerRadius={6}
        />
        <Legend
          iconSize={8}
          iconType="circle"
          wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
        />
        <Tooltip content={<CustomTooltip valueSuffix="%" />} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

/* ===== Mini Sparkline ===== */
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function Sparkline({
  data,
  color = COLORS.navy,
  height = 40,
  width = 120,
}: SparklineProps) {
  const chartData = data.map((value, i) => ({ value, i }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ===== Chart Card Wrapper ===== */
interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, action, children }: ChartCardProps) {
  return (
    <div className="bg-white dark:bg-surface rounded-2xl border border-navy/6 dark:border-white/6 p-5 shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-navy dark:text-white">{title}</h3>
          {subtitle && (
            <p className="text-[12px] text-navy/45 dark:text-white/45 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
