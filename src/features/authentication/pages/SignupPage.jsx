import { AuthCard } from "../components/AuthCard";
import { FormInput } from "../components/FormInput";
import { Button } from "../../../components/ui/Button";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { AuthNavbar } from "../components/AuthNavbar";
import { useSignup } from "../hooks/useSignup";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { parsePhoneNumberFromString } from "libphonenumber-js";

// ─────────────────────────────────────────────────────────────
// Validation Functions
// ─────────────────────────────────────────────────────────────

const validateName = (name) => {
  if (!name?.trim()) return "Full name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return "";
};

const validateEmail = (email) => {
  if (!email) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? "" : "Enter a valid email";
};

const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Minimum 6 characters required";
  if (!/[A-Z]/.test(password)) return "Must include uppercase letter";
  if (!/[0-9]/.test(password)) return "Must include a number";
  return "";
};

const validateConfirmPassword = (confirmPassword, password) => {
  if (!confirmPassword) return "Please confirm your password";
  if (confirmPassword !== password) return "Passwords do not match";
  return "";
};

const validatePhone = (phone) => {
  if (!phone) return "Please enter the phone number";
  try {
    const parsed = parsePhoneNumberFromString("+" + phone);
    return parsed?.isValid() ? "" : "Invalid phone number";
  } catch {
    return "Invalid phone number";
  }
};

// ─────────────────────────────────────────────────────────────
// Signup Component
// ─────────────────────────────────────────────────────────────

export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { signup, isLoading } = useSignup();
  const reCaptcha = useRef(null);

  // ─────────────────────────────────────────────────────────
  // Handle Change
  // ─────────────────────────────────────────────────────────
  const handleChange = useCallback((field, value) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  // ─────────────────────────────────────────────────────────
  // Handle Blur
  // ─────────────────────────────────────────────────────────
  const handleBlur = useCallback(
    (field, value) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      let error = "";

      switch (field) {
        case "name":
          error = validateName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "phone":
          error = validatePhone(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
        case "confirmPassword":
          error = validateConfirmPassword(value, password);
          break;
        default:
          break;
      }

      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [password],
  );

  // Revalidate confirm password
  useEffect(() => {
    if (touched.confirmPassword) {
      const err = validateConfirmPassword(confirmPassword, password);
      setErrors((prev) => ({ ...prev, confirmPassword: err }));
    }
  }, [password, confirmPassword]);

  // ─────────────────────────────────────────────────────────
  // Submit
  // ─────────────────────────────────────────────────────────

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.values(newErrors).some((e) => e)) {
      toast.error("Fix form errors");
      return;
    }

    if (!reCaptcha.current?.getValue()) {
      toast.error("Complete CAPTCHA");
      return;
    }

    // ✅ Parse phone properly
    const parsed = parsePhoneNumberFromString("+" + phone);

    const country_code = parsed?.countryCallingCode
      ? "+" + parsed.countryCallingCode
      : "";

    const phone_number = parsed?.nationalNumber || "";

    signup({
      name,
      email,
      password,
      phone_number,
      country_code,
    });
  };

  const showError = (field) => touched[field] && errors[field];

  // ─────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────

  return (
    <>
      <AuthNavbar />
      <AuthCard
        title="Create an account"
        description="Get started with your free exam platform"
        footer={
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full name"
            placeHolder="Enter your name"
            value={name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={(e) => handleBlur("name", e.target.value)}
            error={showError("name") ? errors.name : ""}
          />

          <FormInput
            label="Email"
            icon={Mail}
            placeHolder="Enter you email"
            value={email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={(e) => handleBlur("email", e.target.value)}
            error={showError("email") ? errors.email : ""}
          />

          {/* 🔥 Phone Input with Flags */}
          <div>
            <label className="text-sm font-medium">Phone number</label>
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={(value) => handleChange("phone", value)}
              onBlur={() => handleBlur("phone", phone)}
              inputClass="!w-full !h-[42px] !text-sm"
              buttonClass="!border !border-input"
            />
            {showError("phone") && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <FormInput
            label="Password"
            placeHolder="Enter the password "
            type={showPassword ? "text" : "password"}
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
            value={password}
            onChange={(e) => handleChange("password", e.target.value)}
            onBlur={(e) => handleBlur("password", e.target.value)}
            error={showError("password") ? errors.password : ""}
          />

          <FormInput
            label="Confirm Password"
            placeHolder="Enter confirm password"
            type={showConfirmPassword ? "text" : "password"}
            icon={Lock}
            rightIcon={showConfirmPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
            value={confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
            error={showError("confirmPassword") ? errors.confirmPassword : ""}
          />

          <ReCAPTCHA
            sitekey={import.meta.env.VITE_CAPTCHA_SITE_KEY}
            ref={reCaptcha}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Create Account"}
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
