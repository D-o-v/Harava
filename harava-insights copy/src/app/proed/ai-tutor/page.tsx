"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Brain, Send, User, Sparkles } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

export default function AiTutorPage() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "ai", text: "Hello! I'm your AI tutor. Ask me anything about your courses, or I can help you study for upcoming assessments. What would you like to learn about today?" },
  ]);

  const aiResponses = [
    "Great question! In financial analysis, the current ratio is calculated by dividing current assets by current liabilities. A ratio above 1 indicates good short-term liquidity.",
    "Cash flow forecasting involves projecting future cash inflows and outflows. The three main methods are: direct method, indirect method, and the discounted cash flow (DCF) approach.",
    "EBITDA is a useful metric because it allows comparison between companies regardless of their capital structure, tax jurisdiction, or depreciation policies.",
    "I recommend reviewing Module 3 of your Financial Statement Analysis course - it covers ratio interpretation in detail. Would you like me to create a study plan?",
    "For your upcoming assessment, focus on: 1) Understanding income statement components, 2) Balance sheet relationships, and 3) Cash flow statement preparation.",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: messages.length + 1, role: "user", text: input };
    const aiMsg: Message = { id: messages.length + 2, role: "ai", text: aiResponses[Math.floor(Math.random() * aiResponses.length)] };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  const suggestions = [
    "Explain the difference between accrual and cash accounting",
    "Help me prepare for my Financial Analysis exam",
    "What are the key financial ratios I should know?",
    "Create a study plan for this week",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <DashboardHeader title="AI Tutor" subtitle="Your personal learning assistant" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-violet-600" />
                </div>
              )}
              <div className={`max-w-md rounded-lg px-4 py-3 text-sm ${msg.role === "user" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                {msg.text}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {messages.length === 1 && (
            <div className="grid grid-cols-2 gap-2 mt-6">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => { setInput(s); }} className="text-left p-3 border rounded-lg hover:bg-violet-50 hover:border-violet-300 text-xs text-gray-600 transition-colors">
                  <Sparkles className="w-3 h-3 text-violet-400 inline mr-1" />{s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-4 bg-white">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything about your courses..."
            className="flex-1 border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-300"
          />
          <Button variant="primary" onClick={handleSend} disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
