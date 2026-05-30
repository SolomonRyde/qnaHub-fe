import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearchChange }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange({ search, sort });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, sort, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search exams by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
        />
      </div>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground text-sm"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
        <option value="difficulty">Difficulty</option>
      </select>
    </div>
  );
};

export default SearchBar;
