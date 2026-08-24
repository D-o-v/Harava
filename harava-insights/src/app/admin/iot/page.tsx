"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Cpu, Wifi, WifiOff, Smartphone, RefreshCw, Trash2 } from "lucide-react";
import { notificationsApi } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";

export default function IoTPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const devices = useApi(() => notificationsApi.listDevices(), []);
  const unregister = useMutation((id: string) => notificationsApi.unregisterDevice(id));
  const deviceList = devices.data ?? [];

  const filtered = filter === "all" ? deviceList : deviceList.filter((device) => device.platform.toLowerCase() === filter);

  const onlineCount = deviceList.length;
  const webCount = deviceList.filter((device) => device.platform.toUpperCase() === "WEB").length;
  const mobileCount = deviceList.filter((device) => ["IOS", "ANDROID"].includes(device.platform.toUpperCase())).length;

  if (devices.loading) return <><DashboardHeader title="IoT & Device Management" subtitle="Manage registered notification devices and delivery channels" /><PageLoader message="Loading registered devices…" /></>;
  if (devices.error) return <><DashboardHeader title="IoT & Device Management" subtitle="Manage registered notification devices and delivery channels" /><PageError message={devices.error} onRetry={devices.refetch} /></>;

  return (
    <div>
      <DashboardHeader title="IoT & Device Management" subtitle="Manage registered notification devices and delivery channels" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 dark:text-white/45 uppercase tracking-wider">Total Devices</p>
            <p className="text-2xl font-bold text-navy dark:text-white mt-1">{deviceList.length}</p>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-[11px] font-medium text-navy/45 dark:text-white/45 uppercase tracking-wider">Online</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{onlineCount}</p>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-navy/30" />
              <p className="text-[11px] font-medium text-navy/45 dark:text-white/45 uppercase tracking-wider">Web</p>
            </div>
            <p className="text-2xl font-bold text-navy dark:text-white mt-1">{webCount}</p>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <p className="text-[11px] font-medium text-navy/45 dark:text-white/45 uppercase tracking-wider">Mobile</p>
            </div>
            <p className="text-2xl font-bold text-navy dark:text-white mt-1">{mobileCount}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 dark:text-white/45 uppercase tracking-wider">Supported Channels</p>
            <p className="text-2xl font-bold text-navy dark:text-white mt-1">3</p>
          </div>
        </div>

        <Card><CardContent className="p-5"><div className="flex items-start gap-3"><Smartphone className="w-5 h-5 text-gold mt-0.5" /><div><p className="text-sm font-semibold text-navy dark:text-white">Notification device registry</p><p className="text-xs text-navy/50 dark:text-white/50 mt-1">This platform surface manages registered WEB, IOS, and ANDROID delivery tokens. Tenant audit and business activity remain inside tenant view.</p></div></div></CardContent></Card>

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-navy/8 dark:border-white/10 rounded-xl p-1">
            {["all", ...Array.from(new Set(deviceList.map((device) => device.platform.toLowerCase())))].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg capitalize transition-colors ${filter === f ? "bg-navy dark:bg-white text-white dark:text-navy" : "text-navy/50 dark:text-white/50 hover:text-navy dark:hover:text-white"}`}>
                {f} ({f === "all" ? deviceList.length : deviceList.filter((device) => device.platform.toLowerCase() === f).length})
              </button>
            ))}
          </div>
          <Button variant="outline" onClick={() => devices.refetch()}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh All
          </Button>
        </div>

        {/* Device Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((device) => (
            <Card key={device.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10">
                      <Cpu className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-navy dark:text-white">{device.label || "Registered device"}</p>
                      <p className="text-[10px] text-navy/40 dark:text-white/40">{device.id}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    active
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-navy/45 dark:text-white/45 inline-flex items-center gap-1"><Wifi className="w-3 h-3" />Push delivery enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-navy/45 dark:text-white/45">Platform:</span>
                    <span className="font-medium text-navy dark:text-white">{device.platform}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-navy/45 dark:text-white/45">Last seen:</span>
                    <span className="text-navy/60 dark:text-white/60">{device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : "Not reported"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-navy/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[10px] text-navy/40 dark:text-white/40"><Wifi className="w-3 h-3" /> registered token</span>
                  </div>
                  <Button variant="ghost" size="xs" onClick={async () => { await unregister.mutate(device.id); toast("Device unregistered.", "success"); devices.refetch(); }} disabled={unregister.loading} title="Unregister device">
                    <Trash2 className="w-3 h-3" />
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
