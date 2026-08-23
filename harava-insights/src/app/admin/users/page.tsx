"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { Search, Plus, UserCog, Trash2, Ban, PlayCircle, Loader2, RefreshCw } from "lucide-react";
import { staffApi, rolesApi, type StaffUser } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { PageLoader, PageError } from "@/components/ui/page-loader";

export default function UsersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<StaffUser | null>(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState("");

  const users = useApi(() => staffApi.list(), []);
  const invitations = useApi(() => staffApi.listInvitations(), []);
  const roles = useApi(() => rolesApi.staff(), []);

  const updateMut = useMutation((id: string, payload: Partial<StaffUser>) => staffApi.update(id, payload));
  const removeMut = useMutation((id: string) => staffApi.remove(id));
  const inviteMut = useMutation((email: string, roleId: string) =>
    staffApi.invite({ email, roleId: roleId || undefined })
  );

  const filtered = (users.data ?? []).filter((u) =>
    !search ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (users.loading) return <><DashboardHeader title="User Management" subtitle="Manage staff users and send invitations" /><PageLoader message="Loading users…" /></>;
  if (users.error) return <><DashboardHeader title="User Management" subtitle="Manage staff users and send invitations" /><PageError message={users.error} onRetry={users.refetch} /></>;

  const handleToggle = async (u: StaffUser) => {
    try {
      await updateMut.mutate(u.id, { enabled: !u.enabled });
      toast(`User ${u.enabled ? "suspended" : "activated"}`, "success");
      users.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  const handleDelete = async (u: StaffUser) => {
    try {
      await removeMut.mutate(u.id);
      toast("User removed", "success");
      users.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await inviteMut.mutate(inviteEmail, inviteRoleId);
      toast("Invitation sent", "success");
      setInviteModal(false);
      setInviteEmail("");
      setInviteRoleId("");
      invitations.refetch();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  return (
    <div>
      <DashboardHeader title="User Management" subtitle="Manage staff users and send invitations" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Staff</p>
            <p className="text-2xl font-bold text-navy mt-1">{users.data?.length ?? "—"}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-bold text-navy mt-1">{users.data?.filter((u) => u.enabled).length ?? "—"}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Suspended</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{users.data?.filter((u) => !u.enabled).length ?? "—"}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Pending Invites</p>
            <p className="text-2xl font-bold text-navy mt-1">{invitations.data?.filter((i) => i.status === "PENDING").length ?? "—"}</p>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border border-navy/8 rounded-xl px-3.5 py-2.5 w-72">
            <Search className="w-4 h-4 text-navy/30" />
            <input type="text" placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} className="text-[13px] outline-none flex-1 bg-transparent" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => users.refetch()} disabled={users.loading}>
              <RefreshCw className={`w-3.5 h-3.5 ${users.loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="primary" onClick={() => setInviteModal(true)}>
              <Plus className="w-3.5 h-3.5" /> Invite User
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-navy/[0.02] border-b border-navy/6">
                    <tr>
                      <th className="text-left px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">User</th>
                      <th className="text-center px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Role</th>
                      <th className="text-center px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Status</th>
                      <th className="text-center px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Last Login</th>
                      <th className="text-right px-6 py-3 text-[11px] font-semibold text-navy/50 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/4">
                    {filtered.map((u) => (
                      <tr key={u.id} className="hover:bg-navy/[0.015] transition-colors">
                        <td className="px-6 py-3.5">
                          <p className="text-[13px] font-medium text-navy">{u.firstName} {u.lastName}</p>
                          <p className="text-[11px] text-navy/40 mt-0.5">{u.email}</p>
                        </td>
                        <td className="px-6 py-3.5 text-center"><Badge variant="default" size="sm">{u.role}</Badge></td>
                        <td className="px-6 py-3.5 text-center">
                          <Badge variant={u.enabled ? "success" : "error"} size="sm">{u.enabled ? "active" : "suspended"}</Badge>
                        </td>
                        <td className="px-6 py-3.5 text-center text-[12px] text-navy/40">
                          {u.lastLoginAt ? new Date(String(u.lastLoginAt)).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setEditUser(u)}><UserCog className="w-3.5 h-3.5 text-navy/50" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleToggle(u)}>
                              {u.enabled ? <Ban className="w-3.5 h-3.5 text-amber-500" /> : <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(u)}><Trash2 className="w-3.5 h-3.5 text-red-400" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-12 text-[13px] text-navy/30">No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
          </CardContent>
        </Card>

        {(invitations.data ?? []).filter((i) => i.status === "PENDING").length > 0 && (
          <Card>
            <CardContent className="p-5">
              <p className="text-[12px] font-semibold text-navy/50 uppercase tracking-wider mb-3">Pending Invitations</p>
              <div className="space-y-2">
                {invitations.data!.filter((i) => i.status === "PENDING").map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 border border-navy/5 rounded-xl">
                    <div>
                      <p className="text-[13px] font-medium text-navy">{inv.email}</p>
                      <p className="text-[11px] text-navy/40 mt-0.5">{inv.role} · {inv.expiresAt ? `Expires ${new Date(inv.expiresAt).toLocaleDateString()}` : "No expiry date"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="xs" onClick={async () => {
                        try { await staffApi.resend(inv.id); toast("Resent", "success"); }
                        catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
                      }}>Resend</Button>
                      <Button variant="ghost" size="xs" onClick={async () => {
                        try { await staffApi.revoke(inv.id); toast("Revoked", "success"); invitations.refetch(); }
                        catch (e) { toast(e instanceof Error ? e.message : "Failed", "error"); }
                      }}>Revoke</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Modal isOpen={inviteModal} onClose={() => setInviteModal(false)} title="Invite Staff Member">
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Email address</label>
            <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="staff@company.com" className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Role</label>
            <select value={inviteRoleId} onChange={(e) => setInviteRoleId(e.target.value)} className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm">
              <option value="">Select role…</option>
              {(roles.data ?? []).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setInviteModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleInvite} disabled={inviteMut.loading || !inviteEmail}>
              {inviteMut.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : "Send Invitation"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        {editUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium text-navy/60 block mb-1.5">First name</label>
                <input value={editUser.firstName ?? ""} onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })} className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Last name</label>
                <input value={editUser.lastName ?? ""} onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })} className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Role</label>
              <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} className="w-full border border-navy/10 rounded-xl px-3 py-2.5 text-sm">
                {(roles.data ?? []).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>
              <Button variant="primary" onClick={async () => {
                try {
                  await updateMut.mutate(editUser.id, { firstName: editUser.firstName, lastName: editUser.lastName, role: editUser.role });
                  toast("User updated", "success");
                  setEditUser(null);
                  users.refetch();
                } catch (e) {
                  toast(e instanceof Error ? e.message : "Failed", "error");
                }
              }} disabled={updateMut.loading}>
                {updateMut.loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save changes"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
