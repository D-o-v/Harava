"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Bell, Check, Trash2, CheckCheck } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "ai" | "action" | "success" | "warning" | "info";
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "New AI Insight Available", message: "FinSight detected unusual spending pattern in Q2 expenses.", time: "5 min ago", read: false, type: "ai" },
  { id: 2, title: "Approval Required", message: "Invoice #4521 from ABC Corp requires your approval.", time: "30 min ago", read: false, type: "action" },
  { id: 3, title: "Course Completed", message: "You completed 'Financial Statement Analysis' with a score of 92%.", time: "2 hours ago", read: false, type: "success" },
  { id: 4, title: "Compliance Deadline", message: "CARF mid-cycle review due in 14 days.", time: "Yesterday", read: true, type: "warning" },
  { id: 5, title: "System Update", message: "Platform maintenance scheduled for Sunday 2am-4am UTC.", time: "2 days ago", read: true, type: "info" },
  { id: 6, title: "New Team Member", message: "Lisa Chen joined your organization on ProEd AI.", time: "3 days ago", read: true, type: "info" },
];

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const { toast } = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast("All notifications marked as read", "success");
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast("Notification dismissed", "info");
  };

  return (
    <div>
      <DashboardHeader title="Notifications" subtitle="Stay updated on activity across your products" />
      <div className="p-4 sm:p-6 w-full max-w-full lg:max-w-5xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-sm text-gray-500">{unreadCount} unread</p>
          <Button variant="ghost" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No notifications</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((n) => (
            <Card key={n.id} className={!n.read ? "border-l-4 border-l-blue-500" : ""}>
              <CardContent className="p-4 flex items-start gap-3">
                <Bell className={`w-5 h-5 mt-0.5 shrink-0 ${!n.read ? "text-blue-500" : "text-gray-400"}`} />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => markRead(n.id)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-sm ${!n.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>{n.title}</p>
                    <Badge variant={n.type === "warning" ? "warning" : n.type === "success" ? "success" : n.type === "action" ? "error" : "info"}>
                      {n.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 wrap-break-word">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteNotification(n.id)}>
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
