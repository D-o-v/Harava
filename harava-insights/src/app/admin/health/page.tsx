"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { TrendChart, MetricBarChart, ChartCard } from "@/components/ui/charts";
import { Activity, Server, Database, Cpu, Clock, Globe, Wifi, HardDrive, RefreshCw, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function SystemHealthPage() {
  const { toast } = useToast();

  const services = [
    { name: "API Gateway", status: "healthy", uptime: "99.99%", latency: "12ms", region: "US-East", lastIncident: "Never" },
    { name: "Authentication Service", status: "healthy", uptime: "99.98%", latency: "8ms", region: "US-East", lastIncident: "45d ago" },
    { name: "Database Cluster", status: "healthy", uptime: "99.97%", latency: "3ms", region: "US-East", lastIncident: "12d ago" },
    { name: "AI Processing Engine", status: "healthy", uptime: "99.95%", latency: "45ms", region: "US-West", lastIncident: "7d ago" },
    { name: "File Storage (S3)", status: "healthy", uptime: "99.99%", latency: "18ms", region: "Global", lastIncident: "Never" },
    { name: "Email Service", status: "degraded", uptime: "99.80%", latency: "120ms", region: "US-East", lastIncident: "Now" },
    { name: "CDN Edge Nodes", status: "healthy", uptime: "99.99%", latency: "5ms", region: "Global", lastIncident: "30d ago" },
    { name: "Background Workers", status: "healthy", uptime: "99.96%", latency: "N/A", region: "US-East", lastIncident: "3d ago" },
    { name: "WebSocket Server", status: "healthy", uptime: "99.94%", latency: "2ms", region: "US-East", lastIncident: "14d ago" },
    { name: "Search Index (ES)", status: "healthy", uptime: "99.97%", latency: "22ms", region: "US-East", lastIncident: "21d ago" },
  ];

  const metrics = [
    { label: "Overall Uptime", value: "99.97%", icon: Activity, color: "text-emerald-600" },
    { label: "Avg Response Time", value: "24ms", icon: Clock, color: "text-navy" },
    { label: "Active Connections", value: "12,847", icon: Wifi, color: "text-blue-600" },
    { label: "CPU Usage", value: "34%", icon: Cpu, color: "text-gold" },
    { label: "Memory Usage", value: "62%", icon: HardDrive, color: "text-violet-600" },
    { label: "Storage Used", value: "1.2TB", icon: Database, color: "text-amber-600" },
  ];

  return (
    <div>
      <DashboardHeader title="System Health" subtitle="Infrastructure monitoring, uptime, and performance metrics" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* Status Banner */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-800/30">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-[13px] font-semibold text-emerald-800 dark:text-emerald-400">All Systems Operational</p>
              <p className="text-[11px] text-emerald-600/70 dark:text-emerald-500/70">9 of 10 services running normally. 1 degraded.</p>
            </div>
          </div>
          <Button variant="ghost" size="xs" onClick={() => toast("Refreshing health checks...", "info")}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 stagger-children">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="stat-card p-4 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${m.color}`} />
                <p className="text-lg font-bold text-navy">{m.value}</p>
                <p className="text-[10px] text-navy/40 mt-0.5">{m.label}</p>
              </div>
            );
          })}
        </div>

        {/* Performance Charts */}
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          <ChartCard title="Response Time (p95)" subtitle="Last 24 hours">
            <TrendChart
              data={[
                { name: "00:00", time: 28 },
                { name: "04:00", time: 18 },
                { name: "08:00", time: 35 },
                { name: "10:00", time: 42 },
                { name: "12:00", time: 38 },
                { name: "14:00", time: 45 },
                { name: "16:00", time: 32 },
                { name: "18:00", time: 28 },
                { name: "20:00", time: 22 },
                { name: "Now", time: 24 },
              ]}
              dataKeys={[{ key: "time", label: "Response Time (ms)", color: "#182954" }]}
              valueSuffix="ms"
              height={180}
              showLegend={false}
            />
          </ChartCard>
          <ChartCard title="Request Volume" subtitle="Requests per hour">
            <MetricBarChart
              data={[
                { name: "00", requests: 2400 },
                { name: "04", requests: 1200 },
                { name: "08", requests: 8500 },
                { name: "10", requests: 12000 },
                { name: "12", requests: 14200 },
                { name: "14", requests: 13800 },
                { name: "16", requests: 11000 },
                { name: "18", requests: 8200 },
                { name: "20", requests: 5400 },
                { name: "22", requests: 3200 },
              ]}
              dataKeys={[{ key: "requests", label: "Requests", color: "#C19B3F" }]}
              height={180}
              showLegend={false}
            />
          </ChartCard>
        </div>

        {/* Services Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Server className="w-4 h-4 text-gold" /> Service Status
            </CardTitle>
            <p className="text-[11px] text-navy/40">Last checked: 30 seconds ago</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-navy/2 border-b border-navy/6">
                  <tr>
                    <th className="text-left px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Service</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Uptime</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Latency</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Region</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Last Incident</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/4">
                  {services.map((svc, i) => (
                    <tr key={i} className="hover:bg-navy/1.5 transition-colors duration-150">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${svc.status === "healthy" ? "bg-emerald-500" : svc.status === "degraded" ? "bg-amber-500" : "bg-red-500"}`} />
                          <span className="text-[13px] font-medium text-navy">{svc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={svc.status === "healthy" ? "success" : svc.status === "degraded" ? "warning" : "error"} size="sm">
                          {svc.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-[12px] font-medium text-navy">{svc.uptime}</td>
                      <td className="px-4 py-3 text-center text-[12px] text-navy/60">{svc.latency}</td>
                      <td className="px-4 py-3 text-center"><Badge variant="default" size="sm">{svc.region}</Badge></td>
                      <td className="px-4 py-3 text-center text-[12px] text-navy/50">{svc.lastIncident}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
