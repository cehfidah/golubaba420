// API Response Types
export interface SearchResultRecord {
  [key: string]: string | number | boolean | null;
}

export interface DatabaseResult {
  Data: SearchResultRecord[];
  Fields?: string[];
}

export interface SearchResponse {
  List: {
    [database: string]: DatabaseResult;
  };
}

export interface SearchFormData {
  query: string;
  limit: number;
  lang: string;
}

export interface SearchStats {
  query: string;
  limit: number;
  duration: number;
  totalResults?: number;
  databaseCount?: number;
}

// Component Props Types
export interface SearchFormProps {
  onSearch: (query: string, limit: number, lang: string) => void;
  isLoading: boolean;
}

export interface SearchResultsProps {
  data: SearchResponse;
  query: string;
}

export interface SearchStatsProps {
  query: string;
  limit: number;
  duration: number;
}

// Language Options
export interface Language {
  value: string;
  label: string;
}
