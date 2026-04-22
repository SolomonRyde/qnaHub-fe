import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { AuthCard } from "../components/AuthCard";
import { FormInput } from "../components/FormInput";
import { AuthNavbar } from "../components/AuthNavbar";
import { useForgotPassword } from "../hooks/useForgotPassword";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { forgotPassowrd, isLoading } = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    // ✅ Call API
    forgotPassowrd(email);
  };

  return (
    <>
      <AuthNavbar />

      <AuthCard
        title="Forgot Password"
        description="Enter your email to receive reset link"
        className="mt-16"
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
            <div className="p-3 text-sm text-red-500 bg-red-100 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
