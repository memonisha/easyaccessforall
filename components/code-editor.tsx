"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Play,
  RotateCcw,
  Eye,
  Volume2,
  TestTube,
  MousePointer,
} from "lucide-react"
import { CelebrationPopup } from "@/components/celebration-popup"
import { useProgressStore } from "@/lib/progress-store"
import { useRouter } from "next/navigation"

interface TestResult {
  passed: boolean
  message: string
  details?: string[]
  screenReaderText?: string
}

interface CodeEditorProps {
  initialCode: string
  solution: string
  hints: string[]
  testDescription: string
  dayNumber: number
  activityId: string
  activityTitle: string
  activityType?:
    | "alt-text"
    | "heading"
    | "contrast"
    | "tab-order"
    | "focus"
    | "skip-link"
    | "aria-label"
    | "form-label"
    | "live-region"
    | "responsive"
    | "motion"
    | "captions"
}

export function CodeEditor({
  initialCode,
  solution,
  hints,
  testDescription,
  dayNumber,
  activityId,
  activityTitle,
  activityType = "alt-text",
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [testResult, setTestResult] = useState<"idle" | "testing" | "passed" | "failed">("idle")
  const [testDetails, setTestDetails] = useState<TestResult | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [lineNumbers, setLineNumbers] = useState<number[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)

  const { completeActivity, progress } = useProgressStore()
  const router = useRouter()

  useEffect(() => {
    const lines = code.split("\n").map((_, index) => index + 1)
    setLineNumbers(lines)
  }, [code])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const runAccessibilityTest = (code: string, type: string): TestResult => {
    switch (type) {
      case "alt-text":
        const hasEmptyAlt = code.includes('alt=""')
        const hasAltAttribute = code.includes('alt="')
        const altTexts = code.match(/alt="([^"]*)"/g) || []
        const meaningfulAlts = altTexts.filter(
          (alt) =>
            alt !== 'alt=""' &&
            alt.length > 8 &&
            !alt.toLowerCase().includes("image") &&
            !alt.toLowerCase().includes("picture"),
        )

        if (hasEmptyAlt) {
          return {
            passed: false,
            message: "Some images still have empty alt attributes",
            details: ['Empty alt="" found - add descriptive text'],
            screenReaderText: "Image, no description available",
          }
        }

        if (!hasAltAttribute) {
          return {
            passed: false,
            message: "Images need alt attributes for screen readers",
            details: ['Add alt="description" to all img tags'],
            screenReaderText: "Image, no description available",
          }
        }

        if (meaningfulAlts.length < altTexts.length) {
          return {
            passed: false,
            message: "Alt text should be more descriptive",
            details: ["Avoid generic words like 'image' or 'picture'", "Describe what you see in the image"],
            screenReaderText: "Image, generic description",
          }
        }

        const firstAltMatch = meaningfulAlts[0]?.match(/alt="([^"]*)"/)
        const userAltText = firstAltMatch ? firstAltMatch[1] : "Golden sunset over calm lake with silhouetted mountains"

        return {
          passed: true,
          message: "Perfect! All images have descriptive alt text",
          details: [`Found ${meaningfulAlts.length} well-described images`],
          screenReaderText: userAltText,
        }

      case "heading":
        const headings = code.match(/<h[1-6][^>]*>/g) || []
        const h1Count = (code.match(/<h1[^>]*>/g) || []).length

        // Check if there are multiple h1s
        if (h1Count > 1) {
          return {
            passed: false,
            message: "Page should have only one h1 element",
            details: ["Use h1 for main title, h2-h6 for subsections"],
            screenReaderText: "Multiple main headings found - confusing for navigation",
          }
        }

        // Check if h1 exists
        if (h1Count === 0) {
          return {
            passed: false,
            message: "Page needs an h1 element for the main title",
            details: ["Add an h1 tag for the main page title"],
            screenReaderText: "No main heading found",
          }
        }

        // Check for proper heading order (no skipping levels)
        const headingLevels = headings.map((h) => Number.parseInt(h.match(/<h([1-6])/)?.[1] || "1"))
        let hasSkippedLevel = false

        for (let i = 1; i < headingLevels.length; i++) {
          const current = headingLevels[i]
          const previous = headingLevels[i - 1]

          // If current level is more than 1 level deeper than previous, it's a skip
          if (current > previous + 1) {
            hasSkippedLevel = true
            break
          }
        }

        if (hasSkippedLevel) {
          return {
            passed: false,
            message: "Heading levels should not skip (e.g., h1 → h3)",
            details: ["Use sequential heading levels: h1 → h2 → h3", "Don't skip from h1 directly to h3"],
            screenReaderText: "Heading structure is confusing - levels are skipped",
          }
        }

        return {
          passed: true,
          message: "Great! Heading structure is logical and accessible",
          details: [`Found ${headings.length} properly structured headings`],
          screenReaderText:
            "Heading structure: " +
            headings.map((h) => h.match(/<h([1-6])[^>]*>([^<]*)</)?.[2] || "heading").join(", "),
        }

      case "contrast":
        const extractColorsFromCode = (code: string) => {
          const colors: { foreground?: string; background?: string } = {}

          // Extract color properties from CSS
          const colorMatches = code.match(/color\s*:\s*([^;]+)/gi) || []
          const backgroundMatches = code.match(/background(?:-color)?\s*:\s*([^;]+)/gi) || []

          // Get the first color value found
          if (colorMatches.length > 0) {
            const colorValue = colorMatches[0].split(":")[1].trim().replace(/['"]/g, "")
            colors.foreground = colorValue
          }

          if (backgroundMatches.length > 0) {
            const bgValue = backgroundMatches[0].split(":")[1].trim().replace(/['"]/g, "")
            colors.background = bgValue
          }

          // Convert named colors to hex
          const namedColors: Record<string, string> = {
            black: "#000000",
            white: "#ffffff",
            red: "#ff0000",
            green: "#008000",
            blue: "#0000ff",
            yellow: "#ffff00",
            gray: "#808080",
            grey: "#808080",
            lightgray: "#d3d3d3",
            lightgrey: "#d3d3d3",
            darkgray: "#a9a9a9",
            darkgrey: "#a9a9a9",
          }

          if (colors.foreground && namedColors[colors.foreground.toLowerCase()]) {
            colors.foreground = namedColors[colors.foreground.toLowerCase()]
          }

          if (colors.background && namedColors[colors.background.toLowerCase()]) {
            colors.background = namedColors[colors.background.toLowerCase()]
          }

          return colors
        }

        const extractedColors = extractColorsFromCode(code)

        // Use default values if no colors found in code
        const foregroundColor = extractedColors.foreground || "#000000"
        const backgroundColorValue = extractedColors.background || "#ffffff"

        // Import and use the actual contrast calculation function
        const calculateContrast = (color1: string, color2: string) => {
          const getLuminance = (color: string): number => {
            // Handle hex colors
            let hex = color.replace("#", "")
            if (hex.length === 3) {
              hex = hex
                .split("")
                .map((char) => char + char)
                .join("")
            }

            const r = Number.parseInt(hex.substr(0, 2), 16) / 255
            const g = Number.parseInt(hex.substr(2, 2), 16) / 255
            const b = Number.parseInt(hex.substr(4, 2), 16) / 255

            const sRGB = [r, g, b].map((c) => {
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
            })

            return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
          }

          const lum1 = getLuminance(color1)
          const lum2 = getLuminance(color2)
          const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)

          return Math.round(ratio * 100) / 100
        }

        const contrastRatio = calculateContrast(foregroundColor, backgroundColorValue)

        let level = "FAIL"
        if (contrastRatio >= 7) level = "AAA"
        else if (contrastRatio >= 4.5) level = "AA"
        else if (contrastRatio >= 3) level = "A"

        const passes = contrastRatio >= 4.5
        const message = passes
          ? `Contrast ratio: ${contrastRatio}:1 - Passes WCAG ${level} standards`
          : `Contrast ratio: ${contrastRatio}:1 - Fails WCAG standards. Use darker colors.`

        return {
          passed: passes,
          message: message,
          details: [],
        }

      case "tab-order":
        const tabindexMatches = code.match(/tabindex="(\d+)"/g) || []
        const tabindexValues = tabindexMatches.map((match) =>
          Number.parseInt(match.match(/tabindex="(\d+)"/)?.[1] || "0"),
        )

        // Check if tabindex values are sequential starting from 1
        const expectedSequence = Array.from({ length: tabindexValues.length }, (_, i) => i + 1)
        const isSequential = JSON.stringify(tabindexValues.sort((a, b) => a - b)) === JSON.stringify(expectedSequence)

        if (!isSequential) {
          return {
            passed: false,
            message: "Tab order should be sequential (1, 2, 3, 4...)",
            details: ["Use tabindex values in logical order", "Start with tabindex='1' for first element"],
            screenReaderText: "Tab order is confusing",
          }
        }

        return {
          passed: true,
          message: "Perfect! Tab order follows logical sequence",
          details: [`Found ${tabindexValues.length} elements with proper tab order`],
          screenReaderText: "Tab navigation flows logically through the form",
        }

      case "focus":
        const hasFocusStyles = code.includes(":focus") && (code.includes("outline") || code.includes("border"))

        if (!hasFocusStyles) {
          return {
            passed: false,
            message: "Missing visible focus indicators",
            details: ["Add :focus styles with outline or border", "Ensure focus indicators are visible"],
            screenReaderText: "No visible focus indicators",
          }
        }

        return {
          passed: true,
          message: "Great! Focus indicators are clearly visible",
          details: ["Focus styles will help keyboard users navigate"],
          screenReaderText: "Clear focus indicators present",
        }

      case "skip-link":
        const hasSkipLink = code.includes('href="#main-content"') || code.includes('href="#main"')
        const hasMainContent = code.includes('id="main-content"') || code.includes('id="main"')

        if (!hasSkipLink) {
          return {
            passed: false,
            message: "Missing skip navigation link",
            details: ["Add a skip link at the beginning", "Use href='#main-content' to link to main content"],
            screenReaderText: "No skip link available",
          }
        }

        if (!hasMainContent) {
          return {
            passed: false,
            message: "Skip link target not found",
            details: ["Add id='main-content' to the main content area", "Ensure skip link has a valid target"],
            screenReaderText: "Skip link target missing",
          }
        }

        return {
          passed: true,
          message: "Excellent! Skip link is properly implemented",
          details: ["Keyboard users can now skip to main content"],
          screenReaderText: "Skip to main content link available",
        }

      case "aria-label":
        const hasAriaLabels = code.includes("aria-label=")
        const ariaLabels = code.match(/aria-label="([^"]*)"/g) || []
        const meaningfulLabels = ariaLabels.filter((label) => label.length > 15 && !label.includes('aria-label=""'))

        if (!hasAriaLabels) {
          return {
            passed: false,
            message: "Missing aria-label attributes",
            details: ["Add aria-label to icon buttons", "Describe what each button does"],
            screenReaderText: "Button with no description",
          }
        }

        if (meaningfulLabels.length < ariaLabels.length) {
          return {
            passed: false,
            message: "Aria labels should be more descriptive",
            details: ["Describe the action, not just the icon", "Use clear, concise descriptions"],
            screenReaderText: "Button with unclear description",
          }
        }

        return {
          passed: true,
          message: "Perfect! All buttons have clear aria-labels",
          details: [`Found ${meaningfulLabels.length} well-labeled buttons`],
          screenReaderText: meaningfulLabels[0]?.match(/aria-label="([^"]*)"/)?.[1] || "Button with clear description",
        }

      case "form-label":
        const hasForAttributes = code.includes("for=")
        const hasIdAttributes = code.includes("id=")
        const forMatches = code.match(/for="([^"]*)"/g) || []
        const idMatches = code.match(/id="([^"]*)"/g) || []

        if (!hasForAttributes || !hasIdAttributes) {
          return {
            passed: false,
            message: "Labels not properly connected to inputs",
            details: ["Use 'for' attribute on labels", "Add matching 'id' attribute on inputs"],
            screenReaderText: "Form field with no label",
          }
        }

        const forValues = forMatches.map((match) => match.match(/for="([^"]*)"/)?.[1])
        const idValues = idMatches.map((match) => match.match(/id="([^"]*)"/)?.[1])
        const allMatched = forValues.every((forVal) => idValues.includes(forVal))

        if (!allMatched) {
          return {
            passed: false,
            message: "Some labels don't match their inputs",
            details: ["Ensure each 'for' attribute matches an 'id'", "Check spelling and case sensitivity"],
            screenReaderText: "Form field with mismatched label",
          }
        }

        return {
          passed: true,
          message: "Excellent! All form labels are properly connected",
          details: [`Found ${forMatches.length} properly labeled form fields`],
          screenReaderText: "Form field with proper label connection",
        }

      case "live-region":
        const hasAriaLive = code.includes("aria-live=")

        if (!hasAriaLive) {
          return {
            passed: false,
            message: "Missing aria-live attribute for status updates",
            details: ["Add aria-live='polite' to status messages", "This announces changes to screen readers"],
            screenReaderText: "Status update not announced",
          }
        }

        return {
          passed: true,
          message: "Great! Status messages will be announced",
          details: ["Screen readers will announce status changes"],
          screenReaderText: "Status update will be announced",
        }

      case "responsive":
        const hasMaxWidth = code.includes("max-width") || code.includes("max-w-")
        const hasRelativeUnits = code.includes("rem") || code.includes("em") || code.includes("%")
        const hasFixedWidth = code.includes("width: 300px") && !code.includes("max-width")

        if (hasFixedWidth) {
          return {
            passed: false,
            message: "Fixed width prevents proper scaling",
            details: ["Use max-width instead of width", "Allow content to scale with zoom"],
            screenReaderText: "Content may be cut off when zoomed",
          }
        }

        if (!hasMaxWidth || !hasRelativeUnits) {
          return {
            passed: false,
            message: "Layout needs to be more flexible for zoom",
            details: ["Use max-width for containers", "Use relative units like rem or em"],
            screenReaderText: "Layout may not work well when zoomed",
          }
        }

        return {
          passed: true,
          message: "Perfect! Layout supports high zoom levels",
          details: ["Content will remain accessible when zoomed to 200%"],
          screenReaderText: "Layout works well at high zoom levels",
        }

      case "motion":
        const hasReducedMotion = code.includes("prefers-reduced-motion")

        if (!hasReducedMotion) {
          return {
            passed: false,
            message: "Missing reduced motion support",
            details: ["Add @media (prefers-reduced-motion: reduce)", "Disable animations for sensitive users"],
            screenReaderText: "Animations may cause discomfort",
          }
        }

        return {
          passed: true,
          message: "Excellent! Respects user motion preferences",
          details: ["Animations will be disabled for sensitive users"],
          screenReaderText: "Motion preferences respected",
        }

      case "captions":
        const hasTrackElement = code.includes("<track")
        const hasCaptions = code.includes('kind="captions"')
        const hasTranscript = code.includes("transcript")

        if (!hasTrackElement || !hasCaptions) {
          return {
            passed: false,
            message: "Missing video captions",
            details: ["Add <track> element with kind='captions'", "Provide captions for video content"],
            screenReaderText: "Video has no captions",
          }
        }

        if (!hasTranscript) {
          return {
            passed: false,
            message: "Consider adding transcript link",
            details: ["Provide a link to full transcript", "Transcripts help users who can't use video"],
            screenReaderText: "Video has captions but no transcript",
          }
        }

        return {
          passed: true,
          message: "Perfect! Video is fully accessible",
          details: ["Captions and transcript provide multiple access methods"],
          screenReaderText: "Video has captions and transcript available",
        }

      default:
        return {
          passed: code.includes('alt="') && !code.includes('alt=""'),
          message: code.includes('alt="') ? "Test passed!" : "Test failed - check your code",
          details: [],
        }
    }
  }

  const handleTest = () => {
    setTestResult("testing")

    setTimeout(() => {
      const result = runAccessibilityTest(code, activityType)
      setTestDetails(result)
      setTestResult(result.passed ? "passed" : "failed")
    }, 1500)
  }

  const handleHint = () => {
    setShowHint(true)
    if (currentHint < hints.length - 1) {
      setCurrentHint(currentHint + 1)
    }
    setHintsUsed((prev) => prev + 1)
  }

  const handleReset = () => {
    setCode(initialCode)
    setTestResult("idle")
    setTestDetails(null)
    setShowHint(false)
    setCurrentHint(0)
  }

  const handlePreview = () => {
    setShowPreview(!showPreview)
  }

  const handleScreenReaderTest = () => {
    if (testDetails?.screenReaderText) {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(testDetails.screenReaderText)
        utterance.rate = 0.8
        utterance.pitch = 1
        window.speechSynthesis.speak(utterance)
      } else {
        alert(`Screen Reader announces: "${testDetails.screenReaderText}"`)
      }
    } else {
      const result = runAccessibilityTest(code, activityType)
      if (result.screenReaderText) {
        if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(result.screenReaderText)
          utterance.rate = 0.8
          utterance.pitch = 1
          window.speechSynthesis.speak(utterance)
        } else {
          alert(`Screen Reader announces: "${result.screenReaderText}"`)
        }
      }
    }
  }

  const handleSubmit = () => {
    if (testResult === "passed") {
      setShowCelebration(true)
    } else {
      alert("Please run the test and ensure it passes before submitting your solution.")
    }
  }

  const getNextActivityUrl = () => {
    const activities = ["alt-text-adventure", "heading-hierarchy-quest", "color-contrast-champion"]

    const currentIndex = activities.indexOf(activityId)
    if (currentIndex < activities.length - 1) {
      return `/day/${dayNumber}/activity/${activities[currentIndex + 1]}`
    }
    return null
  }

  const getNextDayUrl = () => {
    if (dayNumber < 4) {
      return `/day/${dayNumber + 1}`
    }
    return null
  }

  const isDayComplete = () => {
    const dayData = progress.days[dayNumber]
    return dayData?.completed || false
  }

  const getNewBadge = () => {
    const newBadge = progress.badges.find((b) => b.earnedAt && new Date(b.earnedAt).getTime() > Date.now() - 5000)
    return newBadge
  }

  const handleCelebrationClose = () => {
    setShowCelebration(false)

    const nextActivityUrl = getNextActivityUrl()
    const nextDayUrl = getNextDayUrl()
    const dayComplete = isDayComplete()

    setTimeout(() => {
      if (nextActivityUrl && !dayComplete) {
        router.push(nextActivityUrl)
      } else if (dayComplete && nextDayUrl) {
        router.push(nextDayUrl)
      } else {
        router.push(`/day/${dayNumber}`)
      }
    }, 1000)
  }

  const getTestingButtons = () => {
    switch (activityType) {
      case "alt-text":
        return (
          <Button variant="outline" onClick={handleScreenReaderTest} className="flex-1 bg-transparent">
            <Volume2 className="w-4 h-4 mr-2" />
            Test with Screen Reader
          </Button>
        )

      case "heading":
        return (
          <Button variant="outline" onClick={handleHeadingNavigation} className="flex-1 bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            Test Heading Navigation
          </Button>
        )

      case "contrast":
        return (
          <Button variant="outline" onClick={handleContrastCheck} className="flex-1 bg-transparent">
            <TestTube className="w-4 h-4 mr-2" />
            Check Color Contrast
          </Button>
        )

      case "tab-order":
      case "focus":
      case "skip-link":
        return (
          <Button variant="outline" onClick={handleKeyboardTest} className="flex-1 bg-transparent">
            <MousePointer className="w-4 h-4 mr-2" />
            Test Keyboard Navigation
          </Button>
        )

      case "aria-label":
      case "form-label":
      case "live-region":
        return (
          <Button variant="outline" onClick={handleScreenReaderTest} className="flex-1 bg-transparent">
            <Volume2 className="w-4 h-4 mr-2" />
            Test with Screen Reader
          </Button>
        )

      case "responsive":
        return (
          <Button variant="outline" onClick={handleZoomTest} className="flex-1 bg-transparent">
            <Eye className="w-4 h-4 mr-2" />
            Test 200% Zoom
          </Button>
        )

      case "motion":
        return (
          <Button variant="outline" onClick={handleMotionTest} className="flex-1 bg-transparent">
            <Play className="w-4 h-4 mr-2" />
            Test Reduced Motion
          </Button>
        )

      case "captions":
        return (
          <Button variant="outline" onClick={handleCaptionTest} className="flex-1 bg-transparent">
            <Volume2 className="w-4 h-4 mr-2" />
            Test Video Accessibility
          </Button>
        )

      default:
        return (
          <Button variant="outline" onClick={handleScreenReaderTest} className="flex-1 bg-transparent">
            <Volume2 className="w-4 h-4 mr-2" />
            Test with Screen Reader
          </Button>
        )
    }
  }

  const handleHeadingNavigation = () => {
    const headings = code.match(/<h[1-6][^>]*>([^<]*)<\/h[1-6]>/g) || []
    const headingStructure = headings
      .map((h) => {
        const level = h.match(/<h([1-6])/)?.[1]
        const text = h.match(/>([^<]*)</)?.[1]
        return `Heading level ${level}: ${text}`
      })
      .join(", ")

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`Heading navigation: ${headingStructure}`)
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    } else {
      alert(`Heading Navigation: ${headingStructure}`)
    }
  }

  const handleContrastCheck = () => {
    // Simple contrast check simulation
    const extractColorsFromCode = (code: string) => {
      const colors: { foreground?: string; background?: string } = {}

      // Extract color properties from CSS
      const colorMatches = code.match(/color\s*:\s*([^;]+)/gi) || []
      const backgroundMatches = code.match(/background(?:-color)?\s*:\s*([^;]+)/gi) || []

      // Get the first color value found
      if (colorMatches.length > 0) {
        const colorValue = colorMatches[0].split(":")[1].trim().replace(/['"]/g, "")
        colors.foreground = colorValue
      }

      if (backgroundMatches.length > 0) {
        const bgValue = backgroundMatches[0].split(":")[1].trim().replace(/['"]/g, "")
        colors.background = bgValue
      }

      // Convert named colors to hex
      const namedColors: Record<string, string> = {
        black: "#000000",
        white: "#ffffff",
        red: "#ff0000",
        green: "#008000",
        blue: "#0000ff",
        yellow: "#ffff00",
        gray: "#808080",
        grey: "#808080",
        lightgray: "#d3d3d3",
        lightgrey: "#d3d3d3",
        darkgray: "#a9a9a9",
        darkgrey: "#a9a9a9",
      }

      if (colors.foreground && namedColors[colors.foreground.toLowerCase()]) {
        colors.foreground = namedColors[colors.foreground.toLowerCase()]
      }

      if (colors.background && namedColors[colors.background.toLowerCase()]) {
        colors.background = namedColors[colors.background.toLowerCase()]
      }

      return colors
    }

    const extractedColors = extractColorsFromCode(code)

    // Use default values if no colors found in code
    const foregroundColor = extractedColors.foreground || "#000000"
    const backgroundColorValue = extractedColors.background || "#ffffff"

    // Import and use the actual contrast calculation function
    const calculateContrast = (color1: string, color2: string) => {
      const getLuminance = (color: string): number => {
        // Handle hex colors
        let hex = color.replace("#", "")
        if (hex.length === 3) {
          hex = hex
            .split("")
            .map((char) => char + char)
            .join("")
        }

        const r = Number.parseInt(hex.substr(0, 2), 16) / 255
        const g = Number.parseInt(hex.substr(2, 2), 16) / 255
        const b = Number.parseInt(hex.substr(4, 2), 16) / 255

        const sRGB = [r, g, b].map((c) => {
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        })

        return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
      }

      const lum1 = getLuminance(color1)
      const lum2 = getLuminance(color2)
      const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)

      return Math.round(ratio * 100) / 100
    }

    const contrastRatio = calculateContrast(foregroundColor, backgroundColorValue)

    let level = "FAIL"
    if (contrastRatio >= 7) level = "AAA"
    else if (contrastRatio >= 4.5) level = "AA"
    else if (contrastRatio >= 3) level = "A"

    const passes = contrastRatio >= 4.5
    const message = passes
      ? `Contrast ratio: ${contrastRatio}:1 - Passes WCAG ${level} standards`
      : `Contrast ratio: ${contrastRatio}:1 - Fails WCAG standards. Use darker colors.`

    alert(`Color Contrast Test: ${message}`)
  }

  const handleKeyboardTest = () => {
    const message =
      activityType === "tab-order"
        ? "Tab order test: Press Tab to navigate through elements in logical sequence"
        : activityType === "focus"
          ? "Focus test: Elements should show clear visual indicators when focused"
          : "Skip link test: First Tab press should reveal skip navigation link"

    alert(`Keyboard Navigation: ${message}`)
  }

  const handleZoomTest = () => {
    alert(
      "Zoom Test: Content should remain readable and usable at 200% zoom level. Check for horizontal scrolling and cut-off text.",
    )
  }

  const handleMotionTest = () => {
    alert("Motion Test: Animations should be disabled or reduced when user has motion sensitivity preferences enabled.")
  }

  const handleCaptionTest = () => {
    const hasCaptions = code.includes("<track") && code.includes('kind="captions"')
    const hasTranscript = code.includes("transcript")

    let message = "Video Accessibility Test: "
    if (hasCaptions && hasTranscript) {
      message += "✓ Captions and transcript provided - Fully accessible"
    } else if (hasCaptions) {
      message += "✓ Captions provided, consider adding transcript link"
    } else {
      message += "✗ Missing captions - Add <track> element with captions"
    }

    alert(message)
  }

  return (
    <div className="space-y-4">
      <div className="relative border rounded-lg overflow-hidden bg-card">
        <div className="flex items-center justify-between p-2 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              HTML
            </Badge>
            <span className="text-xs text-muted-foreground">{code.split("\n").length} lines</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePreview}>
              <Eye className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex">
          <div className="bg-muted/30 px-2 py-4 text-xs text-muted-foreground font-mono select-none">
            {lineNumbers.map((num) => (
              <div key={num} className="leading-5">
                {num}
              </div>
            ))}
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm bg-transparent border-none resize-none focus:outline-none leading-5"
            placeholder="Edit your code here..."
            rows={Math.max(8, code.split("\n").length)}
            spellCheck={false}
          />
        </div>
      </div>

      {showPreview && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Live Preview</span>
            </div>
            <div className="border rounded p-4 bg-background">
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <style>
                        body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; }
                        ${code.includes("<style>") ? code.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] || "" : ""}
                      </style>
                    </head>
                    <body>
                      ${code.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")}
                    </body>
                  </html>
                `}
                className="w-full h-48 border-0"
                title="Code Preview"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {testResult !== "idle" && (
        <Card
          className={`border-2 ${
            testResult === "passed"
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : testResult === "failed"
                ? "border-red-500 bg-red-50 dark:bg-red-950"
                : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
          }`}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {testResult === "testing" && (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Testing with {testDescription.toLowerCase()}...</span>
                  </>
                )}
                {testResult === "passed" && (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800 dark:text-green-200">{testDetails?.message}</span>
                  </>
                )}
                {testResult === "failed" && (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-800 dark:text-red-200">{testDetails?.message}</span>
                  </>
                )}
              </div>

              {testDetails?.details && testDetails.details.length > 0 && (
                <div className="ml-7 space-y-1">
                  {testDetails.details.map((detail, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      • {detail}
                    </p>
                  ))}
                </div>
              )}

              {testResult === "passed" && testDetails?.screenReaderText && (
                <div className="ml-7">
                  <Button variant="ghost" size="sm" onClick={handleScreenReaderTest} className="text-xs">
                    <Volume2 className="w-3 h-3 mr-1" />
                    Test with Screen Reader
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {showHint && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Hint {currentHint + 1} of {hints.length}:
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">{hints[currentHint]}</p>

                {currentHint < hints.length - 1 && (
                  <Button variant="ghost" size="sm" onClick={handleHint} className="mt-2 text-xs">
                    Next Hint
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleTest} disabled={testResult === "testing"} className="flex-1 min-w-32">
          <Play className="w-4 h-4 mr-2" />
          {testResult === "testing" ? "Testing..." : "Run Test"}
        </Button>

        <Button
          variant="outline"
          onClick={handleHint}
          disabled={currentHint >= hints.length - 1 && showHint}
          className="flex-1 min-w-32"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          {showHint ? "Next Hint" : "Get Hint"}
        </Button>

        <Button variant="ghost" onClick={handlePreview} className="flex-1 min-w-32">
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? "Hide Preview" : "Preview"}
        </Button>

        <Button
          onClick={handleSubmit}
          className="flex-1 min-w-32"
          variant={testResult === "passed" ? "default" : "secondary"}
        >
          Submit Solution
        </Button>
      </div>

      <div className="flex gap-4">{getTestingButtons()}</div>

      <CelebrationPopup
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        activityTitle={activityTitle}
        dayNumber={dayNumber}
        xpGained={100 + (hintsUsed === 0 ? 50 : 0) + (timeSpent < 120 ? 25 : 0)}
        timeSpent={timeSpent}
        hintsUsed={hintsUsed}
        nextActivityUrl={getNextActivityUrl()}
        nextDayUrl={getNextDayUrl()}
        isDayComplete={isDayComplete()}
        newBadge={getNewBadge()}
      />
    </div>
  )
}
