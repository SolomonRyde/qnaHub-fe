import { BookOpen } from "lucide-react";
import { BENEFITS } from "../../constants/Benefits.constats";
import { SectionCard } from "./SectionCard";
import { memo } from "react";
import { cn } from "../../../../lib/utils";

export const AboutSection = memo(({ exam }) => {
  const description =
    exam.description ||
    `This ${exam.difficulty} level assessment validates your expertise in ${exam.category_name}. Consisting of ${exam.no_of_questions} carefully curated questions, it is designed to challenge your knowledge within ${exam.duration_minutes} minutes. Completing it demonstrates verified proficiency in ${exam.sub_category_name || exam.category_name}.`;

  return (
    <SectionCard
      icon={<BookOpen className="h-4.5 w-4.5 text-sky-500 dark:text-sky-400" />}
      title="About This Exam"
    >
      <p className="text-sm text-muted-foreground leading-[1.85] mb-5">
        {description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {BENEFITS.map(({ icon: Icon, text, color }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl
                       bg-muted border border-border
                       hover:border-primary/25 hover:bg-muted/70
                       transition-all duration-150 group"
          >
            <div
              className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0
                            group-hover:border-primary/20 transition-colors"
            >
              <Icon className={cn("h-3.5 w-3.5", color)} />
            </div>
            <span className="text-xs text-foreground font-medium leading-snug">
              {text}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
});
AboutSection.displayName = "AboutSection";
