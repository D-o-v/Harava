"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/lib/toast";
import { ClipboardCheck, Trophy, Clock, BarChart3 } from "lucide-react";

export default function AssessmentPage() {
  const { toast } = useToast();
  const [quizModal, setQuizModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  const assessments = [
    { id: 1, title: "Financial Analysis Midterm", course: "Financial Statement Analysis", questions: 25, timeLimit: "45 min", status: "available", score: null },
    { id: 2, title: "Cash Flow Quiz 2", course: "Cash Flow Forecasting", questions: 15, timeLimit: "20 min", status: "available", score: null },
    { id: 3, title: "AI Concepts Final", course: "AI in Accounting", questions: 30, timeLimit: "60 min", status: "completed", score: 92 },
    { id: 4, title: "Intro Quiz", course: "Financial Statement Analysis", questions: 10, timeLimit: "15 min", status: "completed", score: 85 },
  ];

  const demoQuestions = [
    { q: "What is the primary purpose of a cash flow statement?", options: ["Show profitability", "Track cash movements", "Record assets", "Calculate taxes"], answer: 1 },
    { q: "Which ratio measures liquidity?", options: ["Debt-to-equity", "Current ratio", "Gross margin", "ROI"], answer: 1 },
    { q: "EBITDA stands for?", options: ["Earnings Before Interest, Taxes, Depreciation & Amortization", "Earnings By Internal Tax Deduction Analysis", "External Balance In Total Debt Assessment", "None of the above"], answer: 0 },
  ];

  const handleStartQuiz = () => {
    setQuizModal(true);
    setCurrentQuestion(0);
    setScore(null);
  };

  const handleAnswer = (idx: number) => {
    if (currentQuestion < demoQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const finalScore = Math.floor(Math.random() * 20) + 80;
      setScore(finalScore);
      toast(`Quiz completed! Score: ${finalScore}%`, "success");
    }
  };

  return (
    <div>
      <DashboardHeader title="Assessments" subtitle="Test your knowledge and track progress" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Trophy className="w-8 h-8 text-amber-500" /><div><p className="text-xl font-bold">88%</p><p className="text-xs text-gray-500">Avg Score</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><ClipboardCheck className="w-8 h-8 text-gold" /><div><p className="text-xl font-bold">2</p><p className="text-xs text-gray-500">Completed</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><Clock className="w-8 h-8 text-violet-500" /><div><p className="text-xl font-bold">2</p><p className="text-xs text-gray-500">Available</p></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>All Assessments</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto"><table className="w-full text-sm min-w-150">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Assessment</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Course</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Questions</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Time</th>
                  <th className="text-center px-6 py-3 font-medium text-gray-500">Score</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {assessments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{a.title}</td>
                    <td className="px-6 py-3 text-gray-600">{a.course}</td>
                    <td className="px-6 py-3 text-center">{a.questions}</td>
                    <td className="px-6 py-3 text-center">{a.timeLimit}</td>
                    <td className="px-6 py-3 text-center">{a.score ? <Badge variant="success">{a.score}%</Badge> : "—"}</td>
                    <td className="px-6 py-3 text-right">
                      {a.status === "available" ? (
                        <Button variant="primary" size="sm" onClick={handleStartQuiz}>Start</Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => toast("Viewing results...", "info")}>Results</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={quizModal} onClose={() => setQuizModal(false)} title="Quick Assessment">
        <div className="space-y-4">
          {score === null ? (
            <>
              <p className="text-xs text-gray-500">Question {currentQuestion + 1} of {demoQuestions.length}</p>
              <p className="text-sm font-medium text-gray-900">{demoQuestions[currentQuestion].q}</p>
              <div className="space-y-2">
                {demoQuestions[currentQuestion].options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(i)} className="w-full text-left p-3 border rounded-lg hover:bg-violet-50 hover:border-violet-300 text-sm transition-colors">{opt}</button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="text-lg font-bold text-gray-900">Score: {score}%</p>
              <p className="text-sm text-gray-500 mt-1">Great job! Keep learning.</p>
              <Button variant="primary" className="mt-4" onClick={() => setQuizModal(false)}>Close</Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
