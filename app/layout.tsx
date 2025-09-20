import type React from "react"
import type { Metadata } from "next"
import { Atkinson_Hyperlegible } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { AccessibilitySettings } from "@/components/accessibility-settings"
import "./globals.css"

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-atkinson",
})

export const metadata: Metadata = {
  title: "AccessiQuest - Level up your code, unlock the web for everyone!",
  description: "Gamified web accessibility learning through daily 10-minute exercises for students",
  generator: "v0.app",
  keywords: ["accessibility", "web development", "education", "gamification", "WCAG"],
  authors: [{ name: "AccessiQuest Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=OpenDyslexic:wght@400;700&display=swap" rel="stylesheet" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @font-face {
              font-family: 'OpenDyslexic';
              src: url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/fonts/OpenDyslexic-Regular.woff2') format('woff2'),
                   url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/fonts/OpenDyslexic-Regular.woff') format('woff');
              font-weight: 400;
              font-display: swap;
            }
            @font-face {
              font-family: 'OpenDyslexic';
              src: url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/fonts/OpenDyslexic-Bold.woff2') format('woff2'),
                   url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/fonts/OpenDyslexic-Bold.woff') format('woff');
              font-weight: 700;
              font-display: swap;
            }
          `,
          }}
        />
      </head>
      <body className={`font-sans ${atkinsonHyperlegible.variable} ${GeistMono.variable} antialiased`}>
        <svg className="accessibility-filters" aria-hidden="true">
          <defs>
            <filter id="protanopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.567, 0.433, 0,     0, 0
                        0.558, 0.442, 0,     0, 0
                        0,     0.242, 0.758, 0, 0
                        0,     0,     0,     1, 0"
              />
            </filter>
            <filter id="deuteranopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.625, 0.375, 0,   0, 0
                        0.7,   0.3,   0,   0, 0
                        0,     0.3,   0.7, 0, 0
                        0,     0,     0,   1, 0"
              />
            </filter>
            <filter id="tritanopia-filter">
              <feColorMatrix
                type="matrix"
                values="0.95, 0.05,  0,     0, 0
                        0,    0.433, 0.567, 0, 0
                        0,    0.475, 0.525, 0, 0
                        0,    0,     0,     1, 0"
              />
            </filter>
          </defs>
        </svg>
        {children}
        <AccessibilitySettings />
      </body>
    </html>
  )
}
