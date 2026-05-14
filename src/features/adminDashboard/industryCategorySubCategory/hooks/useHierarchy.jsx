import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "../../../../services/apiIndustryCategorySubCategory";

const QUERY_KEY = ["hierarchy"];

// ─── Fetch Hierarchy WITH PAGINATION PARAMS ─────────────────────────────────────
export function useHierarchy(params = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => api.getHierarchy(params),
    keepPreviousData: true,
    // staleTime: 5 * 60 * 1000,
    // retry: 1,
  });
}

// ─── Industry Mutations ──────────────────────────────────
export function useIndustryMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({ industry_name }) => api.createIndustry(industry_name),
    onSuccess: () => {
      toast.success("Industry created");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create industry");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, industry_name }) =>
      api.updateIndustry(id, industry_name),
    onSuccess: () => {
      toast.success("Industry updated");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update industry");
    },
  });

  const remove = useMutation({
    mutationFn: (id) => api.deleteIndustry(id),
    onSuccess: () => {
      toast.success("Industry deleted");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete industry");
    },
  });

  return { create, update, remove };
}

// ─── Category Mutations ──────────────────────────────────
export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({ category_name, industry_id }) =>
      api.createCategory(category_name, industry_id),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, category_name }) =>
      api.updateCategory(id, category_name),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const remove = useMutation({
    mutationFn: (id) => api.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  return { create, update, remove };
}

// ─── Subcategory Mutations ───────────────────────────────
export function useSubcategoryMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({ sub_category_name, category_id }) =>
      api.createSubcategory(sub_category_name, category_id),
    onSuccess: () => {
      toast.success("Subcategory created");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create subcategory");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, sub_category_name }) =>
      api.updateSubcategory(id, sub_category_name),
    onSuccess: () => {
      toast.success("Subcategory updated");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update subcategory");
    },
  });

  const remove = useMutation({
    mutationFn: (id) => api.deleteSubcategory(id),
    onSuccess: () => {
      toast.success("Subcategory deleted");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete subcategory");
    },
  });

  return { create, update, remove };
}
