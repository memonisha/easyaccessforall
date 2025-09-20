"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, BookOpen, TestTube, Palette, HelpCircle } from "lucide-react"
import { useProgressStore } from "@/lib/progress-store"
import Link from "next/link"

export function QuickActions() {
  const { progress } = useProgressStore()

  const getNextAction = () => {
    for (let i = 1; i <= 4; i++) {
      const dayData = progress.days[i]
      if (!dayData || !dayData.completed) {
        return {
          type: "continue",
          dayNumber: i,
          label: dayData ? "Continue Day" : "Start Day",
        }
      }
    }

    // All days completed
    return {
      type: "completed",
      label: "All Complete!",
    }
  }

  const nextAction = getNextAction()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump right into learning - all days available!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {nextAction.type === "continue" && (
          <Link href={`/day/${nextAction.dayNumber}`}>
            <Button className="w-full">
              <Play className="w-4 h-4 mr-2" />
              {nextAction.label} {nextAction.dayNumber}
            </Button>
          </Link>
        )}

        {nextAction.type === "completed" && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="text-2xl mb-2">🎉</div>
            <div className="font-medium text-green-800 dark:text-green-200 mb-1">Congratulations!</div>
            <div className="text-sm text-green-600 dark:text-green-400">You've completed all 4 days!</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <TestTube className="w-3 h-3 mr-1" />
            Practice
          </Button>
          <Button variant="outline" size="sm">
            <Palette className="w-3 h-3 mr-1" />
            Tools
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="w-full">
          <BookOpen className="w-4 h-4 mr-2" />
          Learning Resources
        </Button>

        <Button variant="ghost" size="sm" className="w-full">
          <HelpCircle className="w-4 h-4 mr-2" />
          Get Help
        </Button>

        {progress.totalActivitiesCompleted > 0 && (
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Progress
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
