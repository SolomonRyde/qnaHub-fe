import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { mutate: loginUser, isPending: isLoading } = useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      if (data.success) {
        login({
          user: data.user,
        });

        toast.success("Login successful 🎉");

        // ✅ Role-based redirect
        const role = data.user?.role?.toLowerCase();

        if (role === "admin") {
          navigate("/user-management");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("Something went wrong");
      }
    },

    onError: (err) => {
      if (err.message.includes("Invalid email")) {
        toast.error("Invalid email or password");
      } else if (err.message.includes("not verified")) {
        toast.error("Please verify your email first");
      } else {
        toast.error(err.message);
      }
    },
  });

  return { loginUser, isLoading };
};
