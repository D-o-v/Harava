"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";

export default function ReadinessPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([
    { name: "Documentation", score: 85, items: 34, passed: 29, status: "good" },
    { name: "Process Controls", score: 72, items: 28, passed: 20, status: "warning" },
    { name: "Technical Security", score: 91, items: 22, passed: 20, status: "good" },
    { name: "Personnel Training", score: 60, items: 15, passed: 9, status: "critical" },
    { name: "Risk Management", score: 78, items: 20, passed: 16, status: "warning" },
    { name: "Incident Response", score: 95, items: 12, passed: 11, status: "good" },
  ]);

  const handleReassess = (name: string) => {
    setCategories((prev) => prev.map((c) => c.name === name ? { ...c, score: Math.min(100, c.score + 5), passed: Math.min(c.items, c.passed + 1) } : c));
    toast(`${name} reassessed - score updated!`, "success");
  };

  const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  return (
    <div>
      <DashboardHeader title="Readiness Assessment" subtitle="Track your accreditation readiness across all areas" />
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-gold mb-3">
              <span className="text-2xl font-bold text-navy">{overallScore}%</span>
            </div>
            <p className="text-sm text-gray-500">Overall Readiness Score</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => toast("Running full assessment...", "info")}><RefreshCw className="w-3 h-3" /> Run Full Assessment</Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  {cat.status === "good" ? <CheckCircle className="w-5 h-5 text-gold" /> : cat.status === "warning" ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                  <Badge variant={cat.status === "good" ? "success" : cat.status === "warning" ? "warning" : "error"}>{cat.score}%</Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{cat.passed} of {cat.items} items passed</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div className={`h-full rounded-full ${cat.status === "good" ? "bg-navy" : cat.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${cat.score}%` }} />
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleReassess(cat.name)}>Reassess</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
