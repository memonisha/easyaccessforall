"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Trophy, Star, ArrowRight, Sparkles } from "lucide-react"
import { useProgressStore } from "@/lib/progress-store"
import Link from "next/link"

interface ActivityCompletionProps {
  dayNumber: number
  activityId: string
  activityTitle: string
  timeSpent: number
  hintsUsed: number
  onNext?: () => void
}

const ConfettiParticle = ({ delay }: { delay: number }) => (
  <div
    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full animate-bounce"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}ms`,
      animationDuration: `${1000 + Math.random() * 1000}ms`,
    }}
  />
)

export function ActivityCompletion({
  dayNumber,
  activityId,
  activityTitle,
  timeSpent,
  hintsUsed,
  onNext,
}: ActivityCompletionProps) {
  const { completeActivity, progress } = useProgressStore()
  const [showCelebration, setShowCelebration] = useState(false)
  const [xpGained, setXpGained] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const playSuccessSound = () => {
    try {
      // Create a simple success sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log("Audio not supported")
    }
  }

  useEffect(() => {
    // Calculate XP before completing activity
    const baseXP = 100
    let bonusXP = 0

    if (hintsUsed === 0) bonusXP += 50
    if (timeSpent < 120) bonusXP += 25

    const totalXP = baseXP + bonusXP
    setXpGained(totalXP)

    // Complete the activity
    completeActivity(dayNumber, activityId, timeSpent, hintsUsed)

    setShowCelebration(true)
    setShowConfetti(true)
    playSuccessSound()

    // Hide celebration after 4 seconds
    const timer = setTimeout(() => {
      setShowCelebration(false)
      setShowConfetti(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [dayNumber, activityId, timeSpent, hintsUsed, completeActivity])

  const dayProgress = progress.days[dayNumber]
  const activitiesCompleted = dayProgress ? Object.values(dayProgress.activities).filter((a) => a.completed).length : 0
  const isDayComplete = dayProgress?.completed || false
  const newBadge = progress.badges.find((b) => b.earnedAt && new Date(b.earnedAt).getTime() > Date.now() - 5000)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Celebration Animation with Confetti */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl animate-bounce" style={{ animationDuration: "0.6s" }}>
              🎉
            </div>
          </div>
          <div className="absolute top-1/4 left-1/4 text-4xl animate-spin" style={{ animationDuration: "2s" }}>
            ⭐
          </div>
          <div className="absolute top-1/3 right-1/4 text-4xl animate-pulse" style={{ animationDelay: "0.5s" }}>
            🏆
          </div>
          <div className="absolute bottom-1/3 left-1/3 text-4xl animate-bounce" style={{ animationDelay: "1s" }}>
            ✨
          </div>

          {/* Confetti particles */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <ConfettiParticle key={i} delay={i * 100} />
              ))}
            </div>
          )}

          {/* Pulsing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-blue-500/20 to-purple-600/20 animate-pulse"></div>
        </div>
      )}

      {/* Completion Card with enhanced styling */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 transform transition-all duration-500 hover:scale-105">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800 dark:text-green-200 animate-fade-in">
            Activity Complete!
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Great job completing "{activityTitle}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Performance Stats with animations */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-green-800 dark:text-green-200 animate-bounce">+{xpGained}</div>
              <div className="text-sm text-green-600 dark:text-green-400">XP Earned</div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">{formatTime(timeSpent)}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Time Taken</div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">{hintsUsed}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Hints Used</div>
            </div>
          </div>

          {/* Bonus XP with enhanced animation */}
          {(hintsUsed === 0 || timeSpent < 120) && (
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg animate-pulse border-2 border-yellow-300 dark:border-yellow-700">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span className="font-medium">Bonus XP Earned!</span>
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                {hintsUsed === 0 && "• No hints used: +50 XP"}
                {timeSpent < 120 && "• Completed quickly: +25 XP"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Badge with enhanced celebration */}
      {newBadge && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 animate-bounce">
          <CardHeader className="text-center">
            <div
              className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4 animate-spin"
              style={{ animationDuration: "2s" }}
            >
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-xl text-yellow-800 dark:text-yellow-200">New Badge Earned!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl mb-2 animate-bounce">{newBadge.icon}</div>
            <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">{newBadge.name}</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">{newBadge.description}</div>
          </CardContent>
        </Card>
      )}

      {/* Day Progress with celebration for completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Day {dayNumber} Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Activities Completed</span>
              <Badge variant={isDayComplete ? "default" : "secondary"}>{activitiesCompleted}/3</Badge>
            </div>

            {isDayComplete ? (
              <div className="text-center p-4 bg-primary/10 rounded-lg animate-pulse border-2 border-primary/30">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                <div className="font-medium text-primary">Day {dayNumber} Complete!</div>
                <div className="text-sm text-muted-foreground">You've mastered all activities for today</div>
                <div className="mt-2 text-lg">🎊 Congratulations! 🎊</div>
              </div>
            ) : (
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  {3 - activitiesCompleted} more {3 - activitiesCompleted === 1 ? "activity" : "activities"} to complete
                  Day {dayNumber}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Actions with enhanced styling */}
      <div className="flex gap-4">
        {!isDayComplete && onNext && (
          <Button onClick={onNext} className="flex-1 transform transition-all duration-200 hover:scale-105">
            Next Activity
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}

        {isDayComplete && dayNumber < 4 && (
          <Link href={`/day/${dayNumber + 1}`} className="flex-1">
            <Button className="w-full transform transition-all duration-200 hover:scale-105">
              Start Day {dayNumber + 1}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}

        <Link href={`/day/${dayNumber}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full bg-transparent transform transition-all duration-200 hover:scale-105"
          >
            Back to Day {dayNumber}
          </Button>
        </Link>
      </div>
    </div>
  )
}
