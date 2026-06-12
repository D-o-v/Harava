"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { TrendChart, MetricBarChart, DonutChart, ChartCard } from "@/components/ui/charts";
import { FileText, Download, Plus, Calendar, Clock, BarChart3, PieChart, TrendingUp, Users, Building2, Filter } from "lucide-react";

export default function ReportsPage() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("revenue");

  const savedReports = [
    { id: 1, name: "Monthly Revenue Summary", type: "Financial", frequency: "Monthly", lastGenerated: "Jun 1, 2026", format: "PDF", status: "ready" },
    { id: 2, name: "User Growth Analysis", type: "Analytics", frequency: "Weekly", lastGenerated: "Jun 10, 2026", format: "Excel", status: "ready" },
    { id: 3, name: "Client Retention Report", type: "Clients", frequency: "Quarterly", lastGenerated: "Apr 1, 2026", format: "PDF", status: "ready" },
    { id: 4, name: "Payroll Tax Summary", type: "Payroll", frequency: "Monthly", lastGenerated: "Jun 1, 2026", format: "PDF", status: "ready" },
    { id: 5, name: "Security Compliance Audit", type: "Security", frequency: "Quarterly", lastGenerated: "Apr 1, 2026", format: "PDF", status: "ready" },
    { id: 6, name: "Module Usage Breakdown", type: "Analytics", frequency: "Monthly", lastGenerated: "Jun 1, 2026", format: "Excel", status: "ready" },
    { id: 7, name: "Accreditation Progress", type: "Compliance", frequency: "Monthly", lastGenerated: "Jun 5, 2026", format: "PDF", status: "generating" },
    { id: 8, name: "Employee Performance", type: "HR", frequency: "Quarterly", lastGenerated: "Apr 1, 2026", format: "PDF", status: "scheduled" },
  ];

  return (
    <div>
      <DashboardHeader title="Reports & Analytics" subtitle="Generate, schedule, and export comprehensive platform reports" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* Report Builder Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="default">{savedReports.length} reports</Badge>
            <Badge variant="success">{savedReports.filter(r => r.status === "ready").length} ready</Badge>
            <Badge variant="warning">{savedReports.filter(r => r.status === "generating").length} generating</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast("Opening report scheduler...", "info")}>
              <Calendar className="w-3.5 h-3.5" /> Schedule
            </Button>
            <Button variant="primary" onClick={() => toast("Creating new report...", "info")}>
              <Plus className="w-3.5 h-3.5" /> New Report
            </Button>
          </div>
        </div>

        {/* Quick Report Charts */}
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <ChartCard
              title="Revenue Trend"
              subtitle="Platform-wide revenue (last 6 months)"
              action={
                <Button variant="ghost" size="xs" onClick={() => toast("Exporting revenue report...", "success")}>
                  <Download className="w-3 h-3" /> Export
                </Button>
              }
            >
              <TrendChart
                data={[
                  { name: "Jan", revenue: 195000, target: 200000 },
                  { name: "Feb", revenue: 211000, target: 210000 },
                  { name: "Mar", revenue: 226000, target: 220000 },
                  { name: "Apr", revenue: 242000, target: 235000 },
                  { name: "May", revenue: 265000, target: 250000 },
                  { name: "Jun", revenue: 284000, target: 270000 },
                ]}
                dataKeys={[
                  { key: "revenue", label: "Actual Revenue", color: "#182954" },
                  { key: "target", label: "Target", color: "#d4b366" },
                ]}
                valuePrefix="$"
                height={220}
              />
            </ChartCard>
          </div>

          <ChartCard title="User Distribution" subtitle="By module">
            <DonutChart
              data={[
                { name: "FinSight", value: 560, color: "#182954" },
                { name: "AccrediAI", value: 380, color: "#C19B3F" },
                { name: "ProEd", value: 307, color: "#4A9EFF" },
              ]}
              centerValue="1,247"
              centerLabel="Total Users"
              height={190}
              innerRadius={45}
              outerRadius={72}
            />
          </ChartCard>
        </div>

        {/* Client & Employee Summary */}
        <ChartCard title="Client Growth & Churn" subtitle="Monthly client metrics">
          <MetricBarChart
            data={[
              { name: "Jan", acquired: 8, churned: 2 },
              { name: "Feb", acquired: 6, churned: 1 },
              { name: "Mar", acquired: 9, churned: 3 },
              { name: "Apr", acquired: 7, churned: 1 },
              { name: "May", acquired: 10, churned: 2 },
              { name: "Jun", acquired: 8, churned: 1 },
            ]}
            dataKeys={[
              { key: "acquired", label: "New Clients", color: "#059669" },
              { key: "churned", label: "Churned", color: "#dc2626" },
            ]}
            height={180}
          />
        </ChartCard>

        {/* Saved Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" /> Saved Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-navy/2 border-b border-navy/6">
                  <tr>
                    <th className="text-left px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Report Name</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Type</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Frequency</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Last Generated</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Format</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/4">
                  {savedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-navy/1.5 transition-colors duration-150">
                      <td className="px-6 py-3">
                        <p className="text-[13px] font-medium text-navy">{report.name}</p>
                      </td>
                      <td className="px-4 py-3 text-center"><Badge variant="default" size="sm">{report.type}</Badge></td>
                      <td className="px-4 py-3 text-center text-[12px] text-navy/50">{report.frequency}</td>
                      <td className="px-4 py-3 text-center text-[12px] text-navy/50">{report.lastGenerated}</td>
                      <td className="px-4 py-3 text-center"><Badge variant="info" size="sm">{report.format}</Badge></td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={report.status === "ready" ? "success" : report.status === "generating" ? "warning" : "default"} size="sm">
                          {report.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => toast(`Downloading ${report.name}...`, "success")}
                          disabled={report.status !== "ready"}
                        >
                          <Download className="w-3 h-3" /> Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Report Templates */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Revenue Report", desc: "Complete financial overview", icon: TrendingUp, color: "from-navy/6 to-gold/4" },
            { title: "User Analytics", desc: "Growth, engagement, retention", icon: Users, color: "from-blue-50 to-blue-100/50" },
            { title: "Client Report", desc: "Account health & lifecycle", icon: Building2, color: "from-emerald-50 to-emerald-100/50" },
            { title: "Custom Report", desc: "Build from scratch", icon: BarChart3, color: "from-violet-50 to-violet-100/50" },
          ].map((template, i) => {
            const Icon = template.icon;
            return (
              <div
                key={i}
                className="group p-5 rounded-2xl border border-navy/6 bg-white dark:bg-white/5 hover:border-gold/20 hover:shadow-md cursor-pointer transition-all duration-300"
                onClick={() => toast(`Starting ${template.title} builder...`, "info")}
              >
                <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${template.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-navy/50" />
                </div>
                <p className="text-[13px] font-semibold text-navy">{template.title}</p>
                <p className="text-[11px] text-navy/40 mt-0.5">{template.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
