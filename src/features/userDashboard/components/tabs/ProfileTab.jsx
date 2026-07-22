import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User, Phone, Loader2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../components/ui/Card";
import { updateProfile } from "../../../../services/apiAuth";
import { Field, TextInput } from "../FormPrimitives";

export default function ProfileTab({ user, onUpdated }) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [countryCode, setCountryCode] = useState(user?.country_code || "+1");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone_number || "");
    setCountryCode(user?.country_code || "+1");
  }, [user]);

  const isDirty =
    name !== (user?.name || "") ||
    phone !== (user?.phone_number || "") ||
    countryCode !== (user?.country_code || "+1");

  const validate = () => {
    const next = {};
    if (name.trim().length < 2)
      next.name = "Name must be at least 2 characters";
    if (!/^\d{10}$/.test(phone))
      next.phone = "Enter a valid 10-digit phone number";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await updateProfile({
        name: name.trim(),
        phone_number: phone.trim(),
        country_code: countryCode.trim(),
      });
      onUpdated(res.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-white/10">
      <CardHeader>
        <CardTitle className="text-base">Profile information</CardTitle>
        <CardDescription>
          Update the name and phone number on your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
          <Field label="Full name" icon={User} error={errors.name}>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Code">
              <TextInput
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="+1"
                maxLength={4}
              />
            </Field>
            <div className="col-span-2">
              <Field label="Phone number" icon={Phone} error={errors.phone}>
                <TextInput
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="9876543210"
                  inputMode="numeric"
                />
              </Field>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!isDirty || saving}
              className="gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
