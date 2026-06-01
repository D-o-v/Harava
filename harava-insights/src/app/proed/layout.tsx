"use client";

import { DashboardSidebar, NavItem } from "@/components/layout/dashboard-sidebar";
import {
  LayoutDashboard,
  Brain,
  BookOpen,
  Route,
  Play,
  MessageSquare,
  FlaskConical,
  ClipboardList,
  FileBox,
  Award,
  Users,
  Building,
} from "lucide-react";

const navigation: NavItem[] = [
  { title: "Dashboard", href: "/proed", icon: LayoutDashboard },
  { title: "Skills Assessment", href: "/proed/assessment", icon: Brain },
  { title: "Course Library", href: "/proed/courses", icon: BookOpen },
  { title: "Learning Tracks", href: "/proed/tracks", icon: Route },
  { title: "AI Tutor", href: "/proed/ai-tutor", icon: MessageSquare },
  { title: "Case Study Lab", href: "/proed/case-studies", icon: FlaskConical },
  { title: "Assignments", href: "/proed/assignments", icon: ClipboardList },
  { title: "Template Library", href: "/proed/templates", icon: FileBox },
  { title: "Certificates", href: "/proed/certificates", icon: Award },
  { title: "Community", href: "/proed/community", icon: Users },
  { title: "Employer Dashboard", href: "/proed/employer", icon: Building },
];

export default function ProEdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar navigation={navigation} product="proed" />
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}
