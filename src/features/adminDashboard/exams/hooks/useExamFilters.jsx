import { useState, useCallback, useMemo } from "react";

const DEFAULT_FILTERS = {
  status: null,
  difficulty: null,
  industry: null,
  category: null,
};

export function useExamFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => {
      if (prev[key] === value) return prev;
      return { ...prev, [key]: value };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: null }));
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (v) => v !== null && v !== undefined && v !== "",
    ).length;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  return {
    filters,
    updateFilter,
    clearFilter,
    clearFilters,
    activeFilterCount,
    hasActiveFilters,
  };
}
