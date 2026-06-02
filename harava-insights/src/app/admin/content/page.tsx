"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { FileText, Eye, Edit, Trash2, Plus, Search } from "lucide-react";

export default function ContentPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [content, setContent] = useState([
    { id: 1, title: "Getting Started with FinSight", type: "Guide", product: "FinSight", status: "published", views: 1240 },
    { id: 2, title: "AccrediAI Best Practices", type: "Article", product: "AccrediAI", status: "published", views: 890 },
    { id: 3, title: "ProEd Course Creation Guide", type: "Documentation", product: "ProEd", status: "draft", views: 0 },
    { id: 4, title: "Platform Security Overview", type: "Policy", product: "Platform", status: "published", views: 456 },
    { id: 5, title: "API Integration Guide", type: "Documentation", product: "Platform", status: "review", views: 234 },
  ]);

  const handlePublish = (id: number) => {
    setContent((prev) => prev.map((c) => c.id === id ? { ...c, status: "published" } : c));
    toast("Content published!", "success");
  };

  const handleDelete = (id: number) => {
    setContent((prev) => prev.filter((c) => c.id !== id));
    toast("Content deleted.", "success");
  };

  return (
    <div>
      <DashboardHeader title="Content Management" subtitle="Manage platform content and documentation" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 w-80">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search content..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-sm outline-none flex-1" />
          </div>
          <Button variant="primary" onClick={() => toast("Opening content editor...", "info")}><Plus className="w-3 h-3" /> New Content</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Title</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Type</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Product</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Views</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {content.filter((c) => c.title.toLowerCase().includes(search.toLowerCase())).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2"><FileText className="w-4 h-4 text-navy" />{c.title}</td>
                    <td className="px-6 py-3 text-center"><Badge variant="default">{c.type}</Badge></td>
                    <td className="px-6 py-3 text-center text-gray-500">{c.product}</td>
                    <td className="px-6 py-3 text-center"><Badge variant={c.status === "published" ? "success" : c.status === "draft" ? "default" : "warning"}>{c.status}</Badge></td>
                    <td className="px-6 py-3 text-center text-gray-500">{c.views.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right space-x-1">
                      {c.status !== "published" && <Button variant="outline" size="sm" onClick={() => handlePublish(c.id)}>Publish</Button>}
                      <Button variant="ghost" size="sm" onClick={() => toast("Opening editor...", "info")}><Edit className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}><Trash2 className="w-3 h-3 text-red-500" /></Button>
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
