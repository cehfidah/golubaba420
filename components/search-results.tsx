"use client";

import { useState } from "react";
import {
  Download,
  ChevronDown,
  ChevronUp,
  Database,
  Copy,
  Check,
  FileJson,
  FileText,
  FileDown,
  AlertCircle,
} from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SearchResultsProps } from "@/types";

export function SearchResults({ data, query }: SearchResultsProps) {
  const [expandedDbs, setExpandedDbs] = useState<Set<string>>(new Set());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!data || !data.List) {
    return null;
  }

  const databases = Object.keys(data.List);
  const totalResults = databases.reduce((acc, db) => {
    if (db === "No results found") return acc;
    return acc + (data.List[db]?.Data?.length || 0);
  }, 0);

  const toggleDb = (db: string) => {
    const newExpanded = new Set(expandedDbs);
    if (newExpanded.has(db)) {
      newExpanded.delete(db);
    } else {
      newExpanded.add(db);
    }
    setExpandedDbs(newExpanded);
  };

  const expandAll = () => {
    setExpandedDbs(new Set(databases));
  };

  const collapseAll = () => {
    setExpandedDbs(new Set());
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `search-${query.replace(/\s+/g, "_")}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const allColumns = new Set<string>();
    const rows: Record<string, string>[] = [];

    for (const db of databases) {
      if (db === "No results found") continue;
      const dbData = data.List[db];
      if (dbData?.Data) {
        for (const record of dbData.Data) {
          const row: Record<string, string> = { "Source Database": db };
          for (const key of Object.keys(record)) {
            allColumns.add(key);
            row[key] = String(record[key] ?? "");
          }
          rows.push(row);
        }
      }
    }

    const columns = ["Source Database", ...Array.from(allColumns)];
    const csvContent = [
      columns.map((c) => `"${c}"`).join(","),
      ...rows.map((row) =>
        columns.map((c) => `"${(row[c] || "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `search-${query.replace(/\s+/g, "_")}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    generatePDF(data, query);
  };

  const downloadTXT = () => {
    let text = `Search Results for: "${query}"\n`;
    text += `${"=".repeat(50)}\n\n`;

    for (const db of databases) {
      const dbData = data.List[db];
      text += `--- ${db} ---\n`;
      text += `${dbData?.InfoLeak || ""}\n\n`;
      if (db !== "No results found" && dbData?.Data) {
        for (const record of dbData.Data) {
          for (const [key, value] of Object.entries(record)) {
            text += `  ${key}: ${value}\n`;
          }
          text += "\n";
        }
      }
      text += "\n";
    }

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `search-${query.replace(/\s+/g, "_")}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (databases.length === 1 && databases[0] === "No results found") {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">No results found</p>
            <p className="text-muted-foreground mt-1">
              {"Try adjusting your search query or expanding the result limit."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Results header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <span className="text-foreground font-semibold text-lg">
              {totalResults} results
            </span>
          </div>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {databases.filter((d) => d !== "No results found").length} databases
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="text-xs border-border text-foreground bg-transparent hover:bg-secondary"
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="text-xs border-border text-foreground bg-transparent hover:bg-secondary"
          >
            Collapse All
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={downloadJSON} className="cursor-pointer">
                <FileJson className="h-4 w-4 mr-2" />
                Download as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadCSV} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                Download as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadTXT} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                Download as TXT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadPDF} className="cursor-pointer">
                <FileDown className="h-4 w-4 mr-2" />
                Download as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Database cards */}
      {databases.map((dbName) => {
        const dbData = data.List[dbName];
        const isExpanded = expandedDbs.has(dbName);
        const recordCount = dbData?.Data?.length || 0;

        if (dbName === "No results found") return null;

        return (
          <Card key={dbName} className="border-border bg-card overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-secondary/50 transition-colors p-4"
              onClick={() => toggleDb(dbName)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                  <CardTitle className="text-base font-semibold text-card-foreground">
                    {dbName}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                    {recordCount} {recordCount === 1 ? "record" : "records"}
                  </Badge>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              {dbData?.InfoLeak && (
                <p className="text-sm text-muted-foreground mt-1 ml-5">
                  {dbData.InfoLeak}
                </p>
              )}
            </CardHeader>

            {isExpanded && dbData?.Data && (
              <CardContent className="px-4 pb-4 pt-0">
                <div className="flex flex-col gap-3">
                  {dbData.Data.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (record: Record<string, any>, recordIndex: number) => (
                      <div
                        key={recordIndex}
                        className="rounded-lg border border-border bg-secondary/30 p-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                          {Object.entries(record).map(([key, value]) => {
                            const fieldId = `${dbName}-${recordIndex}-${key}`;
                            const displayValue = String(value ?? "");
                            return (
                              <div
                                key={key}
                                className="flex items-start gap-2 py-1.5 group"
                              >
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide min-w-[100px] pt-0.5 shrink-0">
                                  {key}
                                </span>
                                <span className="text-sm text-foreground font-mono break-all flex-1">
                                  {displayValue}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(displayValue, fieldId)
                                  }
                                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 rounded hover:bg-muted"
                                  title="Copy to clipboard"
                                >
                                  {copiedField === fieldId ? (
                                    <Check className="h-3.5 w-3.5 text-accent" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
