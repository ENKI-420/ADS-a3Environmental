import React from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdvancedIRISOrchestrator } from "@/components/advanced-iris-orchestrator"
import { CognitiveOverlay } from "@/components/cognitive-overlay"
import { EnhancedNavigation } from "@/components/enhanced-navigation"

export default function OrchestrationPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AdvancedIRISOrchestrator />
      <CognitiveOverlay />
      <EnhancedNavigation />
      <Footer />
    </div>
  )
}