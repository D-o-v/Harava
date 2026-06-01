"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Award, Download, Share2, ExternalLink } from "lucide-react";

export default function CertificatesPage() {
  const { toast } = useToast();

  const certificates = [
    { id: 1, title: "AI & Digital Finance", issueDate: "May 15, 2026", credentialId: "HARAVA-AI-2026-0451", track: "AI & Digital Finance", score: 94 },
    { id: 2, title: "Financial Statement Analysis - Level 1", issueDate: "Apr 20, 2026", credentialId: "HARAVA-FSA-2026-0298", track: "Chartered Accountant Path", score: 88 },
    { id: 3, title: "Cash Flow Management Basics", issueDate: "Mar 10, 2026", credentialId: "HARAVA-CFM-2026-0167", track: "Chartered Accountant Path", score: 91 },
  ];

  return (
    <div>
      <DashboardHeader title="Certificates" subtitle="Your earned credentials and achievements" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4">
          {certificates.map((cert) => (
            <Card key={cert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                    <Award className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cert.title}</h3>
                    <p className="text-xs text-gray-500">Track: {cert.track} • Score: {cert.score}%</p>
                    <p className="text-xs text-gray-400 mt-1">Issued: {cert.issueDate} • ID: {cert.credentialId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast("Certificate downloaded!", "success")}>
                    <Download className="w-3 h-3" /> Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast("Share link copied to clipboard!", "success")}>
                    <Share2 className="w-3 h-3" /> Share
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toast("Verifying credential...", "info")}>
                    <ExternalLink className="w-3 h-3" /> Verify
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
