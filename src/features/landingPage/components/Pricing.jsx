import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Practice Lite",
    price: "₹0",
    period: "forever",
    description: "Explore and get started",
    features: [
      "20+ Daily Practice Questions",
      "Basic Aptitude, Reasoning & Verbal",
      "Real Exam Pattern Questions",
      "Limited Explanations",
      "Ad-supported access",
    ],
    cta: "Start Free",
    variant: "outline",
  },
  {
    name: "Smart Prep",
    price: "₹199",
    period: "per month",
    description: "Most Popular for serious learners",
    features: [
      "300+ Questions Daily Practice",
      "Step-by-Step Explanations",
      "Intermediate Level Questions",
      "Topic-wise Practice Sets",
      "5 Full-Length Mock Tests",
      "Performance Tracking",
    ],
    cta: "Start Cracking Exams ",
    variant: "default",
    popular: true,
  },
  {
    name: "Ultimate Success",
    price: "₹499",
    period: "per month",
    description: "Complete exam mastery",
    features: [
      "Unlimited Questions",
      "All Categories (IT, Govt, Core)",
      "Real Exam-Level Mock Tests",
      "AI Adaptive Questions",
      "Advanced Analytics",
      "Weak Area Improvement System",
    ],
    cta: "Unlock Full Power ",
    variant: "outline",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your learning goals. Upgrade or downgrade
            anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? "border-primary shadow-lg scale-105"
                  : "hover:shadow-md"
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
