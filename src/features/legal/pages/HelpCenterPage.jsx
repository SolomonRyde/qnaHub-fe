import { Link } from "react-router-dom";
import {
  UserPlus,
  BookOpen,
  Award,
  Wallet,
  LifeBuoy,
  HelpCircle,
  Mail,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/Accordion";
import LegalPageLayout from "../components/LegalPageLayout";
import LegalHero from "../components/LegalHero";

const SECTIONS = [
  {
    icon: UserPlus,
    title: "Getting Started",
    items: [
      {
        q: "How do I create an account?",
        a: "Click Sign Up, enter your name, email, and password, and verify your account via the OTP sent to your email. Once verified, you can log in and browse exams right away.",
      },
      {
        q: "How do I subscribe to a plan?",
        a: (
          <>
            Go to the{" "}
            <a href="/pricing" className="text-primary hover:underline">
              Pricing section
            </a>{" "}
            on the homepage, choose a plan, and complete checkout via Razorpay.
            Your plan activates as soon as payment is confirmed. Full billing
            details are in our{" "}
            <Link
              to="/subscription-and-pricing-policy"
              className="text-primary hover:underline"
            >
              Subscription &amp; Pricing Policy
            </Link>
            .
          </>
        ),
      },
      {
        q: "Can I use QnaHub without subscribing?",
        a: "Yes, the Practice Lite plan is free forever and gives you access to daily practice questions and real exam-pattern questions with limited explanations.",
      },
    ],
  },
  {
    icon: BookOpen,
    title: "Taking an Exam",
    items: [
      {
        q: "How do I start an exam?",
        a: "Browse exams from the Exams page, open the one you want, review the overview and instructions, then click Start Exam.",
      },
      {
        q: "What are the exam rules?",
        a: (
          <>
            Each exam has a timer (typically 30 minutes for 30 questions), no
            backward navigation once you move past a question, and auto-submits
            when time runs out. Fullscreen mode is mandatory, and tab-switching
            or external resources are monitored. Full detail is in our{" "}
            <Link
              to="/terms-and-conditions"
              className="text-primary hover:underline"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/academic-integrity-policy"
              className="text-primary hover:underline"
            >
              Academic Integrity Policy
            </Link>
            .
          </>
        ),
      },
      {
        q: "What happens if I lose my internet connection during an exam?",
        a: (
          <>
            You're responsible for maintaining a stable connection, and a
            disconnection may affect your attempt. If a verified technical issue
            on our end affected your attempt, contact us see our{" "}
            <Link to="/contact-us" className="text-primary hover:underline">
              Contact Us
            </Link>{" "}
            page under Examination Support.
          </>
        ),
      },
      {
        q: "What counts as cheating?",
        a: (
          <>
            Switching tabs, using external help, letting someone else take the
            exam for you, or trying to manipulate the timer or scoring are all
            treated as malpractice and may invalidate your result. See our{" "}
            <Link
              to="/academic-integrity-policy"
              className="text-primary hover:underline"
            >
              Academic Integrity Policy
            </Link>{" "}
            for the full list and how to appeal a flagged result.
          </>
        ),
      },
    ],
  },
  {
    icon: Award,
    title: "Results & Certificates",
    items: [
      {
        q: "How do I check my results?",
        a: "Your score appears immediately after you submit an exam, and all past attempts are visible on your Dashboard along with your pass rate and history.",
      },
      {
        q: "How do I unlock a certificate?",
        a: "Certificates unlock when you pass an exam with a score of 90% or above. If you score below that, you'll see a 'Certificate locked' notice on your results page.",
      },
      {
        q: "Are QnaHub certificates recognized by employers or Microsoft?",
        a: (
          <>
            No. QnaHub certificates are provided solely for self-declaration and
            skill demonstration purposes. They are independent practice
            assessments and are not issued, endorsed, or recognised by Microsoft
            or any third-party certification body. See our{" "}
            <Link
              to="/terms-and-conditions"
              className="text-primary hover:underline"
            >
              Terms &amp; Conditions
            </Link>{" "}
            for full detail.
          </>
        ),
      },
      {
        q: "Can I retake an exam?",
        a: "Yes, you can retake exams to try for a better score, subject to your plan's access limits.",
      },
    ],
  },
  {
    icon: Wallet,
    title: "Subscription & Billing",
    items: [
      {
        q: "Does my subscription auto-renew?",
        a: "No. QnaHub plans do not auto-renew. Your access simply ends at the end of your plan's validity period, and you won't be charged again unless you purchase a new plan.",
      },
      {
        q: "Can I downgrade my plan?",
        a: "Downgrading mid-cycle isn't supported. Your current plan stays active for its full purchased duration; once it ends, you can subscribe to any plan you like, including a lower-priced one.",
      },
      {
        q: "What happens if I upgrade my plan?",
        a: (
          <>
            You get immediate access to the higher plan, and any unused time on
            your current plan is carried forward into your new plan's expiry
            date, so you don't lose the value of what you already paid for. See
            our{" "}
            <Link
              to="/subscription-and-pricing-policy"
              className="text-primary hover:underline"
            >
              Subscription &amp; Pricing Policy
            </Link>{" "}
            for full detail.
          </>
        ),
      },
      {
        q: "Can I get a refund?",
        a: (
          <>
            Refunds apply for duplicate payments, failed/incomplete
            transactions, or a verified technical issue on our end. See our{" "}
            <Link
              to="/refund-and-cancellation-policy"
              className="text-primary hover:underline"
            >
              Refund &amp; Cancellation Policy
            </Link>{" "}
            for exact conditions and how to request one.
          </>
        ),
      },
    ],
  },
  {
    icon: LifeBuoy,
    title: "Account & Technical Issues",
    items: [
      {
        q: "I didn't receive my OTP. What do I do?",
        a: "Check your spam folder first. If it still doesn't arrive, use the Resend OTP option on the verification page, or contact Technical Support if the issue continues.",
      },
      {
        q: "I forgot my password.",
        a: "Use the Forgot Password link on the login page to reset it via your registered email.",
      },
      {
        q: "Who do I contact if something isn't working?",
        a: (
          <>
            Visit our{" "}
            <Link to="/contact-us" className="text-primary hover:underline">
              Contact Us
            </Link>{" "}
            page — it lists the right channel and expected response time for
            account issues, payment/refund questions, exam-related problems, and
            general technical support.
          </>
        ),
      },
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <LegalPageLayout title="Help Center" lastUpdated="01-Sep-2026">
      <div className="max-w-3xl mx-auto">
        <LegalHero icon={HelpCircle}>
          Everything you need to know about using QnaHub from creating your
          account to checking your results.
        </LegalHero>

        {/* Quick nav */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {SECTIONS.map(({ title }) => (
            <a
              key={title}
              href={`#${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-border bg-secondary text-secondary-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {title}
            </a>
          ))}
        </div>

        <div className="space-y-12">
          {SECTIONS.map(({ icon: Icon, title, items }) => (
            <section
              key={title}
              id={title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </span>
                <h2 className="text-lg text-green-700 font-bold text-foreground">
                  {title}
                </h2>
              </div>

              {/* No prose wrapper anywhere near this — the Accordion's
                  own internal <h3> can never inherit oversized heading
                  styles, because there is no page-wide h3 rule to catch it. */}
              <Accordion type="single" collapsible className="space-y-3">
                {items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${title}-${i}`}
                    className="bg-card border border-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center mt-14">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-sm mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-foreground mb-2 text-lg">
            Still need help?
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            Our support team is available Monday–Saturday, 10AM – 6PM IST.
          </p>
          <Link
            to="/contact-us"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold px-6 py-2.5 text-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </LegalPageLayout>
  );
}
