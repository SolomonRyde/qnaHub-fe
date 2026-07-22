import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock, KeyRound, RefreshCcw, Loader2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../components/ui/Card";
import {
  updateEmail,
  verifyOtp,
  resendOtp,
} from "../../../../services/apiAuth";
import { Field, TextInput, PasswordInput } from "../FormPrimitives";

export default function EmailTab({ user, onUpdated }) {
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [pendingEmail, setPendingEmail] = useState(null);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleRequestChange = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
      setError("Enter a valid email address");
      return;
    }
    if (newEmail.toLowerCase() === user?.email?.toLowerCase()) {
      setError("This is already your current email");
      return;
    }
    if (!currentPassword) {
      setError("Enter your current password to confirm this change");
      return;
    }

    setSaving(true);
    try {
      const res = await updateEmail({
        email: newEmail.trim(),
        current_password: currentPassword,
      });
      setPendingEmail(res.email);
      setCooldown(60);
      toast.success("Verification code sent to your new email");
    } catch (err) {
      setError(err.message || "Failed to update email");
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setVerifying(true);
    try {
      const res = await verifyOtp({ email: pendingEmail, otp });
      onUpdated(res.user);
      toast.success("Email verified and updated");
      setPendingEmail(null);
      setOtp("");
      setNewEmail("");
      setCurrentPassword("");
    } catch (err) {
      toast.error(err.message || "Invalid or expired code");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    try {
      await resendOtp({ email: pendingEmail });
      toast.success("A new code has been sent");
      setCooldown(60);
    } catch (err) {
      toast.error(err.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  if (pendingEmail) {
    return (
      <Card className="border-white/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary" />
            Verify your new email
          </CardTitle>
          <CardDescription>
            We sent a 6-digit code to <strong>{pendingEmail}</strong>. Enter it
            below to finish updating your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-5 max-w-sm">
            <Field label="Verification code">
              <TextInput
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                inputMode="numeric"
                className="text-center text-lg tracking-[0.5em] font-semibold"
                maxLength={6}
                autoFocus
              />
            </Field>

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={verifying} className="gap-2">
                {verifying && <Loader2 className="w-4 h-4 animate-spin" />}
                Verify & update
              </Button>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || resending}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setPendingEmail(null);
                setOtp("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel and use a different email
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10">
      <CardHeader>
        <CardTitle className="text-base">Email address</CardTitle>
        <CardDescription>
          Changing your email requires verifying the new address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRequestChange} className="space-y-5 max-w-lg">
          <Field label="Current email" icon={Mail}>
            <TextInput value={user?.email || ""} disabled />
          </Field>

          <Field label="New email" icon={Mail} error={error}>
            <TextInput
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>

          <Field
            label="Current password"
            icon={Lock}
            hint="Confirm it's you before we change your email"
          >
            <PasswordInput
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Send verification code
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
