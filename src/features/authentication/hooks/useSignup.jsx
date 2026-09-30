import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const navigate = useNavigate();

  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: signupApi,

    onSuccess: (data, variables) => {
      toast.success(
        "Account successfully created! Please verify the new account from the user'\s mail address",
      );
      // ✅ Pass email to next page
      navigate("/verify-otp", {
        state: { email: variables.email },
      });
    },

    onError: (err) => {
      console.log(err);

      toast.error(err.message || "Signup failed");
    },
  });
  return { signup, isLoading };
};
