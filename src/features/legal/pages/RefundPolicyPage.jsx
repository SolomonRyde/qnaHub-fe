import { Link } from "react-router-dom";
import {
  Receipt,
  Copy,
  AlertOctagon,
  ListOrdered,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  ShieldAlert,
  History,
  Mail,
  Ban,
} from "lucide-react";
import LegalPageLayout from "../components/LegalPageLayout";
import LegalHero from "../components/LegalHero";
import SectionCard from "../components/SectionCard";

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Refund & Cancellation Policy">
      <div className="max-w-4xl mx-auto">
        <LegalHero icon={Receipt}>
          We want you to have a fair experience on QnaHub.in. This policy
          explains exactly when a refund applies and how it is processed.
        </LegalHero>

        <div className="space-y-8">
          <div className="bg-card rounded-2xl border-2 border-primary/20 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl text-green-700 font-bold text-foreground mb-6 text-center">
              Refund Conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Copy,
                  title: "Duplicate Payment",
                  body: "If you were charged more than once for the same transaction.",
                },
                {
                  icon: AlertOctagon,
                  title: "Technical Issue",
                  body: "If a platform error prevented you from accessing purchased content.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="bg-background rounded-xl border border-border p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-200"
                >
                  <div className="bg-primary/10 text-primary rounded-lg p-3 shrink-0 flex items-center justify-center">
                    <c.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg text-green-700 font-bold text-foreground mb-1">
                      {c.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SectionCard icon={ListOrdered} title="How to Request a Refund">
            <div className="space-y-4">
              {[
                <>
                  Email{" "}
                  <a
                    className="text-primary hover:underline font-medium"
                    href="mailto:admin@rydecs.com"
                  >
                    admin@rydecs.com
                  </a>{" "}
                  within 10 days with your order ID.
                </>,
                "Verification by the QnaHub team to ensure conditions are met.",
                "Receive the final decision and timeline via email.",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 md:p-5 bg-background rounded-xl border border-border"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm md:text-base text-foreground m-0">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />{" "}
                <span className="text-green-700">Refundable</span>
              </h3>
              <ul className="space-y-3">
                {["Duplicate Payment", "Technical Issue"].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="text-green-700">Non-Refundable</span>
              </h3>
              <ul className="space-y-3">
                {["Change of Mind", "Started Exams", "Rule Breach"].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />{" "}
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-4">
              Refund Timelines
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
              <li>Requests must be submitted within 10 days of purchase.</li>
              <li>Approved refunds are processed within 10 business days.</li>
            </ul>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
            <p className="text-muted-foreground mb-8">
              This Refund and Cancellation Policy explains the terms under which
              you may request a refund or cancel a purchase on QnaHub.in,
              operated by Ryde Consulting. By purchasing any paid subscription
              or exam access on our platform, you agree to the terms set out
              below.
            </p>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground text-green-700">
                    1. Eligibility for Refunds
                  </h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  A refund may be issued{" "}
                  <strong className="text-foreground">only</strong> under the
                  following conditions:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>
                    <strong className="text-foreground">
                      Duplicate or Multiple Charges:
                    </strong>{" "}
                    If you were charged more than once for the same transaction
                    due to a technical or payment gateway error, and you can
                    provide proof (e.g., multiple debit entries, transaction
                    IDs).
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Payment Failure but Debit Confirmation:
                    </strong>{" "}
                    If your bank account or payment method was debited, but the
                    transaction failed on our platform and you did not receive
                    access to the exam or subscription you paid for.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Platform Technical Issue:
                    </strong>{" "}
                    If a verified technical issue on QnaHub's side prevented you
                    from accessing or completing an exam that you had purchased
                    and paid for, and you reported the issue within 48 hours of
                    the exam attempt.
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground text-green-700">
                    2. Non-Refundable Scenarios
                  </h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  Refunds will <strong className="text-foreground">not</strong>{" "}
                  be provided in the following cases:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>
                    <strong className="text-foreground">Change of Mind:</strong>{" "}
                    Once you have purchased exam access or a subscription, you
                    cannot request a refund simply because you no longer wish to
                    use it.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Exam Already Started or Completed:
                    </strong>{" "}
                    If you have already started or completed the exam(s) covered
                    by your purchase, the purchase is considered fully utilized
                    and cannot be refunded.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Violation of Platform Terms:
                    </strong>{" "}
                    If your account has been suspended or terminated due to a
                    breach of our Terms & Conditions or Academic Integrity
                    Policy, no refund will be issued.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      User-Side Technical Issues:
                    </strong>{" "}
                    Refunds will not be issued for issues caused by your device,
                    internet connection, browser compatibility, or any other
                    factor outside of QnaHub's control.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Expiry of Subscription or Exam Access Period:
                    </strong>{" "}
                    If the validity period of your subscription or exam access
                    has expired (even if you did not use it), no refund will be
                    provided unless the expiry was caused by a technical issue
                    on our platform.
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <ListOrdered className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground text-green-700">
                    3. How to Request a Refund
                  </h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  If you believe you are eligible for a refund based on the
                  conditions above, follow these steps:
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>
                    <strong className="text-foreground">
                      Email us at admin@rydecs.com
                    </strong>{" "}
                    with the subject line:{" "}
                    <em className="text-foreground">
                      "Refund Request — [Your Order/Transaction ID]"
                    </em>
                    .
                  </li>
                  <li>
                    In your email, include your registered email address and
                    name, order/transaction ID, date and time of the
                    transaction, a brief description of the issue, and any
                    supporting documents.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Submit your request within 10 days
                    </strong>{" "}
                    of the original transaction date. Requests received after
                    this window may not be considered.
                  </li>
                </ol>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground text-green-700">
                    4. Refund Review and Processing
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>
                    Once we receive your refund request, we will review it and
                    verify the details within{" "}
                    <strong className="text-foreground">5 business days</strong>
                    .
                  </li>
                  <li>
                    If your request is approved, the refund will be processed
                    within{" "}
                    <strong className="text-foreground">
                      10 business days
                    </strong>{" "}
                    from the date of approval.
                  </li>
                  <li>
                    Refunds will be credited to the{" "}
                    <strong className="text-foreground">
                      original payment method
                    </strong>{" "}
                    used for the transaction.
                  </li>
                  <li>
                    You will receive an email confirmation once the refund has
                    been initiated.
                  </li>
                  <li>
                    If your refund request is{" "}
                    <strong className="text-foreground">rejected</strong>, we
                    will notify you by email with the reason for rejection.
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Ban className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground text-green-700">
                    5. Cancellations
                  </h3>
                </div>
                <p className="text-muted-foreground mb-2">
                  <strong className="text-foreground">
                    a) User-Initiated Cancellation before Exam Access:
                  </strong>{" "}
                  If you have purchased exam access but have not yet accessed or
                  started any exam, you may cancel your purchase and request a
                  refund by following the refund request process above. This
                  must be done within{" "}
                  <strong className="text-foreground">
                    10 days of purchase
                  </strong>{" "}
                  and before accessing the purchased content.
                </p>
                <p className="text-muted-foreground mb-2">
                  <strong className="text-foreground">
                    b) Cancellation of Subscription Plans:
                  </strong>{" "}
                  If you have an active subscription plan, you may choose not to
                  renew it at the end of the current billing cycle. However, we
                  do not offer partial refunds or pro-rated refunds for unused
                  portions of a subscription period.
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">
                    c) QnaHub-Initiated Cancellation:
                  </strong>{" "}
                  We reserve the right to cancel or revoke access to any exam or
                  subscription without notice if we detect fraudulent activity,
                  payment disputes, chargebacks, or violations of our Terms &
                  Conditions or Academic Integrity Policy.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground text-green-700">
                    6. Payment Gateway and Third-Party Charges
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>
                    QnaHub uses{" "}
                    <strong className="text-foreground">Razorpay</strong> as our
                    payment gateway partner. Any transaction fees, payment
                    gateway charges, or currency conversion fees are{" "}
                    <strong className="text-foreground">non-refundable</strong>.
                  </li>
                  <li>
                    In the event of a refund, only the{" "}
                    <strong className="text-foreground">
                      base exam/subscription fee
                    </strong>{" "}
                    will be refunded.
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground text-green-700">
                    7. Chargebacks and Disputes
                  </h3>
                </div>
                <p className="text-muted-foreground mb-2">
                  If you initiate a chargeback or payment dispute with your bank
                  or payment provider without first contacting QnaHub for a
                  refund resolution, we reserve the right to suspend or
                  terminate your account, reject future refund requests, and
                  take legal action to recover the disputed amount if the
                  chargeback is found to be fraudulent or unjustified.
                </p>
                <p className="text-muted-foreground">
                  We strongly encourage you to contact us first before
                  initiating a chargeback.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <History className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground text-green-700">
                    9. Changes to This Policy
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  We may update this Refund and Cancellation Policy from time to
                  time to reflect changes in our practices or legal
                  requirements. Any updates will be posted on this page with a
                  revised "Last updated" date.
                </p>
              </div>
            </div>
          </div>

          <SectionCard icon={Mail} title="8. Contact Us" variant="highlight">
            <p className="text-foreground/90 mb-2">
              For any questions or concerns about this Refund and Cancellation
              Policy, or to request a refund, please contact us at:
            </p>
            <p className="text-foreground/90">
              <strong className="text-foreground">Email:</strong>{" "}
              admin@rydecs.com
              <br />
              <strong className="text-foreground">Subject Line:</strong> "Refund
              Request — [Your Order ID]"
            </p>
            <p className="text-foreground/90">
              We aim to respond to all refund-related queries within{" "}
              <strong className="text-foreground">3 business days</strong>.
            </p>
          </SectionCard>

          <p className="text-sm text-muted-foreground text-center pt-2">
            <strong>Last updated:</strong> 01-Sep-2026
          </p>
        </div>
      </div>
    </LegalPageLayout>
  );
}
