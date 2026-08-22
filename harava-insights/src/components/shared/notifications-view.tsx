"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Bell, CheckCheck, Trash2, Loader2, RefreshCw } from "lucide-react";
import { notificationsApi, type Notification } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { PageLoader } from "@/components/ui/page-loader";

const TYPE_VARIANT: Record<string, "warning" | "success" | "error" | "info" | "default"> = {
  warning: "warning",
  success: "success",
  error: "error",
  info: "info",
};

export function NotificationsView() {
  const { toast } = useToast();

  const feed = useApi(
    () => notificationsApi.list({ page: 0, size: 50 }),
    [],
    { pollMs: 60_000 },
  );
  const unreadCount = useApi(() => notificationsApi.unreadCount(), [], { pollMs: 30_000 });

  const markReadMut = useMutation((id: string) => notificationsApi.markRead(id));
  const markAllMut = useMutation(() => notificationsApi.markAllRead());

  const notifications: Notification[] = feed.data?.content ?? [];

  const handleMarkRead = async (n: Notification) => {
    if (n.read) return;
    try {
      await markReadMut.mutate(n.id);
      feed.refetch();
      unreadCount.refetch();
    } catch {
      // silent
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllMut.mutate();
      toast("All notifications marked as read", "success");
      feed.refetch();
      unreadCount.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  const count = unreadCount.data?.count ?? notifications.filter((n) => !n.read).length;

  if (feed.loading) return <><DashboardHeader title="Notifications" subtitle="Stay updated on activity across your products" /><PageLoader message="Loading notifications…" /></>;

  return (
    <div>
      <DashboardHeader title="Notifications" subtitle="Stay updated on activity across your products" />
      <div className="p-4 sm:p-6 w-full max-w-full space-y-4">

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-navy/50 font-medium">
            {count > 0 ? <><span className="text-navy font-bold">{count}</span> unread</> : "All caught up"}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { feed.refetch(); unreadCount.refetch(); }} disabled={feed.loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${feed.loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleMarkAll} disabled={count === 0 || markAllMut.loading}>
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </Button>
          </div>
        </div>

        {/* Error */}
        {feed.error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{feed.error}</div>
        )}

        {/* Empty */}
        {!feed.error && notifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6 text-navy/20" />
              </div>
              <p className="text-[13px] text-navy/40 font-medium">No notifications yet</p>
            </CardContent>
          </Card>
        )}

        {/* List */}
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={`transition-all duration-200 cursor-pointer hover:shadow-sm ${!n.read ? "border-l-[3px] border-l-gold" : ""}`}
            onClick={() => handleMarkRead(n)}
          >
            <CardContent className="p-4 flex items-start gap-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${!n.read ? "bg-gold/10" : "bg-navy/5"}`}>
                <Bell className={`w-4 h-4 ${!n.read ? "text-gold-dark" : "text-navy/30"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <p className={`text-[13px] ${!n.read ? "font-semibold text-navy" : "font-medium text-navy/70"}`}>
                    {n.title}
                  </p>
                  {n.category && (
                    <Badge variant={TYPE_VARIANT[n.category] ?? "default"} size="sm">
                      {n.category}
                    </Badge>
                  )}
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  )}
                </div>
                {n.body && (
                  <p className="text-[12px] text-navy/50 leading-relaxed">{n.body}</p>
                )}
                <p className="text-[11px] text-navy/30 mt-1.5">
                  {new Date(n.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {n.url && (
                <a
                  href={n.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] text-gold-dark font-medium hover:text-gold shrink-0"
                >
                  View →
                </a>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Pagination hint */}
        {feed.data && feed.data.totalElements > 50 && (
          <p className="text-center text-[11px] text-navy/30">
            Showing 50 of {feed.data.totalElements} notifications
          </p>
        )}
      </div>
    </div>
  );
}
