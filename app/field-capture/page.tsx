"use client"

import { IrisProvider } from "@/components/iris-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FieldDataCapture } from "@/components/field-data/field-data-capture"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

function ProtectedFieldCapturePage() {
  const { role } = useAuth()

  if (!role) {
    return (
      <div className="container mx-auto px-4 py-32">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock /> Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to use the Field Data Capture tool.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <FieldDataCapture />
      </div>
    </div>
  )
}

export default function FieldCapturePage() {
  return (
    <IrisProvider>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <ProtectedFieldCapturePage />
        <Footer />
      </main>
    </IrisProvider>
  )
}
