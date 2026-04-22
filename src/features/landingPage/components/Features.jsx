import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import {
  Brain,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Award,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Questions",
    description:
      "Unique questions generated in real-time by advanced AI, ensuring fresh and challenging exams every time.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get your exam results immediately with detailed feedback and explanations for each question.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Shield,
    title: "Verified Certificates",
    description:
      "Earn blockchain-verified certificates that employers can trust and verify instantly.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed analytics and personalized recommendations.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Target,
    title: " Exam-Oriented Practice",
    description:
      "Practice questions designed exactly like real aptitude exams asked in placements and competitive tests.",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: Sparkles,
    title: "Adaptive Difficulty",
    description:
      "Questions automatically adjust to your level—easy to start, challenging to master.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  // We keep the remaining features in the array, but only render the first 4 in the grid
];

// Reusable Exam Card Component for the Features Section
function ExamPreviewCard() {
  return (
    <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                JavaScript Fundamentals
              </h3>
              <p className="text-sm text-muted-foreground">AI-Generated Exam</p>
            </div>
          </div>
          <Badge variant="secondary">In Progress</Badge>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground mb-3">
              Question 5 of 20
            </p>
            <p className="text-foreground">
              What is the output of typeof null in JavaScript?
            </p>
          </div>

          <div className="grid gap-2">
            {["undefined", "object", "null", "number"].map((option, i) => (
              <button
                key={option}
                className={`p-3 rounded-lg border text-left transition-all ${
                  i === 1
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>12:45 remaining</span>
        </div>
        <Button size="sm">Next Question</Button>
      </div>

      {/* Floating Certificate Badge */}
      <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <Award className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">
              Certificate Ready
            </p>
            <p className="text-xs text-muted-foreground">Score: 92%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Students Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with proven
            learning methodologies to help you succeed.
          </p>
        </div>

        {/* New 2-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: 2x2 Feature Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.slice(0, 6).map((feature) => (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* RIGHT: Exam Card UI */}
          <div className="relative">
            {/* Optional: Add a subtle background blob behind the card for depth */}
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full transform scale-90 -z-10" />
            <ExamPreviewCard />
          </div>
        </div>
      </div>
    </section>
  );
}
