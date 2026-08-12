import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Share2, Loader2 } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../components/ui/Card";
import { updateReferral } from "../../../../services/apiAuth";
import { Field, TextInput } from "../FormPrimitives";
import { REFERRAL_SOURCES, isChannelSource } from "../../../../lib/referralSources";

const isStandard = (value) => REFERRAL_SOURCES.includes(value);

export default function ReferralTab({ user, onUpdated }) {
  const [source, setSource] = useState(() =>
    isStandard(user?.referral_source) ? user?.referral_source : "",
  );
  const [customSource, setCustomSource] = useState(() =>
    isStandard(user?.referral_source) ? "" : user?.referral_source || "",
  );
  const [referralName, setReferralName] = useState(user?.referral_name || "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = user?.referral_source || "";
    setSource(isStandard(saved) ? saved : saved ? "Other" : "");
    setCustomSource(isStandard(saved) ? "" : saved);
    setReferralName(user?.referral_name || "");
  }, [user]);

  const effectiveSource =
    source === "Other" ? customSource.trim() : (source || "").trim();

  const isDirty =
    effectiveSource !== (user?.referral_source || "") ||
    referralName.trim() !== (user?.referral_name || "");

  const validate = () => {
    const next = {};
    if (!source) next.source = "Please select a referral source";
    if (source === "Other" && !customSource.trim())
      next.customSource = "Please enter how they heard about you";
    if (!referralName.trim()) next.referralName = "Please enter the referral name";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await updateReferral({
        referral_source: effectiveSource,
        referral_name: referralName.trim(),
      });
      onUpdated(res.user);
      toast.success("Referral details saved");
    } catch (err) {
      toast.error(err.message || "Failed to save referral details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-white/10">
      <CardHeader>
        <CardTitle className="text-base">Referral information</CardTitle>
        <CardDescription>
          How did you hear about us? This helps us understand where candidates
          come from.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
          <Field label="Referral source" icon={Share2} error={errors.source}>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setErrors((prev) => ({ ...prev, source: undefined }));
              }}
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a source</option>
              {REFERRAL_SOURCES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>

          {source === "Other" && (
            <Field
              label="Tell us more"
              error={errors.customSource}
            >
              <TextInput
                value={customSource}
                onChange={(e) => {
                  setCustomSource(e.target.value);
                  setErrors((prev) => ({ ...prev, customSource: undefined }));
                }}
                placeholder="e.g. Campus event, WhatsApp group..."
                maxLength={50}
              />
            </Field>
          )}

          <Field
            label="Referral name"
            error={errors.referralName}
          >
            <TextInput
              value={referralName}
              onChange={(e) => {
                setReferralName(e.target.value);
                setErrors((prev) => ({ ...prev, referralName: undefined }));
              }}
              placeholder={
                isChannelSource(source)
                  ? "Type NONE if you heard about us from social media / ads"
                  : "Who referred you?"
              }
              maxLength={255}
            />
          </Field>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!isDirty || saving}
              className="gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save referral
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}