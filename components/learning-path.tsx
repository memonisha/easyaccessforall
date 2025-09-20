"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, ArrowRight } from "lucide-react"
import { useProgressStore } from "@/lib/progress-store"
import Link from "next/link"

export function LearningPath() {
  const { progress } = useProgressStore()

  const days = [
    {
      number: 1,
      title: "Visual Accessibility Heroes",
      description: "Master alt text, headings, and color contrast",
      activities: ["Alt Text Adventure", "Heading Hierarchy Quest", "Color Contrast Champion"],
    },
    {
      number: 2,
      title: "Keyboard Navigation Masters",
      description: "Learn tab order, focus indicators, and skip links",
      activities: ["Tab Order Detective", "Focus Ring Rescuer", "Skip Link Creator"],
    },
    {
      number: 3,
      title: "Screen Reader Allies",
      description: "Implement ARIA labels and live regions",
      activities: ["ARIA Label Wizard", "Form Label Guardian", "Live Region Herald"],
    },
    {
      number: 4,
      title: "Universal Design Champions",
      description: "Master responsive design and motion preferences",
      activities: ["Responsive Text Resizer", "Motion Sensitivity Supporter", "Multi-Modal Master"],
    },
  ]

  const getDayProgress = (dayNumber: number) => {
    const dayData = progress.days[dayNumber]
    if (!dayData) return { completed: 0, total: 3, isCompleted: false, isUnlocked: true }

    const completedActivities = Object.values(dayData.activities).filter((a) => a.completed).length
    const isCompleted = dayData.completed
    const isUnlocked = true

    return {
      completed: completedActivities,
      total: 3,
      isCompleted,
      isUnlocked,
    }
  }

  const getNextDay = () => {
    for (let i = 1; i <= 4; i++) {
      const dayProgress = getDayProgress(i)
      if (dayProgress.isUnlocked && !dayProgress.isCompleted) {
        return i
      }
    }
    return null
  }

  const nextDay = getNextDay()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Learning Path
        </CardTitle>
        <CardDescription>Your 4-day accessibility mastery journey - start any day!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {days.map((day) => {
            const dayProgress = getDayProgress(day.number)
            const progressPercentage = (dayProgress.completed / dayProgress.total) * 100

            return (
              <div
                key={day.number}
                className={`p-4 rounded-lg border-2 transition-all ${
                  dayProgress.isCompleted
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      dayProgress.isCompleted ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {dayProgress.isCompleted ? <CheckCircle className="w-5 h-5" /> : day.number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{day.title}</h3>
                      {day.number === nextDay && (
                        <Badge variant="secondary" className="text-xs">
                          Recommended
                        </Badge>
                      )}
                      {dayProgress.isCompleted && (
                        <Badge variant="default" className="text-xs">
                          Complete
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{day.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span>
                          {dayProgress.completed}/{dayProgress.total} activities
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="mt-3">
                      <Link href={`/day/${day.number}`}>
                        <Button size="sm" variant={dayProgress.isCompleted ? "outline" : "default"}>
                          {dayProgress.isCompleted ? "Review" : dayProgress.completed > 0 ? "Continue" : "Start"}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Overall Progress */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {Object.values(progress.days).filter((d) => d.completed).length}/4 days complete
              </span>
            </div>
            <Progress
              value={(Object.values(progress.days).filter((d) => d.completed).length / 4) * 100}
              className="h-3"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
