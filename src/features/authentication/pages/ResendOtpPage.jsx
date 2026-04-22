import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { AuthCard } from "../components/AuthCard";
import { FormInput } from "../components/FormInput";
import { AuthNavbar } from "../components/AuthNavbar";
import toast from "react-hot-toast";
import { resendOtp } from "../../../services/apiAuth";

export function ResendOtpPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setIsLoading(true);

      await resendOtp({ email });

      toast.success("OTP sent successfully 📩");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ✅ Redirect to verify page with email
      navigate("/verify-otp", {
        state: { email },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar />

      <AuthCard
        title="Resend OTP"
        description="Enter your email to receive a new OTP"
        footer={
          <p className="text-sm text-muted-foreground">
            Remember your OTP?{" "}
            <Link
              to="/verify-otp"
              className="text-primary hover:underline font-medium"
            >
              Verify here
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email"
            id="email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Resend OTP"}
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
