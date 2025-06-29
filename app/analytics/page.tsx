import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { KPIDashboard } from "@/components/analytics/kpi-dashboard"
import { IrisProvider } from "@/components/iris-provider"

export const metadata: Metadata = {
  title: "IRIS MCP SDK Analytics Dashboard | Real-Time Performance Monitoring",
  description: "Experience IRIS MCP SDK's advanced analytics capabilities through real-time performance monitoring, agent coordination tracking, and intelligent system optimization.",
  keywords: "IRIS MCP SDK, analytics, performance monitoring, AI agents, system optimization"
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