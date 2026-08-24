"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Search, Download, Loader2, RefreshCw } from "lucide-react";
import { accountApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";
import { useTenantAdmin } from "@/lib/tenant-admin-context";

export default function AuditLogPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const { activeTenantId, isReady } = useTenantAdmin();
  const canLoadAudit = isReady && !!activeTenantId;

  const audit = useApi(() => accountApi.audit({ page, size: 20 }), [page, canLoadAudit], { skip: !canLoadAudit });

  const events = audit.data?.content ?? [];
  const total = audit.data?.totalElements ?? 0;
  const totalPages = audit.data?.totalPages ?? 1;

  const filtered = events.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return JSON.stringify(e).toLowerCase().includes(s);
  }) as Array<Record<string, unknown>>;

  if (!canLoadAudit || audit.loading) return <><DashboardHeader title="Audit Log" subtitle="Complete activity trail for compliance and security" /><PageLoader message="Opening tenant audit log…" /></>;
  if (audit.error) return <><DashboardHeader title="Audit Log" subtitle="Complete activity trail for compliance and security" /><PageError message={audit.error} onRetry={audit.refetch} /></>;

  return (
    <div>
      <DashboardHeader title="Audit Log" subtitle="Complete activity trail for compliance and security" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Events</p>
            <p className="text-2xl font-bold text-navy mt-1">{total}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">This Page</p>
            <p className="text-2xl font-bold text-navy mt-1">{events.length}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Pages</p>
            <p className="text-2xl font-bold text-navy mt-1">{totalPages}</p>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border border-navy/8 rounded-xl px-3.5 py-2.5 w-72">
            <Search className="w-4 h-4 text-navy/30" />
            <input type="text" placeholder="Search events…" value={search} onChange={(e) => setSearch(e.target.value)} className="text-[13px] outline-none flex-1 bg-transparent" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => audit.refetch()} disabled={audit.loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${audit.loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" onClick={() => toast("Exporting audit log…", "info")}>
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-navy/[0.02] border-b border-navy/6">
                    <tr>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Time</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Event</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Actor</th>
                      <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Outcome</th>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/4">
                    {filtered.map((e, i) => (
                      <tr key={String(e.id ?? i)} className="hover:bg-navy/[0.015] transition-colors">
                        <td className="px-5 py-3 text-[11px] text-navy/50 font-mono whitespace-nowrap">
                          {e.occurredAt ? new Date(String(e.occurredAt)).toLocaleString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-[12px] font-semibold text-navy">{String(e.eventType ?? "—")}</td>
                        <td className="px-4 py-3 text-[12px] text-navy/70">{String(e.actorEmail ?? e.actorUserId ?? "—")}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={String(e.outcome) === "SUCCESS" ? "success" : "error"} size="sm">
                            {String(e.outcome ?? "—")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-navy/40 font-mono">{String(e.ipAddress ?? "—")}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-12 text-[13px] text-navy/30">No events found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>← Prev</Button>
            <span className="text-[12px] text-navy/50">Page {page + 1} of {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next →</Button>
          </div>
        )}
      </div>
    </div>
  );
}
