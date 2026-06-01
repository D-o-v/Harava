"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { BarChart3, FileText, PieChart, Download, Eye } from "lucide-react";

export default function ReportsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reports = [
    { title: "Income Statement", desc: "Revenue, expenses, and net income", icon: BarChart3, period: "May 2026" },
    { title: "Balance Sheet", desc: "Assets, liabilities, and equity", icon: FileText, period: "May 31, 2026" },
    { title: "Cash Flow Statement", desc: "Operating, investing, financing cash flows", icon: PieChart, period: "May 2026" },
    { title: "Budget vs Actual", desc: "Variance analysis", icon: BarChart3, period: "May 2026" },
    { title: "Department P&L", desc: "Profit and loss by department", icon: PieChart, period: "May 2026" },
    { title: "KPI Dashboard", desc: "Key performance indicators", icon: BarChart3, period: "Real-time" },
  ];

  return (
    <div>
      <DashboardHeader title="Financial Reports" subtitle="Generate and view financial statements" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, i) => {
            const Icon = report.icon;
            return (
              <Card key={i} className={`cursor-pointer hover:shadow-md transition-shadow ${selectedReport === report.title ? "ring-2 ring-emerald-500" : ""}`} onClick={() => setSelectedReport(report.title)}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{report.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{report.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{report.period}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); toast(`Generating ${report.title}...`, "success"); }}>
                      <Eye className="w-3 h-3" /> View
                    </Button>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); toast(`Downloading ${report.title} as PDF...`, "info"); }}>
                      <Download className="w-3 h-3" /> Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedReport && (
          <Card>
            <CardHeader><CardTitle>{selectedReport} Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Report preview for <strong>{selectedReport}</strong></p>
                <p className="text-xs text-gray-400 mt-1">Full report will render with live data from your accounting system</p>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="primary" size="sm" onClick={() => toast("Opening full report view...", "success")}>Open Full Report</Button>
                  <Button variant="outline" size="sm" onClick={() => toast("Scheduling report delivery...", "info")}>Schedule</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
