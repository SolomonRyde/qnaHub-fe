import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast"; // or your preferred toast library
import { restoreUser, bulkRestoreUsers } from "../../../../services/apiUsers";

/**
 * React Query hook for restoring users (single or bulk)
 * @param {Object} options - Optional callbacks
 */
export function useRestoreUser({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    // 🎯 Accept either single ID (string) or array of IDs
    mutationFn: async (input) => {
      const userIds = Array.isArray(input) ? input : [input];

      if (userIds.length === 1) {
        return await restoreUser(userIds[0]);
      }
      return await bulkRestoreUsers(userIds);
    },

    // ⚡ OPTIMISTIC UPDATE: Update UI before API responds
    onMutate: async (input) => {
      const userIds = Array.isArray(input) ? input : [input];

      // Cancel any ongoing refetches for users query
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot previous state for rollback
      const previousUsers = queryClient.getQueryData(["users"]);

      // Optimistically update the cache
      queryClient.setQueryData(["users"], (old) => {
        if (!old?.data?.users) return old;

        return {
          ...old,
          data: {
            ...old.data,
            users: old.data.users.map((user) =>
              userIds.includes(user.id)
                ? {
                    ...user,
                    is_deleted: 0,
                    status: 1,
                    displayStatus: "Active", // Update derived field
                  }
                : user,
            ),
          },
        };
      });

      return { previousUsers };
    },

    // ✅ SUCCESS: Show toast + invalidate queries
    onSuccess: (data, variables) => {
      const userIds = Array.isArray(variables) ? variables : [variables];
      const count = userIds.length;

      toast.success(
        count === 1
          ? "User restored successfully"
          : `${count} users restored successfully`,
      );

      // Invalidate dependent queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });

      // Call optional external onSuccess callback
      onSuccess?.(data, variables);
    },

    // ❌ ERROR: Rollback UI + show error toast
    onError: (err, variables, context) => {
      // Rollback to previous state
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }

      toast.error(err.message || "Failed to restore user(s)");

      // Call optional external onError callback
      onError?.(err, variables);
    },

    // 🔄 SETTLED: Always refetch to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  return {
    restore: mutation.mutate,
    restoreAsync: mutation.mutateAsync,
    isLoading: mutation.isPending, // React Query v5 uses isPending
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}
