import { useMutation } from "@tanstack/react-query";
import { resendOtp as resendOtpApi } from "../../../services/apiAuth";
import toast from "react-hot-toast";

export const useResendOtp = () => {
  const { mutate: resendOtp, isPending } = useMutation({
    mutationFn: resendOtpApi,

    onSuccess: () => {
      toast.success("OTP sent again 📩");
    },

    onError: (err) => {
      toast.error("Failed to Resend OTP, please try again");
      console.log("RESEND OTP ERROR:", err);
    },
  });

  return { resendOtp, isPending };
};
