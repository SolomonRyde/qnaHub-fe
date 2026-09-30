import { apiClient } from "../lib/apiClient.js";
import { API_PATHS } from "../config/api.js";

export async function getDashboardStats() {
  return apiClient.get(`${API_PATHS.ADMIN}/dashboard-stats`);
}
