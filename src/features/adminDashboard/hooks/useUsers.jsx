// src/hooks/useUsers.jsimport { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../../services/apiUsers";
import { normalizeUser } from "../../../lib/userStatus";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";

// src/hooks/useUsers.js
export const useUsers = ({
  page = 1,
  search = "",
  role = "all",
  status: filterStatus = "all",
} = {}) => {
  const { user, loading: authLoading } = useAuth();

  const {
    data,
    isPending: isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["users", page, search, role, filterStatus],
    queryFn: () =>
      getUsers({ page, limit: 10, search, role, status: filterStatus }),
    enabled: !authLoading && user?.role === "admin",
    keepPreviousData: true,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    onError: (err) => toast.error(err.message || "Failed to fetch users"),
  });

  const allUsers = (data?.data || []).map(normalizeUser);

  // ✅ FIX: Don't filter out deleted users - show ALL users in main list
  // Just apply status filter
  const filteredUsers = allUsers.filter((u) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "1") return u.status === 1;
    if (filterStatus === "0") return u.status === 0;
    return true;
  });

  return {
    users: filteredUsers, // ✅ Now includes deleted users
    allUsers,
    deletedUsers: allUsers.filter((u) => u.is_deleted === 1), // Keep this for Trash view
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isFetching,
    error,
  };
};
