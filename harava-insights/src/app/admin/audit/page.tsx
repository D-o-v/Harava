"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { ClipboardList, Search, Download, Filter, User, Clock, Shield, Settings, Key, FileText, Globe } from "lucide-react";

export default function AuditLogPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const auditLogs = [
    { id: 1, timestamp: "2026-06-12 14:32:05", user: "jay@harava.com", action: "Role Created", details: "Created role 'Compliance Officer' with 12 permissions", category: "access", ip: "192.168.1.45", severity: "info" },
    { id: 2, timestamp: "2026-06-12 14:28:11", user: "admin@harava.com", action: "User Suspended", details: "Suspended user john@example.com - Reason: Policy violation", category: "users", ip: "192.168.1.12", severity: "warning" },
    { id: 3, timestamp: "2026-06-12 13:55:00", user: "system", action: "Payroll Processed", details: "Batch #847 - 248 employees - Total: $986,400", category: "payroll", ip: "10.0.0.1", severity: "info" },
    { id: 4, timestamp: "2026-06-12 13:42:33", user: "admin@harava.com", action: "Client Onboarded", details: "New client: Sigma Education Inc - Enterprise plan", category: "clients", ip: "192.168.1.12", severity: "info" },
    { id: 5, timestamp: "2026-06-12 12:15:20", user: "unknown@test.com", action: "Login Failed (3x)", details: "3 consecutive failed login attempts - IP blocked", category: "security", ip: "45.33.32.156", severity: "critical" },
    { id: 6, timestamp: "2026-06-12 11:30:00", user: "system", action: "Report Generated", details: "Monthly revenue report - All modules - PDF exported", category: "reports", ip: "10.0.0.1", severity: "info" },
    { id: 7, timestamp: "2026-06-12 10:45:18", user: "jay@harava.com", action: "Settings Changed", details: "Updated session timeout from 30min to 45min", category: "settings", ip: "192.168.1.45", severity: "warning" },
    { id: 8, timestamp: "2026-06-12 10:20:05", user: "admin@harava.com", action: "Permission Granted", details: "Granted 'payroll.process' to role 'Manager'", category: "access", ip: "192.168.1.12", severity: "info" },
    { id: 9, timestamp: "2026-06-12 09:50:42", user: "system", action: "Backup Completed", details: "Full database backup - 4.2GB - Stored to S3", category: "system", ip: "10.0.0.1", severity: "info" },
    { id: 10, timestamp: "2026-06-12 09:12:30", user: "admin@harava.com", action: "Bulk Import", details: "Imported 45 users from CSV - All assigned 'learner' role", category: "users", ip: "192.168.1.12", severity: "info" },
    { id: 11, timestamp: "2026-06-12 08:30:00", user: "system", action: "IoT Alert", details: "Device SH-007 (Backup Generator) went offline", category: "system", ip: "10.0.0.1", severity: "warning" },
    { id: 12, timestamp: "2026-06-12 08:00:00", user: "system", action: "SSL Certificate", details: "Certificate renewal scheduled - Expires in 14 days", category: "security", ip: "10.0.0.1", severity: "info" },
    { id: 13, timestamp: "2026-06-11 23:45:00", user: "enterprise@corp.com", action: "Subscription Upgraded", details: "Upgraded from Professional to Enterprise - $28,900/mo", category: "billing", ip: "72.14.123.89", severity: "info" },
    { id: 14, timestamp: "2026-06-11 22:10:15", user: "system", action: "Module Deployment", details: "FinSight AI v2.4.1 deployed - Zero downtime", category: "system", ip: "10.0.0.1", severity: "info" },
    { id: 15, timestamp: "2026-06-11 18:30:00", user: "admin@harava.com", action: "API Key Rotated", details: "Production API key rotated for security compliance", category: "security", ip: "192.168.1.12", severity: "warning" },
  ];

  const categories = ["all", "security", "users", "access", "payroll", "clients", "billing", "system", "settings", "reports"];

  const filtered = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || log.details.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || log.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <DashboardHeader title="Audit Log" subtitle="Complete activity trail for compliance and security auditing" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Events (Today)</p>
            <p className="text-2xl font-bold text-navy mt-1">{auditLogs.filter(l => l.timestamp.includes("2026-06-12")).length}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Critical Events</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{auditLogs.filter(l => l.severity === "critical").length}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Warnings</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{auditLogs.filter(l => l.severity === "warning").length}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Unique Users</p>
            <p className="text-2xl font-bold text-navy mt-1">{new Set(auditLogs.map(l => l.user)).size}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-navy/8 rounded-xl px-3.5 py-2.5 w-72">
              <Search className="w-4 h-4 text-navy/30" />
              <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-[13px] outline-none flex-1 bg-transparent text-navy placeholder:text-navy/30" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-navy/8 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none bg-white dark:bg-white/5 text-navy capitalize"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" onClick={() => toast("Exporting audit log...", "success")}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>

        {/* Log Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-225">
                <thead className="bg-navy/2 border-b border-navy/6">
                  <tr>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Timestamp</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">User</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Action</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Details</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Category</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Severity</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/4">
                  {filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-navy/1.5 transition-colors duration-150">
                      <td className="px-5 py-3 text-[11px] text-navy/50 font-mono whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-4 py-3 text-[12px] font-medium text-navy">{log.user}</td>
                      <td className="px-4 py-3 text-[12px] font-semibold text-navy">{log.action}</td>
                      <td className="px-4 py-3 text-[11px] text-navy/55 max-w-xs truncate">{log.details}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="default" size="sm">{log.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={log.severity === "critical" ? "error" : log.severity === "warning" ? "warning" : "info"} size="sm">
                          {log.severity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-[10px] text-navy/40 font-mono">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
