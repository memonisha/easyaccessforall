"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Trophy, ArrowRight, Sparkles, X } from "lucide-react"
import Link from "next/link"

interface CelebrationPopupProps {
  isOpen: boolean
  onClose: () => void
  activityTitle: string
  dayNumber: number
  xpGained: number
  timeSpent: number
  hintsUsed: number
  nextActivityUrl?: string
  nextDayUrl?: string
  isDayComplete: boolean
  newBadge?: {
    name: string
    description: string
    icon: string
  }
}

const ConfettiParticle = ({ delay, color }: { delay: number; color: string }) => (
  <div
    className={`absolute w-3 h-3 ${color} rounded-full animate-bounce`}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}ms`,
      animationDuration: `${1000 + Math.random() * 1000}ms`,
    }}
  />
)

export function CelebrationPopup({
  isOpen,
  onClose,
  activityTitle,
  dayNumber,
  xpGained,
  timeSpent,
  hintsUsed,
  nextActivityUrl,
  nextDayUrl,
  isDayComplete,
  newBadge,
}: CelebrationPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Play a cheerful melody
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
      oscillator.frequency.setValueAtTime(1046.5, audioContext.currentTime + 0.3) // C6

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.6)
    } catch (error) {
      console.log("Audio not supported")
    }
  }

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      playSuccessSound()

      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 100}
              color={
                ["bg-yellow-400", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500"][i % 6]
              }
            />
          ))}

          {/* Floating celebration emojis */}
          <div className="absolute top-1/4 left-1/4 text-6xl animate-bounce" style={{ animationDelay: "0s" }}>
            🎉
          </div>
          <div className="absolute top-1/3 right-1/4 text-4xl animate-pulse" style={{ animationDelay: "0.5s" }}>
            ⭐
          </div>
          <div className="absolute bottom-1/3 left-1/3 text-5xl animate-bounce" style={{ animationDelay: "1s" }}>
            🏆
          </div>
          <div className="absolute top-1/2 right-1/3 text-3xl animate-spin" style={{ animationDelay: "1.5s" }}>
            ✨
          </div>
        </div>
      )}

      {/* Main Popup */}
      <Card className="w-full max-w-md mx-auto border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 animate-scale-in shadow-2xl">
        <CardHeader className="text-center relative">
          <Button variant="ghost" size="sm" onClick={onClose} className="absolute right-2 top-2 w-8 h-8 p-0">
            <X className="w-4 h-4" />
          </Button>

          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <CheckCircle className="w-10 h-10 text-green-600 animate-bounce" />
          </div>

          <CardTitle className="text-2xl text-green-800 dark:text-green-200">🎊 Activity Complete! 🎊</CardTitle>

          <p className="text-green-700 dark:text-green-300 text-sm">Amazing work on "{activityTitle}"!</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Performance Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-green-800 dark:text-green-200 animate-bounce">+{xpGained}</div>
              <div className="text-xs text-green-600 dark:text-green-400">XP Earned</div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">{formatTime(timeSpent)}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Time Taken</div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">{hintsUsed}</div>
              <div className="text-xs text-green-600 dark:text-green-400">Hints Used</div>
            </div>
          </div>

          {/* Bonus XP */}
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

          {/* New Badge */}
          {newBadge && (
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg text-center animate-bounce border-2 border-yellow-300 dark:border-yellow-700">
              <div className="text-4xl mb-2">{newBadge.icon}</div>
              <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">New Badge Earned!</div>
              <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{newBadge.name}</div>
              <div className="text-xs text-yellow-700 dark:text-yellow-300">{newBadge.description}</div>
            </div>
          )}

          {/* Day Complete Celebration */}
          {isDayComplete && (
            <div className="text-center p-4 bg-primary/10 rounded-lg animate-pulse border-2 border-primary/30">
              <Trophy className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
              <div className="font-medium text-primary text-lg">Day {dayNumber} Complete!</div>
              <div className="text-sm text-muted-foreground">You've mastered all activities for today</div>
              <div className="mt-2 text-2xl">🎊 Outstanding! 🎊</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {nextActivityUrl && !isDayComplete && (
              <Link href={nextActivityUrl} className="block">
                <Button className="w-full transform transition-all duration-200 hover:scale-105" onClick={onClose}>
                  Next Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}

            {isDayComplete && nextDayUrl && (
              <Link href={nextDayUrl} className="block">
                <Button className="w-full transform transition-all duration-200 hover:scale-105" onClick={onClose}>
                  Start Day {dayNumber + 1}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}

            <Link href={`/day/${dayNumber}`} className="block">
              <Button
                variant="outline"
                className="w-full transform transition-all duration-200 hover:scale-105 bg-transparent"
                onClick={onClose}
              >
                Back to Day {dayNumber}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
