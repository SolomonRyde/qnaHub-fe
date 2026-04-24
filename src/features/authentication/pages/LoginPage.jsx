import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { AuthCard } from "../components/AuthCard";
import { FormInput } from "../components/FormInput";
import { AuthNavbar } from "../components/AuthNavbar";

import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import { useLogin } from "../hooks/useLogin";

// ✅ Validation functions
const validateEmail = (email) => {
  if (!email) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? "" : "Enter a valid email";
};

const validatePassword = (password) => {
  if (!password) return "Password is required";
  return "";
};

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const reCaptcha = useRef(null);
  const { loginUser, isLoading } = useLogin();

  // 🔹 Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
    });

    // ❌ Stop if errors
    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Please fix form errors");
      return;
    }

    // ❌ CAPTCHA check
    if (!reCaptcha.current?.getValue()) {
      toast.error("Please complete captcha");
      return;
    }

    // ✅ API call
    loginUser({ email, password });
  };

  // ✅ Show error logic
  const showError = (field) => (touched[field] || submitted) && errors[field];

  return (
    <>
      <AuthNavbar />

      <AuthCard
        title="Welcome back"
        description="Sign in to your account to continue"
        footer={
          <>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </>
        }
        className="mt-16"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <FormInput
            label="Email"
            type="email"
            placeHolder="Enter your email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, email: true }));
              setErrors((prev) => ({
                ...prev,
                email: validateEmail(email),
              }));
            }}
            error={showError("email") ? errors.email : ""}
          />

          {/* Password */}
          <FormInput
            label="Password"
            type={showPassword ? "text" : "password"}
            placeHolder="Enter the password"
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, password: true }));
              setErrors((prev) => ({
                ...prev,
                password: validatePassword(password),
              }));
            }}
            error={showError("password") ? errors.password : ""}
          />

          {/* CAPTCHA */}
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
            ref={reCaptcha}
          />

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
