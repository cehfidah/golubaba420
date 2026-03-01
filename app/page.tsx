"use client";

import { useState, useCallback, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { IntroAnimation } from "@/components/intro-animation";
import { SearchForm } from "@/components/search-form";
import { SearchResults } from "@/components/search-results";
import { SearchStats } from "@/components/search-stats";
import { IntelligenceDisplay } from "@/components/intelligence-display";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { SearchResponse } from "@/types";

const WATCHLIST_STORAGE_KEY = "golubaba420_surveillance_watchlist";

function normalizeWatchlistItem(value: string): string {
  return value.trim().toLowerCase();
}

function getTotalResultCount(data: SearchResponse): number {
  return Object.keys(data.List).reduce((acc, db) => {
    if (db === "No results found") return acc;
    return acc + (data.List[db]?.Data?.length || 0);
  }, 0);
}

export default function Home() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showIntelligence, setShowIntelligence] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [lastLimit, setLastLimit] = useState(100);
  const [duration, setDuration] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        setWatchlist(parsed.filter((item) => typeof item === "string"));
      }
    } catch {
      setWatchlist([]);
    }
  }, []);

  const persistWatchlist = useCallback((items: string[]) => {
    setWatchlist(items);
    window.localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
  }, []);

  const handleAddToSurveillanceList = useCallback(
    (targetQuery: string) => {
      const normalized = normalizeWatchlistItem(targetQuery);
      if (!normalized) return;

      if (watchlist.includes(normalized)) {
        toast.message("Target already on surveillance list", {
          description: "Existing watcher active. You will receive alert when new records appear.",
        });
        return;
      }

      const next = [...watchlist, normalized];
      persistWatchlist(next);

      toast.success("Target added to surveillance list", {
        description: "When system uptime returns and a new record appears, an alert will be triggered.",
      });
    },
    [persistWatchlist, watchlist]
  );

  const handleRemoveFromSurveillanceList = useCallback(
    (targetQuery: string) => {
      const normalized = normalizeWatchlistItem(targetQuery);
      const next = watchlist.filter((item) => item !== normalized);
      persistWatchlist(next);
      toast.message("Target removed from surveillance list");
    },
    [persistWatchlist, watchlist]
  );

  const handleClearSurveillanceList = useCallback(() => {
    persistWatchlist([]);
    toast.message("Surveillance list cleared");
  }, [persistWatchlist]);

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
          if (response.status === 401) {
            setIsUnlocked(false);
            setError("Access signature expired. Re-initialize intelligence clearance to continue.");
            return;
          }
          setError(
            data.error ||
              data.message ||
              "Surveillance uplink interrupted. Retry when tactical network is stable."
          );
        } else {
          setResults(data);

          const normalizedQuery = normalizeWatchlistItem(query);
          const totalResults = getTotalResultCount(data);

          if (totalResults > 0 && watchlist.includes(normalizedQuery)) {
            const nextWatchlist = watchlist.filter((item) => item !== normalizedQuery);
            persistWatchlist(nextWatchlist);
            toast.success("Surveillance Alert", {
              description: "New record found for your tracked keyword/number.",
            });
          }
        }
      } catch {
        setError(
          "Encrypted uplink lost. Verify secure channel and reattempt intelligence scan."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [persistWatchlist, watchlist]
  );

  const handleUnlock = useCallback(async (pin: string) => {
    setError(null);

    const response = await fetch("/api/auth/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    const data = await response.json();

    if (!response.ok) {
      setIsUnlocked(false);
      throw new Error(data.error || "Intelligence code rejected. Clearance denied.");
    }

    setIsUnlocked(true);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Step 1: Intro Animation */}
      {showIntro && (
        <IntroAnimation
          onComplete={() => {
            setShowIntro(false);
            setShowIntelligence(true);
          }}
        />
      )}

      {/* Step 2: Intelligence Page */}
      {showIntelligence && !showIntro && (
        <IntelligenceDisplay
          onClose={() => setShowIntelligence(false)}
          showNavigationButtons={true}
          isFlow={true}
        />
      )}

      {/* Step 3: Search Page (Main Interface) */}
      {!showIntro && !showIntelligence && (
        <>
          {/* Header */}
          <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="/logo.png"
                  alt="Golubaba420 Logo"
                  className="h-16 w-16 rounded-lg shadow-lg"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-2xl text-foreground">Golubaba420</span>
                  <span className="text-xs text-muted-foreground">OSINT Intelligence Platform</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-medium text-primary">
                  Surveillance Watchlist: {watchlist.length}
                </span>
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
                {hasSearched && <h2 className="text-2xl font-bold text-foreground">Search</h2>}
                <SearchForm
                  onSearch={handleSearch}
                  onUnlock={async (pin) => {
                    try {
                      await handleUnlock(pin);
                    } catch (unlockError) {
                      if (unlockError instanceof Error) {
                        setError(unlockError.message);
                        return;
                      }
                      setError("Intelligence code handshake failed. Retry secure authorization.");
                    }
                  }}
                  isUnlocked={isUnlocked}
                  isLoading={isLoading}
                />

                {watchlist.length > 0 && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Tracked Targets</p>
                        <p className="text-xs text-muted-foreground">
                          Monitoring {watchlist.length} keyword{watchlist.length === 1 ? "" : "s"} for
                          new records.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearSurveillanceList}
                        className="text-xs px-3 py-1.5 rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 w-fit"
                      >
                        Clear List
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {watchlist.map((item) => (
                        <div
                          key={item}
                          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5"
                        >
                          <span className="text-xs font-medium text-primary">{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromSurveillanceList(item)}
                            className="text-[10px] leading-none text-primary/80 hover:text-primary"
                            aria-label={`Remove ${item} from surveillance list`}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-muted" />
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute inset-0" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-medium">Executing surveillance intelligence sweep...</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Syncing uplink nodes and correlating record clusters
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
                  <SearchStats query={lastQuery} limit={lastLimit} duration={duration} />
                  <SearchResults
                    data={results}
                    query={lastQuery}
                    onAddToSurveillanceList={handleAddToSurveillanceList}
                  />
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
              <span>Golubaba420.online</span>
              <span>OSINT Intelligence Platform</span>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}
