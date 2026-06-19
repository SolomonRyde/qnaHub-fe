import {
  getStatusClasses,
  getUserDisplayStatus,
} from "../../../../lib/userStatus";
import { cn } from "../../../../lib/utils";

export const StatusBadge = ({ user }) => {
  const status = getUserDisplayStatus(user);
  const classes = getStatusClasses(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5  px-2.5 py-0.5 rounded-full text-xs font-medium border",
        classes,
      )}
    >
      {/* <span className="text-xs">{getStatusIcon(status)}</span> */}
      {status}
    </span>
  );
};
