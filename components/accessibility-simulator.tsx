"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Volume2, Eye, Keyboard, Zap, Palette } from "lucide-react"

interface AccessibilitySimulatorProps {
  code: string
  activityType: string
}

export function AccessibilitySimulator({ code, activityType }: AccessibilitySimulatorProps) {
  const [activeSimulation, setActiveSimulation] = useState<string>("screen-reader")

  const simulateScreenReader = () => {
    const altTexts = code.match(/alt="([^"]*)"/g) || []
    const headings = code.match(/<h[1-6][^>]*>([^<]*)<\/h[1-6]>/g) || []

    return {
      images: altTexts.map((alt) => alt.replace(/alt="([^"]*)"/, "$1")),
      headings: headings.map((h) => h.replace(/<h[1-6][^>]*>([^<]*)<\/h[1-6]>/, "$1")),
      navigation: "Main navigation, 4 items",
    }
  }

  const simulateKeyboardNav = () => {
    const focusableElements = [
      "Skip to main content link",
      "Navigation menu",
      "Search input",
      "Submit button",
      "Footer links",
    ]
    return focusableElements
  }

  const simulateColorBlindness = () => {
    return {
      protanopia: "Red-green colorblind simulation",
      deuteranopia: "Green-red colorblind simulation",
      tritanopia: "Blue-yellow colorblind simulation",
    }
  }

  const screenReaderOutput = simulateScreenReader()
  const keyboardFlow = simulateKeyboardNav()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Accessibility Simulator
        </CardTitle>
        <CardDescription>Test how your code works with assistive technologies</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSimulation} onValueChange={setActiveSimulation}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="screen-reader" className="text-xs">
              <Volume2 className="w-3 h-3 mr-1" />
              Screen Reader
            </TabsTrigger>
            <TabsTrigger value="keyboard" className="text-xs">
              <Keyboard className="w-3 h-3 mr-1" />
              Keyboard
            </TabsTrigger>
            <TabsTrigger value="vision" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Low Vision
            </TabsTrigger>
            <TabsTrigger value="color" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Color Blind
            </TabsTrigger>
          </TabsList>

          <TabsContent value="screen-reader" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Screen Reader Output:</h4>
              <div className="space-y-2 text-sm">
                {screenReaderOutput.images.length > 0 && (
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">
                      Images
                    </Badge>
                    {screenReaderOutput.images.map((alt, i) => (
                      <p key={i} className="text-muted-foreground ml-2">
                        "Image: {alt || "No description available"}"
                      </p>
                    ))}
                  </div>
                )}
                {screenReaderOutput.headings.length > 0 && (
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">
                      Headings
                    </Badge>
                    {screenReaderOutput.headings.map((heading, i) => (
                      <p key={i} className="text-muted-foreground ml-2">
                        "Heading level {i + 1}: {heading}"
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="keyboard" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Tab Order:</h4>
              <div className="space-y-1">
                {keyboardFlow.map((element, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs w-8 justify-center">
                      {i + 1}
                    </Badge>
                    <span className="text-muted-foreground">{element}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vision" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Low Vision Simulation:</h4>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Simulating 200% zoom level...</div>
                <div className="border rounded p-2 text-xs transform scale-150 origin-top-left">
                  <div dangerouslySetInnerHTML={{ __html: code.slice(0, 100) + "..." }} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="color" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Color Vision Simulation:</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <Badge variant="outline" className="mb-1">
                    Protanopia
                  </Badge>
                  <div className="w-full h-8 bg-gradient-to-r from-yellow-400 to-blue-400 rounded"></div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-1">
                    Deuteranopia
                  </Badge>
                  <div className="w-full h-8 bg-gradient-to-r from-yellow-400 to-blue-400 rounded"></div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-1">
                    Tritanopia
                  </Badge>
                  <div className="w-full h-8 bg-gradient-to-r from-red-400 to-green-400 rounded"></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
