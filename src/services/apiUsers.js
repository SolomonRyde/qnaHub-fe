// src/services/apiUsers.js
const API_BASE = "https://api.rydevalues.cloud/api/v1/admin";

/**
 * Unified response handler - consistent with existing auth/delete services
 */
async function handleResponse(res) {
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;

    if (isJson) {
      const data = await res.json().catch(() => ({}));
      message = data.message || message;
    } else {
      const text = await res.text().catch(() => "");
      console.error("🔴 API Error:", res.status, text.substring(0, 200));
    }

    // 🎯 Custom handling for specific cases
    if (res.status === 400) {
      console.log("You cannot change your own role  ");
      throw new Error("You cannot change your own role !!!!");
    }
    if (res.status === 403) {
      console.log(
        "Admins do not have permission to change this role. Only Super Admins can.",
      );
      throw new Error(
        " Admins do not have permission to change this role. Only Super Admins can.",
      );
    }

    throw new Error("Something went wrong");
  }

  return isJson ? res.json() : { success: true };
}

/**
 * Reusable fetch wrapper to reduce repetition (🎁 Bonus)
 */
async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  return handleResponse(res);
}

// ─────────────────────────────────────────────────────────────
// 🔹 GET USERS
// ─────────────────────────────────────────────────────────────
export async function getUsers({
  page = 1,
  limit = 10,
  search = "",
  role = "all",
  status = "all",
}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search?.trim()) params.append("search", search.trim());
  if (role && role !== "all") params.append("role", role.toLowerCase());
  if (status && status !== "all") params.append("status", status);

  return apiRequest(`/users?${params}`, { method: "GET" });
}

// ─────────────────────────────────────────────────────────────
// 🔹 SOFT DELETE (Sets is_deleted=1, status=0)
// ─────────────────────────────────────────────────────────────
export async function softDeleteUser(id) {
  console.log(`🗑️ SOFT DELETE: PATCH /users/${id}/delete`);
  return apiRequest(`/users/${id}/delete`, { method: "PATCH" });
}

export async function bulkSoftDelete(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0)
    throw new Error("No users selected");
  console.log(`🗑️ BULK SOFT DELETE: PATCH /users/bulk-delete`, { userIds });
  return apiRequest(`/users/bulk-delete`, {
    method: "PATCH",
    body: JSON.stringify({ userIds }),
  });
}

// ─────────────────────────────────────────────────────────────
// 🔹 PURGE (Permanent DELETE)
// ─────────────────────────────────────────────────────────────
export async function purgeUser(id) {
  console.log(`💀 PURGE: DELETE /users/${id}/purge`);
  return apiRequest(`/users/${id}/purge`, { method: "DELETE" });
}

export async function bulkPurge(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0)
    throw new Error("No users selected");
  console.log(`💀 BULK PURGE: DELETE /users/bulk-purge`, { userIds });
  return apiRequest(`/users/bulk-purge`, {
    method: "DELETE",
    body: JSON.stringify({ userIds }),
  });
}

// ─────────────────────────────────────────────────────────────
// 🔹 ✅ RESTORE FUNCTIONS (NEW)
// ─────────────────────────────────────────────────────────────

/**
 * Restore a single soft-deleted user
 * @param {string} userId - The ID of the user to restore
 */
export async function restoreUser(userId) {
  console.log(`🔄 RESTORE: PATCH /users/${userId}/restore`);
  return apiRequest(`/users/${userId}/restore`, { method: "PATCH" });
}

/**
 * Bulk restore multiple soft-deleted users
 * @param {string[]} userIds - Array of user IDs to restore
 */
export async function bulkRestoreUsers(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0)
    throw new Error("No users selected for restore");

  console.log(`🔄 BULK RESTORE: PATCH /users/bulk-restore`, { userIds });
  return apiRequest(`/users/bulk-restore`, {
    method: "PATCH",
    body: JSON.stringify({ userIds }),
  });
}

/**
 * API functions for user management operations
 */

/**
 * Update a user's role via PATCH request
 * @param {string} id - User ID
 * @param {string} role - New role value ('admin' | 'staff' | 'user')
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserRole = async (id, role) => {
  return apiRequest(`/users/${id}/update-role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
};

// ─────────────────────────────────────────────────────────────
// 🔹 GET SINGLE USER DETAILS
// ─────────────────────────────────────────────────────────────

/**
 * Get detailed information for a specific user
 * @param {string} userId - The ID of the user to fetch
 * @returns {Promise<Object>} User details
 */
export async function getUserById(userId) {
  if (!userId) throw new Error("User ID is required");
  console.log(`📄 GET SINGLE USER: GET /users/${userId}`);
  return apiRequest(`/users/${userId}`, { method: "GET" });
}
