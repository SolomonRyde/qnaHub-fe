import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purgeUser, bulkPurge } from "../../../../services/apiUsers";
import toast from "react-hot-toast";

export const usePurgeUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds) => {
      const ids = Array.isArray(userIds) ? userIds : [userIds];
      return ids.length === 1 ? purgeUser(ids[0]) : bulkPurge(ids);
    },
    onMutate: async (userIds) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueryData(["users"]);
      const ids = Array.isArray(userIds) ? userIds : [userIds];

      queryClient.setQueryData(["users"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.filter((user) => !ids.includes(user.id)),
          total: Math.max(0, (old.total || 0) - ids.length),
        };
      });
      return { previous, affectedIds: ids };
    },
    onSuccess: (_, userIds) => {
      const ids = Array.isArray(userIds) ? userIds : [userIds];
      toast.success(
        ids.length === 1
          ? "User permanently deleted"
          : `${ids.length} users permanently deleted`,
        { icon: "💀", duration: 4000 },
      );
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err, userIds, context) => {
      console.error("Purge failed:", err);
      if (context?.previous)
        queryClient.setQueryData(["users"], context.previous);
      const ids = Array.isArray(userIds) ? userIds : [userIds];
      toast.error(
        ids.length === 1
          ? err.message || "Failed to permanently delete"
          : err.message || "Failed to bulk purge",
        { icon: "❌", duration: 5000 },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
};
