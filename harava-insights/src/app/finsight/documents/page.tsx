"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { FileText, Upload, Download, Trash2, Search, FolderOpen } from "lucide-react";

export default function DocumentsPage() {
  const { toast } = useToast();
  const [uploadModal, setUploadModal] = useState(false);
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([
    { id: 1, name: "Q1 Financial Statements.pdf", category: "Financial", size: "2.4 MB", uploaded: "May 28, 2026", status: "approved" },
    { id: 2, name: "Tax Return 2025.pdf", category: "Tax", size: "1.8 MB", uploaded: "May 15, 2026", status: "approved" },
    { id: 3, name: "Bank Reconciliation May.xlsx", category: "Reconciliation", size: "456 KB", uploaded: "Jun 1, 2026", status: "pending" },
    { id: 4, name: "Invoice Batch 2026-05.pdf", category: "Invoices", size: "3.2 MB", uploaded: "May 30, 2026", status: "approved" },
    { id: 5, name: "Payroll Summary May.xlsx", category: "Payroll", size: "890 KB", uploaded: "Jun 2, 2026", status: "pending" },
    { id: 6, name: "Audit Report Draft.docx", category: "Audit", size: "1.1 MB", uploaded: "May 22, 2026", status: "review" },
  ]);

  const filtered = documents.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: number) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast("Document deleted.", "success");
  };

  return (
    <div>
      <DashboardHeader title="Document Manager" subtitle="Upload, organize, and manage financial documents" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 w-80">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-sm outline-none flex-1" />
          </div>
          <Button variant="primary" onClick={() => setUploadModal(true)}><Upload className="w-3 h-3" /> Upload Document</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Document</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Size</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Uploaded</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900 flex items-center gap-2"><FileText className="w-4 h-4 text-navy" />{doc.name}</td>
                    <td className="px-6 py-3 text-center"><Badge variant="default">{doc.category}</Badge></td>
                    <td className="px-6 py-3 text-center text-gray-500">{doc.size}</td>
                    <td className="px-6 py-3 text-center text-gray-500">{doc.uploaded}</td>
                    <td className="px-6 py-3 text-center"><Badge variant={doc.status === "approved" ? "success" : doc.status === "review" ? "warning" : "info"}>{doc.status}</Badge></td>
                    <td className="px-6 py-3 text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => toast("Downloading...", "success")}><Download className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={uploadModal} onClose={() => setUploadModal(false)} title="Upload Document">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Drag & drop files or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX up to 25MB</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => toast("File selected (demo)", "info")}>Choose Files</Button>
          </div>
          <div><label className="text-xs text-gray-500">Category</label><select className="w-full border rounded-lg px-3 py-2 text-sm mt-1"><option>Financial</option><option>Tax</option><option>Payroll</option><option>Invoices</option><option>Audit</option></select></div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setUploadModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setUploadModal(false); toast("Document uploaded successfully!", "success"); }}>Upload</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
