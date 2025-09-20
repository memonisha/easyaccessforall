"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Flame, Clock, Target, Star, Award } from "lucide-react"
import { useProgressStore } from "@/lib/progress-store"

export function ProgressDashboard() {
  const { progress, calculateLevel, getXPForNextLevel } = useProgressStore()

  const currentLevelXP = getXPForNextLevel(progress.level - 1)
  const nextLevelXP = getXPForNextLevel(progress.level)
  const progressToNextLevel = ((progress.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  const recentBadges = progress.badges
    .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
    .slice(0, 3)

  const completedDays = Object.values(progress.days).filter((day) => day.completed).length

  return (
    <div className="space-y-6">
      {/* Level and XP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Level {progress.level}
          </CardTitle>
          <CardDescription>
            {progress.xp.toLocaleString()} XP • {(nextLevelXP - progress.xp).toLocaleString()} XP to next level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressToNextLevel} className="h-3" />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{progress.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{progress.badges.length}</div>
            <div className="text-sm text-muted-foreground">Badges Earned</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{progress.totalActivitiesCompleted}</div>
            <div className="text-sm text-muted-foreground">Activities Done</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{Math.round(progress.totalTimeSpent / 60)}</div>
            <div className="text-sm text-muted-foreground">Minutes Learned</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Badges */}
      {recentBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBadges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{badge.name}</div>
                    <div className="text-sm text-muted-foreground">{badge.description}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {badge.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Journey Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Journey</CardTitle>
          <CardDescription>Your progress through the 4-day accessibility course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((dayNumber) => {
              const dayProgress = progress.days[dayNumber]
              const activitiesCompleted = dayProgress
                ? Object.values(dayProgress.activities).filter((a) => a.completed).length
                : 0
              const totalActivities = 3
              const dayCompleted = dayProgress?.completed || false

              return (
                <div key={dayNumber} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      dayCompleted
                        ? "bg-primary text-primary-foreground"
                        : activitiesCompleted > 0
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {dayCompleted ? "✓" : dayNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Day {dayNumber}</span>
                      <span className="text-sm text-muted-foreground">
                        {activitiesCompleted}/{totalActivities}
                      </span>
                    </div>
                    <Progress value={(activitiesCompleted / totalActivities) * 100} className="h-2" />
                  </div>
                  {dayProgress?.badgeEarned && (
                    <Badge variant="secondary" className="text-xs">
                      Badge Earned
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
