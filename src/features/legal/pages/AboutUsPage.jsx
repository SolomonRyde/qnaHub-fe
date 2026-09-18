import { Link } from "react-router-dom";
import {
  Target,
  Heart,
  Shield,
  Sparkles,
  Users,
  TrendingUp,
  Rocket,
  Building2,
  GraduationCap,
  MessageCircle,
  Info,
} from "lucide-react";
import LegalPageLayout from "../components/LegalPageLayout";
import LegalHero from "../components/LegalHero";
import SectionCard from "../components/SectionCard";

export default function AboutUsPage() {
  return (
    <LegalPageLayout title="About Us">
      <div className="max-w-5xl mx-auto">
        <LegalHero icon={Rocket}>
          QnaHub.in is a product of <strong>Ryde Consulting</strong> dedicated
          to helping students and early-career professionals build practical,
          job-ready skills.
        </LegalHero>

        {/* Mission Section - Two Column */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg md:text-xl text-green-700 font-bold text-foreground">
                  Our Mission
                </h3>
              </div>
              <p className="text-muted-foreground">
                Our mission is to bridge the gap in problem-solving and
                workplace readiness skills that are often not covered in
                standard academic curriculums.
              </p>
              <p className="text-muted-foreground">
                We provide skill-assessment and practice exams in key areas like
                Aptitude, Microsoft Excel, and Microsoft Word. Our platform is
                tailored for college students and entry-level professionals
                preparing for placements and interviews.
              </p>
              <p className="text-muted-foreground">
                QnaHub.in is managed by Ryde Consulting, based in Ponneri, Tamil
                Nadu.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden border border-border bg-muted/50 flex items-center justify-center p-8 lg:p-12">
              <div className="w-full aspect-square max-w-md bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-xl flex items-center justify-center border border-border">
                <div className="text-center space-y-4">
                  <img src="./about_us.png" alt="about-us" />
                  <p className="text-sm font-medium text-muted-foreground px-4">
                    Empowering learners with skill-driven assessments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-8">
          <SectionCard icon={GraduationCap} title="Who We Are">
            <p className="text-muted-foreground leading-relaxed">
              Welcome to QnaHub a practical skill assessment platform built to
              help students and early career professionals prepare for the real
              world with confidence. We help you close the gap between what you
              learn in a classroom and what employers actually expect, through
              focused, realistic practice exams.
            </p>
          </SectionCard>

          <SectionCard icon={Target} title="Our Mission">
            <p className="text-muted-foreground">
              QnaHub exists to make skill-readiness testing practical and
              accessible whether you're a college student preparing for your
              first placement drive or a fresher brushing up before an
              interview. We focus on realistic exam formats, honest
              skill-building content, and a distraction-free testing experience
              that mirrors what you'll face in an actual assessment.
            </p>
          </SectionCard>

          <SectionCard icon={Sparkles} title="Why We Started">
            <p className="text-muted-foreground">
              QnaHub was born from a simple observation: many talented students
              and freshers don't struggle because they lack potential they
              struggle because basic problem solving and workplace readiness
              skills are rarely covered in standard academic curriculums. Every
              learner deserves a simple, affordable way to identify and close
              these gaps before they walk into an interview or a job role.
            </p>
          </SectionCard>

          <SectionCard icon={Heart} title="Our Values">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: "Authenticity",
                  body: "Exam content built around real, practical skills, not filler questions.",
                },
                {
                  icon: Shield,
                  title: "Clarity",
                  body: "Straightforward instructions, transparent rules, and no hidden surprises during a test.",
                },
                {
                  icon: Users,
                  title: "Accessibility",
                  body: "Affordable practice exams that any student or fresher can access, regardless of background.",
                },
                {
                  icon: Heart,
                  title: "Integrity",
                  body: "A fair testing environment, with clear rules that protect the value of every score earned on QnaHub.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="flex gap-4 p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all hover:-translate-y-1 duration-200"
                >
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {v.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {v.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Building2} title="Where We Come From">
            <p className="text-muted-foreground">
              QnaHub is a product of{" "}
              <strong className="text-foreground">Ryde Consulting</strong>, a
              proprietorship business based in Chennai, Tamil Nadu, focused on
              practical skill development for students and early career
              professionals. QnaHub is our platform for making that mission
              accessible online, through structured skill assessment exams and
              related preparation guides for placements and interviews.
            </p>
          </SectionCard>

          <SectionCard icon={GraduationCap} title="Our Approach to Learning">
            <p className="text-muted-foreground">
              Rather than long form courses, QnaHub is built around short,
              targeted assessments that mirror how skills are actually tested in
              the real world: timed, focused, and outcome-based. Each exam is
              designed to give you an honest read on where you stand, so you can
              prioritise your preparation time on what matters most.
            </p>
          </SectionCard>

          <SectionCard
            icon={TrendingUp}
            title="Looking Ahead"
            variant="highlight"
          >
            <p className="text-foreground/90 leading-relaxed">
              We're actively expanding our exam categories and preparation
              resources to cover more roles, skills, and industries. As QnaHub
              grows, our commitment stays the same: practical, honest, and
              fairly assessed skill testing that respects your time.
            </p>
          </SectionCard>

          <SectionCard icon={Info} title="A Note on What QnaHub Is — and Isn't">
            <p className="text-muted-foreground mb-6">
              QnaHub's assessments cover foundational, commonly used skills and
              are intended for self-practice and skill-building purposes only.
              They are independent practice tests and are not equivalent to,
              affiliated with, or a substitute for official certification exams
              offered by Microsoft or any other organisation. QnaHub does not
              guarantee any specific interview, placement, or employment outcome
              as a result of using the platform; our role is to help you prepare
              and self-assess, not to place you in a role.
            </p>
            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 border-l-4 border-l-primary flex gap-3 items-start">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  Independent Practice
                </p>
                <p className="text-sm text-foreground/80 m-0">
                  Our Excel and Word assessments provide an overview of
                  foundational, commonly-used skills and are intended for
                  self-practice and skill-building purposes only. They are
                  independent practice tests and are not equivalent to,
                  affiliated with, or a substitute for official certification
                  exams offered by Microsoft or any other organisation.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={MessageCircle}
            title="Get in Touch"
            variant="highlight"
          >
            <p className="text-foreground/90">
              We'd love to hear from you. For feedback, suggestions for new exam
              categories, or any questions, please visit our{" "}
              <Link to="/contact-us" className="text-primary hover:underline">
                Contact Us
              </Link>{" "}
              page. You can also read our{" "}
              <Link
                to="/terms-and-conditions"
                className="text-primary hover:underline"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              to understand how QnaHub works and how your data is handled.
            </p>
          </SectionCard>

          <blockquote className="border-l-4 border-primary/50 pl-6 py-4 italic text-sm text-muted-foreground bg-muted/30 rounded-lg">
            Disclaimer: Our assessments provide an overview of foundational,
            commonly-used skills and are intended for self-practice and
            skill-building purposes only. They are independent practice tests
            and are not equivalent to, affiliated with, or a substitute for
            official certification exams offered by Microsoft or any other
            organisation.
          </blockquote>
        </div>
      </div>
    </LegalPageLayout>
  );
}
