"use client";

import React, { useState } from "react";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { SearchFormProps, Language } from "@/types";

const languages: Language[] = [
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
];

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState("100");
  const [lang, setLang] = useState("en");
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), Number(limit), lang);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by email, name, phone, username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 h-12 text-base bg-card text-card-foreground border-border placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>

      <Collapsible open={showOptions} onOpenChange={setShowOptions}>
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary px-3 h-9 text-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Advanced Options
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="flex flex-wrap gap-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex flex-col gap-2 min-w-[180px]">
              <Label htmlFor="limit" className="text-sm font-medium text-foreground">
                Result Limit
              </Label>
              <Select value={limit} onValueChange={setLimit}>
                <SelectTrigger id="limit" className="w-[180px] bg-card text-card-foreground border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 results</SelectItem>
                  <SelectItem value="300">300 results</SelectItem>
                  <SelectItem value="500">500 results</SelectItem>
                  <SelectItem value="1000">1,000 results</SelectItem>
                  <SelectItem value="5000">5,000 results</SelectItem>
                  <SelectItem value="10000">10,000 results</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 min-w-[180px]">
              <Label htmlFor="lang" className="text-sm font-medium text-foreground">
                Language
              </Label>
              <Select value={lang} onValueChange={setLang}>
                <SelectTrigger id="lang" className="w-[180px] bg-card text-card-foreground border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </form>
  );
}
