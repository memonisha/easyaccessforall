import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Heart, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 homepage-font">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10"></div>
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900 border-2 border-slate-700 text-white animate-pulse-glow">
              <Heart className="w-5 h-5 text-blue-400" />
              <span className="text-base font-semibold">Building an inclusive digital world</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-slate-800 tracking-tight leading-none whitespace-nowrap">
              Easy Access For All
            </h1>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="max-w-3xl mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-200 shadow-lg">
                <p className="text-lg text-slate-700 leading-relaxed">
                  Welcome to Easy Access For All – a space dedicated to making the digital world more inclusive.
                  Currently featuring my first project, with many more on the way to break down barriers and bring
                  everyone together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Cards Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Projects</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Innovative tools and resources designed to make digital experiences accessible to everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card className="group relative overflow-hidden border-0 transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/20 animate-fade-in-up bg-slate-900 backdrop-blur-sm transform hover:-translate-y-4 shadow-xl animate-card-glow animate-card-float">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                <ArrowRight className="w-6 h-6 text-blue-400 animate-gentle-float" />
              </div>

              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border-2 border-blue-400/30">
                    <Zap className="w-8 h-8 text-blue-400" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-sm font-semibold px-4 py-2 bg-green-600/20 text-green-400 border-green-400/20"
                  >
                    Live Project
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-500">
                  AccessiQuest
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                <CardDescription className="text-lg leading-relaxed text-slate-300">
                  A gamified web accessibility learning platform that makes WCAG guidelines fun and engaging. Master
                  accessibility through daily challenges, real user stories, and hands-on coding exercises.
                </CardDescription>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge
                    variant="outline"
                    className="text-sm px-3 py-1 border-2 border-blue-400/30 text-blue-400 bg-blue-400/10"
                  >
                    Accessibility
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-sm px-3 py-1 border-2 border-purple-400/30 text-purple-400 bg-purple-400/10"
                  >
                    Gamification
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-sm px-3 py-1 border-2 border-green-400/30 text-green-400 bg-green-400/10"
                  >
                    Education
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-sm px-3 py-1 border-2 border-yellow-400/30 text-yellow-400 bg-yellow-400/10"
                  >
                    WCAG
                  </Badge>
                </div>

                <Link href="/accessiquest" className="block">
                  <Button className="w-full h-14 text-lg font-semibold group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 transform group-hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white">
                    <Sparkles className="w-5 h-5 mr-3" />
                    Explore AccessiQuest
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 transition-all duration-700 animate-fade-in-up bg-slate-900 backdrop-blur-sm transform hover:-translate-y-4 shadow-xl hover:shadow-indigo-500/20 animate-card-glow animate-card-float">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/30 via-transparent to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-700/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border-2 border-slate-600/30">
                    <Users className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors duration-500" />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-sm font-semibold px-4 py-2 border-dashed border-slate-500/40 text-slate-400"
                  >
                    Coming Soon
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-500">
                  More Projects
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                <CardDescription className="text-4xl font-bold text-slate-300 text-center py-12">
                  Coming Soon!
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-slate-900 text-center">
        <p className="text-slate-400 text-sm">
          © 2025 Easy Access For All. Created by <span className="text-white">Er. Monisha Sharma</span>{" "}
          (Engineer, Educator and Researcher)
        </p>
      </footer>
    </div>
  )
}
