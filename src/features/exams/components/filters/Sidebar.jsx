import React, { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "../../../../lib/utils";
import { useCategories } from "../../hooks/useCategories";
import {
  ChevronDown,
  Building2,
  Tag,
  Layers,
  X,
  Filter,
  Check,
  Search,
} from "lucide-react";

// --- Custom Dropdown Component ---
const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
  disabled = false,
  getId = (opt) => opt.id,
  getLabel = (opt) => opt.name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedOption = options.find((opt) => getId(opt) === value);

  const filteredOptions = options.filter((opt) =>
    getLabel(opt).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (option) => {
    onChange(getId(option));
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="relative">
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-foreground">
        <Icon className="w-4 h-4 text-primary" />
        {label}
        {value && (
          <span className="ml-auto text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
            Selected
          </span>
        )}
      </label>

      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded-xl border",
          "text-sm font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary/25",
          disabled
            ? "bg-muted/40 border-border/50 text-muted-foreground/60 cursor-not-allowed"
            : "bg-background border-border text-foreground hover:border-primary/50 cursor-pointer hover:shadow-md",
          isOpen && "border-primary ring-2 ring-primary/25 shadow-lg",
        )}
      >
        <span className={cn(!selectedOption && "text-muted-foreground")}>
          {selectedOption ? getLabel(selectedOption) : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              isOpen && "transform rotate-180",
            )}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute left-0 right-0 mt-2 z-50">
            <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Search Input */}
              {options.length > 5 && (
                <div className="p-2 border-b border-border/60">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-9 pr-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="max-h-64 overflow-y-auto custom-scrollbar py-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const isSelected = getId(option) === value;
                    return (
                      <button
                        key={getId(option)}
                        onClick={() => handleSelect(option)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-left",
                          "transition-colors duration-150",
                          "hover:bg-primary/5",
                          isSelected &&
                            "bg-primary/10 text-primary font-medium",
                        )}
                      >
                        <span className="flex-1 text-sm">
                          {getLabel(option)}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No results found
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Sidebar Component ---
const Sidebar = ({ className, onFilterChange, initialFilters = {} }) => {
  const { categories, isLoading } = useCategories();
  const [selectedIndustry, setSelectedIndustry] = useState(
    initialFilters.industry ?? null,
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialFilters.category ?? null,
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    initialFilters.subcategory ?? null,
  );

  // Notify parent of filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        industry: selectedIndustry,
        category: selectedCategory,
        subcategory: selectedSubcategory,
      });
    }
  }, [selectedIndustry, selectedCategory, selectedSubcategory, onFilterChange]);

  // Sync with initialFilters when they change externally
  useEffect(() => {
    setSelectedIndustry(initialFilters.industry ?? null);
    setSelectedCategory(initialFilters.category ?? null);
    setSelectedSubcategory(initialFilters.subcategory ?? null);
  }, [initialFilters]);

  // Handlers
  const handleIndustryChange = useCallback((id) => {
    setSelectedIndustry(id);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  }, []);

  const handleCategoryChange = useCallback((id) => {
    setSelectedCategory(id);
    setSelectedSubcategory(null);
  }, []);

  const handleSubcategoryChange = useCallback((id) => {
    setSelectedSubcategory(id);
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedIndustry(null);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  }, []);

  // Derived Data
  const industries = categories?.nestedData || [];
  const selectedIndustryData = useMemo(() => {
    return industries.find((i) => Number(i.id) === Number(selectedIndustry));
  }, [selectedIndustry, industries]);

  const categoriesList = selectedIndustryData?.categories || [];
  const selectedCategoryData = useMemo(() => {
    return categoriesList.find(
      (c) => Number(c.id) === Number(selectedCategory),
    );
  }, [selectedCategory, categoriesList]);

  const subcategories = selectedCategoryData?.subcategories || [];

  const hasActiveFilters =
    selectedIndustry || selectedCategory || selectedSubcategory;

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Loading filters...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-lg text-foreground">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="space-y-5">
        {/* Industry Filter */}
        <CustomDropdown
          label="Industry"
          icon={Building2}
          value={selectedIndustry}
          onChange={handleIndustryChange}
          options={industries}
          placeholder="Select an industry"
          getId={(opt) => opt.id}
          getLabel={(opt) => opt.industry_name}
        />

        {/* Category Filter */}
        <CustomDropdown
          label="Category"
          icon={Tag}
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={categoriesList}
          placeholder={
            selectedIndustry ? "Select a category" : "Select industry first"
          }
          disabled={!selectedIndustry}
          getId={(opt) => opt.id}
          getLabel={(opt) => opt.category_name}
        />

        {/* Subcategory Filter */}
        <CustomDropdown
          label="Subcategory"
          icon={Layers}
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          options={subcategories}
          placeholder={
            selectedCategory ? "Select a subcategory" : "Select category first"
          }
          disabled={!selectedCategory || subcategories.length === 0}
          getId={(opt) => opt.id}
          getLabel={(opt) => opt.sub_category_name}
        />
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-5 border-t border-border/60 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Active Filters
            </p>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {
                [
                  selectedIndustry,
                  selectedCategory,
                  selectedSubcategory,
                ].filter(Boolean).length
              }
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedIndustry && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20 shadow-sm">
                <Building2 className="w-3 h-3" />
                {
                  industries.find((i) => i.id === selectedIndustry)
                    ?.industry_name
                }
                <button
                  onClick={() => {
                    setSelectedIndustry(null);
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                  }}
                  className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors -mr-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20 shadow-sm">
                <Tag className="w-3 h-3" />
                {
                  categoriesList.find((c) => c.id === selectedCategory)
                    ?.category_name
                }
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                  }}
                  className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors -mr-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedSubcategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20 shadow-sm">
                <Layers className="w-3 h-3" />
                {
                  subcategories.find(
                    (s) => Number(s.id) === Number(selectedSubcategory),
                  )?.sub_category_name
                }
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors -mr-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasActiveFilters && (
        <div className="pt-4">
          <div className="text-center py-6 px-4 rounded-xl bg-muted/30 border border-dashed border-border">
            <p className="text-xs text-muted-foreground">
              Select filters above to refine your results
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
