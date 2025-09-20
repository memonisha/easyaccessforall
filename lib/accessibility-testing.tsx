export interface ContrastResult {
  ratio: number
  level: "AAA" | "AA" | "A" | "FAIL"
  passes: boolean
}

export interface AccessibilityIssue {
  type: "error" | "warning" | "info"
  rule: string
  message: string
  element?: string
  suggestion: string
}

export interface TestResult {
  passed: boolean
  score: number
  issues: AccessibilityIssue[]
  details: Record<string, any>
}

// Color contrast calculation
export function calculateContrast(color1: string, color2: string): ContrastResult {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16) / 255
    const g = Number.parseInt(hex.substr(2, 2), 16) / 255
    const b = Number.parseInt(hex.substr(4, 2), 16) / 255

    // Calculate relative luminance
    const sRGB = [r, g, b].map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)

  let level: ContrastResult["level"] = "FAIL"
  if (ratio >= 7) level = "AAA"
  else if (ratio >= 4.5) level = "AA"
  else if (ratio >= 3) level = "A"

  return {
    ratio: Math.round(ratio * 100) / 100,
    level,
    passes: ratio >= 4.5,
  }
}

// Alt text analysis
export function analyzeAltText(code: string): TestResult {
  const issues: AccessibilityIssue[] = []
  let score = 100

  // Find all img tags
  const imgRegex = /<img[^>]*>/gi
  const images = code.match(imgRegex) || []

  if (images.length === 0) {
    return { passed: true, score: 100, issues: [], details: { imageCount: 0 } }
  }

  images.forEach((img, index) => {
    // Check for alt attribute
    const altMatch = img.match(/alt=["']([^"']*)["']/i)

    if (!altMatch) {
      issues.push({
        type: "error",
        rule: "img-alt",
        message: `Image ${index + 1} is missing alt attribute`,
        element: img,
        suggestion: 'Add alt="descriptive text" to describe the image content',
      })
      score -= 30
    } else {
      const altText = altMatch[1]

      if (altText === "") {
        // Empty alt is okay for decorative images, but warn
        issues.push({
          type: "warning",
          rule: "img-alt-empty",
          message: `Image ${index + 1} has empty alt text`,
          element: img,
          suggestion: "If decorative, empty alt is fine. If meaningful, add description.",
        })
        score -= 5
      } else if (altText.length < 3) {
        issues.push({
          type: "warning",
          rule: "img-alt-short",
          message: `Image ${index + 1} has very short alt text`,
          element: img,
          suggestion: "Provide more descriptive alt text",
        })
        score -= 10
      } else if (altText.toLowerCase().includes("image") || altText.toLowerCase().includes("picture")) {
        issues.push({
          type: "warning",
          rule: "img-alt-redundant",
          message: `Image ${index + 1} alt text contains redundant words`,
          element: img,
          suggestion: 'Remove words like "image" or "picture" from alt text',
        })
        score -= 10
      }
    }
  })

  return {
    passed: issues.filter((i) => i.type === "error").length === 0,
    score: Math.max(0, score),
    issues,
    details: { imageCount: images.length },
  }
}

// Heading structure analysis
export function analyzeHeadingStructure(code: string): TestResult {
  const issues: AccessibilityIssue[] = []
  let score = 100

  const headingRegex = /<h([1-6])[^>]*>([^<]*)<\/h[1-6]>/gi
  const headings: { level: number; text: string; position: number }[] = []

  let match
  while ((match = headingRegex.exec(code)) !== null) {
    headings.push({
      level: Number.parseInt(match[1]),
      text: match[2].trim(),
      position: match.index,
    })
  }

  if (headings.length === 0) {
    issues.push({
      type: "warning",
      rule: "heading-missing",
      message: "No headings found",
      suggestion: "Add headings to structure your content",
    })
    return { passed: true, score: 80, issues, details: { headingCount: 0 } }
  }

  // Check for multiple h1s
  const h1Count = headings.filter((h) => h.level === 1).length
  if (h1Count > 1) {
    issues.push({
      type: "error",
      rule: "heading-h1-multiple",
      message: `Found ${h1Count} h1 elements, should have only one`,
      suggestion: "Use only one h1 per page for the main title",
    })
    score -= 25
  } else if (h1Count === 0) {
    issues.push({
      type: "warning",
      rule: "heading-h1-missing",
      message: "No h1 element found",
      suggestion: "Add an h1 element for the main page title",
    })
    score -= 15
  }

  // Check heading sequence
  for (let i = 1; i < headings.length; i++) {
    const current = headings[i]
    const previous = headings[i - 1]

    if (current.level > previous.level + 1) {
      issues.push({
        type: "warning",
        rule: "heading-skip-level",
        message: `Heading level jumps from h${previous.level} to h${current.level}`,
        suggestion: "Don't skip heading levels (e.g., h2 should follow h1, not h3)",
      })
      score -= 10
    }
  }

  // Check for empty headings
  headings.forEach((heading, index) => {
    if (!heading.text) {
      issues.push({
        type: "error",
        rule: "heading-empty",
        message: `Heading ${index + 1} is empty`,
        suggestion: "Add descriptive text to all headings",
      })
      score -= 15
    }
  })

  return {
    passed: issues.filter((i) => i.type === "error").length === 0,
    score: Math.max(0, score),
    issues,
    details: { headingCount: headings.length, h1Count },
  }
}

