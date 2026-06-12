"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { TrendChart, MetricBarChart, ChartCard } from "@/components/ui/charts";
import { Cpu, Wifi, WifiOff, Thermometer, Zap, Battery, MapPin, RefreshCw, Settings, AlertTriangle, CheckCircle, Signal } from "lucide-react";

export default function IoTPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");

  const devices = [
    { id: "SH-001", name: "Server Room Sensor A", type: "Temperature", location: "Data Center - Floor 1", status: "online", battery: 92, signal: "strong", lastReading: "22.4°C", lastPing: "30s ago" },
    { id: "SH-002", name: "Server Room Sensor B", type: "Humidity", location: "Data Center - Floor 1", status: "online", battery: 87, signal: "strong", lastReading: "45% RH", lastPing: "30s ago" },
    { id: "SH-003", name: "Power Monitor Main", type: "Power", location: "Electrical Room", status: "online", battery: 100, signal: "strong", lastReading: "847 kWh", lastPing: "1 min ago" },
    { id: "SH-004", name: "Office HVAC Controller", type: "HVAC", location: "Main Office - 3rd Floor", status: "online", battery: 78, signal: "good", lastReading: "23.1°C / Auto", lastPing: "2 min ago" },
    { id: "SH-005", name: "Security Camera Hub", type: "Camera", location: "Building Entrance", status: "online", battery: 100, signal: "strong", lastReading: "Recording", lastPing: "Live" },
    { id: "SH-006", name: "Air Quality Monitor", type: "Air Quality", location: "Open Office - 2nd Floor", status: "online", battery: 65, signal: "good", lastReading: "AQI 42 (Good)", lastPing: "5 min ago" },
    { id: "SH-007", name: "Backup Generator Sensor", type: "Power", location: "Basement", status: "offline", battery: 12, signal: "none", lastReading: "Standby", lastPing: "4 hrs ago" },
    { id: "SH-008", name: "Water Leak Detector", type: "Water", location: "Server Room - Floor 1", status: "online", battery: 94, signal: "strong", lastReading: "No leak", lastPing: "10 min ago" },
    { id: "SH-009", name: "Door Access Controller", type: "Access", location: "Main Entrance", status: "online", battery: 100, signal: "strong", lastReading: "Locked", lastPing: "Live" },
    { id: "SH-010", name: "Parking Lot Sensor", type: "Occupancy", location: "Parking B1", status: "warning", battery: 23, signal: "weak", lastReading: "67/120 spots", lastPing: "15 min ago" },
  ];

  const filtered = filter === "all" ? devices : devices.filter(d => d.status === filter);

  const onlineCount = devices.filter(d => d.status === "online").length;
  const offlineCount = devices.filter(d => d.status === "offline").length;
  const warningCount = devices.filter(d => d.status === "warning").length;

  return (
    <div>
      <DashboardHeader title="IoT & Device Management" subtitle="Monitor connected devices, sensors, and infrastructure" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Devices</p>
            <p className="text-2xl font-bold text-navy mt-1">{devices.length}</p>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Online</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{onlineCount}</p>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Offline</p>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-1">{offlineCount}</p>
          </div>
          <div className="stat-card p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Warnings</p>
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-1">{warningCount}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Avg Battery</p>
            <p className="text-2xl font-bold text-navy mt-1">{Math.round(devices.reduce((s, d) => s + d.battery, 0) / devices.length)}%</p>
          </div>
        </div>

        {/* Sensor Data Trends */}
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6">
          <ChartCard title="Temperature Readings" subtitle="Server room (last 24h)">
            <TrendChart
              data={[
                { name: "00:00", temp: 21.8, threshold: 25 },
                { name: "04:00", temp: 21.5, threshold: 25 },
                { name: "08:00", temp: 22.1, threshold: 25 },
                { name: "12:00", temp: 23.2, threshold: 25 },
                { name: "16:00", temp: 23.8, threshold: 25 },
                { name: "20:00", temp: 22.9, threshold: 25 },
                { name: "Now", temp: 22.4, threshold: 25 },
              ]}
              dataKeys={[
                { key: "temp", label: "Temperature (°C)", color: "#182954" },
                { key: "threshold", label: "Max Threshold", color: "#dc2626" },
              ]}
              height={180}
            />
          </ChartCard>
          <ChartCard title="Power Consumption" subtitle="Daily usage (kWh)">
            <MetricBarChart
              data={[
                { name: "Mon", usage: 780 },
                { name: "Tue", usage: 820 },
                { name: "Wed", usage: 795 },
                { name: "Thu", usage: 847 },
                { name: "Fri", usage: 810 },
                { name: "Sat", usage: 420 },
                { name: "Sun", usage: 380 },
              ]}
              dataKeys={[{ key: "usage", label: "kWh Used", color: "#C19B3F" }]}
              height={180}
              showLegend={false}
            />
          </ChartCard>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-navy/8 rounded-xl p-1">
            {["all", "online", "warning", "offline"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`text-[11px] font-medium px-3.5 py-1.5 rounded-lg capitalize transition-colors ${filter === f ? "bg-navy text-white" : "text-navy/50 hover:text-navy"}`}>
                {f} {f === "all" ? `(${devices.length})` : f === "online" ? `(${onlineCount})` : f === "offline" ? `(${offlineCount})` : `(${warningCount})`}
              </button>
            ))}
          </div>
          <Button variant="outline" onClick={() => toast("Refreshing device statuses...", "info")}>
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
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${device.status === "online" ? "bg-emerald-50" : device.status === "warning" ? "bg-amber-50" : "bg-red-50"}`}>
                      <Cpu className={`w-4.5 h-4.5 ${device.status === "online" ? "text-emerald-600" : device.status === "warning" ? "text-amber-600" : "text-red-600"}`} />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-navy">{device.name}</p>
                      <p className="text-[10px] text-navy/40">{device.id}</p>
                    </div>
                  </div>
                  <Badge variant={device.status === "online" ? "success" : device.status === "warning" ? "warning" : "error"} size="sm">
                    {device.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-navy/45 inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{device.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-navy/45">Reading:</span>
                    <span className="font-medium text-navy">{device.lastReading}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-navy/45">Last Ping:</span>
                    <span className="text-navy/60">{device.lastPing}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-navy/5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[10px] text-navy/40">
                      <Battery className="w-3 h-3" /> {device.battery}%
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-navy/40">
                      <Signal className="w-3 h-3" /> {device.signal}
                    </span>
                  </div>
                  <Button variant="ghost" size="xs" onClick={() => toast(`Managing ${device.name}`, "info")}>
                    <Settings className="w-3 h-3" />
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
