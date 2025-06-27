import React from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import MultiModalInterface from "@/components/multimodal-interface"

export default function OrchestrationPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <MultiModalInterface />
      <Footer />
    </div>
  )
}