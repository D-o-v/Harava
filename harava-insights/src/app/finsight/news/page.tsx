"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";
import { newsApi, referenceApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";

export default function NewsPage() {
  const [category, setCategory] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [q, setQ] = useState("");

  const countries = useApi(() => referenceApi.countries(), []);
  const feed = useApi(
    () => newsApi.feed({ category: category || undefined, country: country || undefined, q: q || undefined }),
    [category, country, q],
  );

  const items = Array.isArray(feed.data) ? feed.data : feed.data?.content ?? [];

  return (
    <div>
      <DashboardHeader title="Financial News" subtitle="Latest business & finance headlines" />
      <div className="p-6 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search headlines…" className="border rounded-lg px-3 py-2 text-sm w-64" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All categories</option>
            <option value="business">Business</option>
            <option value="health">Health</option>
            <option value="technology">Technology</option>
            <option value="general">General</option>
          </select>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">Default country</option>
            {(countries.data ?? []).map((c) => <option key={c.code} value={c.code.toLowerCase()}>{c.name}</option>)}
          </select>
        </div>

        {feed.loading ? (
          <div className="flex items-center gap-2 text-navy/50 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
        ) : feed.error ? (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{feed.error}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((a) => (
              <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="block group">
                <Card className="hover:shadow-md transition-all h-full">
                  {a.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.imageUrl} alt="" className="w-full h-40 object-cover rounded-t-xl" />
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-[10px] text-navy/40 mb-1">
                      <span className="uppercase font-semibold">{a.source ?? a.category}</span>
                      <span>·</span>
                      <span>{new Date(a.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-navy group-hover:text-gold-dark line-clamp-3">{a.title}</h3>
                    {a.summary && <p className="text-xs text-navy/60 mt-2 line-clamp-3">{a.summary}</p>}
                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold-dark font-medium">Read <ExternalLink className="w-3 h-3" /></span>
                  </CardContent>
                </Card>
              </a>
            ))}
            {items.length === 0 && <div className="col-span-full text-sm text-navy/40 text-center py-12">No articles.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