// Form accessibility analysis
export function analyzeFormAccessibility(code: string): TestResult {
  const issues: AccessibilityIssue[] = []
  let score = 100

  // Find all input elements
  const inputRegex = /<input[^>]*>/gi
  const inputs = code.match(inputRegex) || []

  // Find all label elements
  const labelRegex = /<label[^>]*>([^<]*)<\/label>/gi
  const labels = code.match(labelRegex) || []

  if (inputs.length === 0) {
    return { passed: true, score: 100, issues: [], details: { inputCount: 0 } }
  }

  inputs.forEach((input, index) => {
    const idMatch = input.match(/id=["']([^"']*)["']/i)
    const typeMatch = input.match(/type=["']([^"']*)["']/i)
    const type = typeMatch ? typeMatch[1] : "text"

    // Skip hidden inputs
    if (type === "hidden") return

    if (!idMatch) {
      issues.push({
        type: "warning",
        rule: "input-id-missing",
        message: `Input ${index + 1} missing id attribute`,
        element: input,
        suggestion: "Add id attribute to associate with label",
      })
      score -= 10
    } else {
      const inputId = idMatch[1]
      const hasAssociatedLabel = labels.some(
        (label) => label.includes(`for="${inputId}"`) || label.includes(`for='${inputId}'`),
      )

      if (!hasAssociatedLabel) {
        issues.push({
          type: "error",
          rule: "input-label-missing",
          message: `Input ${index + 1} has no associated label`,
          element: input,
          suggestion: `Add <label for="${inputId}">Label text</label>`,
        })
        score -= 20
      }
    }

    // Check for placeholder-only labels
    const placeholderMatch = input.match(/placeholder=["']([^"']*)["']/i)
    if (placeholderMatch && !idMatch) {
      issues.push({
        type: "warning",
        rule: "placeholder-label",
        message: `Input ${index + 1} uses placeholder as label`,
        element: input,
        suggestion: "Use proper label element instead of relying on placeholder",
      })
      score -= 15
    }
  })

  return {
    passed: issues.filter((i) => i.type === "error").length === 0,
    score: Math.max(0, score),
    issues,
    details: { inputCount: inputs.length, labelCount: labels.length },
  }
}

// ARIA analysis
export function analyzeARIA(code: string): TestResult {
  const issues: AccessibilityIssue[] = []
  let score = 100

  // Find elements with ARIA attributes
  const ariaRegex = /aria-[\w-]+=/gi
  const ariaAttributes = code.match(ariaRegex) || []

  // Find buttons without text content
  const buttonRegex = /<button[^>]*>([^<]*)<\/button>/gi
  let buttonMatch
  while ((buttonMatch = buttonRegex.exec(code)) !== null) {
    const buttonContent = buttonMatch[1].trim()
    const buttonElement = buttonMatch[0]

    if (!buttonContent) {
      // Check if it has aria-label
      if (!buttonElement.includes("aria-label=")) {
        issues.push({
          type: "error",
          rule: "button-accessible-name",
          message: "Button has no accessible name",
          element: buttonElement,
          suggestion: 'Add aria-label="description" or text content to button',
        })
        score -= 25
      }
    }
  }

  // Check for invalid ARIA attributes
  const validAriaAttributes = [
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "aria-hidden",
    "aria-expanded",
    "aria-live",
    "aria-atomic",
    "aria-relevant",
    "aria-busy",
    "aria-disabled",
    "aria-invalid",
    "aria-required",
  ]

  ariaAttributes.forEach((attr) => {
    const attrName = attr.replace("=", "")
    if (!validAriaAttributes.includes(attrName)) {
      issues.push({
        type: "warning",
        rule: "aria-invalid-attribute",
        message: `Unknown ARIA attribute: ${attrName}`,
        suggestion: "Check ARIA attribute spelling and validity",
      })
      score -= 5
    }
  })

  return {
    passed: issues.filter((i) => i.type === "error").length === 0,
    score: Math.max(0, score),
    issues,
    details: { ariaAttributeCount: ariaAttributes.length },
  }
}

// Comprehensive accessibility test
export function runAccessibilityAudit(code: string): TestResult {
  const altTextResult = analyzeAltText(code)
  const headingResult = analyzeHeadingStructure(code)
  const formResult = analyzeFormAccessibility(code)
  const ariaResult = analyzeARIA(code)

  const allIssues = [...altTextResult.issues, ...headingResult.issues, ...formResult.issues, ...ariaResult.issues]

  const averageScore = Math.round((altTextResult.score + headingResult.score + formResult.score + ariaResult.score) / 4)

  const errorCount = allIssues.filter((i) => i.type === "error").length
  const passed = errorCount === 0

  return {
    passed,
    score: averageScore,
    issues: allIssues,
    details: {
      altText: altTextResult.details,
      headings: headingResult.details,
      forms: formResult.details,
      aria: ariaResult.details,
    },
  }
}
