import { Icons } from "./Icons";

// Stat Card
export function StatCard({ icon, iconBg, label, value }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium leading-tight">
          {label}
        </p>
        <p className="text-3xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// Select Dropdown
export const SelectDropdown = ({
  label,
  options,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="appearance-none bg-card border border-input rounded-xl px-4 py-2.5 pr-9 text-sm text-foreground font-medium outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer disabled:bg-muted/30 disabled:text-muted-foreground/60 disabled:cursor-not-allowed"
      >
        <option value="">{label}: All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Icons.ChevronDown />
      </div>
    </div>
  );
};
