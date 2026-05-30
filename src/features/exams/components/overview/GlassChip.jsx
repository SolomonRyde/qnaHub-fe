import { memo } from "react";
import { cn } from "../../../../lib/utils";

export const GlassChip = memo(({ icon: Icon, label, value, accent }) => (
  <div
    className="flex items-center gap-3 px-4 py-3 rounded-xl
                  bg-black/40 border border-white/20 backdrop-blur-md
                  hover:bg-black/55 hover:border-white/35 hover:-translate-y-0.5
                  transition-all duration-200 cursor-default select-none"
    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
  >
    <Icon className={cn("h-4 w-4 flex-shrink-0", accent)} />
    <div className="leading-none">
      <p className="text-[10px] text-white/55 font-bold tracking-wider uppercase mb-1">
        {label}
      </p>
      <p className="text-[15px] font-extrabold text-white leading-none">
        {value}
      </p>
    </div>
  </div>
));
GlassChip.displayName = "GlassChip";
