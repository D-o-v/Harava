"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { TrendingUp, DollarSign, Receipt, AlertTriangle, CheckCircle, Clock, ArrowRight, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import { TrendChart, MetricBarChart, DonutChart, ChartCard } from "@/components/ui/charts";

export default function FinSightDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, title: "Invoice #4521 - ABC Corp", amount: "$12,450", type: "Invoice" },
    { id: 2, title: "Expense Report - Marketing Q2", amount: "$3,200", type: "Expense" },
    { id: 3, title: "PO #892 - Office Supplies", amount: "$890", type: "Purchase Order" },
  ]);

  const handleApprove = (id: number) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
    toast("Approved successfully!", "success");
  };

  const handleReject = (id: number) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
    toast("Rejected", "warning");
  };

  return (
    <div>
      <DashboardHeader title={`Welcome back, ${user?.firstName || "User"}`} subtitle="Here's your financial overview" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 stagger-children">
          {/* Revenue */}
          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/finsight/reports")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Revenue (MTD)</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">$124,500</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-navy bg-navy/5 px-1.5 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3 h-3" /> +12%
                  </span>
                  <span className="text-[11px] text-navy/35">vs last month</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-5 h-5 text-navy/50" />
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/finsight/accounting")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Expenses (MTD)</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">$78,200</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">
                    <ArrowDownRight className="w-3 h-3" /> +5%
                  </span>
                  <span className="text-[11px] text-navy/35">vs last month</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Receipt className="w-5 h-5 text-navy/50" />
              </div>
            </div>
          </div>

          {/* Net Income */}
          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/finsight/reconciliation")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Net Income</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">$46,300</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-navy bg-navy/5 px-1.5 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3 h-3" /> +18%
                  </span>
                  <span className="text-[11px] text-navy/35">vs last month</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-5 h-5 text-navy/50" />
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="stat-card p-5 cursor-pointer group" onClick={() => router.push("/finsight/approvals")}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-navy/45 uppercase tracking-wider">Pending Approvals</p>
                <p className="text-2xl font-bold text-navy mt-2 tracking-tight">{pendingApprovals.length}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                    Requires attention
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-5 h-5 text-navy/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue & Expense Trends */}
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <ChartCard
              title="Revenue vs Expenses"
              subtitle="6-month trend overview"
              action={
                <Button variant="ghost" size="xs" onClick={() => router.push("/finsight/reports")}>
                  Details <ArrowRight className="w-3 h-3" />
                </Button>
              }
            >
              <TrendChart
                data={[
                  { name: "Jan", revenue: 98000, expenses: 62000 },
                  { name: "Feb", revenue: 105000, expenses: 68000 },
                  { name: "Mar", revenue: 112000, expenses: 71000 },
                  { name: "Apr", revenue: 108000, expenses: 65000 },
                  { name: "May", revenue: 118000, expenses: 74000 },
                  { name: "Jun", revenue: 124500, expenses: 78200 },
                ]}
                dataKeys={[
                  { key: "revenue", label: "Revenue", color: "#182954" },
                  { key: "expenses", label: "Expenses", color: "#C19B3F" },
                ]}
                valuePrefix="$"
                height={260}
              />
            </ChartCard>
          </div>

          <ChartCard title="Expense Breakdown" subtitle="Current month">
            <DonutChart
              data={[
                { name: "Payroll", value: 38000, color: "#182954" },
                { name: "Operations", value: 18500, color: "#C19B3F" },
                { name: "Marketing", value: 12200, color: "#4A9EFF" },
                { name: "Software", value: 5800, color: "#059669" },
                { name: "Other", value: 3700, color: "#64748b" },
              ]}
              centerValue="$78.2K"
              centerLabel="Total"
              height={220}
              innerRadius={55}
              outerRadius={85}
            />
          </ChartCard>
        </div>

        {/* Cash Flow Bar Chart */}
        <ChartCard
          title="Monthly Cash Flow"
          subtitle="Net income trend with projections"
          action={
            <Button variant="ghost" size="xs" onClick={() => router.push("/finsight/reconciliation")}>
              Reconciliation <ArrowRight className="w-3 h-3" />
            </Button>
          }
        >
          <MetricBarChart
            data={[
              { name: "Jan", income: 36000, projected: 34000 },
              { name: "Feb", income: 37000, projected: 36000 },
              { name: "Mar", income: 41000, projected: 39000 },
              { name: "Apr", income: 43000, projected: 41000 },
              { name: "May", income: 44000, projected: 43000 },
              { name: "Jun", income: 46300, projected: 45000 },
              { name: "Jul", income: 0, projected: 48000 },
              { name: "Aug", income: 0, projected: 51000 },
            ]}
            dataKeys={[
              { key: "income", label: "Actual", color: "#182954" },
              { key: "projected", label: "Projected", color: "#d4b366" },
            ]}
            valuePrefix="$"
            height={220}
          />
        </ChartCard>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="xs" onClick={() => router.push("/finsight/accounting")}>
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-navy/4">
                {[
                  { desc: "Client Payment - Acme Corp", amount: "+$15,000", date: "Today", type: "income" },
                  { desc: "SaaS Subscription - Slack", amount: "-$1,200", date: "Today", type: "expense" },
                  { desc: "Client Payment - Beta LLC", amount: "+$8,500", date: "Yesterday", type: "income" },
                  { desc: "Office Rent", amount: "-$4,500", date: "Yesterday", type: "expense" },
                  { desc: "Consulting Fee - Delta Inc", amount: "+$22,000", date: "Jun 28", type: "income" },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-3.5 hover:bg-navy/1.5 cursor-pointer transition-colors duration-200" onClick={() => router.push("/finsight/accounting")}>
                    <div>
                      <p className="text-[13px] font-medium text-navy">{tx.desc}</p>
                      <p className="text-[11px] text-navy/35 mt-0.5">{tx.date}</p>
                    </div>
                    <span className={`text-[13px] font-semibold ${tx.type === "income" ? "text-navy" : "text-red-500"}`}>
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Approvals</CardTitle>
              <Button variant="ghost" size="xs" onClick={() => router.push("/finsight/approvals")}>
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-gold" />
                  </div>
                  <p className="text-[13px] text-navy/45 font-medium">All caught up! No pending approvals.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-navy/5 rounded-xl hover:border-navy/10 hover:bg-navy/1 transition-all duration-200">
                      <div>
                        <p className="text-[13px] font-medium text-navy">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="info" size="sm">{item.type}</Badge>
                          <span className="text-[12px] text-navy/45 font-medium">{item.amount}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="gold" size="xs" onClick={() => handleApprove(item.id)}>Approve</Button>
                        <Button variant="ghost" size="xs" onClick={() => handleReject(item.id)}>Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-gold/60 via-gold-light/40 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
              </div>
              <CardTitle>AI Insights</CardTitle>
            </div>
            <Button variant="ghost" size="xs" onClick={() => router.push("/finsight/ai-intelligence")}>
              View All <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Unusual Expense Detected", message: "Marketing spend is 34% above 3-month average. Review recommended.", severity: "warning" },
                { title: "Cash Flow Forecast", message: "Projected cash position dips to $180K in 2 weeks. Consider delaying non-essential payments.", severity: "warning" },
                { title: "Month-End Ready", message: "All reconciliations complete. 98% of transactions categorized automatically.", severity: "success" },
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-3.5 p-4 rounded-xl bg-navy/1.5 border border-navy/4 cursor-pointer hover:bg-navy/2.5 hover:border-navy/[0.07] transition-all duration-200" onClick={() => router.push("/finsight/ai-intelligence")}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${insight.severity === "warning" ? "bg-amber-50" : "bg-navy/5"}`}>
                    <AlertTriangle className={`w-4 h-4 ${insight.severity === "warning" ? "text-amber-500" : "text-gold"}`} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-navy">{insight.title}</p>
                    <p className="text-[12px] text-navy/45 mt-0.5 leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
