export const initialsOf = (name) =>
  (name || "U")
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

export function passwordStrength(pw = "") {
  if (!pw) return { score: 0, label: "", className: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const levels = [
    { label: "Too short", className: "bg-rose-500", width: "20%" },
    { label: "Weak", className: "bg-rose-500", width: "35%" },
    { label: "Fair", className: "bg-amber-500", width: "55%" },
    { label: "Good", className: "bg-blue-500", width: "75%" },
    { label: "Strong", className: "bg-emerald-500", width: "100%" },
  ];
  const idx = Math.min(score, levels.length - 1);
  return { ...levels[idx], score };
}
