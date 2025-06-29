import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/context/auth-context"
import { ErrorBoundary } from "@/components/error-boundary"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { AdvancedCognitiveVectoring } from '@/components/advanced-cognitive-vectoring'
import { LightningNavigation } from '@/components/lightning-navigation'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IRIS MCP SDK - Advanced Cognitive AI Platform",
  description: "Experience next-generation AI with cognitive vectoring overlays, recursive assessment, and adaptive multi-modal orchestration. Industry-first transparent AI that empowers users.",
  keywords: "IRIS MCP SDK, cognitive AI, advanced orchestration, multi-modal AI, adaptive intelligence, cognitive vectoring, recursive assessment",
  authors: [{ name: "IRIS MCP SDK Team" }],
  openGraph: {
    title: "IRIS MCP SDK - Advanced Cognitive AI Platform",
    description: "Revolutionary AI platform with cognitive awareness, adaptive intelligence, and transparent user empowerment",
    url: "https://web-bice-two-75.vercel.app/",
    type: "website"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <Providers>
              {children}
              <EnhancedNavigation />
              <AdvancedCognitiveVectoring />
              <LightningNavigation />
            </Providers>
          </AuthProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  )
}
