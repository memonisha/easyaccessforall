import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { StreakIndicator } from "@/components/streak-indicator"
import { RecentActivity } from "@/components/recent-activity"
import { BadgeCollection } from "@/components/badge-collection"
import { LearningPath } from "@/components/learning-path"
import { QuickActions } from "@/components/quick-actions"
import { BookOpen, Target } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your accessibility learning journey</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Streak Indicator */}
            <StreakIndicator />

            {/* Progress Overview */}
            <ProgressDashboard />

            {/* Learning Path */}
            <LearningPath />

            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Badge Collection */}
            <BadgeCollection />

            {/* Daily Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Daily Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Complete 1 activity</span>
                    <Badge variant="outline">0/1</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Just 10 minutes a day builds lasting accessibility skills
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Tip */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Today's Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Alt text should describe the content and function of an image, not just its appearance. Think about
                  what information the image conveys to someone who can see it.
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
