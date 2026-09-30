import { useMutation } from "@tanstack/react-query";
import { forgotPassword as forgotPasswordApi } from "../../../services/apiAuth";
import toast from "react-hot-toast";

export const useForgotPassword = () => {
  const { mutate: forgotPassowrd, isPending: isLoading } = useMutation({
    mutationFn: forgotPasswordApi,

    onSuccess: () => {
      toast.success(
        "Resend password link has been sent, please check your mail",
      );
    },

    onError: (err) => {
      // Show the actual error message from backend (e.g., rate limit messages)
      toast.error(err.message || "Something went wrong");
    },
  });

  return { forgotPassowrd, isLoading };
};
