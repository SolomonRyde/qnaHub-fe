import { Card, CardContent } from "../../../components/ui/Card";
import {
  FileText,
  Brain,
  Award,
  CheckCircle,
  Target,
  Users,
  Zap,
} from "lucide-react";

const steps = [
  {
    step: 1,
    icon: FileText,
    title: "Choose Your Exam",
    description:
      "Browse our catalog or generate a custom AI exam on any topic.",
  },
  {
    step: 2,
    icon: Brain,
    title: "Take the Test",
    description: "Answer AI-generated questions tailored to your skill level.",
  },
  {
    step: 3,
    icon: Award,
    title: "Get Certified",
    description: "Earn a verified certificate and share your achievement.",
  },
];

const reasons = [
  { icon: Target, text: "Personalized learning paths" },
  { icon: Users, text: "Trusted by 50K+ professionals" },
  { icon: Zap, text: "Instant feedback and results" },
  { icon: CheckCircle, text: "Industry-recognized certificates" },
];

export function About() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get certified in three simple steps with our AI-powered platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              <Card className="relative bg-card">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                    <item.icon className="w-8 h-8 text-primary" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Why Professionals Choose Us
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {reasons.map((reason) => (
                <div
                  key={reason.text}
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <reason.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">
                    {reason.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Award className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Certificate of Achievement
                </p>
                <h4 className="text-xl font-bold text-foreground mb-1">
                  JavaScript Mastery
                </h4>
                <p className="text-muted-foreground mb-4">John Developer</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Verified on Blockchain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
