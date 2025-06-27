import { IrisProvider } from "@/components/iris-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MyDashboard } from "@/components/my-dashboard/dashboard"

export default function DashboardPage() {
  return (
    <IrisProvider>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <MyDashboard />
        <Footer />
      </main>
    </IrisProvider>
  )
}
