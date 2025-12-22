"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, TrendingUp, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearchHistory } from "@/hooks/use-search-history";

interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  category: string | null;
  inStock: boolean;
}

interface SearchAutocompleteProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchAutocomplete({
  className,
  placeholder = "Search products...",
  onSearch,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const { history, addToHistory, removeFromHistory } = useSearchHistory();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Fetch popular searches on mount
  useEffect(() => {
    fetch("/api/search/popular")
      .then((res) => res.json())
      .then((data) => setPopularSearches(data.popular || []))
      .catch(console.error);
  }, []);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length >= 2) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    addToHistory(trimmed);
    setIsOpen(false);
    setQuery(trimmed);

    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showHistory = isOpen && query.length === 0 && history.length > 0;
  const showPopular =
    isOpen &&
    query.length === 0 &&
    history.length === 0 &&
    popularSearches.length > 0;
  const showSuggestions = isOpen && query.length >= 2 && suggestions.length > 0;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query);
            } else if (e.key === "Escape") {
              setIsOpen(false);
              inputRef.current?.blur();
            }
          }}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-[500px] overflow-y-auto">
          {/* Product Suggestions */}
          {showSuggestions && (
            <div className="p-2">
              <div className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">
                Products
              </div>
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion.id}
                  href={`/shop/${suggestion.slug}`}
                  onClick={() => {
                    addToHistory(query);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary/50 transition-colors"
                >
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                    <Image
                      src={suggestion.imageUrl}
                      alt={suggestion.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {suggestion.name}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>€{suggestion.price.toFixed(2)}</span>
                      {suggestion.category && (
                        <>
                          <span>•</span>
                          <span className="capitalize">
                            {suggestion.category}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {!suggestion.inStock && (
                    <span className="text-xs text-muted-foreground">
                      Out of stock
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {isOpen &&
            query.length >= 2 &&
            !isLoading &&
            suggestions.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No products found for "{query}"</p>
                <p className="text-xs mt-1">Try different keywords</p>
              </div>
            )}

          {/* Search History */}
          {showHistory && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent Searches
                </div>
                <button
                  onClick={() => history.forEach(removeFromHistory)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              {history.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSearch(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-secondary/50 transition-colors text-left group"
                >
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="flex-1 text-sm">{item}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(item);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {showPopular && (
            <div className="p-2">
              <div className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">
                Popular Searches
              </div>
              {popularSearches.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSearch(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-secondary/50 transition-colors text-left"
                >
                  <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="flex-1 text-sm capitalize">{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
