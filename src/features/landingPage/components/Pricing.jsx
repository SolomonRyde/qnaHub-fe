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
      "10 exam attempts included",
      "Access to a curated selection of exams",
      "Core coverage in Aptitude, Reasoning & Verbal Ability",
      "Questions modeled on real exam patterns",
      "500+ questions available per exam",
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
      "Up to 25 exam attempts per month",
      "Full access to all available exams",
      "Detailed, step-by-step answer explanations",
      "Basic to intermediate difficulty questions",
      "900+ questions available per exam",
      "Topic-wise practice sets for focused revision",
      "Ongoing performance tracking and insights",
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
      "Up to 100 exam attempts per month",
      "Full access to all available exams",
      "Coverage across IT, Government & Core categories",
      "Real exam level difficulty",
      "AI-driven adaptive questioning",
      "Advanced analytics for deeper performance insights",
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
