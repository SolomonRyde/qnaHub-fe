import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { ArrowRight, Sparkles, Users, Award, Clock } from "lucide-react";
import { HeroCarousel } from "./HeroCarousel";

const stats = [
  { icon: Users, value: "50,000+", label: "Learners Practicing Daily" },
  { icon: Award, value: "1000+", label: " Unique AI-Generated Tests" },
  { icon: Clock, value: "24/7", label: " Practice Anytime" },
];

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-14 overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge className="mb-6 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI-Powered Exams
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Master Your Skills with{" "}
              <span className="text-primary">AI-Generated</span> Exams
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty">
              Unlock your potential and fast-track your success with our
              AI-powered exam platform. Gain valuable certifications, sharpen
              your skills, and stay ahead with real-time, personalized questions
              designed to match your expertise level—every time you practice.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2">
                Start Free Exam
                <ArrowRight className="w-4 h-4" />
              </Button>
              {/* <Button variant="outline" size="lg">
                View All Exams
              </Button> */}
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - New Carousel */}
          <div className="relative lg:pl-10">
            <HeroCarousel />

            {/* Floating Badge (Optional decoration to keep visual interest) */}
            {/* <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-xl max-w-[200px] hidden sm:block animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Top Rated</p>
                  <p className="text-xs text-muted-foreground">4.9/5 Stars</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
