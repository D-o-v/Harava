"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { CheckCircle, RefreshCw, AlertTriangle } from "lucide-react";

interface Account {
  id: number;
  name: string;
  bookBalance: string;
  bankBalance: string;
  difference: string;
  status: "matched" | "unmatched" | "in-progress";
  lastReconciled: string;
}

export default function ReconciliationPage() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: "Operating Account (Chase)", bookBalance: "$245,892", bankBalance: "$245,892", difference: "$0", status: "matched", lastReconciled: "Jun 1, 2026" },
    { id: 2, name: "Payroll Account (BOA)", bookBalance: "$82,450", bankBalance: "$82,450", difference: "$0", status: "matched", lastReconciled: "May 31, 2026" },
    { id: 3, name: "Savings Account (Chase)", bookBalance: "$150,000", bankBalance: "$150,000", difference: "$0", status: "matched", lastReconciled: "May 30, 2026" },
    { id: 4, name: "Credit Card (Amex)", bookBalance: "$12,340", bankBalance: "$13,540", difference: "$1,200", status: "unmatched", lastReconciled: "May 28, 2026" },
    { id: 5, name: "Petty Cash", bookBalance: "$2,100", bankBalance: "$1,850", difference: "$250", status: "in-progress", lastReconciled: "May 25, 2026" },
  ]);

  const handleReconcile = (id: number) => {
    setAccounts((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: "matched" as const, difference: "$0", lastReconciled: "Jun 1, 2026" } : a)
    );
    toast("Account reconciled successfully!", "success");
  };

  const handleAutoReconcile = () => {
    toast("Running AI auto-reconciliation...", "info");
    setTimeout(() => {
      setAccounts((prev) => prev.map((a) => ({ ...a, status: "matched" as const, difference: "$0", lastReconciled: "Jun 1, 2026" })));
      toast("All accounts reconciled!", "success");
    }, 1500);
  };

  return (
    <div>
      <DashboardHeader title="Reconciliation" subtitle="Bank reconciliation and account matching" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{accounts.filter(a => a.status === "matched").length}</p>
              <p className="text-xs text-gray-500">Matched</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{accounts.filter(a => a.status === "in-progress").length}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{accounts.filter(a => a.status === "unmatched").length}</p>
              <p className="text-xs text-gray-500">Unmatched</p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={handleAutoReconcile}>
            <RefreshCw className="w-4 h-4" /> Auto-Reconcile All
          </Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Account Reconciliation</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Account</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Book Balance</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Bank Balance</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Difference</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Last Reconciled</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{account.name}</td>
                    <td className="px-6 py-3 text-right text-gray-700">{account.bookBalance}</td>
                    <td className="px-6 py-3 text-right text-gray-700">{account.bankBalance}</td>
                    <td className={`px-6 py-3 text-right font-medium ${account.difference === "$0" ? "text-emerald-600" : "text-red-600"}`}>{account.difference}</td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={account.status === "matched" ? "success" : account.status === "unmatched" ? "error" : "warning"}>{account.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{account.lastReconciled}</td>
                    <td className="px-6 py-3 text-right">
                      {account.status !== "matched" && (
                        <Button variant="primary" size="sm" onClick={() => handleReconcile(account.id)}>Reconcile</Button>
                      )}
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
