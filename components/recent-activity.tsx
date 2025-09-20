"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, Trophy, Target, ArrowRight } from "lucide-react"
import { useProgressStore } from "@/lib/progress-store"
import Link from "next/link"

export function RecentActivity() {
  const { progress } = useProgressStore()

  // Get recent activities (last 7 days)
  const recentActivities = Object.values(progress.days)
    .flatMap((day) =>
      Object.values(day.activities)
        .filter((activity) => activity.completed && activity.completedAt)
        .map((activity) => ({
          ...activity,
          dayNumber: day.dayNumber,
          completedAt: new Date(activity.completedAt!),
        })),
    )
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
    .slice(0, 5)

  const recentBadges = progress.badges
    .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
    .slice(0, 3)

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const getActivityTitle = (activityId: string) => {
    const titles: Record<string, string> = {
      "alt-text-adventure": "Alt Text Adventure",
      "heading-hierarchy-quest": "Heading Hierarchy Quest",
      "color-contrast-champion": "Color Contrast Champion",
      "tab-order-detective": "Tab Order Detective",
      "focus-ring-rescuer": "Focus Ring Rescuer",
      "skip-link-creator": "Skip Link Creator",
      "aria-label-wizard": "ARIA Label Wizard",
      "form-label-guardian": "Form Label Guardian",
      "live-region-herald": "Live Region Herald",
      "responsive-text-resizer": "Responsive Text Resizer",
      "motion-sensitivity-supporter": "Motion Sensitivity Supporter",
      "multi-modal-master": "Multi-Modal Master",
    }
    return titles[activityId] || activityId
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest learning achievements</CardDescription>
      </CardHeader>
      <CardContent>
        {recentActivities.length === 0 && recentBadges.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No recent activity yet</p>
            <Link href="/day/1">
              <Button>
                Start Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recent Badges */}
            {recentBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Badge Earned: {badge.name}</div>
                  <div className="text-xs text-muted-foreground">{formatTimeAgo(new Date(badge.earnedAt))}</div>
                </div>
                <div className="text-2xl">{badge.icon}</div>
              </div>
            ))}

            {/* Recent Activities */}
            {recentActivities.map((activity) => (
              <div
                key={`${activity.dayNumber}-${activity.id}`}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Completed: {getActivityTitle(activity.id)}</div>
                  <div className="text-xs text-muted-foreground">
                    Day {activity.dayNumber} • {formatTimeAgo(activity.completedAt)} •{" "}
                    {Math.round(activity.timeSpent / 60)}m
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activity.hintsUsed === 0 && (
                    <Badge variant="secondary" className="text-xs">
                      No Hints
                    </Badge>
                  )}
                  {activity.timeSpent < 120 && (
                    <Badge variant="outline" className="text-xs">
                      Fast
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            {(recentActivities.length > 0 || recentBadges.length > 0) && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm">
                  View All Activity
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
