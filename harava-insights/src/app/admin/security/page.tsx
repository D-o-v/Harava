"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Lock, Eye, Loader2, RefreshCw, Search } from "lucide-react";
import { accountApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";

export default function SecurityPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const audit = useApi(() => accountApi.audit({ page, size: 20 }), [page]);

  const events = (audit.data?.content ?? []) as Array<Record<string, unknown>>;
  const total = audit.data?.totalElements ?? 0;
  const totalPages = audit.data?.totalPages ?? 1;

  const filtered = events.filter((e) =>
    !search || JSON.stringify(e).toLowerCase().includes(search.toLowerCase())
  );

  const failedLogins = events.filter((e) => String(e.eventType ?? "").toLowerCase().includes("login") && String(e.outcome ?? "") !== "SUCCESS").length;

  if (audit.loading) return <><DashboardHeader title="Security Center" subtitle="Monitor and respond to security events" /><PageLoader message="Loading security events…" /></>;
  if (audit.error) return <><DashboardHeader title="Security Center" subtitle="Monitor and respond to security events" /><PageError message={audit.error} onRetry={audit.refetch} /></>;

  return (
    <div>
      <DashboardHeader title="Security Center" subtitle="Monitor and respond to security events" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Shield className="w-8 h-8 text-gold" /><div><p className="text-xl font-bold">Strong</p><p className="text-xs text-gray-500">Security Posture</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-amber-500" /><div><p className="text-xl font-bold">{failedLogins}</p><p className="text-xs text-gray-500">Failed Logins</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Lock className="w-8 h-8 text-violet-500" /><div><p className="text-xl font-bold">AES-256</p><p className="text-xs text-gray-500">Encryption</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Eye className="w-8 h-8 text-navy" /><div><p className="text-xl font-bold">{total}</p><p className="text-xs text-gray-500">Audit Events</p></div></CardContent></Card>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border border-navy/8 rounded-xl px-3.5 py-2.5 w-72">
            <Search className="w-4 h-4 text-navy/30" />
            <input type="text" placeholder="Search events…" value={search} onChange={(e) => setSearch(e.target.value)} className="text-[13px] outline-none flex-1 bg-transparent" />
          </div>
          <Button variant="ghost" size="sm" onClick={() => audit.refetch()} disabled={audit.loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${audit.loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Security Events (Audit Log)</CardTitle></CardHeader>
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
                          <Badge variant={String(e.outcome) === "SUCCESS" ? "success" : "error"} size="sm">{String(e.outcome ?? "—")}</Badge>
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
