import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({
  onSearchChange,
  placeholder = "Search exams, topics, or skills...",
}) => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Debounce search input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange({ search: query, sortBy });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, sortBy, onSearchChange]);

  const handleClear = () => {
    setQuery("");
    if (onSearchChange) {
      onSearchChange({ search: "", sortBy });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="latest">Sort by: Latest</option>
          <option value="popular">Sort by: Popular</option>
          <option value="price-low">Sort by: Price (Low-High)</option>
          <option value="price-high">Sort by: Price (High-Low)</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
