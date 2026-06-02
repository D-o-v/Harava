"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/lib/auth";
import { MessageSquare, ThumbsUp, Users, Send } from "lucide-react";

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  topic: string;
  likes: number;
  replies: number;
  time: string;
  liked: boolean;
}

export default function CommunityPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, author: "Sarah Chen", avatar: "SC", content: "Just passed my Financial Analysis certification with 94%! The case studies in Module 7 were incredibly helpful.", topic: "Achievements", likes: 24, replies: 8, time: "2h ago", liked: false },
    { id: 2, author: "Michael Roberts", avatar: "MR", content: "Anyone else finding the transfer pricing section challenging? Would love to form a study group.", topic: "Study Groups", likes: 12, replies: 15, time: "4h ago", liked: false },
    { id: 3, author: "Priya Sharma", avatar: "PS", content: "The AI Tutor feature just helped me understand DCF models in 20 minutes - what took me days in textbooks!", topic: "Tips", likes: 31, replies: 5, time: "6h ago", liked: false },
    { id: 4, author: "James O'Brien", avatar: "JO", content: "Pro tip: Use the template library for your assignments. The financial model templates saved me hours.", topic: "Tips", likes: 18, replies: 3, time: "1d ago", liked: false },
  ]);

  const handleLike = (id: number) => {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = { id: posts.length + 1, author: `${user?.firstName} ${user?.lastName}`, avatar: `${user?.firstName?.[0]}${user?.lastName?.[0]}`, content: newPost, topic: "General", likes: 0, replies: 0, time: "Just now", liked: false };
    setPosts([post, ...posts]);
    setNewPost("");
    toast("Post published!", "success");
  };

  return (
    <div>
      <DashboardHeader title="Community" subtitle="Connect with fellow learners" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3"><Users className="w-8 h-8 text-violet-500" /><div><p className="text-xl font-bold">2,450</p><p className="text-xs text-gray-500">Members</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><MessageSquare className="w-8 h-8 text-navy" /><div><p className="text-xl font-bold">186</p><p className="text-xs text-gray-500">Active Discussions</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3"><ThumbsUp className="w-8 h-8 text-gold" /><div><p className="text-xl font-bold">1.2k</p><p className="text-xs text-gray-500">Helpful Answers</p></div></CardContent></Card>
        </div>

        {/* New Post */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-600">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1">
                <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Share something with the community..." className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-violet-300 resize-none" rows={2} />
                <div className="flex justify-end mt-2">
                  <Button variant="primary" size="sm" onClick={handlePost} disabled={!newPost.trim()}><Send className="w-3 h-3" /> Post</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{post.author}</span>
                      <Badge variant="default">{post.topic}</Badge>
                      <span className="text-xs text-gray-400">{post.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                    <div className="flex gap-4">
                      <button onClick={() => handleLike(post.id)} className={`flex items-center gap-1 text-xs ${post.liked ? "text-violet-600" : "text-gray-400"} hover:text-violet-600`}>
                        <ThumbsUp className="w-3 h-3" /> {post.likes}
                      </button>
                      <button onClick={() => toast("Opening thread...", "info")} className="flex items-center gap-1 text-xs text-gray-400 hover:text-navy">
                        <MessageSquare className="w-3 h-3" /> {post.replies} replies
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
