import { Metadata } from "next"
import { AINexxusBackground } from "@/components/ai-nexus-background"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Database,
  Eye,
  Cpu,
  Zap,
  Settings,
  BarChart3,
  Sparkles
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AI Nexus - A3E's Pulsating Intelligence Core | 3D Visualization",
  description: "Experience A3E's revolutionary AI intelligence core in stunning 3D. Watch data flow from EPA, NOAA, USGS into our pulsating AI nexus for predictive environmental analytics.",
}

export default function AINexxusPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <AINexxusBackground />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A3E</span>
                </div>
                <div>
                  <h1 className="font-bold text-xl">A3 Environmental</h1>
                  <p className="text-sm text-gray-300">AI Nexus Visualization</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Live Demo
              </Badge>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/ai-features">
                  Explore AI Features
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Left Panel - Information */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-black/40 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-emerald-400" />
                    The Pulsating AI Nexus
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    A living, breathing digital ecosystem where environmental data becomes intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-emerald-400">Real-Time Data Sources</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>EPA Environmental Database</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span>NOAA Weather Intelligence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                        <span>USGS Geological Data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span>IoT Sensor Networks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>State Environmental Data</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-emerald-400">AI Intelligence Beacons</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Predictive Analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span>Compliance Automation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span>Computer Vision</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span>Data Integration</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Technical Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Voxel Count</span>
                      <span className="text-emerald-400 font-mono">2,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Particle Systems</span>
                      <span className="text-emerald-400 font-mono">500</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rendering</span>
                      <span className="text-emerald-400 font-mono">GPU</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Post-Processing</span>
                      <span className="text-emerald-400 font-mono">4 Effects</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Center - 3D Visualization Area */}
            <div className="lg:col-span-2">
              <Card className="bg-black/20 backdrop-blur-sm border-white/20 h-full">
                <CardContent className="p-2 h-full">
                  <div className="rounded-lg overflow-hidden h-full bg-black/30">
                    {/* The 3D background is already rendered as the page background */}
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-4 p-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                          A3E AI Intelligence Core
                        </h2>
                        <p className="text-gray-300 max-w-md">
                          Watch data streams flow from environmental databases into our pulsating AI core,
                          where raw information crystallizes into predictive intelligence.
                        </p>
                        <div className="flex justify-center space-x-2">
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                            <Brain className="h-3 w-3 mr-1" />
                            Live Processing
                          </Badge>
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                            <Database className="h-3 w-3 mr-1" />
                            Real-Time Data
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Controls & Stats */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-black/40 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Live Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Processing Load</span>
                        <span className="text-emerald-400">78%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Data Throughput</span>
                        <span className="text-blue-400">1.2K/s</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>AI Accuracy</span>
                        <span className="text-purple-400">94.7%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{ width: '94.7%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Predictions</span>
                        <span className="text-yellow-400">156</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '89%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-400" />
                    Visualization Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Toggle Camera
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Cpu className="h-4 w-4 mr-2" />
                    Performance Mode
                  </Button>

                  <div className="space-y-2">
                    <label htmlFor="particle-density" className="text-sm text-gray-300">Particle Density</label>
                    <input
                      id="particle-density"
                      type="range"
                      min="50"
                      max="100"
                      defaultValue="80"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      aria-label="Particle Density Control"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="animation-speed" className="text-sm text-gray-300">Animation Speed</label>
                    <input
                      id="animation-speed"
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      defaultValue="1"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      aria-label="Animation Speed Control"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Bottom Panel */}
        <footer className="p-6 bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="text-center space-y-2">
            <p className="text-gray-300">
              This visualization represents A3E's revolutionary AI-powered environmental intelligence platform
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/ai-features">
                  Explore Full AI Suite
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/dashboard">
                  View Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}