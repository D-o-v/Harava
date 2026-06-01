"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { Building2, Calendar, DollarSign, ArrowRight } from "lucide-react";

interface Deal {
  id: number;
  client: string;
  service: string;
  value: string;
  stage: "lead" | "proposal" | "negotiation" | "won" | "lost";
  dueDate: string;
  probability: number;
}

export default function PipelinePage() {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Deal | null>(null);
  const [deals, setDeals] = useState<Deal[]>([
    { id: 1, client: "TechCorp Ltd", service: "ISO 27001 Certification", value: "$45,000", stage: "proposal", dueDate: "Jun 15, 2026", probability: 65 },
    { id: 2, client: "FinServ Global", service: "SOC 2 Type II", value: "$72,000", stage: "negotiation", dueDate: "Jul 1, 2026", probability: 80 },
    { id: 3, client: "MedTech Inc", service: "HIPAA Compliance", value: "$38,000", stage: "lead", dueDate: "Aug 10, 2026", probability: 30 },
    { id: 4, client: "CloudNine SaaS", service: "ISO 9001 Recertification", value: "$28,000", stage: "won", dueDate: "May 28, 2026", probability: 100 },
    { id: 5, client: "RetailMax", service: "PCI DSS Assessment", value: "$55,000", stage: "proposal", dueDate: "Jun 30, 2026", probability: 50 },
    { id: 6, client: "DataFlow Systems", service: "GDPR Audit", value: "$32,000", stage: "lost", dueDate: "May 15, 2026", probability: 0 },
  ]);

  const stages = ["lead", "proposal", "negotiation", "won", "lost"] as const;
  const stageColors = { lead: "bg-gray-100", proposal: "bg-blue-100", negotiation: "bg-amber-100", won: "bg-emerald-100", lost: "bg-red-100" };

  const advanceStage = (id: number) => {
    setDeals((prev) => prev.map((d) => {
      if (d.id !== id) return d;
      const idx = stages.indexOf(d.stage);
      if (idx < 3) return { ...d, stage: stages[idx + 1], probability: Math.min(100, d.probability + 20) };
      return d;
    }));
    setSelected(null);
    toast("Deal advanced to next stage!", "success");
  };

  return (
    <div>
      <DashboardHeader title="Client Pipeline" subtitle="Track and manage engagement opportunities" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-5 gap-3">
          {stages.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            return (
              <div key={stage} className={`rounded-lg p-3 ${stageColors[stage]} min-h-[300px]`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase">{stage}</h3>
                  <Badge variant="default">{stageDeals.length}</Badge>
                </div>
                <div className="space-y-2">
                  {stageDeals.map((deal) => (
                    <Card key={deal.id} className="cursor-pointer hover:shadow-md" onClick={() => setSelected(deal)}>
                      <CardContent className="p-3">
                        <p className="text-xs font-semibold text-gray-900">{deal.client}</p>
                        <p className="text-xs text-gray-500">{deal.service}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-medium text-emerald-600">{deal.value}</span>
                          <span className="text-xs text-gray-400">{deal.probability}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Deal Details">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Client</p><p className="text-sm font-medium">{selected.client}</p></div>
              <div><p className="text-xs text-gray-500">Service</p><p className="text-sm font-medium">{selected.service}</p></div>
              <div><p className="text-xs text-gray-500">Value</p><p className="text-sm font-medium">{selected.value}</p></div>
              <div><p className="text-xs text-gray-500">Due Date</p><p className="text-sm font-medium">{selected.dueDate}</p></div>
              <div><p className="text-xs text-gray-500">Stage</p><Badge>{selected.stage}</Badge></div>
              <div><p className="text-xs text-gray-500">Probability</p><p className="text-sm font-medium">{selected.probability}%</p></div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              {selected.stage !== "won" && selected.stage !== "lost" && (
                <Button variant="primary" onClick={() => advanceStage(selected.id)}>Advance Stage <ArrowRight className="w-3 h-3" /></Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
