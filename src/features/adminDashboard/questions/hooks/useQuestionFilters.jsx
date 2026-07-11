// hooks/useQuestionFilters.js
import { useState, useMemo } from "react";

export function useQuestionFilters(filterMasterData) {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [examFilter, setExamFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");

  const industryOptions = useMemo(
    () => filterMasterData?.industries || [],
    [filterMasterData],
  );

  const categoryOptions = useMemo(() => {
    const all = filterMasterData?.categories || [];
    return industryFilter === "all"
      ? all
      : all.filter((i) => String(i.industry_id) === String(industryFilter));
  }, [filterMasterData, industryFilter]);

  const subCategoryOptions = useMemo(() => {
    let rows = filterMasterData?.subcategories || [];
    if (industryFilter !== "all")
      rows = rows.filter(
        (i) => String(i.industry_id) === String(industryFilter),
      );
    if (categoryFilter !== "all")
      rows = rows.filter(
        (i) => String(i.category_id) === String(categoryFilter),
      );
    return rows;
  }, [filterMasterData, industryFilter, categoryFilter]);

  const examOptions = useMemo(() => {
    let exams = filterMasterData?.exams || [];
    if (industryFilter !== "all")
      exams = exams.filter(
        (e) => String(e.industry_id) === String(industryFilter),
      );
    if (categoryFilter !== "all")
      exams = exams.filter(
        (e) => String(e.category_id) === String(categoryFilter),
      );
    if (subCategoryFilter !== "all")
      exams = exams.filter(
        (e) => String(e.sub_category_id) === String(subCategoryFilter),
      );
    return exams;
  }, [filterMasterData, industryFilter, categoryFilter, subCategoryFilter]);

  function clearFilters() {
    setSearch("");
    setExamFilter("all");
    setIndustryFilter("all");
    setCategoryFilter("all");
    setSubCategoryFilter("all");
    setDifficultyFilter("all");
  }

  return {
    search,
    setSearch,
    difficultyFilter,
    setDifficultyFilter,
    examFilter,
    setExamFilter,
    industryFilter,
    setIndustryFilter,
    categoryFilter,
    setCategoryFilter,
    subCategoryFilter,
    setSubCategoryFilter,
    industryOptions,
    categoryOptions,
    subCategoryOptions,
    examOptions,
    clearFilters,
  };
}
