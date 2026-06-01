"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { CreditCard, DollarSign, Users, Download } from "lucide-react";

export default function BillingPage() {
  const { toast } = useToast();

  const subscriptions = [
    { id: 1, plan: "Enterprise", client: "TechCorp Ltd", amount: "$2,499/mo", users: 50, status: "active", renewal: "Jul 1, 2026" },
    { id: 2, plan: "Professional", client: "FinServ Global", amount: "$999/mo", users: 20, status: "active", renewal: "Jun 15, 2026" },
    { id: 3, plan: "Starter", client: "SmallBiz Inc", amount: "$299/mo", users: 5, status: "active", renewal: "Jul 10, 2026" },
    { id: 4, plan: "Professional", client: "ConsultCo", amount: "$999/mo", users: 15, status: "past_due", renewal: "May 28, 2026" },
  ];

  return (
    <div>
      <DashboardHeader title="Billing & Subscriptions" subtitle="Manage plans, invoices, and payments" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><DollarSign className="w-8 h-8 text-emerald-500" /><div><p className="text-xl font-bold">$4,796</p><p className="text-xs text-gray-500">Monthly Revenue</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><CreditCard className="w-8 h-8 text-violet-500" /><div><p className="text-xl font-bold">4</p><p className="text-xs text-gray-500">Active Subscriptions</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-8 h-8 text-blue-500" /><div><p className="text-xl font-bold">90</p><p className="text-xs text-gray-500">Licensed Users</p></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Subscriptions</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toast("Exporting billing data...", "success")}><Download className="w-3 h-3" /> Export</Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Client</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Plan</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Amount</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Users</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Renewal</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscriptions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{s.client}</td>
                    <td className="px-6 py-3 text-center"><Badge variant="default">{s.plan}</Badge></td>
                    <td className="px-6 py-3 text-center text-gray-700">{s.amount}</td>
                    <td className="px-6 py-3 text-center text-gray-500">{s.users}</td>
                    <td className="px-6 py-3 text-center"><Badge variant={s.status === "active" ? "success" : "error"}>{s.status}</Badge></td>
                    <td className="px-6 py-3 text-center text-gray-500">{s.renewal}</td>
                    <td className="px-6 py-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => toast("Opening subscription details...", "info")}>Manage</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
