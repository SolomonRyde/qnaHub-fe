import { useMutation } from "@tanstack/react-query";
import { verifyOtp as verifyOtpApi } from "../../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export const useVerifyOtp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { mutate: verifyOtp, isPending: isLoading } = useMutation({
    mutationFn: verifyOtpApi,

    onSuccess: (data) => {
      if (data.success) {
        login({
          user: data.user,
        });

        toast.success("Login successful 🎉");
        navigate("/dashboard");
      } else {
        // Show the actual error message from backend
        toast.error(data.message || "Verification failed");
      }
    },

    onError: (err) => {
      // Show the actual error message from backend (e.g., rate limit messages)
      toast.error(err.message || "Invalid OTP");
      console.log(err);
    },
  });

  return { verifyOtp, isLoading };
};
