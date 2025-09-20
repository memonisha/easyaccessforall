"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Type, Eye, MousePointer, Brain, RotateCcw } from "lucide-react"
import { useAccessibilityStore } from "@/lib/accessibility-preferences"

export function AccessibilitySettings() {
  const { preferences, updatePreference, resetPreferences } = useAccessibilityStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        aria-label="Open accessibility settings"
      >
        <Settings className="w-4 h-4" />
        <span className="sr-only">Accessibility Settings</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Accessibility Settings
              </CardTitle>
              <CardDescription>Customize your learning experience for better accessibility and comfort</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="typography" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="typography" className="text-xs">
                    <Type className="w-3 h-3 mr-1" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="visual" className="text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Visual
                  </TabsTrigger>
                  <TabsTrigger value="interaction" className="text-xs">
                    <MousePointer className="w-3 h-3 mr-1" />
                    Controls
                  </TabsTrigger>
                  <TabsTrigger value="cognitive" className="text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    Cognitive
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="typography" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="font-size">Font Size</Label>
                      <Select
                        value={preferences.fontSize}
                        onValueChange={(value: any) => updatePreference("fontSize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (14px)</SelectItem>
                          <SelectItem value="medium">Medium (16px)</SelectItem>
                          <SelectItem value="large">Large (18px)</SelectItem>
                          <SelectItem value="extra-large">Extra Large (20px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="font-family">Font Family</Label>
                      <Select
                        value={preferences.fontFamily}
                        onValueChange={(value: any) => updatePreference("fontFamily", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="atkinson">
                            Atkinson Hyperlegible
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Recommended
                            </Badge>
                          </SelectItem>
                          <SelectItem value="opendyslexic">
                            OpenDyslexic
                            <Badge variant="outline" className="ml-2 text-xs">
                              Dyslexia-friendly
                            </Badge>
                          </SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="line-height">Line Spacing</Label>
                      <Select
                        value={preferences.lineHeight}
                        onValueChange={(value: any) => updatePreference("lineHeight", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal (1.5)</SelectItem>
                          <SelectItem value="relaxed">Relaxed (1.6)</SelectItem>
                          <SelectItem value="loose">Loose (1.8)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="letter-spacing">Letter Spacing</Label>
                      <Select
                        value={preferences.letterSpacing}
                        onValueChange={(value: any) => updatePreference("letterSpacing", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="wide">Wide</SelectItem>
                          <SelectItem value="wider">Wider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="visual" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="high-contrast">High Contrast Mode</Label>
                        <p className="text-sm text-muted-foreground">Increases contrast for better visibility</p>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={preferences.highContrast}
                        onCheckedChange={(checked) => updatePreference("highContrast", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="reduced-motion">Reduce Motion</Label>
                        <p className="text-sm text-muted-foreground">Minimizes animations and transitions</p>
                      </div>
                      <Switch
                        id="reduced-motion"
                        checked={preferences.reducedMotion}
                        onCheckedChange={(checked) => updatePreference("reducedMotion", checked)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="colorblind-filter">Color Vision Filter</Label>
                      <p className="text-sm text-muted-foreground mb-2">Simulate different types of color vision</p>
                      <Select
                        value={preferences.colorBlindnessFilter}
                        onValueChange={(value: any) => updatePreference("colorBlindnessFilter", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Filter</SelectItem>
                          <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                          <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                          <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="interaction" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="large-targets">Large Click Targets</Label>
                        <p className="text-sm text-muted-foreground">Makes buttons and links easier to click</p>
                      </div>
                      <Switch
                        id="large-targets"
                        checked={preferences.largeClickTargets}
                        onCheckedChange={(checked) => updatePreference("largeClickTargets", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="keyboard-nav">Enhanced Keyboard Navigation</Label>
                        <p className="text-sm text-muted-foreground">Improved focus indicators and shortcuts</p>
                      </div>
                      <Switch
                        id="keyboard-nav"
                        checked={preferences.keyboardNavigation}
                        onCheckedChange={(checked) => updatePreference("keyboardNavigation", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="screen-reader">Screen Reader Optimized</Label>
                        <p className="text-sm text-muted-foreground">Enhanced announcements and descriptions</p>
                      </div>
                      <Switch
                        id="screen-reader"
                        checked={preferences.screenReaderOptimized}
                        onCheckedChange={(checked) => updatePreference("screenReaderOptimized", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cognitive" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="simplified-ui">Simplified Interface</Label>
                        <p className="text-sm text-muted-foreground">Reduces visual complexity and distractions</p>
                      </div>
                      <Switch
                        id="simplified-ui"
                        checked={preferences.simplifiedUI}
                        onCheckedChange={(checked) => updatePreference("simplifiedUI", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="progress-indicators">Show Progress Indicators</Label>
                        <p className="text-sm text-muted-foreground">Visual feedback for loading and progress</p>
                      </div>
                      <Switch
                        id="progress-indicators"
                        checked={preferences.showProgressIndicators}
                        onCheckedChange={(checked) => updatePreference("showProgressIndicators", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="extended-timeouts">Extended Timeouts</Label>
                        <p className="text-sm text-muted-foreground">More time for interactions and reading</p>
                      </div>
                      <Switch
                        id="extended-timeouts"
                        checked={preferences.extendedTimeouts}
                        onCheckedChange={(checked) => updatePreference("extendedTimeouts", checked)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-6 border-t">
                <Button onClick={resetPreferences} variant="outline" className="flex-1 bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1">
                  Apply Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
