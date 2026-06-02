"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Calendar, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export default function TaxPage() {
  const { toast } = useToast();
  const [deadlines, setDeadlines] = useState([
    { id: 1, title: "Q2 Estimated Tax Payment", due: "Jun 15, 2026", status: "upcoming" as const },
    { id: 2, title: "Sales Tax Filing - May", due: "Jun 20, 2026", status: "upcoming" as const },
    { id: 3, title: "Payroll Tax Deposit", due: "Jun 15, 2026", status: "upcoming" as const },
    { id: 4, title: "Q1 Estimated Tax Payment", due: "Apr 15, 2026", status: "filed" as const },
    { id: 5, title: "Annual Tax Return", due: "Mar 15, 2026", status: "filed" as const },
  ]);

  const handleFile = (id: number) => {
    setDeadlines((prev) => prev.map((d) => d.id === id ? { ...d, status: "filed" as const } : d));
    toast("Filed successfully!", "success");
  };

  return (
    <div>
      <DashboardHeader title="Tax & Compliance" subtitle="Tax calendar, filings, and compliance monitoring" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{deadlines.filter(d => d.status === "upcoming").length}</p><p className="text-xs text-gray-500">Upcoming Deadlines</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-navy">{deadlines.filter(d => d.status === "filed").length}</p><p className="text-xs text-gray-500">Filed</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-gray-600">$24,800</p><p className="text-xs text-gray-500">Est. Tax Liability (Q2)</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Tax Calendar</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto"><table className="w-full text-sm min-w-150">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Filing</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Due Date</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {deadlines.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{d.title}</td>
                    <td className="px-6 py-3 text-gray-600">{d.due}</td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={d.status === "filed" ? "success" : "warning"}>{d.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {d.status === "upcoming" ? (
                        <Button variant="primary" size="sm" onClick={() => handleFile(d.id)}>File Now</Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => toast("Viewing filed document...", "info")}>View</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>AI Tax Insights</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "R&D Tax Credit Opportunity", message: "Based on your software development expenses, you may qualify for ~$12K in R&D credits.", action: "Review" },
                { title: "Depreciation Optimization", message: "Consider Section 179 deduction for recent equipment purchases totaling $45K.", action: "Calculate" },
                { title: "State Tax Nexus Alert", message: "Remote employees in 3 new states may create nexus. Review filing obligations.", action: "Assess" },
              ].map((insight, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-navy mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{insight.message}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast(`${insight.action} analysis started...`, "info")}>{insight.action}</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
