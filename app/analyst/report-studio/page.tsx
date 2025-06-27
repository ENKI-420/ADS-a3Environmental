import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReportStudioInterface } from "@/components/analyst/report-studio-interface"
import { IrisProvider } from "@/components/iris-provider"

export const metadata: Metadata = {
  title: "Report Studio | AI-Enhanced Environmental Analysis - A3E",
  description: "Advanced AI-powered report generation studio for environmental consultants. Drag-drop intelligence, automated risk assessment, and real-time KML preview.",
  keywords: "environmental reporting, AI analysis, Phase I ESA, Phase II ESA, report generation, risk assessment, KML mapping",
}

export default function ReportStudioPage() {
  return (
    <IrisProvider>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  🎮 Report Studio
                  <span className="ml-3 text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
                    Layer 9: AI Intelligence
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Drag-Drop Intelligence UI for rapid environmental report composition
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">AI Scene Recognition</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Risk Classification</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Evidence Chain</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm font-medium">KML Preview</span>
                    </div>
                  </div>
                </div>
              </div>

              <ReportStudioInterface />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </IrisProvider>
  )
}