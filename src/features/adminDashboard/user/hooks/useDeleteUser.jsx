import { useMutation, useQueryClient } from "@tanstack/react-query";
import { softDeleteUser, bulkSoftDelete } from "../../../../services/apiUsers";
import toast from "react-hot-toast";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds) => {
      const ids = Array.isArray(userIds) ? userIds : [userIds];
      return ids.length === 1 ? softDeleteUser(ids[0]) : bulkSoftDelete(ids);
    },
    // ✅ Backend rule: sets is_deleted=1 AND status=0
    onMutate: async (userIds) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueryData(["users"]);
      const ids = Array.isArray(userIds) ? userIds : [userIds];

      queryClient.setQueryData(["users"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data?.map((user) =>
            ids.includes(user.id)
              ? { ...user, is_deleted: 1, status: 0 }
              : user,
          ),
        };
      });
      return { previous, affectedIds: ids };
    },
    onSuccess: (_, userIds) => {
      const ids = Array.isArray(userIds) ? userIds : [userIds];
      toast.success(
        ids.length === 1 ? "User deleted" : `${ids.length} users deleted`,
      );
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (err, userIds, context) => {
      console.error("Soft delete failed:", err);
      if (context?.previous)
        queryClient.setQueryData(["users"], context.previous);
      const ids = Array.isArray(userIds) ? userIds : [userIds];
      toast.error(
        ids.length === 1
          ? err.message || "Failed to delete user"
          : err.message || "Failed to bulk delete users",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
};
