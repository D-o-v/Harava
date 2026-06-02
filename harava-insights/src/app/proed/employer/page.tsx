"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Building2, Users, TrendingUp, Award, Download } from "lucide-react";

export default function EmployerPage() {
  const { toast } = useToast();

  const teamMembers = [
    { name: "Alice Johnson", role: "Senior Accountant", courses: 6, completed: 4, compliance: true },
    { name: "Bob Williams", role: "Tax Analyst", courses: 4, completed: 3, compliance: true },
    { name: "Carol Davis", role: "Audit Associate", courses: 5, completed: 2, compliance: false },
    { name: "David Lee", role: "Financial Analyst", courses: 3, completed: 3, compliance: true },
  ];

  return (
    <div>
      <DashboardHeader title="Employer Portal" subtitle="Team learning progress and compliance tracking" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-8 h-8 text-violet-500" /><div><p className="text-xl font-bold">12</p><p className="text-xs text-gray-500">Team Members</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><TrendingUp className="w-8 h-8 text-gold" /><div><p className="text-xl font-bold">78%</p><p className="text-xs text-gray-500">Avg Completion</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Award className="w-8 h-8 text-amber-500" /><div><p className="text-xl font-bold">23</p><p className="text-xs text-gray-500">Certificates Earned</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Building2 className="w-8 h-8 text-navy" /><div><p className="text-xl font-bold">75%</p><p className="text-xs text-gray-500">CPD Compliance</p></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Team Progress</CardTitle>
            <Button variant="outline" size="sm" onClick={() => toast("Exporting team report...", "success")}><Download className="w-3 h-3" /> Export Report</Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Member</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Role</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Courses</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Progress</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">CPD Compliance</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teamMembers.map((m, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{m.name}</td>
                    <td className="px-6 py-3 text-gray-600">{m.role}</td>
                    <td className="px-6 py-3 text-center">{m.completed}/{m.courses}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(m.completed / m.courses) * 100}%` }} />
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={m.compliance ? "success" : "error"}>{m.compliance ? "Compliant" : "Overdue"}</Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => toast(`Viewing ${m.name}'s details...`, "info")}>View</Button>
                      {!m.compliance && <Button variant="outline" size="sm" onClick={() => toast(`Reminder sent to ${m.name}`, "success")}>Remind</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
