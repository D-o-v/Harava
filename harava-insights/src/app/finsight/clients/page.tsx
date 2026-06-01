"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { Plus, Search, Eye, Edit, MoreHorizontal } from "lucide-react";

interface Client {
  id: number;
  name: string;
  email: string;
  industry: string;
  revenue: string;
  status: "active" | "inactive" | "prospect";
  lastContact: string;
}

export default function ClientsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({ name: "", email: "", industry: "" });

  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: "Acme Corp", email: "finance@acme.com", industry: "Technology", revenue: "$450K/yr", status: "active", lastContact: "Today" },
    { id: 2, name: "Beta Healthcare", email: "admin@beta.org", industry: "Healthcare", revenue: "$280K/yr", status: "active", lastContact: "Yesterday" },
    { id: 3, name: "Omega Retail", email: "cfo@omega.com", industry: "Retail", revenue: "$120K/yr", status: "active", lastContact: "3 days ago" },
    { id: 4, name: "Delta Finance", email: "ops@delta.com", industry: "Finance", revenue: "$890K/yr", status: "active", lastContact: "1 week ago" },
    { id: 5, name: "Gamma Manufacturing", email: "accounting@gamma.com", industry: "Manufacturing", revenue: "$340K/yr", status: "inactive", lastContact: "2 weeks ago" },
    { id: 6, name: "Zeta Consulting", email: "info@zeta.co", industry: "Consulting", revenue: "$0", status: "prospect", lastContact: "3 days ago" },
  ]);

  const filteredClients = clients.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast("Please fill in name and email", "error");
      return;
    }
    const client: Client = {
      id: clients.length + 1,
      name: newClient.name,
      email: newClient.email,
      industry: newClient.industry || "Other",
      revenue: "$0",
      status: "prospect",
      lastContact: "Today",
    };
    setClients((prev) => [client, ...prev]);
    setShowAddModal(false);
    setNewClient({ name: "", email: "", industry: "" });
    toast("Client added successfully!", "success");
  };

  return (
    <div>
      <DashboardHeader title="Clients" subtitle="Client portfolio and relationship management" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-sm outline-none w-64" />
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}><Plus className="w-4 h-4" /> Add Client</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Client</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Industry</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Revenue</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Last Contact</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{client.industry}</td>
                    <td className="px-6 py-3 text-gray-700">{client.revenue}</td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={client.status === "active" ? "success" : client.status === "prospect" ? "info" : "default"}>{client.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{client.lastContact}</td>
                    <td className="px-6 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setViewClient(client)}><Eye className="w-4 h-4" /> View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Add Client Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Client">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Company Name</label>
            <input type="text" value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Enter company name" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input type="email" value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="contact@company.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Industry</label>
            <select value={newClient.industry} onChange={(e) => setNewClient({...newClient, industry: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="">Select industry</option>
              <option>Technology</option>
              <option>Healthcare</option>
              <option>Finance</option>
              <option>Retail</option>
              <option>Manufacturing</option>
              <option>Consulting</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddClient}>Add Client</Button>
          </div>
        </div>
      </Modal>

      {/* View Client Modal */}
      <Modal open={!!viewClient} onClose={() => setViewClient(null)} title="Client Details">
        {viewClient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Company</p><p className="text-sm font-medium">{viewClient.name}</p></div>
              <div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium">{viewClient.email}</p></div>
              <div><p className="text-xs text-gray-500">Industry</p><p className="text-sm font-medium">{viewClient.industry}</p></div>
              <div><p className="text-xs text-gray-500">Annual Revenue</p><p className="text-sm font-medium">{viewClient.revenue}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><Badge variant={viewClient.status === "active" ? "success" : "info"}>{viewClient.status}</Badge></div>
              <div><p className="text-xs text-gray-500">Last Contact</p><p className="text-sm font-medium">{viewClient.lastContact}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
