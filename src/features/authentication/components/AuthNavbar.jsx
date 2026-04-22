import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { cn } from "../../../lib/utils";

export function AuthNavbar({ className, ...props }) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="Go to home page"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-foreground">Examify</span>
        </Link>
      </div>
    </header>
  );
}
