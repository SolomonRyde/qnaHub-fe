import React, { useState, useMemo, useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import ExamGrid from "./ExamGrid";
import MobileFilterDrawer from "./MobileFilterDrawer";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../../components/ui/Button";

import { useCategories } from "../hooks/useCategories";
import { useExams } from "../hooks/useExams";

const ExamsPage = () => {
  const { theme } = useTheme();

  const { categories } = useCategories();
  const { exams, isLoading } = useExams();

  // Filters
  const [filters, setFilters] = useState({
    industry: null,
    category: null,
    subcategory: null,
  });

  // Search
  const [searchParams, setSearchParams] = useState({
    search: "",
    sortBy: "latest",
  });

  // Handle filter change
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(newFilters)) return prev;
      return newFilters;
    });
  }, []);

  // Handle search
  const handleSearchChange = useCallback((params) => {
    setSearchParams((prev) => {
      if (prev.search === params.search && prev.sortBy === params.sortBy)
        return prev;
      return params;
    });
  }, []);

  // Filter logic (🔥 IMPORTANT PART)
  const filteredExams = useMemo(() => {
    let result = [...exams];

    // === INDUSTRY FILTER ===
    if (filters.industry) {
      result = result.filter((exam) => exam.industry_id === filters.industry);
    }

    // === CATEGORY FILTER ===
    if (filters.category) {
      result = result.filter((exam) => exam.category_id === filters.category);
    }

    // === SUBCATEGORY FILTER ===
    if (filters.subcategory) {
      result = result.filter(
        (exam) => exam.subcategory_name === filters.subcategory,
      );
    }

    // === SEARCH ===
    if (searchParams.search.trim()) {
      const query = searchParams.search.toLowerCase();

      result = result.filter(
        (exam) =>
          exam.title?.toLowerCase().includes(query) ||
          exam.description?.toLowerCase().includes(query),
      );
    }

    // === SORT ===
    switch (searchParams.sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "latest":
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [exams, filters, searchParams]);

  const handleClearAll = useCallback(() => {
    setFilters({
      industry: null,
      category: null,
      subcategory: null,
    });

    setSearchParams({
      search: "",
      sortBy: "latest",
    });
  }, []);

  const hasActiveFilters =
    filters.industry ||
    filters.category ||
    filters.subcategory ||
    searchParams.search;

  if (isLoading) return <p>Loading exams...</p>;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-64">
            <Sidebar
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </aside>

          {/* Content */}
          <div className="flex-1">
            {/* Mobile Filters */}
            <div className="md:hidden mb-4">
              <MobileFilterDrawer
                trigger={
                  <Button variant="outline" className="w-full">
                    Filters <SlidersHorizontal className="ml-2 w-4 h-4" />
                  </Button>
                }
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </div>

            {/* Search */}
            <SearchBar onSearchChange={handleSearchChange} />

            {/* Header */}
            <div className="flex justify-between mb-6">
              <p>
                Showing {filteredExams.length} of {exams.length} exams
              </p>

              {hasActiveFilters && (
                <Button onClick={handleClearAll} variant="outline">
                  Clear All
                </Button>
              )}
            </div>

            {/* Grid */}
            <ExamGrid exams={filteredExams} />

            {/* Empty */}
            {filteredExams.length === 0 && (
              <div className="text-center py-16">
                <h3>No exams found</h3>
                <Button onClick={handleClearAll}>Reset Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamsPage;
