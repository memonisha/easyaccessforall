"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TestTube, AlertTriangle, CheckCircle, Info, Eye, Type, MousePointer, Volume2, Zap } from "lucide-react"
import {
  runAccessibilityAudit,
  analyzeAltText,
  analyzeHeadingStructure,
  analyzeFormAccessibility,
  analyzeARIA,
  type TestResult,
  type AccessibilityIssue,
} from "@/lib/accessibility-testing"

interface AccessibilityTestingPanelProps {
  code: string
  onTestComplete?: (result: TestResult) => void
}

export function AccessibilityTestingPanel({ code, onTestComplete }: AccessibilityTestingPanelProps) {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const runTests = async () => {
    setIsRunning(true)

    // Simulate testing delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const result = runAccessibilityAudit(code)
    setTestResult(result)
    setIsRunning(false)

    onTestComplete?.(result)
  }

  const getIssueIcon = (type: AccessibilityIssue["type"]) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 50) return "Needs Work"
    return "Poor"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5 text-primary" />
          Accessibility Testing
        </CardTitle>
        <CardDescription>Comprehensive accessibility analysis of your code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Button */}
        <Button onClick={runTests} disabled={isRunning || !code.trim()} className="w-full">
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Running Tests...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Run Accessibility Audit
            </>
          )}
        </Button>

        {/* Test Results */}
        {testResult && (
          <div className="space-y-4">
            {/* Overall Score */}
            <Card
              className={`border-2 ${testResult.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {testResult.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">{testResult.passed ? "All Tests Passed" : "Issues Found"}</span>
                  </div>
                  <Badge variant={testResult.passed ? "default" : "destructive"}>
                    {getScoreLabel(testResult.score)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Accessibility Score</span>
                    <span className={`font-bold ${getScoreColor(testResult.score)}`}>{testResult.score}/100</span>
                  </div>
                  <Progress value={testResult.score} className="h-2" />
                </div>

                {testResult.issues.length > 0 && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    {testResult.issues.filter((i) => i.type === "error").length} errors,{" "}
                    {testResult.issues.filter((i) => i.type === "warning").length} warnings,{" "}
                    {testResult.issues.filter((i) => i.type === "info").length} info
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="images" className="text-xs">
                  <Type className="w-3 h-3 mr-1" />
                  Images
                </TabsTrigger>
                <TabsTrigger value="structure" className="text-xs">
                  <MousePointer className="w-3 h-3 mr-1" />
                  Structure
                </TabsTrigger>
                <TabsTrigger value="forms" className="text-xs">
                  <Volume2 className="w-3 h-3 mr-1" />
                  Forms
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3">
                {testResult.issues.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>No accessibility issues found!</p>
                    <p className="text-sm">Your code follows accessibility best practices.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {testResult.issues.slice(0, 5).map((issue, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{issue.message}</div>
                          <div className="text-xs text-muted-foreground mt-1">{issue.suggestion}</div>
                          {issue.element && (
                            <div className="text-xs font-mono bg-muted p-1 rounded mt-1 truncate">{issue.element}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {testResult.issues.length > 5 && (
                      <div className="text-center text-sm text-muted-foreground">
                        And {testResult.issues.length - 5} more issues...
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="images" className="space-y-3">
                {(() => {
                  const altResult = analyzeAltText(code)
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Alt Text Analysis</span>
                        <Badge variant={altResult.passed ? "default" : "destructive"}>{altResult.score}/100</Badge>
                      </div>

                      <div className="text-sm text-muted-foreground">Found {altResult.details.imageCount} images</div>

                      {altResult.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <div className="font-medium text-sm">{issue.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">{issue.suggestion}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </TabsContent>

              <TabsContent value="structure" className="space-y-3">
                {(() => {
                  const headingResult = analyzeHeadingStructure(code)
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Heading Structure</span>
                        <Badge variant={headingResult.passed ? "default" : "destructive"}>
                          {headingResult.score}/100
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Found {headingResult.details.headingCount} headings
                      </div>

                      {headingResult.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <div className="font-medium text-sm">{issue.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">{issue.suggestion}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </TabsContent>

              <TabsContent value="forms" className="space-y-3">
                {(() => {
                  const formResult = analyzeFormAccessibility(code)
                  const ariaResult = analyzeARIA(code)
                  return (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Form Accessibility</span>
                          <Badge variant={formResult.passed ? "default" : "destructive"}>{formResult.score}/100</Badge>
                        </div>

                        <div className="text-sm text-muted-foreground mb-3">
                          Found {formResult.details.inputCount} form inputs
                        </div>

                        {formResult.issues.map((issue, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg mb-2">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{issue.message}</div>
                              <div className="text-xs text-muted-foreground mt-1">{issue.suggestion}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">ARIA Usage</span>
                          <Badge variant={ariaResult.passed ? "default" : "destructive"}>{ariaResult.score}/100</Badge>
                        </div>

                        {ariaResult.issues.map((issue, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg mb-2">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{issue.message}</div>
                              <div className="text-xs text-muted-foreground mt-1">{issue.suggestion}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
