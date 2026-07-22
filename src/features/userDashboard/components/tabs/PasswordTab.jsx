import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Lock, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../components/ui/Card";
import { changePassword } from "../../../../services/apiAuth";
import { Field, PasswordInput } from "../FormPrimitives";
import { passwordStrength } from "../helpers";

export default function PasswordTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = useMemo(() => passwordStrength(newPassword), [newPassword]);

  const validate = () => {
    const next = {};
    if (!currentPassword) next.current = "Enter your current password";
    if (newPassword.length < 6)
      next.next = "New password must be at least 6 characters";
    if (confirmPassword !== newPassword)
      next.confirm = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-white/10">
      <CardHeader>
        <CardTitle className="text-base">Password</CardTitle>
        <CardDescription>
          Choose a strong password you don't use anywhere else
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
          <Field label="Current password" icon={Lock} error={errors.current}>
            <PasswordInput
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          <Field label="New password" icon={ShieldCheck} error={errors.next}>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
            {newPassword && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${strength.className}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {strength.label}
                </p>
              </div>
            )}
          </Field>

          <Field
            label="Confirm new password"
            icon={CheckCircle2}
            error={errors.confirm}
          >
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Update password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
