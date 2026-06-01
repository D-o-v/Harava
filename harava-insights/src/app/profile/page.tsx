import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Camera } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Profile" subtitle="Manage your account and preferences" />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-bold">JJ</div>
              <div>
                <p className="font-medium text-gray-900">Jay Jelenke</p>
                <p className="text-sm text-gray-500">jay@harava.com</p>
                <Button variant="ghost" size="sm" className="mt-1"><Camera className="w-3 h-3" /> Change Photo</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">First Name</label>
                <input type="text" defaultValue="Jay" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
                <input type="text" defaultValue="Jelenke" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input type="email" defaultValue="jay@harava.com" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
                <input type="tel" defaultValue="+234 800 000 0000" className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Products & Access</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="success">FinSight AI</Badge>
              <Badge variant="info">AccrediAI</Badge>
              <Badge variant="info">ProEd AI</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">Contact your administrator to change product access.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Security</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-900">Password</p><p className="text-xs text-gray-500">Last changed 30 days ago</p></div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-900">Two-Factor Authentication</p><p className="text-xs text-gray-500">Add extra security to your account</p></div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary"><Save className="w-4 h-4" /> Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
