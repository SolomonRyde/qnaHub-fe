import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/Accordion";

const faqs = [
  {
    question: "How does the AI generate exam questions?",
    answer:
      "Our AI uses advanced language models trained on millions of educational materials. It generates unique, contextually relevant questions based on the topic and difficulty level you choose.",
  },
  {
    question: "Are QnaHub certificates recognized by employers or Microsoft?",
    answer:
      "QnaHub certificates are provided for self-declaration and skill-demonstration purposes. They're independent practice assessments and aren't issued, endorsed, or recognized by Microsoft or any third-party certification body.",
  },
  {
    question: "Can I retake an exam if I fail?",
    answer:
      "Yes — you can retake exams to try for a better score, subject to your plan's access limits. Practice Lite includes limited retakes; Smart Prep and Ultimate Success offer broader access.",
  },
  {
    question: "How long are the certificates valid?",
    answer:
      "Your certificates never expire. However, we recommend retaking exams every 1-2 years to stay current with evolving skills.",
  },
  {
    question: "Do I need to create an account to take exams?",
    answer:
      "Yes. Creating a free account allows you to track your progress, view your exam history, and download certificates for eligible assessments.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about QnaHub.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
