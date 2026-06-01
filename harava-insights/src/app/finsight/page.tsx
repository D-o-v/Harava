"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { TrendingUp, DollarSign, Receipt, AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";

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

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/finsight/reports")}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenue (MTD)</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">$124,500</p>
                  <span className="text-xs text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% vs last month</span>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/finsight/accounting")}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Expenses (MTD)</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">$78,200</p>
                  <span className="text-xs text-red-600">+5% vs last month</span>
                </div>
                <Receipt className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/finsight/reconciliation")}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Net Income</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">$46,300</p>
                  <span className="text-xs text-emerald-600">+18% vs last month</span>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/finsight/approvals")}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{pendingApprovals.length}</p>
                  <span className="text-xs text-amber-600">Requires attention</span>
                </div>
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => router.push("/finsight/accounting")}>
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  { desc: "Client Payment - Acme Corp", amount: "+$15,000", date: "Today", type: "income" },
                  { desc: "SaaS Subscription - Slack", amount: "-$1,200", date: "Today", type: "expense" },
                  { desc: "Client Payment - Beta LLC", amount: "+$8,500", date: "Yesterday", type: "income" },
                  { desc: "Office Rent", amount: "-$4,500", date: "Yesterday", type: "expense" },
                  { desc: "Consulting Fee - Delta Inc", amount: "+$22,000", date: "Jun 28", type: "income" },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => router.push("/finsight/accounting")}>
                    <div>
                      <p className="text-sm text-gray-900">{tx.desc}</p>
                      <p className="text-xs text-gray-500">{tx.date}</p>
                    </div>
                    <span className={`text-sm font-medium ${tx.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
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
              <Button variant="ghost" size="sm" onClick={() => router.push("/finsight/approvals")}>
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                  <p className="text-sm">All caught up! No pending approvals.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="info">{item.type}</Badge>
                          <span className="text-sm text-gray-600">{item.amount}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" onClick={() => handleApprove(item.id)}>Approve</Button>
                        <Button variant="outline" size="sm" onClick={() => handleReject(item.id)}>Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI Insights</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push("/finsight/ai-intelligence")}>
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
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={() => router.push("/finsight/ai-intelligence")}>
                  <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${insight.severity === "warning" ? "text-amber-500" : "text-emerald-500"}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{insight.message}</p>
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
