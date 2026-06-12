"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { TrendChart, ChartCard } from "@/components/ui/charts";
import { Building2, Plus, Search, Edit2, Trash2, ArrowRight, Mail, Phone, Globe, MapPin, Users, BarChart3 } from "lucide-react";

export default function ClientsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [clients, setClients] = useState([
    { id: 1, name: "Acme Corporation", email: "admin@acme.com", phone: "+1 (555) 100-1000", industry: "Technology", plan: "Enterprise", status: "active", users: 45, revenue: "$12,400/mo", location: "New York, NY", modules: ["finsight", "proed"] },
    { id: 2, name: "Beta Healthcare Group", email: "ops@betahealth.com", phone: "+1 (555) 200-2000", industry: "Healthcare", plan: "Enterprise", status: "active", users: 120, revenue: "$28,900/mo", location: "Chicago, IL", modules: ["accrediai", "finsight"] },
    { id: 3, name: "Delta Financial Services", email: "contact@deltafin.com", phone: "+1 (555) 300-3000", industry: "Finance", plan: "Professional", status: "active", users: 32, revenue: "$8,200/mo", location: "San Francisco, CA", modules: ["finsight"] },
    { id: 4, name: "Omega Behavioral Health", email: "admin@omegabh.com", phone: "+1 (555) 400-4000", industry: "Healthcare", plan: "Enterprise", status: "active", users: 78, revenue: "$18,500/mo", location: "Austin, TX", modules: ["accrediai", "proed"] },
    { id: 5, name: "Sigma Education Inc", email: "info@sigmaedu.com", phone: "+1 (555) 500-5000", industry: "Education", plan: "Professional", status: "active", users: 200, revenue: "$15,000/mo", location: "Boston, MA", modules: ["proed"] },
    { id: 6, name: "Gamma Consulting", email: "hello@gammaconsult.com", phone: "+1 (555) 600-6000", industry: "Consulting", plan: "Starter", status: "trial", users: 8, revenue: "$0/mo", location: "Denver, CO", modules: ["finsight"] },
    { id: 7, name: "Zeta Rehabilitation", email: "admin@zetarehab.com", phone: "+1 (555) 700-7000", industry: "Healthcare", plan: "Professional", status: "churned", users: 0, revenue: "$0/mo", location: "Miami, FL", modules: ["accrediai"] },
  ]);

  const filtered = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = clients.filter(c => c.status === "active").reduce((sum, c) => sum + parseInt(c.revenue.replace(/[^0-9]/g, "")), 0);

  return (
    <div>
      <DashboardHeader title="Client Management" subtitle="Manage client accounts, subscriptions, and onboarding" />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 page-enter">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Clients</p>
            <p className="text-2xl font-bold text-navy mt-1">{clients.length}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-bold text-navy mt-1">{clients.filter(c => c.status === "active").length}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-bold text-navy mt-1">{clients.reduce((s, c) => s + c.users, 0)}</p>
          </div>
          <div className="stat-card p-4">
            <p className="text-[11px] font-medium text-navy/45 uppercase tracking-wider">MRR</p>
            <p className="text-2xl font-bold text-navy mt-1">${(totalRevenue).toLocaleString()}/mo</p>
          </div>
        </div>

        {/* Client Growth Chart */}
        <ChartCard title="Client Revenue Growth" subtitle="Monthly recurring revenue over time">
          <TrendChart
            data={[
              { name: "Jan", mrr: 62000, clients: 72 },
              { name: "Feb", mrr: 68000, clients: 76 },
              { name: "Mar", mrr: 74000, clients: 80 },
              { name: "Apr", mrr: 78000, clients: 83 },
              { name: "May", mrr: 81000, clients: 86 },
              { name: "Jun", mrr: 83100, clients: 89 },
            ]}
            dataKeys={[
              { key: "mrr", label: "MRR ($)", color: "#182954" },
              { key: "clients", label: "Total Clients", color: "#C19B3F" },
            ]}
            valuePrefix="$"
            height={200}
          />
        </ChartCard>

        {/* Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-navy/8 rounded-xl px-3.5 py-2.5 w-72">
              <Search className="w-4 h-4 text-navy/30" />
              <input type="text" placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-[13px] outline-none flex-1 bg-transparent text-navy placeholder:text-navy/30" />
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-navy/8 rounded-xl p-1">
              {["all", "active", "trial", "churned"].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`text-[11px] font-medium px-3 py-1.5 rounded-lg capitalize transition-colors ${filter === f ? "bg-navy text-white" : "text-navy/50 hover:text-navy"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <Button variant="primary" onClick={() => setAddModal(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Client
          </Button>
        </div>

        {/* Client Cards */}
        <div className="grid gap-4">
          {filtered.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-navy/8 to-gold/6 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-navy/50" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-[14px] font-semibold text-navy">{client.name}</h3>
                        <Badge variant={client.status === "active" ? "success" : client.status === "trial" ? "warning" : "error"} size="sm">{client.status}</Badge>
                        <Badge variant="info" size="sm">{client.plan}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-navy/45 mb-2">
                        <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>
                        <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{client.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-navy/50">
                        <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{client.users} users</span>
                        <span className="inline-flex items-center gap-1"><BarChart3 className="w-3 h-3" />{client.revenue}</span>
                        <span className="inline-flex items-center gap-1"><Globe className="w-3 h-3" />{client.industry}</span>
                      </div>
                      <div className="flex gap-1.5 mt-2.5">
                        {client.modules.map(m => (
                          <span key={m} className="text-[9px] font-semibold bg-navy/4 text-navy/55 px-2 py-0.5 rounded-full capitalize">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="xs" onClick={() => toast(`Viewing ${client.name}`, "info")}>
                      <Edit2 className="w-3 h-3" /> Manage
                    </Button>
                    <Button variant="ghost" size="xs" onClick={() => { setClients(prev => prev.filter(c => c.id !== client.id)); toast("Client removed", "success"); }}>
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Client Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add New Client">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Company Name</label>
              <input className="w-full border border-navy/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" placeholder="Acme Corp" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Industry</label>
              <select className="w-full border border-navy/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40">
                <option>Healthcare</option><option>Technology</option><option>Finance</option><option>Education</option><option>Consulting</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Email</label>
              <input className="w-full border border-navy/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" placeholder="admin@company.com" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Phone</label>
              <input className="w-full border border-navy/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-1.5">Plan</label>
            <select className="w-full border border-navy/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/40">
              <option>Enterprise</option><option>Professional</option><option>Starter</option><option>Trial</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-navy/60 block mb-2">Modules</label>
            <div className="flex gap-3">
              {["FinSight", "AccrediAI", "ProEd"].map(m => (
                <label key={m} className="flex items-center gap-2 text-[12px] text-navy/60 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded" /> {m}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setAddModal(false); toast("Client added successfully!", "success"); }}>Add Client</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
