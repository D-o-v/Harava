"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { FileText, Download, Eye, Search } from "lucide-react";

export default function TemplatesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const templates = [
    { id: 1, title: "Financial Analysis Worksheet", category: "Finance", format: "XLSX", downloads: 1240 },
    { id: 2, title: "Cash Flow Projection Template", category: "Finance", format: "XLSX", downloads: 890 },
    { id: 3, title: "Business Plan Framework", category: "Strategy", format: "DOCX", downloads: 2100 },
    { id: 4, title: "Tax Filing Checklist", category: "Tax", format: "PDF", downloads: 654 },
    { id: 5, title: "Audit Report Template", category: "Compliance", format: "DOCX", downloads: 445 },
    { id: 6, title: "Budget Planning Spreadsheet", category: "Finance", format: "XLSX", downloads: 1560 },
    { id: 7, title: "Client Engagement Letter", category: "Advisory", format: "DOCX", downloads: 389 },
    { id: 8, title: "Risk Assessment Matrix", category: "Compliance", format: "XLSX", downloads: 276 },
  ];

  const filtered = templates.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <DashboardHeader title="Templates & Resources" subtitle="Download professional templates for your work" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 w-80">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-sm outline-none flex-1" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((t) => (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-navy" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{t.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default">{t.category}</Badge>
                  <span className="text-xs text-gray-400">{t.format}</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">{t.downloads.toLocaleString()} downloads</p>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1" onClick={() => toast(`Downloading "${t.title}"...`, "success")}>
                    <Download className="w-3 h-3" /> Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast("Preview opening...", "info")}>
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
