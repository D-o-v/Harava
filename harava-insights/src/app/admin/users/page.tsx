"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { Search, Plus, UserCog, Trash2, Ban } from "lucide-react";

export default function UsersPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: "Jay Admin", email: "jay@harava.com", role: "super_admin", status: "active", lastLogin: "Just now" },
    { id: 2, name: "Sarah Accountant", email: "accountant@demo.com", role: "accountant", status: "active", lastLogin: "2 hrs ago" },
    { id: 3, name: "Mike Consultant", email: "consultant@demo.com", role: "consultant", status: "active", lastLogin: "1 day ago" },
    { id: 4, name: "Lisa Learner", email: "learner@demo.com", role: "learner", status: "active", lastLogin: "5 hrs ago" },
    { id: 5, name: "Corp Admin", email: "corporate@demo.com", role: "corporate_admin", status: "active", lastLogin: "3 hrs ago" },
    { id: 6, name: "John Doe", email: "john@example.com", role: "learner", status: "suspended", lastLogin: "30 days ago" },
  ]);

  const handleSuspend = (id: number) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u));
    toast("User status updated!", "success");
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast("User deleted.", "success");
  };

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <DashboardHeader title="User Management" subtitle="Manage platform users and roles" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 w-80">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-sm outline-none flex-1" />
          </div>
          <Button variant="primary" onClick={() => setAddModal(true)}><Plus className="w-3 h-3" /> Add User</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto"><table className="w-full text-sm min-w-150">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">User</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Role</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Last Login</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </td>
                    <td className="px-6 py-3 text-center"><Badge variant="default">{u.role}</Badge></td>
                    <td className="px-6 py-3 text-center"><Badge variant={u.status === "active" ? "success" : "error"}>{u.status}</Badge></td>
                    <td className="px-6 py-3 text-center text-gray-500">{u.lastLogin}</td>
                    <td className="px-6 py-3 text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => toast("Opening user settings...", "info")}><UserCog className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleSuspend(u.id)}><Ban className="w-3 h-3 text-amber-500" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New User">
        <div className="space-y-4">
          <div><label className="text-xs text-gray-500">Full Name</label><input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="Enter name" /></div>
          <div><label className="text-xs text-gray-500">Email</label><input className="w-full border rounded-lg px-3 py-2 text-sm mt-1" placeholder="user@example.com" /></div>
          <div><label className="text-xs text-gray-500">Role</label><select className="w-full border rounded-lg px-3 py-2 text-sm mt-1"><option>learner</option><option>accountant</option><option>consultant</option><option>corporate_admin</option><option>super_admin</option></select></div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setAddModal(false); toast("User created successfully!", "success"); }}>Create User</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
