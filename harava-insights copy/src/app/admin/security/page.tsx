"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Shield, AlertTriangle, Lock, Eye, CheckCircle } from "lucide-react";

export default function SecurityPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState([
    { id: 1, type: "Failed Login", details: "5 attempts from IP 192.168.1.45", severity: "high", time: "10 min ago", resolved: false },
    { id: 2, type: "Suspicious Activity", details: "Bulk data export by user#234", severity: "medium", time: "1 hr ago", resolved: false },
    { id: 3, type: "Password Reset", details: "admin@harava.com triggered reset", severity: "low", time: "3 hrs ago", resolved: true },
    { id: 4, type: "New Device Login", details: "corporate@demo.com from new location", severity: "medium", time: "5 hrs ago", resolved: true },
  ]);

  const handleResolve = (id: number) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, resolved: true } : e));
    toast("Event marked as resolved.", "success");
  };

  return (
    <div>
      <DashboardHeader title="Security Center" subtitle="Monitor and respond to security events" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Shield className="w-8 h-8 text-gold" /><div><p className="text-xl font-bold">Strong</p><p className="text-xs text-gray-500">Security Posture</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-amber-500" /><div><p className="text-xl font-bold">{events.filter(e => !e.resolved).length}</p><p className="text-xs text-gray-500">Active Alerts</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Lock className="w-8 h-8 text-violet-500" /><div><p className="text-xl font-bold">AES-256</p><p className="text-xs text-gray-500">Encryption</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Eye className="w-8 h-8 text-navy" /><div><p className="text-xl font-bold">24/7</p><p className="text-xs text-gray-500">Monitoring</p></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Security Events</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {e.resolved ? <CheckCircle className="w-5 h-5 text-gold" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.type}</p>
                    <p className="text-xs text-gray-500">{e.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={e.severity === "high" ? "error" : e.severity === "medium" ? "warning" : "success"}>{e.severity}</Badge>
                  <span className="text-xs text-gray-400">{e.time}</span>
                  {!e.resolved && <Button variant="outline" size="sm" onClick={() => handleResolve(e.id)}>Resolve</Button>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
