import {
  Code,
  Database,
  Cloud,
  Smartphone,
  Shield,
  Brain,
  Palette,
  BarChart,
  Globe,
  Cpu,
} from "lucide-react"

const categories = [
  { icon: Code, name: "Programming", count: 45, color: "from-blue-500 to-cyan-500" },
  { icon: Database, name: "Databases", count: 23, color: "from-purple-500 to-pink-500" },
  { icon: Cloud, name: "Cloud Computing", count: 31, color: "from-sky-500 to-blue-500" },
  { icon: Smartphone, name: "Mobile Dev", count: 28, color: "from-green-500 to-emerald-500" },
  { icon: Shield, name: "Cybersecurity", count: 19, color: "from-red-500 to-orange-500" },
  { icon: Brain, name: "AI & ML", count: 34, color: "from-violet-500 to-purple-500" },
  { icon: Palette, name: "UI/UX Design", count: 21, color: "from-pink-500 to-rose-500" },
  { icon: BarChart, name: "Data Science", count: 27, color: "from-teal-500 to-green-500" },
  { icon: Globe, name: "Web Development", count: 52, color: "from-orange-500 to-yellow-500" },
  { icon: Cpu, name: "DevOps", count: 18, color: "from-slate-500 to-zinc-500" },
]

export function Categories() {
  return (
    <section id="categories" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive library of certification exams across various
            tech domains.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.name}
              className="group relative p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`}
              />
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.count} exams
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
