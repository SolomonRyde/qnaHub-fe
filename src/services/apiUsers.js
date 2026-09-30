// src/services/apiUsers.js
import { apiClient, buildQueryString } from "../lib/apiClient.js";
import { API_PATHS } from "../config/api.js";

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
  const params = {
    page: String(page),
    limit: String(limit),
  };
  if (search?.trim()) params.search = search.trim();
  if (role && role !== "all") params.role = role.toLowerCase();
  if (status && status !== "all") params.status = status;

  const queryString = buildQueryString(params);
  return apiClient.get(`${API_PATHS.ADMIN}/users${queryString}`);
}

// ─────────────────────────────────────────────────────────────
// 🔹 SOFT DELETE (Sets is_deleted=1, status=0)
// ─────────────────────────────────────────────────────────────
export async function softDeleteUser(id) {
  return apiClient.patch(`${API_PATHS.ADMIN}/users/${id}/delete`);
}

export async function bulkSoftDelete(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0)
    throw new Error("No users selected");
  return apiClient.patch(`${API_PATHS.ADMIN}/users/bulk-delete`, { userIds });
}

// ─────────────────────────────────────────────────────────────
// 🔹 PURGE (Permanent DELETE)
// ─────────────────────────────────────────────────────────────
export async function purgeUser(id) {
  return apiClient.delete(`${API_PATHS.ADMIN}/users/${id}/purge`);
}

export async function bulkPurge(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0)
    throw new Error("No users selected");
  return apiClient.delete(`${API_PATHS.ADMIN}/users/bulk-purge`, { userIds });
}

// ─────────────────────────────────────────────────────────────
// 🔹 ✅ RESTORE FUNCTIONS (NEW)
// ─────────────────────────────────────────────────────────────

/**
 * Restore a single soft-deleted user
 * @param {string} userId - The ID of the user to restore
 */
export async function restoreUser(userId) {
  return apiClient.patch(`${API_PATHS.ADMIN}/users/${userId}/restore`);
}

/**
 * Bulk restore multiple soft-deleted users
 * @param {string[]} userIds - Array of user IDs to restore
 */
export async function bulkRestoreUsers(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0)
    throw new Error("No users selected for restore");

  return apiClient.patch(`${API_PATHS.ADMIN}/users/bulk-restore`, { userIds });
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
  return apiClient.patch(`${API_PATHS.ADMIN}/users/${id}/update-role`, {
    role,
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
  return apiClient.get(`${API_PATHS.ADMIN}/users/${userId}`);
}
