// ─── API Service ────────────────────────────────────────────────
const API_BASE = "https://api.rydevalues.cloud/api/v1";

// Helper to build query string from params (excludes empty/null/undefined values)
const buildQueryString = (params) => {
  if (!params) return "";

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const api = {
  // ==================== HIERARCHY ====================
  getHierarchy: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = `${API_BASE}/all-industries-categories-subcategories${queryString}`;

    const res = await fetch(url, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch hierarchy");
    return res.json();
  },

  // ==================== INDUSTRIES ====================
  createIndustry: async (industry_name) => {
    const res = await fetch(`${API_BASE}/industries`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry_name }),
    });

    if (!res.ok) throw new Error("Failed to create industry");
    return res.json();
  },

  updateIndustry: async (id, industry_name) => {
    const res = await fetch(`${API_BASE}/industries/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry_name }),
    });

    if (!res.ok) throw new Error("Failed to update industry");
    return res.json();
  },

  deleteIndustry: async (id) => {
    const res = await fetch(`${API_BASE}/industries/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      // Try to parse error message from response, fallback to generic
      const errorData = await res.json().catch(() => ({ message: null }));
      throw new Error(
        errorData.message || `Failed to delete industry (HTTP ${res.status})`,
      );
    }

    // Handle 204 No Content or empty 200 response
    if (res.status === 204) return { success: true };

    const text = await res.text();
    return text ? JSON.parse(text) : { success: true };
  },

  // ==================== CATEGORIES ====================
  createCategory: async (category_name, industry_id) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_name, industry_id }),
    });

    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
  },

  updateCategory: async (id, category_name) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_name }),
    });

    if (!res.ok) throw new Error("Failed to update category");
    return res.json();
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: null }));
      throw new Error(
        errorData.message || `Failed to delete category (HTTP ${res.status})`,
      );
    }

    if (res.status === 204) return { success: true };

    const text = await res.text();
    return text ? JSON.parse(text) : { success: true };
  },

  // ==================== SUBCATEGORIES ====================
  createSubcategory: async (sub_category_name, category_id) => {
    const res = await fetch(`${API_BASE}/subcategories`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sub_category_name, category_id }),
    });

    if (!res.ok) throw new Error("Failed to create subcategory");
    return res.json();
  },

  updateSubcategory: async (id, sub_category_name) => {
    const res = await fetch(`${API_BASE}/subcategories/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sub_category_name }),
    });

    if (!res.ok) throw new Error("Failed to update subcategory");
    return res.json();
  },

  deleteSubcategory: async (id) => {
    const res = await fetch(`${API_BASE}/subcategories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: null }));
      throw new Error(
        errorData.message ||
          `Failed to delete subcategory (HTTP ${res.status})`,
      );
    }

    if (res.status === 204) return { success: true };

    const text = await res.text();
    return text ? JSON.parse(text) : { success: true };
  },

  getIndustriesAndCategoriesAndSubCategories: async () => {
    const res = await fetch(
      "https://api.rydevalues.cloud/api/v1/all-industries-categories-subcategories?limit=100",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.log("ERROR:", data.message);
      throw new Error(data.message || "Failed to fetch the Categories");
    }

    return data;
  },
};
