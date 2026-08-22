"use client";

import { useState, useCallback } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Search, RefreshCw, Newspaper } from "lucide-react";
import { newsApi, referenceApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { PageLoader } from "@/components/ui/page-loader";
import type { NewsArticle } from "@/lib/api/endpoints";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "business", label: "Business" },
  { value: "health", label: "Health" },
  { value: "technology", label: "Technology" },
  { value: "top", label: "Top Stories" },
];

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col h-full"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
        {article.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-44 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <CardContent className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            {article.category && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gold bg-gold/8 px-2 py-0.5 rounded-full">
                {article.category}
              </span>
            )}
            <span className="text-[10px] text-navy/35 ml-auto">
              {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
          <h3 className="text-[13px] font-semibold text-navy leading-snug line-clamp-3 group-hover:text-gold-dark transition-colors flex-1">
            {article.title}
          </h3>
          {article.summary && (
            <p className="text-[11px] text-navy/50 mt-2 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>
          )}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-navy/5">
            <span className="text-[11px] text-navy/40 font-medium truncate max-w-[60%]">
              {article.source ?? "News"}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-gold-dark font-semibold">
              Read <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <div className="w-full h-44 bg-navy/5 animate-pulse" />
      <CardContent className="p-4 space-y-2">
        <div className="h-3 w-16 bg-navy/5 rounded animate-pulse" />
        <div className="h-4 bg-navy/5 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-navy/5 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-navy/5 rounded animate-pulse mt-3" />
      </CardContent>
    </Card>
  );
}

export default function NewsPage() {
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const countries = useApi(() => referenceApi.countries(), []);

  const feed = useApi(
    () => q
      ? newsApi.search({ q, category: category || undefined, country: country || undefined, page: 0, size: 30 })
      : newsApi.feed({
          category: category || undefined,
          country: country || undefined,
          page: 0,
          size: 30,
        }),
    [category, country, q],
  );

  const handleSearch = useCallback(() => {
    setQ(searchInput.trim());
  }, [searchInput]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const items: NewsArticle[] = Array.isArray(feed.data)
    ? feed.data
    : (feed.data as { content?: NewsArticle[] } | null)?.content ?? [];

  return (
    <div>
      <DashboardHeader
        title="Financial News"
        subtitle="Latest business, health & market headlines"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-navy/8 rounded-xl px-3.5 py-2.5 flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-navy/30 shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search headlines…"
              className="text-[13px] outline-none flex-1 bg-transparent placeholder:text-navy/30"
            />
            {searchInput && (
              <button onClick={() => { setSearchInput(""); setQ(""); }} className="text-navy/30 hover:text-navy/60 text-xs">✕</button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1 bg-white border border-navy/8 rounded-xl p-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all ${
                  category === c.value
                    ? "bg-navy text-white shadow-sm"
                    : "text-navy/50 hover:text-navy hover:bg-navy/5"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Country */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="text-[12px] border border-navy/8 rounded-xl px-3 py-2.5 bg-white text-navy/70 outline-none"
          >
            <option value="">Default country</option>
            {(countries.data ?? []).map((c) => (
              <option key={c.code} value={c.code.toLowerCase()}>{c.name}</option>
            ))}
          </select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => feed.refetch()}
            disabled={feed.loading}
            className="ml-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${feed.loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Active search indicator */}
        {q && (
          <div className="flex items-center gap-2 text-[12px] text-navy/50">
            Showing results for <span className="font-semibold text-navy">"{q}"</span>
            <button onClick={() => { setQ(""); setSearchInput(""); }} className="text-gold-dark underline">Clear</button>
          </div>
        )}

        {/* Grid */}
        {feed.loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : feed.error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-sm text-red-600 font-medium">{feed.error}</p>
            <Button variant="outline" size="sm" onClick={() => feed.refetch()}>Try again</Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-navy/25" />
            </div>
            <p className="text-[13px] text-navy/40 font-medium">No articles found</p>
            {(q || category || country) && (
              <Button variant="ghost" size="sm" onClick={() => { setQ(""); setSearchInput(""); setCategory(""); setCountry(""); }}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((a) => <NewsCard key={a.id} article={a} />)}
            </div>
            <p className="text-center text-[11px] text-navy/30 pt-2">{items.length} articles loaded</p>
          </>
        )}
      </div>
    </div>
  );
}
