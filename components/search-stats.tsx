"use client";

import { Clock, DollarSign, Hash } from "lucide-react";

interface SearchStatsProps {
  query: string;
  limit: number;
  duration: number;
}

function calculateCost(query: string, limit: number): string {
  const words = query
    .split(/\s+/)
    .filter((w) => {
      if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(w)) return false;
      if (w.length < 4) return false;
      if (/^\d+$/.test(w) && w.length < 6) return false;
      return true;
    });

  let complexity: number;
  const wordCount = words.length;
  if (wordCount <= 1) complexity = 1;
  else if (wordCount === 2) complexity = 5;
  else if (wordCount === 3) complexity = 16;
  else complexity = 40;

  const cost = 0.0002 * (5 + Math.sqrt(limit * complexity));
  return cost.toFixed(4);
}

export function SearchStats({ query, limit, duration }: SearchStatsProps) {
  const cost = calculateCost(query, limit);

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        <span>{(duration / 1000).toFixed(2)}s</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Hash className="h-3.5 w-3.5" />
        <span>Limit: {limit}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <DollarSign className="h-3.5 w-3.5" />
        <span>Est. cost: ${cost}</span>
      </div>
    </div>
  );
}
