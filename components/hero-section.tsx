import { Search, Database, Download, Globe } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center flex flex-col items-center gap-6">
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
        <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
        <span className="text-sm font-medium text-primary">Live Database Search</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
        Golubaba420.online
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl leading-relaxed text-pretty">
        Search across multiple databases instantly. Enter any identifier and get comprehensive results with one click.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4 text-primary" />
          <span>Multi-query support</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Database className="h-4 w-4 text-primary" />
          <span>Multiple databases</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Download className="h-4 w-4 text-primary" />
          <span>Export to PDF/JSON/CSV</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4 text-primary" />
          <span>Multi-language</span>
        </div>
      </div>
    </div>
  );
}
