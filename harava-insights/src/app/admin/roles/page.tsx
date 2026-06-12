"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { Key, Plus, Shield, Edit2, Trash2, Users, Eye, Settings, FileText, BarChart3, Cpu, Wallet } from "lucide-react";

const PERMISSIONS = [
  { id: "users.view", label: "View Users", category: "Users" },
  { id: "users.manage", label: "Manage Users", category: "Users" },
  { id: "users.delete", label: "Delete Users", category: "Users" },
  { id: "roles.manage", label: "Manage Roles", category: "Access Control" },
  { id: "billing.view", label: "View Billing", category: "Billing" },
  { id: "billing.manage", label: "Manage Billing", category: "Billing" },
  { id: "reports.view", label: "View Reports", category: "Reports" },
  { id: "reports.generate", label: "Generate Reports", category: "Reports" },
  { id: "reports.export", label: "Export Reports", category: "Reports" },
  { id: "modules.finsight", label: "Access FinSight", category: "Modules" },
  { id: "modules.accrediai", label: "Access AccrediAI", category: "Modules" },
  { id: "modules.proed", label: "Access ProEd", category: "Modules" },
  { id: "iot.view", label: "View IoT Devices", category: "IoT" },
  { id: "iot.manage", label: "Manage IoT Devices", category: "IoT" },
  { id: "payroll.view", label: "View Payroll", category: "Payroll" },
  { id: "payroll.process", label: "Process Payroll", category: "Payroll" },
  { id: "clients.view", label: "View Clients", category: "Clients" },
  { id: "clients.manage", label: "Manage Clients", category: "Clients" },
  { id: "settings.manage", label: "Manage Settings", category: "System" },
  { id: "audit.view", label: "View Audit Log", category: "System" },
];

export default function RolesPage() {
  const { toast } = useToast();
  const [createModal, setCreateModal] = useState(false);
  const [editRole, setEditRole] = useState<string | null>(null);
  const [roles, setRoles] = useState([
    { id: "super_admin", name: "Super Admin", description: "Full platform access with all permissions", users: 2, permissions: PERMISSIONS.map(p => p.id), color: "error" as const },
    { id: "admin", name: "Admin", description: "Platform management without system settings", users: 4, permissions: PERMISSIONS.filter(p => p.id !== "settings.manage").map(p => p.id), color: "warning" as const },
    { id: "manager", name: "Manager", description: "Team and client oversight with reporting", users: 12, permissions: ["users.view", "billing.view", "reports.view", "reports.generate", "modules.finsight", "modules.accrediai", "modules.proed", "clients.view", "clients.manage", "payroll.view"], color: "info" as const },
    { id: "accountant", name: "Accountant", description: "Financial module access with billing", users: 18, permissions: ["users.view", "billing.view", "billing.manage", "reports.view", "reports.generate", "reports.export", "modules.finsight", "payroll.view", "payroll.process"], color: "success" as const },
    { id: "consultant", name: "Consultant", description: "Accreditation compliance access", users: 24, permissions: ["users.view", "reports.view", "reports.generate", "modules.accrediai", "clients.view"], color: "default" as const },
    { id: "learner", name: "Learner", description: "Education platform access only", users: 890, permissions: ["modules.proed"], color: "default" as const },
    { id: "viewer", name: "Viewer", description: "Read-only access across modules", users: 156, permissions: ["users.view", "billing.view", "reports.view", "modules.finsight", "modules.accrediai", "modules.proed", "clients.view", "iot.view", "payroll.view"], color: "default" as const },
  ]);

  const categories = [...new Set(PERMISSIONS.map(p => p.category))];

  return (
    <div>
      <DashboardHeader title="Roles & Permissions" subtitle="Configure access control and user permissions" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="default">{roles.length} roles</Badge>
            <Badge variant="info">{PERMISSIONS.length} permissions</Badge>
          </div>
          <Button variant="primary" onClick={() => setCreateModal(true)}>
            <Plus className="w-3.5 h-3.5" /> Create Role
          </Button>
        </div>

        {/* Roles List */}
        <div className="grid gap-4">
          {roles.map((role) => (
            <Card key={role.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-linear-to-br from-navy/6 to-gold/4 flex items-center justify-center shrink-0">
                      <Key className="w-5 h-5 text-navy/50" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-[14px] font-semibold text-navy">{role.name}</h3>
                        <Badge variant={role.color} size="sm">{role.id}</Badge>
                      </div>
                      <p className="text-[12px] text-navy/45 mb-3">{role.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-navy/50">
                          <Users className="w-3 h-3" /> {role.users} users
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-navy/50">
                          <Shield className="w-3 h-3" /> {role.permissions.length} permissions
                        </span>
                      </div>
                      {/* Permission tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {role.permissions.slice(0, 6).map(permId => {
                          const perm = PERMISSIONS.find(p => p.id === permId);
                          return (
                            <span key={permId} className="text-[9px] font-medium bg-navy/4 text-navy/55 px-2 py-0.5 rounded-full">
                              {perm?.label}
                            </span>
                          );
                        })}
                        {role.permissions.length > 6 && (
                          <span className="text-[9px] font-medium bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">
                            +{role.permissions.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="xs" onClick={() => { setEditRole(role.id); toast(`Editing role: ${role.name}`, "info"); }}>
                      <Edit2 className="w-3 h-3" /> Edit
                    </Button>
                    {role.id !== "super_admin" && (
                      <Button variant="ghost" size="xs" onClick={() => { setRoles(prev => prev.filter(r => r.id !== role.id)); toast("Role deleted", "success"); }}>
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permission Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold" /> Permission Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] min-w-200">
                <thead>
                  <tr className="border-b border-navy/6">
                    <th className="text-left py-3 px-3 font-semibold text-navy/60 w-40">Permission</th>
                    {roles.slice(0, 5).map(r => (
                      <th key={r.id} className="text-center py-3 px-2 font-semibold text-navy/60">{r.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map(cat => (
                    <>
                      <tr key={cat}>
                        <td colSpan={6} className="pt-4 pb-1 px-3 text-[10px] font-bold text-navy/35 uppercase tracking-wider">{cat}</td>
                      </tr>
                      {PERMISSIONS.filter(p => p.category === cat).map(perm => (
                        <tr key={perm.id} className="border-b border-navy/3 hover:bg-navy/1">
                          <td className="py-2 px-3 text-navy/70 font-medium">{perm.label}</td>
                          {roles.slice(0, 5).map(r => (
                            <td key={r.id} className="py-2 px-2 text-center">
                              {r.permissions.includes(perm.id) ? (
                                <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">✓</span>
                              ) : (
                                <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-navy/3 text-navy/20">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Role Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New Role">
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Role Name</label>
            <input className="w-full border border-navy/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" placeholder="e.g., Compliance Officer" />
          </div>
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Description</label>
            <input className="w-full border border-navy/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" placeholder="Brief role description" />
          </div>
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-2">Permissions</label>
            <div className="max-h-60 overflow-y-auto space-y-3 border border-navy/6 rounded-xl p-3">
              {categories.map(cat => (
                <div key={cat}>
                  <p className="text-[10px] font-bold text-navy/35 uppercase tracking-wider mb-1.5">{cat}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PERMISSIONS.filter(p => p.category === cat).map(perm => (
                      <label key={perm.id} className="flex items-center gap-2 text-[11px] text-navy/60 cursor-pointer hover:text-navy">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded" />
                        {perm.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setCreateModal(false); toast("Role created successfully!", "success"); }}>Create Role</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
