"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { Search, BookOpen, Clock, Users } from "lucide-react";

interface Course {
  id: number;
  title: string;
  category: string;
  duration: string;
  enrolled: number;
  rating: number;
  status: "enrolled" | "available" | "completed";
}

export default function CoursesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: "Financial Statement Analysis", category: "Finance", duration: "12 hours", enrolled: 342, rating: 4.8, status: "enrolled" },
    { id: 2, title: "Cash Flow Forecasting", category: "Finance", duration: "8 hours", enrolled: 218, rating: 4.7, status: "enrolled" },
    { id: 3, title: "AI in Accounting & Finance", category: "Technology", duration: "10 hours", enrolled: 445, rating: 4.9, status: "enrolled" },
    { id: 4, title: "Advanced Tax Planning", category: "Tax", duration: "14 hours", enrolled: 156, rating: 4.6, status: "available" },
    { id: 5, title: "Leadership Essentials", category: "Leadership", duration: "6 hours", enrolled: 289, rating: 4.5, status: "available" },
    { id: 6, title: "Client Advisory Skills", category: "Advisory", duration: "8 hours", enrolled: 178, rating: 4.4, status: "available" },
    { id: 7, title: "Risk Management Fundamentals", category: "Finance", duration: "10 hours", enrolled: 134, rating: 4.3, status: "available" },
    { id: 8, title: "Audit & Compliance", category: "Compliance", duration: "12 hours", enrolled: 95, rating: 4.7, status: "completed" },
  ]);

  const handleEnroll = (id: number) => {
    setCourses((prev) => prev.map((c) => c.id === id ? { ...c, status: "enrolled" as const } : c));
    toast("Enrolled successfully! Course added to your learning track.", "success");
  };

  const filteredCourses = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || c.category.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <DashboardHeader title="Course Library" subtitle="Browse and enroll in courses" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-sm outline-none w-64" />
          </div>
          <div className="flex gap-2">
            {["all", "Finance", "Technology", "Tax", "Leadership", "Advisory"].map((cat) => (
              <Button key={cat} variant={category === cat ? "primary" : "outline"} size="sm" onClick={() => setCategory(cat)}>
                {cat === "all" ? "All" : cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={course.status === "enrolled" ? "success" : course.status === "completed" ? "info" : "default"}>
                    {course.status}
                  </Badge>
                  <span className="text-xs text-amber-600">⭐ {course.rating}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{course.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{course.category}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrolled} enrolled</span>
                </div>
                {course.status === "available" ? (
                  <Button variant="primary" size="sm" className="w-full" onClick={() => handleEnroll(course.id)}>Enroll Now</Button>
                ) : course.status === "enrolled" ? (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => toast("Resuming course...", "info")}>Continue Learning</Button>
                ) : (
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => toast("Viewing certificate...", "info")}>View Certificate</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
