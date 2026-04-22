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
    question: "Are the certificates recognized by employers?",
    answer:
      "Yes! Our certificates are verified on the blockchain and recognized by many tech companies. Each certificate has a unique verification code that employers can use to confirm its authenticity.",
  },
  {
    question: "Can I retake an exam if I fail?",
    answer:
      "Absolutely! Free users can retake exams after 24 hours. Pro and Enterprise users have unlimited retakes with no waiting period.",
  },
  {
    question: "How long are the certificates valid?",
    answer:
      "Your certificates never expire. However, we recommend retaking exams every 1-2 years to stay current with evolving technologies.",
  },
  {
    question: "Can I create custom exams for my team?",
    answer:
      "Yes! Enterprise users can create custom exams tailored to their specific needs, including custom topics, branding, and difficulty levels.",
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
            Everything you need to know about Examify.
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
