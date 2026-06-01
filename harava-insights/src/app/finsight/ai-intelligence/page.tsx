"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Brain, Sparkles, TrendingUp, AlertTriangle, Send } from "lucide-react";

export default function AiIntelligencePage() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<{ q: string; a: string }[]>([]);

  const anomalies = [
    { id: 1, title: "Unusual expense spike in Marketing", severity: "high", amount: "$12,400", date: "Jun 1, 2026" },
    { id: 2, title: "Revenue drop in Product Line B", severity: "medium", amount: "-$8,200", date: "May 28, 2026" },
    { id: 3, title: "Duplicate vendor payment detected", severity: "high", amount: "$3,450", date: "May 30, 2026" },
  ];

  const predictions = [
    { metric: "Monthly Revenue", current: "$245K", predicted: "$268K", trend: "up", confidence: 87 },
    { metric: "Operating Costs", current: "$156K", predicted: "$162K", trend: "up", confidence: 79 },
    { metric: "Net Profit Margin", current: "18.2%", predicted: "19.1%", trend: "up", confidence: 72 },
  ];

  const handleAsk = () => {
    if (!query.trim()) return;
    const answers = [
      "Based on your financial data, cash flow is projected to remain positive for the next 90 days with a comfortable buffer of $125K.",
      "Analysis shows your top expense categories are: Payroll (45%), Marketing (22%), Operations (18%), and Other (15%).",
      "Your accounts receivable aging shows 12% of invoices are past 60 days. Recommend follow-up on 3 specific clients.",
    ];
    setResponses((prev) => [...prev, { q: query, a: answers[Math.floor(Math.random() * answers.length)] }]);
    setQuery("");
  };

  return (
    <div>
      <DashboardHeader title="AI Intelligence" subtitle="AI-powered financial analytics and anomaly detection" />
      <div className="p-6 space-y-6">
        {/* Ask AI */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-500" /> Ask AI About Your Finances</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAsk()} placeholder="Ask anything about your financial data..." className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-300" />
              <Button variant="primary" onClick={handleAsk} disabled={!query.trim()}><Send className="w-4 h-4" /></Button>
            </div>
            {responses.length > 0 && (
              <div className="mt-4 space-y-3">
                {responses.map((r, i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Q: {r.q}</p>
                    <p className="text-sm text-gray-800">{r.a}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Anomalies */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Detected Anomalies</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {anomalies.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.date} • {a.amount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={a.severity === "high" ? "error" : "warning"}>{a.severity}</Badge>
                    <Button variant="outline" size="sm" onClick={() => toast("Investigating anomaly...", "info")}>Investigate</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Predictions */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> AI Predictions (Next 30 days)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {predictions.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.metric}</p>
                    <p className="text-xs text-gray-500">Current: {p.current} → Predicted: {p.predicted}</p>
                  </div>
                  <Badge variant="success">{p.confidence}% confidence</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
