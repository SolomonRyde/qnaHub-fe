import { useMutation } from "@tanstack/react-query";
import { resetPassword as resetPasswordApi } from "../../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useResetPassword = () => {
  const navigate = useNavigate();

  const { mutate: resetPassword, isPending: isLoading } = useMutation({
    mutationFn: resetPasswordApi,

    onSuccess: () => {
      toast.success("Password reset successfully 🎉");

      // ✅ Redirect to login after success
      navigate("/login");
    },

    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  return { resetPassword, isLoading };
};
