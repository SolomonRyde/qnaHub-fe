import { useState } from "react";
import { useParams } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { AuthCard } from "../components/AuthCard";
import { FormInput } from "../components/FormInput";
import { AuthNavbar } from "../components/AuthNavbar";

import { useResetPassword } from "../hooks/useResetPassword";

export function ResetPasswordPage() {
  const { token } = useParams(); // ✅ get token from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { resetPassword, isLoading } = useResetPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validation
    if (!password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // ✅ API call
    resetPassword({
      token,
      new_password: password,
    });
  };

  return (
    <>
      <AuthNavbar />

      <AuthCard
        title="Reset Password"
        description="Enter your new password"
        className="mt-16"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="New Password"
            id="password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
