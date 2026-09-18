import { Link } from "react-router-dom";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCcw,
  AlertTriangle,
  ReceiptText,
  Mail,
  LayoutGrid,
  CreditCard,
  History,
} from "lucide-react";
import LegalPageLayout from "../components/LegalPageLayout";
import LegalHero from "../components/LegalHero";
import SectionCard from "../components/SectionCard";

const PLANS = [
  { name: "Practice Lite", price: "₹0", period: "forever" },
  { name: "Smart Prep", price: "₹199", period: "per month" },
  { name: "Ultimate Success", price: "₹499", period: "per month" },
];

export default function SubscriptionPricingPolicyPage() {
  return (
    <LegalPageLayout
      title="Subscription & Pricing Policy"
      lastUpdated="01-Sep-2026"
    >
      <div className="max-w-4xl mx-auto">
        <LegalHero icon={Wallet}>
          This policy explains how QnaHub's subscription plans work pricing,
          billing, upgrades, and what happens at the end of your plan. It should
          be read together with our{" "}
          <Link
            to="/terms-and-conditions"
            className="text-primary hover:underline"
          >
            Terms &amp; Conditions
          </Link>{" "}
          and our{" "}
          <Link
            to="/refund-and-cancellation-policy"
            className="text-primary hover:underline"
          >
            Refund &amp; Cancellation Policy
          </Link>
          .
        </LegalHero>

        <div className="space-y-8">
          <SectionCard icon={LayoutGrid} title="1. Our Plans">
            <p className="text-muted-foreground mb-6">
              QnaHub currently offers three plans. Full feature details for each
              plan are listed on our{" "}
              <a href="/#pricing" className="text-primary hover:underline">
                pricing section
              </a>{" "}
              on the homepage.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {PLANS.map((p) => (
                <div
                  key={p.name}
                  className="rounded-xl border border-border bg-background p-5 text-center hover:border-primary/50 hover:-translate-y-1 transition-all duration-200"
                >
                  <h4 className="font-semibold text-foreground mb-1">
                    {p.name}
                  </h4>
                  <p className="text-2xl font-bold text-primary mb-0">
                    {p.price}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.period}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={CreditCard} title="2. How Billing Works">
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                Access to paid plans is provided on a subscription basis for the
                duration of the plan you purchase.
              </li>
              <li>
                All payments are processed securely through our payment partner.
                QnaHub does not store your full payment card or bank details.
              </li>
              <li>
                Prices are listed in Indian Rupees (INR) and are inclusive of
                applicable GST unless stated otherwise at checkout.
              </li>
            </ul>
          </SectionCard>

          <SectionCard
            icon={ArrowUpCircle}
            title="3. Upgrading Your Plan"
            variant="highlight"
          >
            <p className="text-sm text-foreground/90 leading-relaxed">
              You can upgrade to a higher plan at any time, and you get
              immediate access to the higher plan's features as soon as your
              upgrade payment is confirmed. To make sure you don't lose the
              value of the days remaining on your current plan, we add a short
              grace period on top of your new plan's full validity so your new
              plan's expiry date accounts for the unused time on your previous
              plan. You're always charged the full price of the plan you're
              upgrading to.
            </p>
          </SectionCard>

          <SectionCard icon={ArrowDownCircle} title="4. Downgrades">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Downgrading to a lower-priced plan mid-cycle is not supported.
              Your current plan remains active for its full purchased duration.
              If you'd like a lower-priced plan going forward, simply let your
              current plan expire and subscribe to the plan you want once it
              ends see Section 5.
            </p>
          </SectionCard>

          <SectionCard icon={RefreshCcw} title="5. Renewal & Expiry">
            <p className="text-muted-foreground">
              QnaHub subscription plans do{" "}
              <strong className="text-foreground">not auto-renew</strong>. Your
              access simply ends at the end of your plan's validity period, and
              no further charge is made unless you choose to purchase a new
              plan. There is no cancellation action required if you do nothing,
              you simply won't be charged again.
            </p>
          </SectionCard>

          <SectionCard
            icon={AlertTriangle}
            title="6. Failed or Incomplete Payments"
            variant="warning"
          >
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              If a payment fails or is not completed, your plan upgrade or
              subscription does not take effect and you are not charged. You can
              simply retry checkout. If an amount was debited from your account
              without your plan being activated, see our{" "}
              <Link
                to="/refund-and-cancellation-policy"
                className="text-primary hover:underline"
              >
                Refund &amp; Cancellation Policy
              </Link>
              .
            </p>
          </SectionCard>

          <SectionCard icon={ReceiptText} title="7. Refunds">
            <p className="text-muted-foreground">
              Refunds are handled separately under our{" "}
              <Link
                to="/refund-and-cancellation-policy"
                className="text-primary hover:underline"
              >
                Refund &amp; Cancellation Policy
              </Link>
              , which sets out exactly when a refund applies and how to request
              one.
            </p>
          </SectionCard>

          <SectionCard icon={History} title="8. Changes to Plans and Pricing">
            <p className="text-muted-foreground">
              We may change plan pricing, features, or availability from time to
              time. Changes apply to new purchases and future billing cycles
              only if you already have an active subscription, it continues
              under the terms you purchased it under until it expires.
            </p>
          </SectionCard>

          <SectionCard
            icon={Mail}
            title="9. Questions about billing?"
            variant="highlight"
          >
            <p className="text-sm text-foreground/90 leading-relaxed">
              Email{" "}
              <strong className="text-foreground">Admin@rydecs.com</strong> with
              your account email and, if applicable, your order/transaction ID.
              See our{" "}
              <Link to="/contact-us" className="text-primary hover:underline">
                Contact Us
              </Link>{" "}
              page for full support details.
            </p>
          </SectionCard>

          <p className="text-sm text-muted-foreground text-center pt-2">
            Last updated: 01-Sep-2026
          </p>
        </div>
      </div>
    </LegalPageLayout>
  );
}
