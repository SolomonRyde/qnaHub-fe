import { cn } from "../../../../lib/utils";

export const RoleBadge = ({ role }) => {
  const variants = {
    ADMIN: "bg-primary/10 text-primary border-primary/20",
    EDITOR: "bg-blue-500/10 text-blue-700 border-blue-200",
    STAFF: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
    VIEWER: "bg-secondary text-secondary-foreground border-border",
    USER: "bg-purple-500/10 text-purple-700 border-purple-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[role] || variants.VIEWER,
      )}
    >
      {role}
    </span>
  );
};
