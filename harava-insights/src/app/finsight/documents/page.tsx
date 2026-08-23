"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCompanyContext } from "@/lib/company-context";
import { quickbooksApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { FileText, Download, Search, Loader2, RefreshCw } from "lucide-react";

export default function DocumentsPage() {
  const { user } = useAuth();
  const { selectedCompanyId } = useCompanyContext();
  const companyId = selectedCompanyId ?? user?.companyId ?? "";
  const [search, setSearch] = useState("");

  const attachables = useApi(
    () => companyId ? quickbooksApi.list(companyId, "attachables", 0, 100) : Promise.resolve(null),
    [companyId], { skip: !companyId },
  );

  const rows = (attachables.data?.content ?? []) as Record<string, unknown>[];
  const filtered = rows.filter((r) =>
    !search || JSON.stringify(r).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <DashboardHeader title="Document Manager" subtitle="Attachments and documents from QuickBooks" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        {!companyId && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
            No company linked. Connect a QuickBooks company to view documents.
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border border-navy/8 rounded-xl px-3.5 py-2.5 w-72">
            <Search className="w-4 h-4 text-navy/30" />
            <input
              type="text" placeholder="Search documents…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[13px] outline-none flex-1 bg-transparent"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => attachables.refetch()} disabled={attachables.loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${attachables.loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Attachments</CardTitle>
            <Badge variant="default" size="sm">{attachables.data?.totalElements ?? 0} total</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {attachables.loading ? (
              <div className="flex items-center justify-center py-16 text-navy/40 text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading…
              </div>
            ) : attachables.error ? (
              <div className="p-6 text-sm text-red-600 bg-red-50 m-4 rounded-xl">{attachables.error}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-[13px] text-navy/30">
                {companyId ? "No attachments found." : "Connect QuickBooks to view documents."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-navy/[0.02] border-b border-navy/6">
                    <tr>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Name</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Type</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Size</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Created</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/4">
                    {filtered.map((doc, i) => {
                      const meta = doc.MetaData as Record<string, unknown> | undefined;
                      return (
                        <tr key={String(doc.Id ?? i)} className="hover:bg-navy/[0.015] transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-navy/40 shrink-0" />
                              <span className="text-[13px] font-medium text-navy truncate max-w-xs">
                                {String(doc.FileName ?? doc.Name ?? doc.Id ?? "—")}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="default" size="sm">
                              {String(doc.ContentType ?? (doc.FileAccessUri ? "File" : "Link"))}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-navy/60">
                            {doc.Size ? `${Math.round(Number(doc.Size) / 1024)} KB` : "—"}
                          </td>
                          <td className="px-4 py-3 text-[12px] text-navy/60">
                            {meta?.CreateTime
                              ? new Date(String(meta.CreateTime)).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {doc.TempDownloadUri || doc.FileAccessUri ? (
                              <a href={String(doc.TempDownloadUri ?? doc.FileAccessUri)} target="_blank" rel="noreferrer">
                                <Button variant="ghost" size="xs">
                                  <Download className="w-3 h-3" /> Download
                                </Button>
                              </a>
                            ) : (
                              <span className="text-[11px] text-navy/30">No link</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
