import { Link } from "react-router-dom";
import {
  ShieldCheck,
  UserCircle,
  Activity,
  Laptop,
  Cookie,
  CreditCard,
  Scale,
  Share2,
  Globe2,
  Clock,
  UserCheck,
  Lock,
  Plug,
  History,
  Mail,
} from "lucide-react";
import LegalPageLayout from "../components/LegalPageLayout";
import LegalHero from "../components/LegalHero";
import SectionCard from "../components/SectionCard";

const SECTIONS = [
  { id: "info-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use It" },
  { id: "legal-basis", label: "Legal Basis" },
  { id: "sharing", label: "Sharing" },
  { id: "cross-border", label: "Cross-Border Transfers" },
  { id: "retention", label: "Data Retention" },
  { id: "rights", label: "Your Rights" },
  { id: "security", label: "Security" },
  { id: "third-party", label: "Third-Party Integrations" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <div className="max-w-4xl mx-auto">
        <LegalHero icon={ShieldCheck}>
          This Privacy Policy explains what information QnaHub.in (operated by
          Ryde Consulting) collects, how we use it, and how we protect it.
        </LegalHero>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-2 mb-10">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-border bg-secondary text-secondary-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="space-y-8">
          <SectionCard
            id="info-collect"
            icon={UserCircle}
            title="1. Information We Collect"
          >
            <div className="space-y-6">
              <div className="border-l-2 border-primary/30 pl-4">
                <p className="font-semibold text-foreground mb-2">
                  a) Information you provide directly
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>Your name</li>
                  <li>Your email address</li>
                  <li>Your contact/phone number</li>
                  <li>
                    Any information you submit through support requests or
                    feedback forms
                  </li>
                </ul>
              </div>

              <div className="border-l-2 border-primary/30 pl-4">
                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> b) Account and
                  activity information
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>
                    Login credentials (stored securely; passwords are not stored
                    in plain text)
                  </li>
                  <li>
                    Exam and subscription activity (tests attempted, scores,
                    timestamps, plan history)
                  </li>
                  <li>
                    Authentication logs (login times, OTP verification events,
                    device used for login) collected to protect your account
                    from unauthorised access
                  </li>
                </ul>
              </div>

              <div className="border-l-2 border-primary/30 pl-4">
                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-primary" /> c) Device and
                  browser information
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  <li>IP address, approximate location derived from IP</li>
                  <li>
                    Device type, operating system, and browser type/version
                  </li>
                  <li>Referring page and general usage patterns on the site</li>
                </ul>
              </div>

              <div className="border-l-2 border-primary/30 pl-4">
                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-primary" /> d) Cookies and
                  tracking technologies
                </p>
                <p className="text-sm text-muted-foreground">
                  We use cookies and similar technologies for essential site
                  functionality, and may use analytics cookies to understand how
                  QnaHub is used so we can improve it. See our{" "}
                  <Link
                    to="/cookie-policy"
                    className="text-primary hover:underline"
                  >
                    Cookie Policy
                  </Link>{" "}
                  for full details and how to manage your preferences.
                </p>
              </div>

              <div className="border-l-2 border-primary/30 pl-4">
                <p className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" /> e) Payment
                  information
                </p>
                <div className="bg-primary/10 rounded-xl p-4 flex gap-3 items-start border border-primary/20">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground m-0">
                    Payment details (such as your card, UPI, or bank
                    information) are collected and processed directly and
                    securely by our payment partner. QnaHub does not store your
                    full card or payment credentials on its own servers; we
                    retain only limited payment metadata (such as transaction
                    ID, amount, status, and date) needed for order records and
                    support.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="how-we-use"
            icon={Activity}
            title="2. How We Use Your Information"
          >
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                To create, verify, and manage your account, including OTP-based
                authentication
              </li>
              <li>To process your subscription and payments (via Razorpay)</li>
              <li>
                To provide access to exams, track your scores and progress, and
                generate certificates where applicable
              </li>
              <li>
                To send exam-related updates, authentication messages (e.g.
                OTPs, login verification), and support communication
              </li>
              <li>
                To detect and prevent fraud, malpractice, and misuse of the
                platform
              </li>
              <li>
                To analyse aggregated, non-identifying usage patterns to improve
                the platform
              </li>
              <li>To comply with applicable legal obligations</li>
            </ul>
          </SectionCard>

          <SectionCard
            id="legal-basis"
            icon={Scale}
            title="3. Legal Basis for Processing"
          >
            <p className="text-sm text-muted-foreground">
              We process your personal data on the following bases:{" "}
              <strong className="text-foreground">(a)</strong> your consent,
              given when you create an account and agree to this Policy;{" "}
              <strong className="text-foreground">(b)</strong> the necessity of
              processing to perform our contract with you (i.e., to provide the
              exam and subscription services you sign up for); and{" "}
              <strong className="text-foreground">(c)</strong> our legitimate
              interests in securing the platform, preventing fraud and
              malpractice, and improving our services, balanced against your
              rights.
            </p>
          </SectionCard>

          <SectionCard
            id="sharing"
            icon={Share2}
            title="4. Sharing of Information"
          >
            <p className="text-sm text-muted-foreground mb-3">
              We do not sell your personal data. We share limited information
              only with:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside mb-3">
              <li>
                <strong className="text-foreground">Payment partner</strong> to
                process your payments securely
              </li>
              <li>
                <strong className="text-foreground">
                  Email/SMS service providers
                </strong>{" "}
                solely to send authentication messages (such as OTPs), account
                notifications, and support communication
              </li>
              <li>
                <strong className="text-foreground">
                  Law enforcement or regulators
                </strong>
                , only where required by applicable law or a valid legal process
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              We do not share your data with any third party for marketing or
              advertising purposes.
            </p>
          </SectionCard>

          <SectionCard
            id="cross-border"
            icon={Globe2}
            title="5. Cross-Border Data Transfers"
          >
            <p className="text-sm text-muted-foreground">
              Some of our service providers (such as email/SMS or analytics
              providers) may process data on servers located outside India.
              Where this occurs, we take reasonable steps to ensure such
              providers maintain appropriate safeguards for your information.
            </p>
          </SectionCard>

          <SectionCard id="retention" icon={Clock} title="6. Data Retention">
            <p className="text-sm text-muted-foreground mb-6">
              We retain personal data only for as long as necessary for the
              purposes described in this Policy, or as required by law:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Account data",
                  value: "Active + 90 days",
                  desc: "After closure, to handle disputes or legal requirements.",
                },
                {
                  label: "Exam activity & scores",
                  value: "3 years",
                  desc: "From the date of attempt, for certificate validity and disputes.",
                },
                {
                  label: "Payment metadata",
                  value: "8 years",
                  desc: "In line with standard Indian financial and tax record-keeping.",
                },
                {
                  label: "Support communications",
                  value: "12 months",
                  desc: "From the date of resolution, for follow-up queries.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                    {item.label}
                  </p>
                  <p className="text-xl font-bold text-primary mb-1">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground m-0">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            id="rights"
            icon={UserCheck}
            title="7. Your Rights and Choices"
          >
            <p className="text-sm text-muted-foreground mb-3">
              Subject to applicable law, you may:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Request access to the personal data we hold about you",
                "Request correction of inaccurate or incomplete data",
                "Request deletion of your personal data, subject to any records we are legally required to retain",
                "Withdraw consent for non-essential communications at any time",
                "Raise a grievance regarding how your data has been handled",
              ].map((right) => (
                <li key={right} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-muted-foreground">{right}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              To exercise any of these rights, contact us at{" "}
              <strong className="text-foreground">admin@rydecs.com</strong>. We
              will respond within 30 days of a verified request, or sooner where
              required by applicable law.
            </p>
          </SectionCard>

          <SectionCard id="security" icon={Lock} title="8. Data Security">
            <p className="text-sm text-muted-foreground">
              We use reasonable technical and organisational measures to protect
              your personal information from unauthorised access, alteration,
              disclosure, or destruction, including encrypted data transmission
              (HTTPS/TLS), access controls on internal systems, and secure
              handling of authentication credentials. No method of transmission
              or storage is completely secure, and we cannot guarantee absolute
              security.
            </p>
          </SectionCard>

          <SectionCard
            id="third-party"
            icon={Plug}
            title="9. Third-Party Integrations"
          >
            <p className="text-sm text-muted-foreground">
              QnaHub integrates with third-party services, including Razorpay
              (payments) and email/SMS providers (authentication and
              notifications). These providers process data under their own
              privacy policies in addition to this one. We encourage you to
              review Razorpay's privacy policy for details on how your payment
              data is handled.
            </p>
          </SectionCard>

          <SectionCard
            id="changes"
            icon={History}
            title="10. Changes to This Policy"
          >
            <p className="text-sm text-muted-foreground">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or applicable law. We will post the
              updated version on this page with a revised "Last updated" date,
              and, for material changes, provide additional notice (such as an
              email or on-platform notification) where appropriate.
            </p>
          </SectionCard>

          <SectionCard
            id="contact"
            icon={Mail}
            title="11. Contact Us"
            variant="highlight"
          >
            <p className="text-sm text-foreground/90">
              For any questions about this Privacy Policy or to exercise your
              rights, contact us at{" "}
              <strong className="text-foreground">admin@rydecs.com</strong>, or
              write to our Grievance Officer as described on our{" "}
              <Link to="/contact-us" className="text-primary hover:underline">
                Contact Us
              </Link>{" "}
              page.
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
