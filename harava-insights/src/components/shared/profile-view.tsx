"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, ROLE_LABELS } from "@/lib/auth";
import { useToast } from "@/lib/toast";
import { Save } from "lucide-react";

export function ProfileView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const handleSave = () => {
    toast("Profile updated successfully!", "success");
  };

  if (!user) return null;

  return (
    <div>
      <DashboardHeader title="Profile" subtitle="Manage your account and preferences" />
      <div className="p-4 sm:p-6 w-full max-w-full lg:max-w-5xl space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-navy/10 flex items-center justify-center text-navy text-2xl font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <Badge variant="success" className="mt-1">{ROLE_LABELS[user.role]}</Badge>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input type="email" value={user.email} disabled className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Role</label>
                <input type="text" value={ROLE_LABELS[user.role]} disabled className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Products & Access</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {user.products.map((p) => (
                <Badge key={p} variant="success">
                  {p === "finsight" ? "FinSight AI" : p === "accrediai" ? "AccrediAI" : p === "proed" ? "ProEd AI" : "Admin"}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Security</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-900">Password</p><p className="text-xs text-gray-500">Last changed 30 days ago</p></div>
              <Button variant="outline" size="sm" onClick={() => toast("Password change feature coming soon", "info")}>Change Password</Button>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-900">Two-Factor Authentication</p><p className="text-xs text-gray-500">Add extra security</p></div>
              <Button variant="outline" size="sm" onClick={() => toast("2FA enabled successfully!", "success")}>Enable</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave}><Save className="w-4 h-4" /> Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
