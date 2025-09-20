"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Palette, CheckCircle, AlertTriangle } from "lucide-react"
import { calculateContrast, type ContrastResult } from "@/lib/accessibility-testing"

export function ContrastChecker() {
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [result, setResult] = useState<ContrastResult | null>(null)

  const checkContrast = () => {
    const contrastResult = calculateContrast(foregroundColor, backgroundColor)
    setResult(contrastResult)
  }

  const getLevelBadge = (level: ContrastResult["level"]) => {
    const variants = {
      AAA: "default",
      AA: "secondary",
      A: "outline",
      FAIL: "destructive",
    } as const

    return <Badge variant={variants[level]}>{level === "FAIL" ? "Fails WCAG" : `WCAG ${level}`}</Badge>
  }

  const getResultIcon = (passes: boolean) => {
    return passes ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-red-600" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Color Contrast Checker
        </CardTitle>
        <CardDescription>Test color combinations for WCAG compliance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="foreground">Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="foreground"
                type="color"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="background">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="background"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <Button onClick={checkContrast} className="w-full">
          Check Contrast
        </Button>

        {/* Preview */}
        <div className="space-y-3">
          <Label>Preview</Label>
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: backgroundColor,
              color: foregroundColor,
            }}
          >
            <div className="text-lg font-medium mb-2">Sample Heading</div>
            <div className="text-sm">
              This is sample text to demonstrate how the color combination looks. Make sure it's readable for all users.
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <Card className={`border-2 ${result.passes ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                {getResultIcon(result.passes)}
                <span className="font-medium">Contrast Ratio: {result.ratio}:1</span>
                {getLevelBadge(result.level)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Normal Text (4.5:1 required)</span>
                  <span className={result.ratio >= 4.5 ? "text-green-600" : "text-red-600"}>
                    {result.ratio >= 4.5 ? "✓ Pass" : "✗ Fail"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Large Text (3:1 required)</span>
                  <span className={result.ratio >= 3 ? "text-green-600" : "text-red-600"}>
                    {result.ratio >= 3 ? "✓ Pass" : "✗ Fail"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Enhanced (7:1 for AAA)</span>
                  <span className={result.ratio >= 7 ? "text-green-600" : "text-yellow-600"}>
                    {result.ratio >= 7 ? "✓ Pass" : "○ Optional"}
                  </span>
                </div>
              </div>

              {!result.passes && (
                <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-800">
                  <strong>Recommendation:</strong> Increase contrast by using darker text or lighter background colors.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
