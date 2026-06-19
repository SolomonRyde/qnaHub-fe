import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../../../services/apiUsers";
import { toast } from "react-hot-toast";

export const useUserById = (userId, options = {}) => {
  const { data, isLoading, isError, refetch, isFetching, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    staleTime: 0,
    retry: 1,
    ...options,
  });

  // Handle query errors with toast (only when error exists)
  if (isError && error) {
    toast.error(error.message || "Failed to fetch user details");
  }

  return {
    user: data?.data || null, // Extract nested `data` from API response
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
