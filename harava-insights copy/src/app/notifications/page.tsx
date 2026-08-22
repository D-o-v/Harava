import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    { id: 1, title: "New AI Insight Available", message: "FinSight detected unusual spending pattern in Q2 expenses.", time: "5 min ago", read: false, type: "ai" },
    { id: 2, title: "Approval Required", message: "Invoice #4521 from ABC Corp requires your approval.", time: "30 min ago", read: false, type: "action" },
    { id: 3, title: "Course Completed", message: 'You completed "Financial Statement Analysis" with a score of 92%.', time: "2 hours ago", read: false, type: "success" },
    { id: 4, title: "Compliance Deadline", message: "CARF mid-cycle review due in 14 days.", time: "Yesterday", read: true, type: "warning" },
    { id: 5, title: "System Update", message: "Platform maintenance scheduled for Sunday 2am-4am UTC.", time: "2 days ago", read: true, type: "info" },
    { id: 6, title: "New Team Member", message: "Lisa Chen joined your organization on ProEd AI.", time: "3 days ago", read: true, type: "info" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Notifications" subtitle="Stay updated on activity across your products" />

      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{notifications.filter(n => !n.read).length} unread</p>
          <Button variant="ghost" size="sm"><Check className="w-4 h-4" /> Mark all read</Button>
        </div>

        {notifications.map((n) => (
          <Card key={n.id} className={!n.read ? "border-l-4 border-l-blue-500" : ""}>
            <CardContent className="p-4 flex items-start gap-3">
              <Bell className={`w-5 h-5 mt-0.5 shrink-0 ${!n.read ? "text-blue-500" : "text-gray-400"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${!n.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>{n.title}</p>
                  <Badge variant={n.type === "warning" ? "warning" : n.type === "success" ? "success" : n.type === "action" ? "error" : "info"}>
                    {n.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-gray-400" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
