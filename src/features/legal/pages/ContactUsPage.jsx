import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  AlertCircle,
  MessageSquare,
  HelpCircle,
  CreditCard,
  Laptop,
  Headset,
  ShieldAlert,
  Building2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import LegalPageLayout from "../components/LegalPageLayout";
import LegalHero from "../components/LegalHero";
import SectionCard from "../components/SectionCard";
import { sendContactMessage } from "../../../services/apiContact";

const CHANNELS = [
  {
    icon: MessageSquare,
    title: "General & Account Support",
    desc: "For account-related queries and general questions",
    lines: [
      { icon: Mail, text: "admin@rydecs.com", bold: true },
      { icon: Phone, text: "+91 8122175571 / +91 80568 31580" },
      { icon: Clock, text: "Mon-Sat, 10:00 AM to 6:00 PM IST" },
    ],
    response: "Within 24 hours",
  },
  {
    icon: CreditCard,
    title: "Payment & Refund Support",
    desc: "For payment failures, duplicate charges, or refunds",
    lines: [{ icon: Mail, text: "admin@rydecs.com", bold: true }],
    note: (
      <>
        Subject line: "Payment/Refund -- [Your Order ID]". Include your
        order/transaction ID.{" "}
        <Link
          to="/refund-and-cancellation-policy"
          className="text-primary hover:underline"
        >
          See refund policy
        </Link>
      </>
    ),
    response: "Within 2 business days",
  },
  {
    icon: AlertCircle,
    title: "Examination Support",
    desc: "For technical issues during exam attempts",
    lines: [{ icon: Mail, text: "admin@rydecs.com", bold: true }],
    note: `Subject line: "Exam Issue -- [Your Order/Attempt ID]". Report within 48 hours of the attempt with a description.`,
    response: "Within 3 business days",
  },
  {
    icon: Laptop,
    title: "Technical Support",
    desc: "For login issues, OTP delivery, or site errors",
    lines: [{ icon: Mail, text: "admin@rydecs.com", bold: true }],
    note: "Include your registered email address and, if possible, a screenshot of the issue.",
    response: "Within 24 hours",
  },
];

const INITIAL_FORM = { name: "", email: "", message: "", company: "" };

export default function ContactUsPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setErrorMsg("Please fill in your name, email, and message.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        company: form.company, // honeypot — stays empty for real users
      });
      setStatus("success");
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <LegalPageLayout title="Contact Us" lastUpdated="01-Sep-2026">
      <div className="max-w-5xl mx-auto">
        <LegalHero icon={Headset}>
          Have questions about QnaHub? Whether you're looking for support,
          inquiring about exams, payments, or just want to say hello, we're here
          to help.
        </LegalHero>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-10">
          <SectionCard icon={MessageSquare} title="Send us a Message">
            {status === "success" ? (
              <div className="flex flex-col items-center text-center gap-3 py-10">
                <CheckCircle2 className="w-12 h-12 text-primary" />
                <p className="font-semibold text-foreground">Message sent!</p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Thanks for reaching out — we'll get back to you within 24
                  hours on business days.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="text-sm text-primary hover:underline mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit}
                noValidate
              >
                <div>
                  <label
                    className="block text-sm font-semibold text-foreground mb-2"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <input
                    className="w-full px-3 py-3 rounded-lg border border-border text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    disabled={status === "submitting"}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold text-foreground mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="w-full px-3 py-3 rounded-lg border border-border text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    id="email"
                    name="email"
                    placeholder="jane@example.com"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={status === "submitting"}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold text-foreground mb-2"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    className="w-full px-3 py-3 rounded-lg border border-border text-foreground bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    disabled={status === "submitting"}
                  ></textarea>
                </div>

                {/* Honeypot field — hidden from real users, catches simple bots */}
                <div
                  className="absolute w-0 h-0 overflow-hidden"
                  aria-hidden="true"
                >
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.company}
                    onChange={handleChange}
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-destructive -mt-2">{errorMsg}</p>
                )}

                <div className="pt-2">
                  <button
                    className="w-full bg-primary text-primary-foreground rounded-full px-6 py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    type="submit"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Mail className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </SectionCard>

          <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm h-full flex flex-col">
            <h3 className="text-lg text-green-700 font-bold text-foreground mb-6 pb-4 border-b border-border">
              Contact Information
            </h3>
            <div className="flex flex-col gap-6 flex-grow">
              {[
                { icon: Building2, label: "Company", value: "Ryde Consulting" },
                {
                  icon: MapPin,
                  label: "Registered Address",
                  value:
                    "4th Floor, ARK Apartment, Old no: 161, New Number: 56, Barracha Road, Secretariat colony, Kilpauk, Chennai 600-010 Tamil Nadu, India.",
                },
                {
                  icon: Mail,
                  label: "Support Email",
                  value: "admin@rydecs.com",
                  href: "mailto:admin@rydecs.com",
                },
                {
                  icon: Phone,
                  label: "Support Phone",
                  value: "+91 8122175571 / +91 80568 31580",
                },
                {
                  icon: Clock,
                  label: "Support Hours",
                  value: "Mon-Sat, 10:00 AM to 6:00 PM IST",
                },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <row.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">
                      {row.label}
                    </p>
                    {row.href ? (
                      <a
                        className="text-base font-medium text-primary hover:underline"
                        href={row.href}
                      >
                        {row.value}
                      </a>
                    ) : (
                      <p className="text-sm text-foreground">{row.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Channels */}
        <SectionCard
          icon={HelpCircle}
          title="Support Channels"
          className="mb-10"
        >
          <p className="text-muted-foreground mb-6">
            We're happy to help with any questions about your account, an exam
            attempt, payments, or refunds. Choose the channel below that best
            matches your query for the fastest response.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {CHANNELS.map((c) => (
              <div
                key={c.title}
                className="bg-background border border-border rounded-xl p-6 hover:border-primary/50 hover:-translate-y-1 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg mb-1">
                      {c.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {c.lines.map((line) => (
                    <div key={line.text} className="flex items-center gap-2">
                      <line.icon className="w-4 h-4 text-primary shrink-0" />
                      <span
                        className={
                          line.bold
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {line.text}
                      </span>
                    </div>
                  ))}
                  {c.note && (
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {c.note}
                    </p>
                  )}
                  <div className="pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      ⚡ Typical response: {c.response}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Escalation */}
        <SectionCard
          icon={ShieldAlert}
          title="Escalation Process"
          variant="warning"
        >
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed mb-3">
            If your query has not been resolved to your satisfaction within the
            timelines above, you may request escalation by replying to your
            existing email thread with "Escalation Request" in the subject line.
            Escalated queries are reviewed directly by the QnaHub support lead.
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed mb-6">
            If your concern remains unresolved after escalation, you may contact
            our Grievance Officer at the postal address below.
          </p>

          <div className="rounded-xl bg-primary/5 border border-primary/20 border-l-4 border-l-primary p-6">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Grievance Officer
              Contact
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              <strong className="text-foreground">Postal Address:</strong> 4th
              Floor, ARK Apartment, Old no: 161, New Number: 56, Barracha Road,
              Secretariat colony, Kilpauk, Chennai 600010
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground">Acknowledgement:</strong>{" "}
                Within 48 hours
              </span>
              <span className="text-border">•</span>
              <span>
                <strong className="text-foreground">Resolution:</strong> Within
                30 days
              </span>
            </div>
          </div>
        </SectionCard>
      </div>
    </LegalPageLayout>
  );
}
