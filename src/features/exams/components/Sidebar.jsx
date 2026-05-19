import React, { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "../../../lib/utils";
import { useCategories } from "../hooks/useCategories";
import { ChevronDown, Building2, Tag, Layers } from "lucide-react";

// --- Sidebar Component ---
const Sidebar = ({ className, onFilterChange, initialFilters = {} }) => {
  const { categories, isLoading } = useCategories();
  console.log("CATEGORIES", categories);
  const [selectedIndustry, setSelectedIndustry] = useState(
    initialFilters.industry ?? null,
  );

  const [selectedCategory, setSelectedCategory] = useState(
    initialFilters.category ?? null,
  );

  const [selectedSubcategory, setSelectedSubcategory] = useState(
    initialFilters.subcategory ?? null,
  );

  // ✅ Notify parent - unchanged from original
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        industry: selectedIndustry,
        category: selectedCategory,
        subcategory: selectedSubcategory,
      });
    }
  }, [selectedIndustry, selectedCategory, selectedSubcategory, onFilterChange]);

  // ✅ Handlers with proper type conversion
  const handleIndustryChange = useCallback((e) => {
    const value = e.target.value;
    const id = value === "" ? null : Number(value);
    setSelectedIndustry(id);
    // Reset dependents when industry changes
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    const value = e.target.value;
    const id = value === "" ? null : Number(value);
    setSelectedCategory(id);
    // Reset subcategory when category changes
    setSelectedSubcategory(null);
  }, []);

  const handleSubcategoryChange = useCallback((e) => {
    const value = e.target.value;
    // Keep subcategory as string, no Number conversion
    const name = value === "" ? null : value;
    setSelectedSubcategory(name);
  }, []);

  // ✅ Derived Data
  const industries = categories?.nestedData || [];
  console.log("INDUSTRIES", industries);

  const selectedIndustryData = useMemo(() => {
    return industries.find((i) => i.id === selectedIndustry);
  }, [selectedIndustry, industries]);

  const categoriesList = selectedIndustryData?.categories || [];

  const selectedCategoryData = useMemo(() => {
    return categoriesList.find((c) => c.id === selectedCategory);
  }, [selectedCategory, categoriesList]);

  const subcategories = selectedCategoryData?.subcategories || [];

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <h3 className="font-semibold text-lg text-foreground">Filters</h3>
        {(selectedIndustry || selectedCategory || selectedSubcategory) && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            Active
          </span>
        )}
      </div>

      {/* INDUSTRIES */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="w-4 h-4 text-primary" />
          Industry
          {selectedIndustry && (
            <span className="ml-auto text-xs text-primary font-medium">
              Selected
            </span>
          )}
        </label>
        <div className="relative">
          <select
            value={selectedIndustry ?? ""}
            onChange={handleIndustryChange}
            className={cn(
              "w-full appearance-none px-4 py-2.5 pr-10",
              "bg-background border border-border rounded-lg",
              "text-sm text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "transition-all duration-200",
              "hover:border-primary/50",
            )}
          >
            <option value="">Select Industry</option>
            {industries.map((industry) => (
              <option key={industry.id} value={industry.id}>
                {industry.industry_name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Tag className="w-4 h-4 text-primary" />
          Category
          {selectedCategory && (
            <span className="ml-auto text-xs text-primary font-medium">
              Selected
            </span>
          )}
        </label>
        {!selectedIndustry ? (
          <div className="relative">
            <select
              disabled
              className={cn(
                "w-full appearance-none px-4 py-2.5 pr-10",
                "bg-muted/30 border border-border rounded-lg",
                "text-sm text-muted-foreground",
                "cursor-not-allowed",
              )}
            >
              <option value="">Select industry first</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedCategory ?? ""}
              onChange={handleCategoryChange}
              className={cn(
                "w-full appearance-none px-4 py-2.5 pr-10",
                "bg-background border border-border rounded-lg",
                "text-sm text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                "transition-all duration-200",
                "hover:border-primary/50",
              )}
            >
              <option value="">Select Category</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        )}
      </div>

      {/* SUBCATEGORIES */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Layers className="w-4 h-4 text-primary" />
          Subcategory
          {selectedSubcategory && (
            <span className="ml-auto text-xs text-primary font-medium">
              Selected
            </span>
          )}
        </label>
        {!selectedCategory ? (
          <div className="relative">
            <select
              disabled
              className={cn(
                "w-full appearance-none px-4 py-2.5 pr-10",
                "bg-muted/30 border border-border rounded-lg",
                "text-sm text-muted-foreground",
                "cursor-not-allowed",
              )}
            >
              <option value="">Select category first</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        ) : subcategories.length === 0 ? (
          <div className="relative">
            <select
              disabled
              className={cn(
                "w-full appearance-none px-4 py-2.5 pr-10",
                "bg-muted/30 border border-border rounded-lg",
                "text-sm text-muted-foreground",
                "cursor-not-allowed",
              )}
            >
              <option value="">No subcategories</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedSubcategory ?? ""}
              onChange={handleSubcategoryChange}
              className={cn(
                "w-full appearance-none px-4 py-2.5 pr-10",
                "bg-background border border-border rounded-lg",
                "text-sm text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                "transition-all duration-200",
                "hover:border-primary/50",
              )}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.sub_category_name}>
                  {sub.sub_category_name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {(selectedIndustry || selectedCategory || selectedSubcategory) && (
        <div className="pt-4 border-t border-border space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Active Filters
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedIndustry && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
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
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                {
                  categoriesList.find((c) => c.id === selectedCategory)
                    ?.category_name
                }
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                  }}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {selectedSubcategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                {selectedSubcategory}
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
