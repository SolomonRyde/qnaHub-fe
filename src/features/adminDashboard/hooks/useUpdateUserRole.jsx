// hooks/useUpdateUserRole.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../../../services/apiUsers";
import { toast } from "react-hot-toast";

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),

    onSuccess: (data, variables) => {
      toast.success("User role updated successfully");

      // ✅ Invalidate the users list
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // ✅ ALSO invalidate the specific user detail cache
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });

      // 🎯 BONUS: Update cache immediately (optimistic update alternative)
      // queryClient.setQueryData(["user", variables.id], (old) => ({
      //   ...old,
      //   data: { ...old?.data, role: variables.role }
      // }));
    },

    onError: (error) => {
      toast.error(error.message || "Failed to update user role");
    },
  });

  return {
    updateRole: mutate,
    isPending,
  };
};
