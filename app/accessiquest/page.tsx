import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Users, Zap, BarChart3, Home } from "lucide-react"
import Link from "next/link"

export default function AccessiQuestPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-4 left-4 z-50">
        <Link href="/">
          <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section id="header" className="relative overflow-hidden bg-gradient-to-br from-background to-muted py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="text-sm font-medium">
              🎯 Learn for 10 Min a Day
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">AccessiQuest</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Level up your code, unlock the web for everyone!
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master web accessibility through gamified daily challenges. Learn WCAG guidelines while building inclusive
              experiences for all users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link href="/day/1">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why AccessiQuest?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Because real heroes code to help everyone play 🌿
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Daily Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Just 10 minutes a day with 3 focused activities. Build habits that stick.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Gamified Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Earn badges, track streaks, and level up as you master accessibility skills.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Real User Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Learn through personas like Luna (screen reader user) and Marcus (keyboard navigator).
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Instant Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built-in accessibility testing tools provide immediate feedback on your code.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Journey Preview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your 4-Day Learning Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Progressive skill building from visual accessibility to universal design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative">
              <CardHeader>
                <Badge className="w-fit mb-2">Day 1</Badge>
                <CardTitle className="text-lg">Visual Accessibility Heroes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Master alt text, heading structure, and color contrast for screen readers and low vision users.
                </CardDescription>
                <Progress value={0} className="mb-2" />
                <p className="text-sm text-muted-foreground mb-4">0/3 activities completed</p>
                <Link href="/day/1">
                  <Button className="w-full">Begin Day 1</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <Badge className="w-fit mb-2">Day 2</Badge>
                <CardTitle className="text-lg">Keyboard Navigation Masters</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Learn tab order, focus indicators, and skip links for keyboard-only users.
                </CardDescription>
                <Progress value={0} className="mb-2" />
                <p className="text-sm text-muted-foreground mb-4">0/3 activities completed</p>
                <Link href="/day/2">
                  <Button className="w-full">Begin Day 2</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <Badge className="w-fit mb-2">Day 3</Badge>
                <CardTitle className="text-lg">Screen Reader Allies</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Implement ARIA labels, form associations, and live regions for assistive technology.
                </CardDescription>
                <Progress value={0} className="mb-2" />
                <p className="text-sm text-muted-foreground mb-4">0/3 activities completed</p>
                <Link href="/day/3">
                  <Button className="w-full">Begin Day 3</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardHeader>
                <Badge className="w-fit mb-2">Day 4</Badge>
                <CardTitle className="text-lg">Universal Design Champions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Master responsive design, motion preferences, and multi-modal accessibility.
                </CardDescription>
                <Progress value={0} className="mb-2" />
                <p className="text-sm text-muted-foreground mb-4">0/3 activities completed</p>
                <Link href="/day/4">
                  <Button className="w-full">Begin Day 4</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground">
              Choose any day to start your accessibility journey - learn at your own pace!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Make the Web Accessible for Everyone?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
             Start your accessibility
            journey today with just 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/day/1">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Today
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">No account required • Start immediately</p>
          </div>
        </div>
      </section>
    </div>
  )
}
