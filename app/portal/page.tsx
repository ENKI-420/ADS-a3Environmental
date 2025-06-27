import { IrisProvider } from "@/components/iris-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ClientPortalDashboard } from "@/components/client-portal/dashboard"

export default function PortalPage() {
  return (
    <IrisProvider>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-24">
          <div className="container mx-auto px-4">
            <ClientPortalDashboard />
          </div>
        </div>
        <Footer />
      </main>
    </IrisProvider>
  )
}
