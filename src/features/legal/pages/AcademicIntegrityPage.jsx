import {
  ShieldCheck,
  AlertTriangle,
  Eye,
  Gavel,
  Bell,
  FileQuestion,
  ListChecks,
  History,
  Mail,
  Ban,
  ShieldOff,
  MonitorX,
  Clock3,
  Fingerprint,
  Flag,
} from "lucide-react";
import LegalPageLayout from "../components/LegalPageLayout";
import LegalHero from "../components/LegalHero";
import SectionCard from "../components/SectionCard";

export default function AcademicIntegrityPage() {
  return (
    <LegalPageLayout title="Academic Integrity & Anti-Cheating Policy">
      <div className="max-w-4xl mx-auto">
        <LegalHero icon={ShieldCheck}>
          QnaHub is committed to maintaining a fair and honest testing
          environment. This policy outlines what constitutes exam malpractice,
          how we monitor for it, and the consequences of violations.
        </LegalHero>

        <div className="space-y-8">
          <SectionCard
            icon={AlertTriangle}
            title="1. What Is Exam Malpractice?"
          >
            <p className="text-muted-foreground mb-4">
              Exam malpractice includes any conduct that gives you an unfair
              advantage or undermines the integrity of the testing process.
              Examples include, but are not limited to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>
                <strong className="text-foreground">
                  Tab switching or leaving fullscreen mode
                </strong>{" "}
                during an exam to access external resources, notes, or search
                engines.
              </li>
              <li>
                <strong className="text-foreground">
                  Using unauthorized aids
                </strong>{" "}
                such as books, notes, websites, AI tools, or software not
                explicitly permitted in the exam instructions.
              </li>
              <li>
                <strong className="text-foreground">
                  Copying or sharing exam content
                </strong>{" "}
                (questions, answers, or explanations) with others, or receiving
                such content from another person during or after an attempt.
              </li>
              <li>
                <strong className="text-foreground">Impersonation:</strong>{" "}
                Having another person take the exam on your behalf, or taking an
                exam for someone else.
              </li>
              <li>
                <strong className="text-foreground">
                  Attempting to manipulate the platform
                </strong>{" "}
                through technical means, including but not limited to browser
                extensions, scripts, or tampering with the exam timer or
                submission mechanism.
              </li>
              <li>
                <strong className="text-foreground">Collusion:</strong> Working
                with another test-taker in real-time to answer questions, or
                coordinating answers via messaging apps or other communication
                channels.
              </li>
            </ul>
          </SectionCard>

          <SectionCard icon={Eye} title="2. Monitoring and Detection">
            <p className="text-muted-foreground mb-4">
              To protect the value of every score earned on QnaHub, we use
              automated and manual monitoring methods, including:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  icon: MonitorX,
                  title: "Tab-switch detection:",
                  body: "The platform monitors when you navigate away from the exam window or exit fullscreen mode.",
                },
                {
                  icon: Clock3,
                  title: "Time-per-question analysis:",
                  body: "Unusually fast or suspiciously consistent response times may be flagged for review.",
                },
                {
                  icon: Fingerprint,
                  title: "Pattern recognition:",
                  body: "We review answer patterns across multiple attempts for signs of collusion or content sharing.",
                },
                {
                  icon: Flag,
                  title: "User reports:",
                  body: "Other users or proctors may report suspected malpractice, which will trigger an investigation.",
                },
              ].map((m) => (
                <div
                  key={m.title}
                  className="flex items-start gap-3 rounded-xl border border-border bg-background p-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <m.icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground m-0">
                    <strong className="text-foreground">{m.title}</strong>{" "}
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground/90 m-0">
                <strong>Important:</strong> Not all flagged behavior
                automatically results in a penalty. We review each case
                individually to distinguish between technical issues, accidental
                violations, and intentional malpractice.
              </p>
            </div>
          </SectionCard>

          <SectionCard icon={Gavel} title="3. Consequences of Malpractice">
            <p className="text-muted-foreground mb-4">
              If we determine that you have engaged in exam malpractice, one or
              more of the following actions may be taken, depending on the
              severity and frequency of the violation:
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: Bell,
                  tone: "amber",
                  title: "1. Warning",
                  body: "For minor or first-time infractions (e.g., a brief, accidental tab switch), you may receive a formal written warning with no immediate penalty to your score.",
                },
                {
                  icon: FileQuestion,
                  tone: "amber",
                  title: "2. Invalidation of Exam Result",
                  body: "Your exam result may be invalidated (marked as void), and any certificate issued for that attempt may be revoked. You will not be entitled to a refund for the invalidated attempt.",
                },
                {
                  icon: ShieldOff,
                  tone: "red",
                  title: "3. Temporary Suspension",
                  body: "For repeat violations or more serious cases, your account may be suspended for a defined period (e.g., 30, 60, or 90 days), during which you will not be able to access exams or purchase new subscriptions.",
                },
                {
                  icon: Ban,
                  tone: "red",
                  title: "4. Permanent Account Termination",
                  body: "In cases of severe, repeated, or organized malpractice (such as impersonation, collusion rings, or platform manipulation), your account will be permanently terminated. You will be banned from creating new accounts on QnaHub, and no refunds will be issued.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className={
                    c.tone === "amber"
                      ? "flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl"
                      : "flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl"
                  }
                >
                  <div
                    className={
                      c.tone === "amber"
                        ? "w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0"
                        : "w-9 h-9 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0"
                    }
                  >
                    <c.icon
                      className={
                        c.tone === "amber"
                          ? "w-4 h-4 text-amber-600 dark:text-amber-400"
                          : "w-4 h-4 text-red-600 dark:text-red-400"
                      }
                    />
                  </div>
                  <div>
                    <strong
                      className={
                        c.tone === "amber"
                          ? "text-amber-900 dark:text-amber-100"
                          : "text-red-900 dark:text-red-100"
                      }
                    >
                      {c.title}
                    </strong>
                    <p
                      className={
                        c.tone === "amber"
                          ? "text-sm text-amber-800 dark:text-amber-200 mt-1 m-0"
                          : "text-sm text-red-800 dark:text-red-200 mt-1 m-0"
                      }
                    >
                      {c.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Bell} title="4. Notification Process">
            <p className="text-muted-foreground mb-3">
              If your exam result is flagged for review, we will notify you via
              the email address associated with your account. The notification
              will include:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside mb-3">
              <li>A description of the suspected violation</li>
              <li>The specific exam attempt in question</li>
              <li>The evidence or monitoring data that triggered the flag</li>
              <li>
                The proposed action (warning, invalidation, suspension, or
                termination)
              </li>
              <li>Information on how to appeal the decision (see below)</li>
            </ul>
            <p className="text-muted-foreground">
              In urgent cases (such as ongoing manipulation attempts), we may
              take immediate action before notifying you, to protect the
              platform and other users.
            </p>
          </SectionCard>

          <SectionCard icon={ListChecks} title="5. Appeals Process">
            <p className="text-muted-foreground mb-4">
              If you believe that an exam result was invalidated, or your
              account was suspended or terminated in error, you may submit an
              appeal within <strong className="text-foreground">14 days</strong>{" "}
              of receiving the notification.
            </p>
            <div className="bg-background border border-border rounded-xl p-5 mb-4">
              <h4 className="font-semibold text-foreground mb-3">
                How to Appeal:
              </h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>
                    Email{" "}
                    <strong className="text-foreground">
                      admin@rydecs.com
                    </strong>{" "}
                    with the subject line:{" "}
                    <em className="block mt-1 text-foreground">
                      "Appeal Malpractice Decision [Your Account Email]"
                    </em>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>
                    Include your registered email address, the exam attempt ID
                    (if applicable), and a clear explanation of why you believe
                    the decision was incorrect.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>
                    Provide any supporting evidence (e.g., screenshots showing a
                    technical issue, proof of a device malfunction).
                  </span>
                </li>
              </ol>
            </div>
            <p className="text-muted-foreground">
              We will review your appeal and respond within{" "}
              <strong className="text-foreground">7–10 business days</strong>.
              If your appeal is successful, the penalty will be reversed, and
              your exam result or account access will be restored. If the appeal
              is denied, the original decision stands, and it is final.
            </p>
          </SectionCard>

          <SectionCard
            icon={ShieldCheck}
            title="6. Preventing Accidental Violations"
          >
            <p className="text-muted-foreground mb-4">
              To avoid unintentional malpractice flags, we recommend the
              following best practices when taking an exam:
            </p>
            <ul className="space-y-2">
              {[
                "Use a stable internet connection and avoid areas with frequent connectivity issues.",
                "Close all unnecessary browser tabs and applications before starting the exam.",
                "Do not exit fullscreen mode or switch tabs during the exam, even briefly.",
                "Disable browser extensions that might interfere with the exam interface (such as ad blockers, auto-fill tools, or screen capture extensions).",
                "Read the exam instructions carefully before starting, and ensure you understand the allowed and prohibited conduct.",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard icon={History} title="7. Changes to This Policy">
            <p className="text-muted-foreground">
              We may update this Academic Integrity & Anti-Cheating Policy from
              time to time to reflect changes in our monitoring methods, legal
              requirements, or platform features. Any updates will be posted on
              this page with a revised "Last updated" date. Continued use of
              QnaHub after changes are posted constitutes your acceptance of the
              revised policy.
            </p>
          </SectionCard>

          <SectionCard icon={Mail} title="8. Contact Us" variant="highlight">
            <p className="text-foreground/90">
              If you have questions about this policy, or if you wish to report
              suspected malpractice by another user, please contact us at{" "}
              <strong className="text-foreground">admin@rydecs.com</strong>.
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
