import { useQuery } from "@tanstack/react-query";
import {
  getAllExams,
  getExamBySlug,
  getAdminExams,
  getIndustries,
  getCategories,
  getSubcategories,
  getExamAnalytics,
} from "../../../services/apiExams";

export const useExams = (filters = {}) => {
  return useQuery({
    queryKey: [
      "exams",
      {
        industry: filters.industry,
        category: filters.category,
        subcategory: filters.subcategory,
        difficulty: filters.difficulty,
        search: filters.search,
        sort: filters.sort,
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
      },
    ],
    queryFn: () => getAllExams(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useExamBySlug = (slug) => {
  return useQuery({
    queryKey: ["exam", slug],
    queryFn: () => getExamBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// ✅ UPDATED: useAdminExams with full filter cache key
export const useAdminExams = (filters = {}) => {
  return useQuery({
    queryKey: [
      "admin-exams",
      {
        search: filters.search ?? "",
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
        status: filters.status ?? null,
        difficulty: filters.difficulty ?? null,
        industry: filters.industry ?? null,
        category: filters.category ?? null,
        sort: filters.sort ?? "created_at:desc", // ✅ Include sort in cache key
      },
    ],
    queryFn: () => getAdminExams(filters),
    // ✅ Keeps old data while fetching new search results
    placeholderData: (prev) => prev,
  });
};

export const useIndustries = () => {
  return useQuery({
    queryKey: ["industries"],
    queryFn: getIndustries,
    staleTime: Infinity,
  });
};

export const useCategories = (industryId) => {
  return useQuery({
    queryKey: ["categories", industryId],
    queryFn: () => getCategories(industryId),
    enabled: !!industryId,
    staleTime: Infinity,
  });
};

export const useSubcategories = (categoryId) => {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: () => getSubcategories(categoryId),
    enabled: !!categoryId,
    staleTime: Infinity,
  });
};

export const useExamAnalytics = (industryId = null) => {
  return useQuery({
    queryKey: ["exam-analytics", industryId],
    queryFn: () => getExamAnalytics(industryId),
    staleTime: 10 * 60 * 1000,
  });
};
