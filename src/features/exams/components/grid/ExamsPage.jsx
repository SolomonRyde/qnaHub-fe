import React, { useState, useCallback, useMemo } from "react";
import { useTheme } from "../../../../context/ThemeContext";
import Sidebar from "../filters/Sidebar";
import SearchBar from "../filters/SearchBar";
import ExamGrid from "../grid/ExamGrid";
import MobileFilterDrawer from "../filters/MobileFilterDrawer";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useExams } from "../../hooks/useExams";

const ExamsPage = () => {
  const { theme } = useTheme();

  const [filters, setFilters] = useState({
    industry: null,
    category: null,
    subcategory: null,
    difficulty: null,
  });

  const [searchParams, setSearchParams] = useState({
    search: "",
    sort: "latest",
    page: 1,
    limit: 12,
  });

  // Combine filters and search params for API call
  const apiParams = useMemo(
    () => ({
      ...filters,
      ...searchParams,
      status: "published",
    }),
    [filters, searchParams],
  );

  const { data, isLoading, error } = useExams(apiParams);
  const exams = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setSearchParams((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSearchChange = useCallback((params) => {
    setSearchParams((prev) => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAll = useCallback(() => {
    setFilters({
      industry: null,
      category: null,
      subcategory: null,
      difficulty: null,
    });
    setSearchParams({
      search: "",
      sort: "latest",
      page: 1,
      limit: 12,
    });
  }, []);

  const hasActiveFilters =
    filters.industry ||
    filters.category ||
    filters.subcategory ||
    filters.difficulty ||
    searchParams.search;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Error Loading Exams
          </h2>
          <p className="text-muted-foreground">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-base font-bold text-foreground mb-4">
                Filters
              </h2>
              <Sidebar
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </div>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {exams.length} of {pagination.total} exams
              </p>

              {hasActiveFilters && (
                <Button onClick={handleClearAll} variant="outline" size="sm">
                  Clear All Filters
                </Button>
              )}
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <>
                <ExamGrid exams={exams} />

                {/* Empty State */}
                {exams.length === 0 && (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No exams found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search query
                    </p>
                    <Button onClick={handleClearAll}>Reset Filters</Button>
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>

                    <span className="text-sm text-muted-foreground px-4">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamsPage;
