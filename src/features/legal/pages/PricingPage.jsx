import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../landingPage/components/Navbar";
import { Footer } from "../../landingPage/components/Footer";
import { Card, CardContent, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Check, FileText } from "lucide-react";

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
    cta: "Start Cracking Exams",
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
    cta: "Unlock Full Power",
    variant: "outline",
  },
];

export default function PricingPage() {
  useEffect(() => {
    document.title =
      "Plans & Pricing | QnaHub - AI-Powered Certification Exams Platform";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-20  bg-background relative overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2" />
        </div>

        {/* Header Section */}
        <div className="relative pt-12 md:pt-16 px-4 md:px-6 max-w-[1280px] mx-auto text-center z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Plans & Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your learning goals. Upgrade anytime as
            you move up in your preparation.
          </p>
        </div>

        {/* Content Section */}
        <div className="relative pb-20 pt-12 md:pt-16 px-4 md:px-6 max-w-6xl mx-auto z-10">
          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 w-full mx-auto mb-16">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular
                    ? "border-primary shadow-lg md:scale-105"
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
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
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
                  <Link to="/signup">
                    <Button variant={plan.variant} className="w-full">
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Link to full policy */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-sm mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-lg">
              Want the full billing details?
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Upgrades, renewal, refunds, and everything else about how billing
              works is covered in our Subscription &amp; Pricing Policy.
            </p>
            <Link
              to="/subscription-and-pricing-policy"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-6 py-2.5 text-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              View Subscription &amp; Pricing Policy
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
