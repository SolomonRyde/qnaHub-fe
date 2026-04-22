// Dynamic overview with useParams
import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  Clock,
  Target,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { Navbar } from "../../landingPage/components/Navbar";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../components/ui/Card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../components/ui/Accordion";
import { EXAMS } from "../../../data/data";

// --- ICON_MAP: Map instruction titles to icons ---
const ICON_MAP = {
  "Time Limit": Clock,
  "Secure Environment": Shield,
  Attempts: RotateCcw,
  "Instant Results": CheckCircle2,
  "Code Questions": Target,
  "Query Questions": Target,
  "Detailed Report": CheckCircle2,
  "Expert Level": AlertCircle,
  "Instant Feedback": CheckCircle2,
};

// --- Difficulty Badge Component ---
const DifficultyBadge = ({ level }) => {
  const variants = {
    Beginner:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    Intermediate:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    Advanced:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  };

  return (
    <Badge variant="outline" className={cn("font-medium", variants[level])}>
      {level}
    </Badge>
  );
};

// --- Instruction Item Component ---
const InstructionItem = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
    <div className="flex-shrink-0 mt-0.5">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
        {title}
      </h4>
      <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
    </div>
  </div>
);

// --- Topic Chip Component ---
const TopicChip = ({ topic }) => (
  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border hover:border-primary/50 transition-colors cursor-default">
    {topic}
  </span>
);

// --- Main Exam Overview Page ---
const ExamOverviewPage = () => {
  const { id } = useParams();
  const [isStarting, setIsStarting] = useState(false);

  // Find exam from centralized data
  console.log("EXAMSOVERVIEW", EXAMS);
  const exam = EXAMS.find((e) => e.id === id);

  // Fallback if exam not found
  if (!exam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Exam Not Found</h2>
          <p className="text-muted-foreground">
            The exam you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Browse All Exams</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleStartExam = () => {
    setIsStarting(true);
    // Simulate exam start logic
    setTimeout(() => {
      console.log(`Starting exam: ${exam.id}`);
      // In real app: navigate to exam interface
      setIsStarting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION - Main Content (70%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="font-medium">
                  {exam.category.subcategory}
                </Badge>
                <DifficultyBadge level={exam.difficulty} />
                {exam.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {exam.title}
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {exam.description}
              </p>
            </div>

            {/* Instructions Card */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Exam Instructions
                </CardTitle>
                <CardDescription>
                  Please review these important guidelines before starting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {exam.instructions.map((instruction, index) => {
                  const IconComponent =
                    ICON_MAP[instruction.title] || AlertCircle;
                  return (
                    <InstructionItem
                      key={index}
                      icon={IconComponent}
                      title={instruction.title}
                      description={instruction.description}
                    />
                  );
                })}
              </CardContent>
            </Card>

            {/* Syllabus / Topics Section */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Topics Covered</CardTitle>
                <CardDescription>
                  Key areas assessed in this examination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {exam.topics.map((topic, index) => (
                    <TopicChip key={index} topic={topic} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About the Exam - Accordion Style */}
            <Card className="border-border shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="about" className="border-b-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span className="text-lg font-semibold">
                        About This Exam
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {exam.about}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {[
                          { label: "Questions", value: exam.totalQuestions },
                          { label: "Duration", value: `${exam.duration} min` },
                          {
                            label: "Passing Score",
                            value: `${exam.passingScore}%`,
                          },
                          {
                            label: "Attempts Left",
                            value: exam.attemptsRemaining,
                          },
                        ].map((stat) => (
                          <div key={stat.label}>
                            <div className="text-2xl font-bold text-foreground">
                              {stat.value}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>

          {/* RIGHT SECTION - Sticky Action Panel (30%) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Start Exam Card */}
              <Card className="border-primary/20 shadow-lg shadow-primary/5 bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Exam Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {exam.duration} min
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Duration
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {exam.totalQuestions}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Questions
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {exam.passingScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Passing
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {exam.attemptsRemaining}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Attempts
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning Message */}
                  {exam.attemptsRemaining < exam.attemptsAllowed && (
                    <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        You have{" "}
                        <strong>
                          {exam.attemptsRemaining} attempt
                          {exam.attemptsRemaining !== 1 ? "s" : ""}
                        </strong>{" "}
                        remaining. Use them wisely!
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-0">
                  {/* Primary CTA */}
                  <Button
                    onClick={handleStartExam}
                    disabled={isStarting || exam.attemptsRemaining === 0}
                    className="w-full h-12 text-base font-semibold shadow-sm hover:shadow-md transition-all"
                  >
                    {isStarting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Starting...
                      </span>
                    ) : exam.attemptsRemaining === 0 ? (
                      "No Attempts Remaining"
                    ) : (
                      "Start Exam"
                    )}
                    {!isStarting && exam.attemptsRemaining > 0 && (
                      <ChevronRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>

                  {/* Secondary Action */}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="#topics">Preview Topics</Link>
                  </Button>

                  {/* Helper Text */}
                  <p className="text-xs text-center text-muted-foreground">
                    By starting, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms & Conditions
                    </a>
                  </p>
                </CardFooter>
              </Card>

              {/* Progress / Tips Card (Optional) */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Pro Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Review all topics before starting. You can't pause once the
                    exam begins.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky CTA - Only visible on small screens */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur border-t border-border lg:hidden">
        <Button
          onClick={handleStartExam}
          disabled={isStarting || exam.attemptsRemaining === 0}
          className="w-full h-12 text-base font-semibold shadow-lg"
        >
          {isStarting ? "Starting..." : "Start Exam"}
        </Button>
      </div>
    </div>
  );
};

export default ExamOverviewPage;
