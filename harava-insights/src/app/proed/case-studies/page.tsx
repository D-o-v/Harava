"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { BookOpen, Clock, Users, ArrowRight } from "lucide-react";

export default function CaseStudiesPage() {
  const { toast } = useToast();
  const [selected, setSelected] = useState<number | null>(null);

  const caseStudies = [
    { id: 1, title: "Enron Scandal Analysis", category: "Ethics & Fraud", difficulty: "Advanced", duration: "3 hours", participants: 156, status: "available", description: "Examine the accounting fraud that led to Enron's collapse. Analyze financial statements, identify red flags, and discuss regulatory implications." },
    { id: 2, title: "Tesla's Revenue Recognition", category: "Revenue Recognition", difficulty: "Intermediate", duration: "2 hours", participants: 234, status: "in-progress", description: "Explore how Tesla applies ASC 606 for vehicle sales, software updates, and energy products. Real-world application of revenue recognition principles." },
    { id: 3, title: "WeWork's IPO Failure", category: "Valuation", difficulty: "Advanced", duration: "2.5 hours", participants: 189, status: "completed", description: "Analyze the financial disclosures and governance issues that caused WeWork's failed IPO attempt." },
    { id: 4, title: "Small Business Cash Management", category: "Cash Flow", difficulty: "Beginner", duration: "1.5 hours", participants: 312, status: "available", description: "Help a fictional small business optimize their cash flow cycle through receivables management and expense control." },
    { id: 5, title: "Cross-Border Tax Planning", category: "Tax", difficulty: "Advanced", duration: "4 hours", participants: 98, status: "available", description: "Navigate transfer pricing, tax treaties, and compliance requirements for a multinational corporation." },
  ];

  const handleStart = (id: number) => {
    setSelected(null);
    toast("Case study started! Good luck.", "success");
  };

  return (
    <div>
      <DashboardHeader title="Case Studies" subtitle="Real-world scenarios to apply your knowledge" />
      <div className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseStudies.map((cs) => (
            <Card key={cs.id} className="hover:shadow-md cursor-pointer transition-shadow" onClick={() => setSelected(cs.id)}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={cs.difficulty === "Advanced" ? "error" : cs.difficulty === "Intermediate" ? "warning" : "success"}>{cs.difficulty}</Badge>
                  <Badge variant={cs.status === "completed" ? "success" : cs.status === "in-progress" ? "info" : "default"}>{cs.status}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{cs.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{cs.category}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{cs.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{cs.participants}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Modal open={selected !== null} onClose={() => setSelected(null)} title="Case Study Details" size="md">
        {selected && (() => {
          const cs = caseStudies.find((c) => c.id === selected)!;
          return (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">{cs.title}</h3>
              <p className="text-sm text-gray-600">{cs.description}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Duration: {cs.duration}</span>
                <span>Difficulty: {cs.difficulty}</span>
                <span>{cs.participants} participants</span>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                {cs.status !== "completed" && (
                  <Button variant="primary" onClick={() => handleStart(cs.id)}>
                    {cs.status === "in-progress" ? "Continue" : "Start Case Study"} <ArrowRight className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
