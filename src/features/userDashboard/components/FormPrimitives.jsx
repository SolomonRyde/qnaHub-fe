import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function Field({ label, icon: Icon, hint, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
    </div>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition-shadow ${props.className || ""}`}
    />
  );
}

export function PasswordInput({ value, onChange, placeholder, ...rest }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <TextInput
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pr-10"
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        tabIndex={-1}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
