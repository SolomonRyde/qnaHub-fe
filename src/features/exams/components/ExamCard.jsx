import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ExamCard = ({ exam }) => {
  const isFree = exam.price === 0;

  // const {
  //   id,
  //   title,
  //   category,
  //   difficulty,
  //   duration,
  //   totalQuestions,
  //   price,
  //   description,
  // } = exam;

  const {
    id,
    title,
    difficulty,
    duration,
    totalQuestions,
    price,
    description,
    subcategory_name, // ✅ add this
  } = exam;

  const difficultyStyles = {
    Beginner:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    Intermediate:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    Advanced:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  };

  const categoryStyles = {
    "Data Science":
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",

    Programming:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800",

    "Cloud Computing":
      "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",

    Frontend:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800",

    Backend:
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",

    DevOps:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  };

  return (
    <Card className="group flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge className={difficultyStyles[difficulty]}>{difficulty}</Badge>
          {/* <Badge
            className={
              categoryStyles[category] ||
              "bg-muted text-muted-foreground border-border"
            }
          >
            {category.subcategory}
          </Badge> */}
          <Badge
            className={
              categoryStyles[subcategory_name] ||
              "bg-muted text-muted-foreground border-border"
            }
          >
            {subcategory_name}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{duration} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{totalQuestions} Questions</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
          {description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div className="font-bold text-lg text-foreground">
          {isFree ? "Free" : `$${price}`}
        </div>
        <Button
          size="sm"
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          asChild
        >
          <Link to={`/exam/${exam.id}`}>
            Start Exam
            {/* <ArrowRight className="w-4 h-4" /> */}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExamCard;
