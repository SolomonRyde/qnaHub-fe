import { Card, CardContent } from "../../../components/ui/Card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: " Yogavarshini R",
    role: "Student at Peri Institute of Technology",
    avatar: "/testimonials/yoga_varshini.jpg",
    content:
      "I was preparing for my TCS iON Cognitive Exam and wanted to practice with tests similar to the actual exam. That's when I found QnaHub. The practice tests were very relevant and helped me improve my understanding and confidence. In my first attempt at the actual exam, I scored 65%, and QnaHub played a big role in my preparation. Thank you, QnaHub!",
    rating: 4,
  },
  {
    name: "Paramanand V",
    role: " System Engineer at Archway Automation",
    avatar: "/testimonials/param_anand.jpg",
    content:
      "I used QnaHub to prepare for technical interviews, and the questions were genuinely relevant close enough to what I was actually asked that the practice carried over. It made me walk into interviews far more confident. I'd definitely recommend it to anyone preparing for interviews.",
    rating: 5,
  },
  {
    name: "John Cena R ",
    role: "Bcom Student at St Thomas College of Arts & Science",
    avatar: "/testimonials/john.jpeg",
    content:
      " I recently took the MS Word, MS Excel, and Aptitude exams on Examify, and the experience was excellent. The platform was smooth, and the questions were practical, especially in MS Excel and Aptitude, helping me identify areas for improvement. I highly recommend Examify to anyone looking to test and enhance their skills.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Our Exam Candidates Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who have advanced their careers with
            QnaHub.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-foreground mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {/* <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {testimonial.avatar}
                  </div> */}
                  <img
                    className="w-10 h-10 rounded-full"
                    src={testimonial.avatar}
                    alt=""
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
