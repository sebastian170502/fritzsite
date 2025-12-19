"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search products...",
  className,
}: SearchBarProps) {
  const [query, setQuery] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  const handleSearch = React.useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        document.getElementById("product-search")?.focus();
      }
      if (e.key === "Escape") {
        handleClear();
        document.getElementById("product-search")?.blur();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className={cn("relative w-full max-w-lg", className)}>
      <div
        className={cn(
          "relative flex items-center transition-all",
          isFocused && "ring-2 ring-primary/20 rounded-full"
        )}
      >
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
        <Input
          id="product-search"
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-12 pr-20 h-12 rounded-full border-border/40 bg-background/50 backdrop-blur"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 h-8 w-8 p-0 rounded-full hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <kbd className="absolute right-12 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>
  );
}
