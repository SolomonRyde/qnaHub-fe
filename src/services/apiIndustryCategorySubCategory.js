import { apiClient, buildQueryString } from "../lib/apiClient.js";
import { API_PATHS } from "../config/api.js";

export const api = {
  // ==================== HIERARCHY ====================
  getHierarchy: async (params = {}) => {
    const queryString = buildQueryString(params);
    return apiClient.get(`${API_PATHS.GETHIERARCHY}${queryString}`);
  },

  // ==================== INDUSTRIES ====================
  createIndustry: async (industry_name) =>
    apiClient.post(API_PATHS.INDUSTRIES, { industry_name }),

  updateIndustry: async (id, industry_name) =>
    apiClient.patch(`${API_PATHS.INDUSTRIES}/${id}`, { industry_name }),

  deleteIndustry: async (id) =>
    apiClient.delete(`${API_PATHS.INDUSTRIES}/${id}`),

  // ==================== CATEGORIES ====================
  createCategory: async (category_name, industry_id) =>
    apiClient.post(API_PATHS.CATEGORIES, { category_name, industry_id }),

  updateCategory: async (id, category_name) =>
    apiClient.patch(`${API_PATHS.CATEGORIES}/${id}`, { category_name }),

  deleteCategory: async (id) =>
    apiClient.delete(`${API_PATHS.CATEGORIES}/${id}`),

  // ==================== SUBCATEGORIES ====================
  createSubcategory: async (sub_category_name, category_id) =>
    apiClient.post(API_PATHS.SUBCATEGORIES, { sub_category_name, category_id }),

  updateSubcategory: async (id, sub_category_name) =>
    apiClient.patch(`${API_PATHS.SUBCATEGORIES}/${id}`, { sub_category_name }),

  deleteSubcategory: async (id) =>
    apiClient.delete(`${API_PATHS.SUBCATEGORIES}/${id}`),

  getIndustriesAndCategoriesAndSubCategories: async () =>
    apiClient.get(`${API_PATHS.GETHIERARCHY}?limit=100`),
};
