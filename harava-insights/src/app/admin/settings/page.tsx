"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Settings, Bell, Globe, Database, Mail } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "Harava Insights",
    timezone: "UTC",
    emailNotifications: true,
    maintenanceMode: false,
    twoFactorRequired: true,
    sessionTimeout: "30",
  });

  const handleSave = () => {
    toast("Settings saved successfully!", "success");
  };

  return (
    <div>
      <DashboardHeader title="Platform Settings" subtitle="Configure global platform settings" />
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-4 h-4" /> General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-xs text-gray-500">Platform Name</label><input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} /></div>
            <div><label className="text-xs text-gray-500">Timezone</label><select className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}><option>UTC</option><option>America/New_York</option><option>Europe/London</option><option>Asia/Tokyo</option></select></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })} className="w-4 h-4" />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-4 h-4" /> Security</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer">
              <span className="text-sm text-gray-700">Require 2FA for all users</span>
              <input type="checkbox" checked={settings.twoFactorRequired} onChange={(e) => setSettings({ ...settings, twoFactorRequired: e.target.checked })} className="w-4 h-4" />
            </label>
            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer">
              <span className="text-sm text-gray-700">Maintenance Mode</span>
              <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} className="w-4 h-4" />
            </label>
            <div><label className="text-xs text-gray-500">Session Timeout (minutes)</label><input type="number" className="w-full border rounded-lg px-3 py-2 text-sm mt-1" value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
