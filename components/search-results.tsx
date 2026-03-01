"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  Zap,
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

export function SearchResults({ data, query, onAddToSurveillanceList }: SearchResultsProps) {
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <motion.div
              className="h-12 w-12 rounded-full bg-muted flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </motion.div>
            <div className="text-center">
              <motion.p
                className="text-lg font-medium text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                No Intelligence Record Located
              </motion.p>
              <motion.p
                className="text-muted-foreground mt-1 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Due to security concern and current uplink surveillance data restrictions, no active record was returned for this target.
              </motion.p>
              <motion.p
                className="text-muted-foreground mt-1 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Try again during stable uptime window, refine target keywords, or increase scan range.
              </motion.p>
              {onAddToSurveillanceList && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="button"
                    onClick={() => onAddToSurveillanceList(query)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Add this keyword/number to surveillance list
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Results header with dramatic entrance */}
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Animated scan line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["0%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Database className="h-5 w-5 text-primary" />
          </motion.div>
          <span className="text-foreground font-semibold text-lg">
            {totalResults} results
          </span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
              {databases.filter((d) => d !== "No results found").length} databases
            </Badge>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
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
      </motion.div>

      {/* Database cards with staggered cascade animation */}
      <motion.div
        className="flex flex-col gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {databases.map((dbName, dbIndex) => {
          const dbData = data.List[dbName];
          const isExpanded = expandedDbs.has(dbName);
          const recordCount = dbData?.Data?.length || 0;

          if (dbName === "No results found") return null;

          return (
            <motion.div
              key={dbName}
              variants={{
                hidden: { opacity: 0, y: 20, x: -20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  x: 0,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border bg-card overflow-hidden relative group">
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      boxShadow: "inset 0 0 40px rgba(59, 130, 246, 0.3)",
                    }}
                  />

                  <motion.div
                    className="cursor-pointer"
                    onClick={() => toggleDb(dbName)}
                    whileHover={{ backgroundColor: "hsl(var(--secondary) / 0.5)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="h-2.5 w-2.5 rounded-full bg-accent"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: dbIndex * 0.2,
                            }}
                          />
                          <CardTitle className="text-base font-semibold text-card-foreground">
                            {dbName}
                          </CardTitle>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + dbIndex * 0.1 }}
                          >
                            <Badge
                              variant="outline"
                              className="text-xs border-border text-muted-foreground"
                            >
                              {recordCount} {recordCount === 1 ? "record" : "records"}
                            </Badge>
                          </motion.div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </motion.div>
                      </div>
                      {dbData?.InfoLeak && (
                        <motion.p
                          className="text-sm text-muted-foreground mt-1 ml-5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {dbData.InfoLeak}
                        </motion.p>
                      )}
                    </CardHeader>
                  </motion.div>

                  {/* Expanding records with staggered animation */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {dbData?.Data && (
                      <CardContent className="px-4 pb-4 pt-0">
                        <motion.div
                          className="flex flex-col gap-3"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.08,
                              },
                            },
                          }}
                        >
                          {dbData.Data.map(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (record: Record<string, any>, recordIndex: number) => (
                              <motion.div
                                key={recordIndex}
                                variants={{
                                  hidden: { opacity: 0, x: -10 },
                                  visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: { duration: 0.3 },
                                  },
                                }}
                                className="rounded-lg border border-border bg-gradient-to-r from-secondary/30 to-secondary/10 p-4 relative overflow-hidden group/record"
                                whileHover={{
                                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                                }}
                              >
                                {/* Record scan effect */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover/record:opacity-100"
                                  animate={{ x: ["-100%", "100%"] }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 relative z-10">
                                  {Object.entries(record).map(
                                    ([key, value], fieldIndex) => {
                                      const fieldId = `${dbName}-${recordIndex}-${key}`;
                                      const displayValue = String(value ?? "");
                                      return (
                                        <motion.div
                                          key={key}
                                          className="flex items-start gap-2 py-1.5 group"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{
                                            delay: recordIndex * 0.08 + fieldIndex * 0.05,
                                          }}
                                        >
                                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide min-w-[100px] pt-0.5 shrink-0">
                                            {key}
                                          </span>
                                          <span className="text-sm text-foreground font-mono break-all flex-1">
                                            {displayValue}
                                          </span>
                                          <motion.button
                                            type="button"
                                            onClick={() =>
                                              copyToClipboard(displayValue, fieldId)
                                            }
                                            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 rounded hover:bg-muted"
                                            title="Copy to clipboard"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                          >
                                            {copiedField === fieldId ? (
                                              <Check className="h-3.5 w-3.5 text-accent" />
                                            ) : (
                                              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                          </motion.button>
                                        </motion.div>
                                      );
                                    }
                                  )}
                                </div>
                              </motion.div>
                            )
                          )}
                        </motion.div>
                      </CardContent>
                    )}
                  </motion.div>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
