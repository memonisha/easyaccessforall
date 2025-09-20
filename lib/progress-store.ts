"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ActivityProgress {
  id: string
  completed: boolean
  completedAt?: Date
  attempts: number
  hintsUsed: number
  timeSpent: number // in seconds
}

export interface DayProgress {
  dayNumber: number
  activities: Record<string, ActivityProgress>
  completed: boolean
  completedAt?: Date
  badgeEarned: boolean
}

export interface UserProgress {
  currentStreak: number
  longestStreak: number
  totalActivitiesCompleted: number
  totalTimeSpent: number
  lastActivityDate?: Date
  days: Record<number, DayProgress>
  badges: Badge[]
  level: number
  xp: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
  category: "daily" | "streak" | "mastery" | "special"
}

interface ProgressStore {
  progress: UserProgress
  completeActivity: (dayNumber: number, activityId: string, timeSpent: number, hintsUsed: number) => void
  addAttempt: (dayNumber: number, activityId: string) => void
  updateStreak: () => void
  earnBadge: (badge: Omit<Badge, "earnedAt">) => void
  getActivityProgress: (dayNumber: number, activityId: string) => ActivityProgress | null
  getDayProgress: (dayNumber: number) => DayProgress | null
  calculateLevel: (xp: number) => number
  getXPForNextLevel: (currentLevel: number) => number
  reset: () => void
}

const initialProgress: UserProgress = {
  currentStreak: 0,
  longestStreak: 0,
  totalActivitiesCompleted: 0,
  totalTimeSpent: 0,
  days: {},
  badges: [],
  level: 1,
  xp: 0,
}

