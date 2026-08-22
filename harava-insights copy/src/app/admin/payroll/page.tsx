"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { MetricBarChart, ChartCard, TrendChart } from "@/components/ui/charts";
import { Wallet, DollarSign, Users, Calendar, CheckCircle, Clock, Download, Play, ArrowUpRight, FileText, AlertTriangle } from "lucide-react";

export default function PayrollPage() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("jun-2026");

  const payrollSummary = {
    totalEmployees: 248,
    totalGross: "$1,248,000",
    totalNet: "$986,400",
    totalDeductions: "$261,600",
    nextRunDate: "Jun 30, 2026",
    lastRunDate: "Jun 15, 2026",
  };

  const employees = [
    { id: 1, name: "Sarah Johnson", department: "Engineering", salary: "$8,500", net: "$6,720", status: "processed", type: "Full-time" },
    { id: 2, name: "Michael Chen", department: "Product", salary: "$9,200", net: "$7,280", status: "processed", type: "Full-time" },
    { id: 3, name: "Jessica Williams", department: "Marketing", salary: "$7,800", net: "$6,160", status: "processed", type: "Full-time" },
    { id: 4, name: "David Brown", department: "Sales", salary: "$7,200", net: "$5,690", status: "pending", type: "Full-time" },
    { id: 5, name: "Emily Davis", department: "HR", salary: "$6,900", net: "$5,450", status: "pending", type: "Full-time" },
    { id: 6, name: "James Wilson", department: "Engineering", salary: "$4,500", net: "$3,780", status: "processed", type: "Contractor" },
    { id: 7, name: "Amanda Taylor", department: "Design", salary: "$7,100", net: "$5,610", status: "processed", type: "Full-time" },
    { id: 8, name: "Robert Martinez", department: "Operations", salary: "$6,500", net: "$5,135", status: "hold", type: "Full-time" },
  ];

  const handleRunPayroll = () => {
    toast("Payroll batch initiated! Processing 248 employees...", "success");
  };

  return (
    <div>
      <DashboardHeader title="Payroll Management" subtitle="Process payments, manage compensation, and track expenses" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <div className="stat-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Employees</p>
                <p className="text-2xl font-bold text-navy mt-1">{payrollSummary.totalEmployees}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center">
                <Users className="w-4 h-4 text-navy/50" />
              </div>
            </div>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Gross Payroll</p>
                <p className="text-2xl font-bold text-navy mt-1">{payrollSummary.totalGross}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-navy/50" />
              </div>
            </div>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Net Payroll</p>
                <p className="text-2xl font-bold text-navy mt-1">{payrollSummary.totalNet}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-navy/50" />
              </div>
            </div>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Next Run</p>
                <p className="text-lg font-bold text-navy mt-1">{payrollSummary.nextRunDate}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-navy/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-navy/10 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-gold/40 bg-white dark:bg-white/5"
            >
              <option value="jun-2026">June 2026 (Current)</option>
              <option value="may-2026">May 2026</option>
              <option value="apr-2026">April 2026</option>
              <option value="mar-2026">March 2026</option>
            </select>
            <Badge variant="warning">2 pending review</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast("Exporting payroll data...", "success")}>
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
            <Button variant="primary" onClick={handleRunPayroll}>
              <Play className="w-3.5 h-3.5" /> Run Payroll
            </Button>
          </div>
        </div>

        {/* Payroll Trend */}
        <ChartCard title="Payroll Expense Trend" subtitle="Monthly gross vs net payroll">
          <MetricBarChart
            data={[
              { name: "Jan", gross: 1180000, net: 932000 },
              { name: "Feb", gross: 1195000, net: 944000 },
              { name: "Mar", gross: 1210000, net: 956000 },
              { name: "Apr", gross: 1225000, net: 968000 },
              { name: "May", gross: 1238000, net: 978000 },
              { name: "Jun", gross: 1248000, net: 986400 },
            ]}
            dataKeys={[
              { key: "gross", label: "Gross", color: "#182954" },
              { key: "net", label: "Net", color: "#C19B3F" },
            ]}
            valuePrefix="$"
            height={200}
          />
        </ChartCard>

        {/* Employee Payroll Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Employee Payroll - June 2026</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="success">{employees.filter(e => e.status === "processed").length} processed</Badge>
              <Badge variant="warning">{employees.filter(e => e.status === "pending").length} pending</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-175">
                <thead className="bg-navy/2 border-b border-navy/6">
                  <tr>
                    <th className="text-left px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Employee</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Department</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Type</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Gross</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Net</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/4">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-navy/1.5 transition-colors duration-150">
                      <td className="px-6 py-3">
                        <p className="text-[13px] font-medium text-navy">{emp.name}</p>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-navy/60">{emp.department}</td>
                      <td className="px-4 py-3"><Badge variant="default" size="sm">{emp.type}</Badge></td>
                      <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{emp.salary}</td>
                      <td className="px-4 py-3 text-right text-[13px] font-medium text-navy">{emp.net}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={emp.status === "processed" ? "success" : emp.status === "pending" ? "warning" : "error"} size="sm">
                          {emp.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Deduction Breakdown */}
        <div className="grid lg:grid-cols-3 gap-5">
          <Card>
            <CardHeader><CardTitle className="text-[13px]">Tax Withholdings</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Federal Income Tax", amount: "$142,800" },
                  { label: "State Tax", amount: "$48,200" },
                  { label: "Social Security", amount: "$38,400" },
                  { label: "Medicare", amount: "$18,100" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-navy/4 last:border-0">
                    <span className="text-[12px] text-navy/60">{item.label}</span>
                    <span className="text-[12px] font-semibold text-navy">{item.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-[13px]">Benefits Deductions</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Health Insurance", amount: "$62,400" },
                  { label: "Dental/Vision", amount: "$12,800" },
                  { label: "401(k) Match", amount: "$38,200" },
                  { label: "Life Insurance", amount: "$4,800" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-navy/4 last:border-0">
                    <span className="text-[12px] text-navy/60">{item.label}</span>
                    <span className="text-[12px] font-semibold text-navy">{item.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-[13px]">Department Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Engineering", amount: "$420,000", pct: 34 },
                  { label: "Sales", amount: "$248,000", pct: 20 },
                  { label: "Product", amount: "$186,000", pct: 15 },
                  { label: "Marketing", amount: "$156,000", pct: 12 },
                  { label: "Others", amount: "$238,000", pct: 19 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-navy/60">{item.label}</span>
                      <span className="text-[11px] font-semibold text-navy">{item.amount}</span>
                    </div>
                    <div className="w-full h-1.5 bg-navy/6 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-navy to-gold rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
