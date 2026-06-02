"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

const aiResponses = [
  "Based on your financial data, I can see that Q2 revenue is trending 12% above projections. Would you like me to generate a detailed forecast?",
  "I've analyzed your compliance documents and found 3 areas that need attention before the upcoming audit. Shall I create action items?",
  "Your learning progress shows strong momentum! You're on track to complete your certification by the end of this month.",
  "I've identified potential cost savings of $23K in vendor consolidation. Would you like me to prepare a recommendation report?",
  "Looking at your accreditation timeline, all documentation is on track. The next milestone is the mock survey scheduled for next week.",
];

export function AiChatView() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "ai", content: "Hello! I'm your Harava AI assistant. I can help with financial analysis, accreditation guidance, learning recommendations, and more. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: messages.length + 1, role: "user", content: input };
    const aiMsg: Message = { id: messages.length + 2, role: "ai", content: aiResponses[Math.floor(Math.random() * aiResponses.length)] };
    setMessages([...messages, userMsg, aiMsg]);
    setInput("");
  };

  const suggestions = [
    "Summarize my financial performance this quarter",
    "What's my accreditation readiness score?",
    "Recommend courses based on my progress",
    "Show me pending approvals and deadlines",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <DashboardHeader title="AI Assistant" subtitle="Ask anything across FinSight, AccrediAI, or ProEd" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-navy" />
                </div>
              )}
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-navy text-white" : "bg-white border text-navy"}`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-navy/60" />
                </div>
              )}
            </div>
          ))}

          {messages.length === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInput(s)} className="text-left p-3 border rounded-lg hover:bg-navy/5 hover:border-gold/50 text-xs text-navy/60 transition-colors">
                  <Sparkles className="w-3 h-3 text-gold inline mr-1" />{s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-3 sm:p-4 bg-white">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-[3px] focus:ring-gold/30"
          />
          <Button variant="primary" onClick={handleSend} disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
