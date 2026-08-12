import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Share2, Loader2, X } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useAuth } from "../../../context/AuthContext";
import { updateReferral } from "../../../services/apiAuth";
import { REFERRAL_SOURCES, isChannelSource } from "../../../lib/referralSources";

const isStandard = (value) => REFERRAL_SOURCES.includes(value);

export default function ReferralModal({ open, onClose, onSaved }) {
  const { user, login } = useAuth();
  const [source, setSource] = useState("");
  const [customSource, setCustomSource] = useState("");
  const [referralName, setReferralName] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    const saved = user?.referral_source || "";
    setSource(isStandard(saved) ? saved : saved ? "Other" : "");
    setCustomSource(isStandard(saved) ? "" : saved);
    setReferralName(user?.referral_name || "");
    setErrors({});
  }, [open, user]);

  if (!open) return null;

  const effectiveSource =
    source === "Other" ? customSource.trim() : (source || "").trim();

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
      login({ user: res.user });
      toast.success("Referral details saved");
      onSaved?.();
    } catch (err) {
      toast.error(err.message || "Failed to save referral details");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="referral-modal-title"
    >
      <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3
                id="referral-modal-title"
                className="text-lg font-semibold text-foreground"
              >
                One last thing
              </h3>
              <p className="text-sm text-muted-foreground">
                How did you hear about us?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-55"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
              Referral source
            </label>
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
            {errors.source && (
              <p className="text-xs text-destructive mt-1.5">{errors.source}</p>
            )}
          </div>

          {source === "Other" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Tell us more
              </label>
              <input
                value={customSource}
                onChange={(e) => {
                  setCustomSource(e.target.value);
                  setErrors((prev) => ({ ...prev, customSource: undefined }));
                }}
                placeholder="e.g. Campus event, WhatsApp group..."
                maxLength={50}
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.customSource && (
                <p className="text-xs text-destructive mt-1.5">
                  {errors.customSource}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Referral name
            </label>
            <input
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
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.referralName && (
              <p className="text-xs text-destructive mt-1.5">
                {errors.referralName}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold",
                "bg-secondary text-secondary-foreground",
                "hover:bg-secondary/80 transition-colors",
                "disabled:opacity-55 disabled:cursor-not-allowed",
              )}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              autoFocus
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "disabled:opacity-55 disabled:cursor-not-allowed",
                "inline-flex items-center justify-center gap-2",
              )}
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/25 border-t-primary-foreground animate-spin" />
                  Saving…
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}