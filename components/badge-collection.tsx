"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Lock, ArrowRight } from "lucide-react"
import { useProgressStore } from "@/lib/progress-store"

export function BadgeCollection() {
  const { progress } = useProgressStore()

  const allPossibleBadges = [
    {
      id: "visual-hero",
      name: "Visual Accessibility Hero",
      description: "Mastered alt text, headings, and color contrast",
      icon: "👁️",
      category: "daily" as const,
      requirement: "Complete Day 1",
    },
    {
      id: "keyboard-master",
      name: "Keyboard Navigation Master",
      description: "Conquered tab order, focus, and skip links",
      icon: "⌨️",
      category: "daily" as const,
      requirement: "Complete Day 2",
    },
    {
      id: "screen-reader-ally",
      name: "Screen Reader Ally",
      description: "Implemented ARIA labels and live regions",
      icon: "🔊",
      category: "daily" as const,
      requirement: "Complete Day 3",
    },
    {
      id: "universal-champion",
      name: "Universal Design Champion",
      description: "Achieved comprehensive accessibility mastery",
      icon: "🌟",
      category: "daily" as const,
      requirement: "Complete Day 4",
    },
    {
      id: "streak-3",
      name: "3 Day Streak",
      description: "Completed activities for 3 consecutive days",
      icon: "🔥",
      category: "streak" as const,
      requirement: "3 day learning streak",
    },
    {
      id: "streak-7",
      name: "7 Day Streak",
      description: "Completed activities for 7 consecutive days",
      icon: "🔥",
      category: "streak" as const,
      requirement: "7 day learning streak",
    },
    {
      id: "perfectionist",
      name: "Perfectionist",
      description: "Complete 5 activities without using hints",
      icon: "💎",
      category: "mastery" as const,
      requirement: "5 activities without hints",
    },
    {
      id: "speed-demon",
      name: "Speed Demon",
      description: "Complete 5 activities in under 2 minutes each",
      icon: "⚡",
      category: "mastery" as const,
      requirement: "5 fast completions",
    },
  ]

  const earnedBadgeIds = new Set(progress.badges.map((b) => b.id))

  const earnedBadges = allPossibleBadges.filter((badge) => earnedBadgeIds.has(badge.id))
  const lockedBadges = allPossibleBadges.filter((badge) => !earnedBadgeIds.has(badge.id))

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "daily":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "streak":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "mastery":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Badge Collection
        </CardTitle>
        <CardDescription>
          {earnedBadges.length} of {allPossibleBadges.length} badges earned
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Earned Badges</h4>
              <div className="grid grid-cols-2 gap-3">
                {earnedBadges.slice(0, 4).map((badge) => (
                  <div key={badge.id} className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-xs font-medium">{badge.name}</div>
                    <Badge variant="outline" className={`text-xs mt-1 ${getCategoryColor(badge.category)}`}>
                      {badge.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Badges to Earn */}
          {lockedBadges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Next to Earn</h4>
              <div className="space-y-2">
                {lockedBadges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg opacity-75">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.requirement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button variant="ghost" size="sm" className="w-full">
            View All Badges
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
