import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { KPIDashboard } from "@/components/analytics/kpi-dashboard"
import { IrisProvider } from "@/components/iris-provider"

export const metadata: Metadata = {
  title: "A3E Analytics Dashboard | Strategic KPI Tracking",
  description: "Real-time analytics and KPI tracking for A3E Environmental Consultants' digital transformation strategy.",
}

export default function AnalyticsPage() {
  return (
    <IrisProvider>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-24">
          <div className="container mx-auto px-4">
            <KPIDashboard />
          </div>
        </div>
        <Footer />
      </main>
    </IrisProvider>
  )
}