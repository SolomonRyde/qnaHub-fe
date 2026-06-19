import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../../../services/apiDashboard";
import toast from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";

export const useDashboardStats = () => {
  const { user } = useAuth();

  const {
    data,
    isPending: isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,

    onError: (err) => {
      toast.error(err.message || "Failed to load dashboard stats");
    },
  });

  const stats = {
    total_users: Number(data?.data?.total_users || 0),
    active_users: Number(data?.data?.active_users || 0),
    inactive_users: Number(data?.data?.inactive_users || 0),
    new_signups_7d: Number(data?.data?.new_signups_7d || 0),
  };

  return { stats, isLoading, error, refetch };
};
