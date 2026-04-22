import { Card, CardContent, CardFooter } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Clock, Users, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { EXAMS } from "../../../data/data";

// const exams = [
//   {
//     title: "JavaScript Mastery",
//     description: "Complete JavaScript fundamentals to advanced concepts",
//     difficulty: "Intermediate",
//     duration: "45 min",
//     participants: "12.5K",
//     questions: 30,
//     color: "from-yellow-500 to-orange-500",
//   },
//   {
//     title: "React Development",
//     description: "Modern React with hooks, context, and best practices",
//     difficulty: "Advanced",
//     duration: "60 min",
//     participants: "8.2K",
//     questions: 40,
//     color: "from-cyan-500 to-blue-500",
//   },
//   {
//     title: "Python Fundamentals",
//     description: "Learn Python from basics to intermediate level",
//     difficulty: "Beginner",
//     duration: "30 min",
//     participants: "15.3K",
//     questions: 25,
//     color: "from-green-500 to-emerald-500",
//   },
//   {
//     title: "Data Structures",
//     description: "Arrays, trees, graphs, and algorithmic thinking",
//     difficulty: "Advanced",
//     duration: "90 min",
//     participants: "5.7K",
//     questions: 50,
//     color: "from-purple-500 to-pink-500",
//   },
// ];

const exams = EXAMS;

const difficultyColors = {
  Beginner: "bg-green-500/10 text-green-600 dark:text-green-400",
  Intermediate: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Advanced: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export function Exams() {
  return (
    <section id="exams" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Popular Exams
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Start with our most popular certification exams, all powered by
              AI.
            </p>
          </div>
          <Button variant="default" className="gap-2 shrink-0">
            <Link to="/exams">
              View All Exams
              {/* <ArrowRight className="w-4 h-4" /> */}
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {exams.slice(0, 4).map((exam, i) => (
            <Card
              key={exam.title}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${exam.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {exam.title}
                    </h3>
                    <p className="text-muted-foreground">{exam.description}</p>
                  </div>
                  <Badge className={difficultyColors[exam.difficulty]}>
                    {exam.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{exam.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{exam.participants}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>{exam.totalQuestions} questions</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-3">
                <Button>
                  <Link to={`/exam/${i + 1}`}>Start Exam</Link>
                </Button>
                <Button variant="outline">Preview</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-foreground">
              <span className="font-semibold">AI-Powered:</span> Generate a
              custom exam on any topic instantly
            </p>
            <Button size="sm" className="ml-2">
              Generate Exam
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
