"use client";

import { useState, useCallback } from "react";
import { HeroSection } from "@/components/hero-section";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { SearchStats } from "@/components/search-stats";
import { AlertCircle } from "lucide-react";
import type { SearchResponse } from "@/types";

export default function Home() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [lastLimit, setLastLimit] = useState(100);
  const [duration, setDuration] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    async (query: string, limit: number, lang: string) => {
      setIsLoading(true);
      setError(null);
      setResults(null);
      setLastQuery(query);
      setLastLimit(limit);
      setHasSearched(true);

      const start = Date.now();

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, limit, lang }),
        });

        const data = await response.json();
        const elapsed = Date.now() - start;
        setDuration(elapsed);

        if (!response.ok) {
          setError(data.error || data.message || "Search failed. Please try again.");
        } else {
          setResults(data);
        }
      } catch {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">GL</span>
            </div>
            <span className="font-semibold text-foreground">Goluleaks.com</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-accent" />
            API Connected
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-10">
          {/* Hero */}
          {!hasSearched && <HeroSection />}

          {/* Search form */}
          <div className="flex flex-col gap-3">
            {hasSearched && (
              <h2 className="text-2xl font-bold text-foreground">Search</h2>
            )}
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-muted" />
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute inset-0" />
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">Searching databases...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This may take a few seconds
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Results */}
          {results && !isLoading && (
            <div className="flex flex-col gap-4">
              <SearchStats
                query={lastQuery}
                limit={lastLimit}
                duration={duration}
              />
              <SearchResults data={results} query={lastQuery} />
            </div>
          )}

          {/* Empty state hint cards */}
          {!hasSearched && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col gap-2 p-5 rounded-lg bg-card border border-border">
                <p className="font-medium text-foreground text-sm">Email Search</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Search by email address to find associated accounts and data entries.
                </p>
                <code className="text-xs font-mono text-primary mt-1 bg-primary/5 px-2 py-1 rounded">
                  example@gmail.com
                </code>
              </div>
              <div className="flex flex-col gap-2 p-5 rounded-lg bg-card border border-border">
                <p className="font-medium text-foreground text-sm">Name Search</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Look up individuals by full name across all available databases.
                </p>
                <code className="text-xs font-mono text-primary mt-1 bg-primary/5 px-2 py-1 rounded">
                  John Smith
                </code>
              </div>
              <div className="flex flex-col gap-2 p-5 rounded-lg bg-card border border-border">
                <p className="font-medium text-foreground text-sm">Username Search</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Find accounts linked to a specific username or phone number.
                </p>
                <code className="text-xs font-mono text-primary mt-1 bg-primary/5 px-2 py-1 rounded">
                  +1234567890
                </code>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>Goluleaks.com</span>
          <span>OSINT Intelligence Platform</span>
        </div>
      </footer>
    </main>
  );
}
