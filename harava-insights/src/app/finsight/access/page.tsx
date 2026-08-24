"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { rolesApi, staffApi, type StaffUser } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useToast } from "@/lib/toast";
import { KeyRound, Pencil, Plus, RefreshCw, UserPlus, Users } from "lucide-react";

export default function AccessPage() {
  const { permissions, can } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const staff = useApi(() => staffApi.list(), []);
  const roles = useApi(() => rolesApi.staff(), []);
  const update = useMutation((id: string, payload: Partial<StaffUser> & { roleId?: string }) => staffApi.update(id, payload));
  const invite = useMutation((inviteEmail: string, selectedRoleId: string) => staffApi.invite({ email: inviteEmail, roleId: selectedRoleId }));

  const save = async () => {
    if (!editing) return;
    try {
      await update.mutate(editing.id, { firstName: editing.firstName, lastName: editing.lastName, roleId: editing.role });
      toast("Staff member updated", "success"); setEditing(null); staff.refetch();
    } catch (error) { toast(error instanceof Error ? error.message : "Could not update staff member", "error"); }
  };

  return <div>
    <DashboardHeader title="Team & Access" subtitle="Manage staff roles and review the permissions granted to your workspace" />
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><KeyRound className="h-4 w-4" /> Your effective permissions</CardTitle></CardHeader><CardContent>
        <div className="flex flex-wrap gap-2">{[...permissions].sort().map((permission) => <Badge key={permission} variant="info">{permission}</Badge>)}</div>
        {!permissions.size && <p className="text-sm text-navy/45">No feature permissions are assigned to this account.</p>}
      </CardContent></Card>

      <div className="flex items-center justify-between"><div><h2 className="text-base font-semibold text-navy">Staff members</h2><p className="text-sm text-navy/45">Assign one of the backend-managed staff roles to each member.</p></div><div className="flex gap-2"><Button variant="ghost" size="sm" onClick={() => { staff.refetch(); roles.refetch(); }}><RefreshCw className="h-3.5 w-3.5" /></Button>{can(PERMISSIONS.STAFF_INVITE) && <Button variant="primary" onClick={() => setInviteOpen(true)}><Plus className="h-3.5 w-3.5" /> Invite staff</Button>}</div></div>
      <Card><CardContent className="p-0"><table className="w-full text-sm"><thead className="bg-navy/[0.02]"><tr><th className="px-5 py-3 text-left">Member</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-center">Status</th>{can(PERMISSIONS.STAFF_MANAGE) && <th className="px-5 py-3 text-right">Actions</th>}</tr></thead><tbody className="divide-y divide-navy/4">{(staff.data ?? []).map((member) => <tr key={member.id}><td className="px-5 py-3"><p className="font-medium text-navy">{member.firstName} {member.lastName}</p><p className="text-xs text-navy/45">{member.email}</p></td><td className="px-4 py-3"><Badge variant="default">{member.role}</Badge></td><td className="px-4 py-3 text-center"><Badge variant={member.enabled ? "success" : "error"}>{member.enabled ? "Active" : "Disabled"}</Badge></td>{can(PERMISSIONS.STAFF_MANAGE) && <td className="px-5 py-3 text-right"><Button variant="ghost" size="xs" onClick={() => setEditing(member)}><Pencil className="h-3 w-3" /> Edit</Button></td>}</tr>)}{!staff.loading && !(staff.data ?? []).length && <tr><td colSpan={4} className="p-8 text-center text-navy/45">No staff members found.</td></tr>}</tbody></table></CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Available staff roles</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{(roles.data ?? []).map((role) => <div key={role.id} className="rounded-xl border border-navy/8 p-3"><p className="font-medium text-navy">{role.name}</p><p className="mt-1 text-xs text-navy/45">{role.description || "Permissions are defined by the Harava backend."}</p></div>)}</CardContent></Card>
    </div>
    <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit staff member">{editing && <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><input value={editing.firstName ?? ""} onChange={(event) => setEditing({ ...editing, firstName: event.target.value })} className="rounded-xl border p-2.5" placeholder="First name" /><input value={editing.lastName ?? ""} onChange={(event) => setEditing({ ...editing, lastName: event.target.value })} className="rounded-xl border p-2.5" placeholder="Last name" /></div><select value={editing.role} onChange={(event) => setEditing({ ...editing, role: event.target.value })} className="w-full rounded-xl border p-2.5">{(roles.data ?? []).map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button variant="primary" onClick={save} disabled={update.loading}>Save changes</Button></div></div>}</Modal>
    <Modal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite staff member"><div className="space-y-4"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="staff@company.com" className="w-full rounded-xl border p-2.5" /><select value={roleId} onChange={(event) => setRoleId(event.target.value)} className="w-full rounded-xl border p-2.5"><option value="">Choose a role</option>{(roles.data ?? []).map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button><Button variant="primary" disabled={!email || !roleId || invite.loading} onClick={async () => { try { await invite.mutate(email, roleId); toast("Invitation sent", "success"); setInviteOpen(false); setEmail(""); setRoleId(""); } catch (error) { toast(error instanceof Error ? error.message : "Could not invite staff", "error"); } }}><UserPlus className="h-3.5 w-3.5" /> Invite</Button></div></div></Modal>
  </div>;
}
