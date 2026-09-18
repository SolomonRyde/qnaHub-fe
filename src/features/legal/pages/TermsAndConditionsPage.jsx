import { Link } from "react-router-dom";
import {
  FileCheck2,
  UserCheck,
  KeyRound,
  Timer,
  Ban,
  ArrowRightCircle,
  Eye,
  Maximize,
  ShieldAlert,
  Wallet,
  Award,
  Copyright,
  UserX,
  ServerCog,
  AlertCircle,
  Scale,
  HandCoins,
  CloudLightning,
  Gavel,
  History,
} from "lucide-react";
import LegalPageLayout from "../components/LegalPageLayout";
import LegalHero from "../components/LegalHero";
import SectionCard from "../components/SectionCard";

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="01-Sep-2026">
      <div className="max-w-4xl mx-auto">
        <LegalHero icon={FileCheck2} heading="Welcome to QnaHub">
          <p className="mb-3">
            Please read these Terms and Conditions carefully before using the
            QnaHub platform. By accessing or using our service, you agree to be
            bound by these terms.
          </p>
          <p className="text-sm m-0">
            This document constitutes a legally binding agreement between you
            and QnaHub.in, operated by Ryde Consulting.
          </p>
        </LegalHero>

        <div className="space-y-8">
          <SectionCard icon={UserCheck} title="1. Eligibility">
            <p className="text-muted-foreground">
              You must be at least 18 years of age to create an account and use
              QnaHub. By creating an account, you confirm that you meet this
              requirement.
            </p>
          </SectionCard>

          <SectionCard icon={KeyRound} title="2. Account & Access">
            <p className="text-muted-foreground mb-4">
              To access certain features of the platform, you must register for
              an account. You agree to provide accurate, current, and complete
              information during the registration process and to update such
              information to keep it accurate, current, and complete.
            </p>
            <ul className="space-y-2">
              {[
                "You are responsible for safeguarding your password.",
                "You agree not to disclose your password to any third party.",
                "Access to exams is provided on a subscription basis for the duration and plan you purchase.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Key Exam Rules Callout */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Key Exam Rules
              </h3>
            </div>
            <p className="text-sm text-foreground/80 mb-6">
              Failure to comply with these rules may result in immediate exam
              termination and account suspension.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: Timer,
                  text: "Timed exam sessions with duration tailored to each assessment.",
                },
                { icon: Ban, text: "No backward navigation allowed." },
                {
                  icon: ArrowRightCircle,
                  text: "Auto-submission upon time expiry.",
                },
                { icon: Eye, text: "Active anti-cheating monitoring enabled." },
              ].map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-primary/20 bg-background p-4"
                >
                  <r.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{r.text}</span>
                </div>
              ))}
            </div>
          </div>

          <SectionCard
            icon={Maximize}
            title="3. Exam Rules and Academic Integrity"
          >
            <p className="text-muted-foreground mb-4">
              Every exam on QnaHub is governed by the instructions shown before
              the test begins. By starting an exam, you agree to follow these
              rules:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside mb-4">
              <li>
                <strong className="text-foreground">Time limit:</strong> Exam
                duration and question count vary by exam; unless otherwise
                stated, you have 30 minutes for 30 questions (approx. 60 seconds
                per question).
              </li>
              <li>
                <strong className="text-foreground">Auto-submit:</strong> When
                the timer reaches zero, your exam is submitted automatically,
                including unanswered questions.
              </li>
              <li>
                <strong className="text-foreground">
                  Stable connection required:
                </strong>{" "}
                You are responsible for maintaining a reliable internet
                connection during an attempt; a disconnection may terminate or
                affect your attempt. If a verified technical failure on our end
                affects your attempt, see our{" "}
                <Link
                  to="/refund-and-cancellation-policy"
                  className="text-primary hover:underline"
                >
                  Refund & Cancellation Policy
                </Link>
                .
              </li>
              <li>
                <strong className="text-foreground">
                  Anti-cheating monitoring:
                </strong>{" "}
                Tab switching, use of external resources, and other prohibited
                conduct during an exam are monitored. See our{" "}
                <Link
                  to="/academic-integrity-policy"
                  className="text-primary hover:underline"
                >
                  Academic Integrity Policy
                </Link>{" "}
                for full detail.
              </li>
              <li>
                <strong className="text-foreground">Fullscreen mode</strong> is
                mandatory during exams to avoid accidental exits and to preserve
                exam integrity.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Any attempt found to violate these rules will be treated as an
              instance of malpractice. Depending on severity, this may result in
              automatic submission of the exam, invalidation of the result at
              our discretion, and/or suspension of your account, without
              entitlement to a refund for that attempt. Where a result is
              invalidated, you may request a review through the appeal process
              described in our{" "}
              <Link
                to="/academic-integrity-policy"
                className="text-primary hover:underline"
              >
                Academic Integrity Policy
              </Link>
              .
            </p>
          </SectionCard>

          <SectionCard icon={Wallet} title="4. Subscriptions and Payments">
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                Subscription plans, pricing, renewal behaviour, and cancellation
                are described in our{" "}
                <Link
                  to="/subscription-and-pricing-policy"
                  className="text-primary hover:underline"
                >
                  Subscription & Pricing Policy
                </Link>
                , which forms part of these Terms.
              </li>
              <li>
                All payments are processed securely through Razorpay. QnaHub
                does not store your full payment card or bank details.
              </li>
              <li>
                Prices are listed in Indian Rupees (INR) and are inclusive of
                applicable GST unless stated otherwise at checkout.
              </li>
            </ul>
          </SectionCard>

          <SectionCard icon={Award} title="5. Certificates">
            <p className="text-muted-foreground">
              Where QnaHub issues a certificate upon successful completion of an
              exam, such certificates are provided solely for self-declaration
              and skill-demonstration purposes, are non-transferable, and may be
              revoked if the underlying result is invalidated for malpractice.
              Certificates are not issued, endorsed, or recognised by any
              third-party certification body unless explicitly stated.
            </p>
          </SectionCard>

          <SectionCard
            icon={Copyright}
            title="6. Content and Intellectual Property"
          >
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                All test content, questions, explanations, and related material
                on QnaHub are owned by Ryde Consulting (or licensed to it) and
                are provided solely for your personal, non-commercial practice.
              </li>
              <li>
                Copying, reproducing, redistributing, publishing, or reselling
                any exam content, in whole or in part, is strictly prohibited.
              </li>
              <li>
                The QnaHub name, logo, and platform software are the property of
                Ryde Consulting and may not be used without prior written
                permission.
              </li>
            </ul>
          </SectionCard>

          <SectionCard
            icon={UserX}
            title="7. Account Suspension and Termination"
          >
            <p className="text-muted-foreground">
              We may suspend or terminate your account, with or without notice,
              if we reasonably believe you have violated these Terms, engaged in
              malpractice, misused the Services, or if required by law. You may
              close your account at any time by contacting us at
              admin@rydecs.com.
            </p>
          </SectionCard>

          <SectionCard icon={ServerCog} title="8. Platform Availability">
            <p className="text-muted-foreground">
              We aim to keep QnaHub available and reliable, but we do not
              guarantee uninterrupted or error-free access. We may modify,
              suspend, or discontinue any part of the Services, including
              specific exams or features, at any time.
            </p>
          </SectionCard>

          <SectionCard icon={AlertCircle} title="9. Disclaimer">
            <p className="text-muted-foreground">
              QnaHub's assessments provide an overview of foundational,
              commonly-used skills and are intended for self-practice and
              skill-building purposes only. They are independent practice tests
              and are not equivalent to, affiliated with, or a substitute for
              official certification exams offered by Microsoft or any other
              organisation.
            </p>
          </SectionCard>

          <SectionCard icon={Scale} title="10. Limitation of Liability">
            <p className="text-muted-foreground">
              To the maximum extent permitted by applicable law, QnaHub and Ryde
              Consulting shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of, or
              inability to use, the Services. Our total liability shall not
              exceed the amount you paid to QnaHub in the three (3) months
              preceding the claim.
            </p>
          </SectionCard>

          <SectionCard icon={HandCoins} title="11. Indemnification">
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless QnaHub, Ryde Consulting,
              and their respective officers and representatives from any claims,
              damages, or expenses arising from your violation of these Terms or
              your misuse of the Services.
            </p>
          </SectionCard>

          <SectionCard icon={CloudLightning} title="12. Force Majeure">
            <p className="text-muted-foreground">
              We will not be liable for any failure or delay in performance
              caused by circumstances beyond our reasonable control, including
              internet or telecommunications failures, power outages, acts of
              government, natural disasters, or failures of our third-party
              service providers.
            </p>
          </SectionCard>

          <SectionCard
            icon={Gavel}
            title="13. Governing Law and Dispute Resolution"
          >
            <p className="text-muted-foreground">
              These Terms are governed by the laws of India. Any dispute shall
              first be addressed through good-faith negotiation by contacting
              admin@rydecs.com. If unresolved within 30 days, the dispute shall
              be subject to the exclusive jurisdiction of the courts at{" "}
              <strong className="text-foreground">Chennai, Tamil Nadu</strong>.
            </p>
          </SectionCard>

          <SectionCard
            icon={History}
            title="14. Changes to These Terms"
            variant="highlight"
          >
            <p className="text-foreground/90">
              We may update these Terms from time to time. Material changes will
              be notified via the platform or by email where practicable.
              Continued use of QnaHub after changes are posted constitutes
              acceptance of the revised Terms.
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
