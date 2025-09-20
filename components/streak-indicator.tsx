"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Calendar } from "lucide-react"
import { useProgressStore } from "@/lib/progress-store"

export function StreakIndicator() {
  const { progress } = useProgressStore()

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-500"
    if (streak >= 14) return "text-orange-500"
    if (streak >= 7) return "text-red-500"
    if (streak >= 3) return "text-yellow-500"
    return "text-gray-500"
  }

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your learning streak today!"
    if (streak === 1) return "Great start! Keep it going tomorrow."
    if (streak < 7) return `${streak} days strong! You're building a habit.`
    if (streak < 14) return `${streak} day streak! You're on fire!`
    if (streak < 30) return `${streak} days! You're a learning machine!`
    return `${streak} days! Absolutely incredible dedication!`
  }

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Flame className={`w-6 h-6 ${getStreakColor(progress.currentStreak)}`} />
            <div>
              <div className="text-2xl font-bold">{progress.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium">{getStreakMessage(progress.currentStreak)}</div>
            {progress.longestStreak > progress.currentStreak && (
              <div className="text-xs text-muted-foreground">Personal best: {progress.longestStreak} days</div>
            )}
          </div>

          {progress.currentStreak > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Active
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
