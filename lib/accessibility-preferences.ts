"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AccessibilityPreferences {
  // Typography
  fontSize: "small" | "medium" | "large" | "extra-large"
  fontFamily: "opendyslexic" | "atkinson" | "system"
  lineHeight: "normal" | "relaxed" | "loose"
  letterSpacing: "normal" | "wide" | "wider"

  // Visual
  highContrast: boolean
  reducedMotion: boolean
  colorBlindnessFilter: "none" | "protanopia" | "deuteranopia" | "tritanopia"

  // Interaction
  largeClickTargets: boolean
  keyboardNavigation: boolean
  screenReaderOptimized: boolean

  // Cognitive
  simplifiedUI: boolean
  showProgressIndicators: boolean
  extendedTimeouts: boolean
}

interface AccessibilityStore {
  preferences: AccessibilityPreferences
  updatePreference: <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => void
  resetPreferences: () => void
  applyPreferences: () => void
}

const defaultPreferences: AccessibilityPreferences = {
  fontSize: "medium",
  fontFamily: "opendyslexic",
  lineHeight: "normal",
  letterSpacing: "normal",
  highContrast: false,
  reducedMotion: false,
  colorBlindnessFilter: "none",
  largeClickTargets: false,
  keyboardNavigation: true,
  screenReaderOptimized: false,
  simplifiedUI: false,
  showProgressIndicators: true,
  extendedTimeouts: false,
}

export const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,

      updatePreference: (key, value) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        }))

        // Apply changes immediately
        setTimeout(() => get().applyPreferences(), 0)
      },

      resetPreferences: () => {
        set({ preferences: defaultPreferences })
        setTimeout(() => get().applyPreferences(), 0)
      },

      applyPreferences: () => {
        const { preferences } = get()
        const root = document.documentElement

        // Apply font size
        const fontSizeMap = {
          small: "14px",
          medium: "16px",
          large: "18px",
          "extra-large": "20px",
        }
        root.style.setProperty("--base-font-size", fontSizeMap[preferences.fontSize])

        // Apply font family
        const fontFamilyMap = {
          opendyslexic: "OpenDyslexic, var(--font-atkinson), system-ui, sans-serif",
          atkinson: "var(--font-atkinson), OpenDyslexic, system-ui, sans-serif",
          system: "system-ui, -apple-system, sans-serif",
        }
        root.style.setProperty("--font-family", fontFamilyMap[preferences.fontFamily])

        // Apply line height
        const lineHeightMap = {
          normal: "1.5",
          relaxed: "1.6",
          loose: "1.8",
        }
        root.style.setProperty("--line-height", lineHeightMap[preferences.lineHeight])

        // Apply letter spacing
        const letterSpacingMap = {
          normal: "0.02em",
          wide: "0.05em",
          wider: "0.1em",
        }
        root.style.setProperty("--letter-spacing", letterSpacingMap[preferences.letterSpacing])

        // Apply high contrast
        if (preferences.highContrast) {
          root.classList.add("high-contrast")
        } else {
          root.classList.remove("high-contrast")
        }

        // Apply reduced motion
        if (preferences.reducedMotion) {
          root.classList.add("reduce-motion")
        } else {
          root.classList.remove("reduce-motion")
        }

        // Apply color blindness filter
        if (preferences.colorBlindnessFilter !== "none") {
          root.classList.add(`filter-${preferences.colorBlindnessFilter}`)
        } else {
          root.classList.remove("filter-protanopia", "filter-deuteranopia", "filter-tritanopia")
        }

        // Apply large click targets
        if (preferences.largeClickTargets) {
          root.classList.add("large-targets")
        } else {
          root.classList.remove("large-targets")
        }

        // Apply simplified UI
        if (preferences.simplifiedUI) {
          root.classList.add("simplified-ui")
        } else {
          root.classList.remove("simplified-ui")
        }

        // Apply screen reader optimizations
        if (preferences.screenReaderOptimized) {
          root.classList.add("screen-reader-optimized")
        } else {
          root.classList.remove("screen-reader-optimized")
        }
      },
    }),
    {
      name: "accessibility-preferences",
      onRehydrateStorage: () => (state) => {
        // Apply preferences after hydration
        if (state) {
          setTimeout(() => state.applyPreferences(), 100)
        }
      },
    },
  ),
)
