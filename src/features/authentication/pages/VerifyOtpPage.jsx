import { AuthCard } from "../components/AuthCard";
import { FormInput } from "../components/FormInput";
import { Button } from "../../../components/ui/Button";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthNavbar } from "../components/AuthNavbar";
import { useVerifyOtp } from "../hooks/useVerifyOtp";

export function VerifyOtpPage() {
  const { state } = useLocation();

  const [email, setEmail] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(60); // ✅ 60 sec timer
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();

  const { verifyOtp, isLoading } = useVerifyOtp();

  // ⏱ Timer logic
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Verify OTP
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !otp) {
      setError("Please fill all fields");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    verifyOtp({ email, otp });
  };

  // 🔁 Resend OTP
  const handleResend = async () => {
    navigate("/resend-otp");
  };

  return (
    <>
      <AuthNavbar />

      <AuthCard
        title="Verify OTP"
        description="Enter the OTP sent to your email"
        footer={
          <p className="text-sm text-muted-foreground">
            Didn’t receive OTP?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className={`font-medium ${
                timer > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary hover:underline"
              }`}
            >
              {timer > 0
                ? `Resend in ${timer}s`
                : isResending
                  ? "Sending..."
                  : "Resend"}
            </button>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            label="OTP"
            type="text"
            value={otp}
            onChange={
              (e) => setOtp(e.target.value.replace(/\D/g, "")) // numbers only
            }
            maxLength={6}
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
