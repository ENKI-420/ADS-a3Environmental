"use client"

import { IrisProvider } from "@/components/iris-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContractsDashboard } from "@/components/contracts/contracts-dashboard"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

function ProtectedContractsPage() {
  const { role } = useAuth()

  if (!role || role === "Technician") {
    return (
      <div className="container mx-auto px-4 py-32">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock /> Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {role === "Technician"
                ? "Your role does not have permission to view this page."
                : "Please log in to view the contracts dashboard."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <ContractsDashboard />
      </div>
    </div>
  )
}

export default function ContractsPage() {
  return (
    <IrisProvider>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <ProtectedContractsPage />
        <Footer />
      </main>
    </IrisProvider>
  )
}
