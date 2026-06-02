"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { Plus, Download, Filter, Eye, Edit, Trash2 } from "lucide-react";

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  status: "posted" | "pending" | "reconciled";
}

export default function AccountingPage() {
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewTx, setViewTx] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [newTx, setNewTx] = useState({ description: "", amount: "", category: "Revenue", type: "income" as "income" | "expense" });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: "Jun 1, 2026", description: "Client Payment - Acme Corp", category: "Revenue", amount: 15000, type: "income", status: "posted" },
    { id: 2, date: "Jun 1, 2026", description: "SaaS Subscription - Slack", category: "Software", amount: 1200, type: "expense", status: "reconciled" },
    { id: 3, date: "May 31, 2026", description: "Client Payment - Beta LLC", category: "Revenue", amount: 8500, type: "income", status: "posted" },
    { id: 4, date: "May 31, 2026", description: "Office Rent - June", category: "Facilities", amount: 4500, type: "expense", status: "posted" },
    { id: 5, date: "May 30, 2026", description: "Consulting Fee - Delta Inc", category: "Revenue", amount: 22000, type: "income", status: "reconciled" },
    { id: 6, date: "May 30, 2026", description: "Payroll - May", category: "Payroll", amount: 45000, type: "expense", status: "reconciled" },
    { id: 7, date: "May 29, 2026", description: "Marketing - Google Ads", category: "Marketing", amount: 3200, type: "expense", status: "pending" },
    { id: 8, date: "May 28, 2026", description: "Client Payment - Omega Retail", category: "Revenue", amount: 12000, type: "income", status: "posted" },
  ]);

  const filteredTx = filterType === "all" ? transactions : transactions.filter((t) => t.type === filterType);

  const handleAddTransaction = () => {
    if (!newTx.description || !newTx.amount) {
      toast("Please fill in all fields", "error");
      return;
    }
    const tx: Transaction = {
      id: transactions.length + 1,
      date: "Jun 1, 2026",
      description: newTx.description,
      category: newTx.category,
      amount: parseFloat(newTx.amount),
      type: newTx.type,
      status: "pending",
    };
    setTransactions((prev) => [tx, ...prev]);
    setShowAddModal(false);
    setNewTx({ description: "", amount: "", category: "Revenue", type: "income" });
    toast("Transaction added successfully!", "success");
  };

  const handleDelete = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast("Transaction deleted", "info");
  };

  const handleExport = () => {
    toast("Exporting transactions to CSV...", "success");
  };

  return (
    <div>
      <DashboardHeader title="Accounting" subtitle="Transaction ledger and month-end management" />

      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant={filterType === "all" ? "primary" : "outline"} size="sm" onClick={() => setFilterType("all")}>All</Button>
            <Button variant={filterType === "income" ? "primary" : "outline"} size="sm" onClick={() => setFilterType("income")}>Income</Button>
            <Button variant={filterType === "expense" ? "primary" : "outline"} size="sm" onClick={() => setFilterType("expense")}>Expenses</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4" /> Export</Button>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}><Plus className="w-4 h-4" /> Add Transaction</Button>
          </div>
        </div>

        {/* Transaction Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto"><table className="w-full text-sm min-w-150">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Description</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Amount</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-500">{tx.date}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{tx.description}</td>
                    <td className="px-6 py-3 text-gray-600">{tx.category}</td>
                    <td className={`px-6 py-3 text-right font-medium ${tx.type === "income" ? "text-navy" : "text-red-600"}`}>
                      {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Badge variant={tx.status === "reconciled" ? "success" : tx.status === "posted" ? "info" : "warning"}>{tx.status}</Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setViewTx(tx)}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(tx.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </CardContent>
        </Card>

        {/* Month-End Status */}
        <Card>
          <CardHeader><CardTitle>Month-End Close Status</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { task: "Bank Reconciliation", status: "complete" },
                { task: "AR Aging Review", status: "complete" },
                { task: "AP Verification", status: "in-progress" },
                { task: "Journal Entries", status: "pending" },
              ].map((task, i) => (
                <div key={i} className="p-3 border rounded-lg text-center">
                  <Badge variant={task.status === "complete" ? "success" : task.status === "in-progress" ? "warning" : "default"}>{task.status}</Badge>
                  <p className="text-sm text-gray-700 mt-2">{task.task}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Transaction Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Transaction">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <input type="text" value={newTx.description} onChange={(e) => setNewTx({...newTx, description: e.target.value})} placeholder="Transaction description" className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Amount</label>
              <input type="number" value={newTx.amount} onChange={(e) => setNewTx({...newTx, amount: e.target.value})} placeholder="0.00" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
              <select value={newTx.type} onChange={(e) => setNewTx({...newTx, type: e.target.value as "income" | "expense"})} className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
            <select value={newTx.category} onChange={(e) => setNewTx({...newTx, category: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option>Revenue</option>
              <option>Software</option>
              <option>Facilities</option>
              <option>Payroll</option>
              <option>Marketing</option>
              <option>Travel</option>
              <option>Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddTransaction}>Add Transaction</Button>
          </div>
        </div>
      </Modal>

      {/* View Transaction Modal */}
      <Modal isOpen={!!viewTx} onClose={() => setViewTx(null)} title="Transaction Details">
        {viewTx && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Description</p><p className="text-sm font-medium">{viewTx.description}</p></div>
              <div><p className="text-xs text-gray-500">Amount</p><p className={`text-sm font-medium ${viewTx.type === "income" ? "text-navy" : "text-red-600"}`}>{viewTx.type === "income" ? "+" : "-"}${viewTx.amount.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-500">Category</p><p className="text-sm font-medium">{viewTx.category}</p></div>
              <div><p className="text-xs text-gray-500">Date</p><p className="text-sm font-medium">{viewTx.date}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><Badge variant={viewTx.status === "reconciled" ? "success" : "info"}>{viewTx.status}</Badge></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