const XP_PER_ACTIVITY = 100
const XP_PER_DAY_COMPLETION = 500
const XP_BONUS_NO_HINTS = 50
const XP_BONUS_FAST_COMPLETION = 25 // if completed in under 2 minutes

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: initialProgress,

      completeActivity: (dayNumber: number, activityId: string, timeSpent: number, hintsUsed: number) => {
        set((state) => {
          const newProgress = { ...state.progress }

          // Initialize day if it doesn't exist
          if (!newProgress.days[dayNumber]) {
            newProgress.days[dayNumber] = {
              dayNumber,
              activities: {},
              completed: false,
              badgeEarned: false,
            }
          }

          // Update activity progress
          const activityProgress: ActivityProgress = {
            id: activityId,
            completed: true,
            completedAt: new Date(),
            attempts: (newProgress.days[dayNumber].activities[activityId]?.attempts || 0) + 1,
            hintsUsed,
            timeSpent,
          }

          newProgress.days[dayNumber].activities[activityId] = activityProgress

          // Calculate XP
          let xpGained = XP_PER_ACTIVITY
          if (hintsUsed === 0) xpGained += XP_BONUS_NO_HINTS
          if (timeSpent < 120) xpGained += XP_BONUS_FAST_COMPLETION

          newProgress.xp += xpGained
          newProgress.totalActivitiesCompleted += 1
          newProgress.totalTimeSpent += timeSpent
          newProgress.lastActivityDate = new Date()

          // Check if day is completed
          const dayActivities = Object.values(newProgress.days[dayNumber].activities)
          const expectedActivitiesCount = 3 // Each day has 3 activities

          if (dayActivities.length === expectedActivitiesCount && dayActivities.every((a) => a.completed)) {
            newProgress.days[dayNumber].completed = true
            newProgress.days[dayNumber].completedAt = new Date()
            newProgress.xp += XP_PER_DAY_COMPLETION

            // Award day completion badge
            if (!newProgress.days[dayNumber].badgeEarned) {
              const dayBadges = {
                1: {
                  id: "visual-hero",
                  name: "Visual Accessibility Hero",
                  description: "Mastered alt text, headings, and color contrast",
                  icon: "👁️",
                },
                2: {
                  id: "keyboard-master",
                  name: "Keyboard Navigation Master",
                  description: "Conquered tab order, focus, and skip links",
                  icon: "⌨️",
                },
                3: {
                  id: "screen-reader-ally",
                  name: "Screen Reader Ally",
                  description: "Implemented ARIA labels and live regions",
                  icon: "🔊",
                },
                4: {
                  id: "universal-champion",
                  name: "Universal Design Champion",
                  description: "Achieved comprehensive accessibility mastery",
                  icon: "🌟",
                },
              }

              const badge = dayBadges[dayNumber as keyof typeof dayBadges]
              if (badge) {
                newProgress.badges.push({
                  ...badge,
                  category: "daily",
                  earnedAt: new Date(),
                })
                newProgress.days[dayNumber].badgeEarned = true
              }
            }
          }

          // Update level
          newProgress.level = get().calculateLevel(newProgress.xp)

          return { progress: newProgress }
        })

        // Update streak after state change
        get().updateStreak()
      },

      addAttempt: (dayNumber: number, activityId: string) => {
        set((state) => {
          const newProgress = { ...state.progress }

          if (!newProgress.days[dayNumber]) {
            newProgress.days[dayNumber] = {
              dayNumber,
              activities: {},
              completed: false,
              badgeEarned: false,
            }
          }

          if (!newProgress.days[dayNumber].activities[activityId]) {
            newProgress.days[dayNumber].activities[activityId] = {
              id: activityId,
              completed: false,
              attempts: 0,
              hintsUsed: 0,
              timeSpent: 0,
            }
          }

          newProgress.days[dayNumber].activities[activityId].attempts += 1

          return { progress: newProgress }
        })
      },

      updateStreak: () => {
        set((state) => {
          const newProgress = { ...state.progress }
          const today = new Date()
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)

          // Check if user completed any activity today
          const completedToday = Object.values(newProgress.days).some((day) => {
            const dayActivities = Object.values(day.activities)
            return dayActivities.some((activity) => {
              if (!activity.completedAt) return false
              const completedDate = new Date(activity.completedAt)
              return completedDate.toDateString() === today.toDateString()
            })
          })

          // Check if user completed any activity yesterday
          const completedYesterday = Object.values(newProgress.days).some((day) => {
            const dayActivities = Object.values(day.activities)
            return dayActivities.some((activity) => {
              if (!activity.completedAt) return false
              const completedDate = new Date(activity.completedAt)
              return completedDate.toDateString() === yesterday.toDateString()
            })
          })

          if (completedToday) {
            if (completedYesterday || newProgress.currentStreak === 0) {
              newProgress.currentStreak += 1
            }
          } else if (newProgress.lastActivityDate) {
            const lastActivity = new Date(newProgress.lastActivityDate)
            const daysSinceLastActivity = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

            if (daysSinceLastActivity > 1) {
              newProgress.currentStreak = 0
            }
          }

          // Update longest streak
          if (newProgress.currentStreak > newProgress.longestStreak) {
            newProgress.longestStreak = newProgress.currentStreak
          }

          // Award streak badges
          const streakMilestones = [3, 7, 14, 30]
          streakMilestones.forEach((milestone) => {
            if (newProgress.currentStreak >= milestone) {
              const existingBadge = newProgress.badges.find((b) => b.id === `streak-${milestone}`)
              if (!existingBadge) {
                newProgress.badges.push({
                  id: `streak-${milestone}`,
                  name: `${milestone} Day Streak`,
                  description: `Completed activities for ${milestone} consecutive days`,
                  icon: "🔥",
                  category: "streak",
                  earnedAt: new Date(),
                })
              }
            }
          })

          return { progress: newProgress }
        })
      },

      earnBadge: (badge: Omit<Badge, "earnedAt">) => {
        set((state) => {
          const existingBadge = state.progress.badges.find((b) => b.id === badge.id)
          if (existingBadge) return state

          const newProgress = { ...state.progress }
          newProgress.badges.push({
            ...badge,
            earnedAt: new Date(),
          })

          return { progress: newProgress }
        })
      },

      getActivityProgress: (dayNumber: number, activityId: string) => {
        const state = get()
        return state.progress.days[dayNumber]?.activities[activityId] || null
      },

      getDayProgress: (dayNumber: number) => {
        const state = get()
        return state.progress.days[dayNumber] || null
      },

      calculateLevel: (xp: number) => {
        // Level formula: each level requires 1000 XP more than the previous
        // Level 1: 0-999 XP, Level 2: 1000-2999 XP, Level 3: 3000-5999 XP, etc.
        return Math.floor(Math.sqrt(xp / 500)) + 1
      },

      getXPForNextLevel: (currentLevel: number) => {
        return Math.pow(currentLevel, 2) * 500
      },

      reset: () => {
        set({ progress: initialProgress })
      },
    }),
    {
      name: "accessiquest-progress",
    },
  ),
)
