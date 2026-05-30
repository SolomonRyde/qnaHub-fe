import { memo, useState } from "react";
import { SectionCard } from "./SectionCard";
import { ChevronDown, Layers } from "lucide-react";
import { TOPIC_COLORS } from "../../constants/TopicColors.constatns";
import { cn } from "../../../../lib/utils";

export const TopicsSection = memo(({ topics }) => {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 12;
  const clamped = !expanded && topics.length > LIMIT;
  const visible = clamped ? topics.slice(0, LIMIT) : topics;

  return (
    <SectionCard
      icon={
        <Layers className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
      }
      title="Topics Covered"
      subtitle={`${topics.length} skill${topics.length !== 1 ? "s" : ""} assessed`}
    >
      <div className="relative">
        <div
          className={cn(
            "flex flex-wrap gap-2",
            clamped && "max-h-[112px] overflow-hidden",
          )}
        >
          {visible.map((topic, i) => (
            <span
              key={i}
              className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold border",
                "transition-all duration-150 cursor-default select-none hover:scale-[1.04]",
                TOPIC_COLORS[i % TOPIC_COLORS.length],
              )}
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Gradient fade over bottom row when collapsed */}
        {clamped && (
          <div
            className="absolute bottom-0 left-0 right-0 h-12
                          bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none"
          />
        )}
      </div>

      {topics.length > LIMIT && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
                     border border-border bg-muted text-muted-foreground
                     hover:bg-accent hover:text-foreground transition-all duration-150
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {expanded ? "Show less" : `Show all ${topics.length} topics`}
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        </button>
      )}
    </SectionCard>
  );
});
TopicsSection.displayName = "TopicsSection";
