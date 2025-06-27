"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Eye, Map, FileText, Link2, DollarSign, Cloud, Camera, Layers, Zap, Globe, BarChart3, Cpu, Download, PlayCircle } from "lucide-react"

export default function VisualIntelligenceSuite() {
  const [selectedLayer, setSelectedLayer] = useState(1)
  const [demoProgress, setDemoProgress] = useState(0)

  const enhancementLayers = [
    {
      id: 1,
      title: "EXIF Core Extraction Engine",
      version: "Enhanced v2",
      icon: <Camera className="h-6 w-6" />,
      description: "Hardened image metadata pipeline with batch processing, GPS fallback, and integrity validation",
      features: [
        "Batch ingestion & processing",
        "GPS fallback via filename/geocoding",
        "Image integrity validation via SHA-256",
        "Duplicate detection & deduplication",
        "Environmental enrichment (EPA regions)"
      ],
      endpoint: "/api/exif/parse",
      status: "Production Ready"
    },
    {
      id: 2,
      title: "KML + Geospatial Visual Layer",
      version: "Enhanced v3",
      icon: <Map className="h-6 w-6" />,
      description: "Interactive geospatial visualizations with clustering, environmental overlays, and 3D rendering",
      features: [
        "Map clustering with configurable radius",
        "Environmental zones & remediation sites",
        "WebGL 3D flythrough tours",
        "Multi-format export (CSV, GeoJSON)",
        "Context overlays for compliance"
      ],
      endpoint: "/api/kml/generate",
      status: "Production Ready"
    },
    {
      id: 3,
      title: "Report Builder & Workflow Orchestration",
      version: "Enhanced v4",
      icon: <FileText className="h-6 w-6" />,
      description: "Automated compliance reports with .a3e project definition format and PDF generation",
      features: [
        "A3E project definition file format",
        "Auto-PDF generation with appendices",
        "Auto-link images to sites",
        "Compliance template integration",
        "Regulatory framework support"
      ],
      endpoint: "/api/reports/generate",
      status: "Production Ready"
    },
    {
      id: 4,
      title: "Bi-directional Image Intelligence",
      version: "Enhanced v5",
      icon: <Link2 className="h-6 w-6" />,
      description: "Link output formats back to original images with real-time dashboard integration",
      features: [
        "Reverse-linked JSON architecture",
        "Album archive → live dashboard",
        "Drag-and-drop report composer",
        "Supabase real-time updates",
        "Firebase notifications"
      ],
      endpoint: "Integrated across APIs",
      status: "Production Ready"
    },
    {
      id: 5,
      title: "Monetizable Productization Hooks",
      version: "Enhanced v6",
      icon: <DollarSign className="h-6 w-6" />,
      description: "Convert to deployable SaaS with visual chain of custody and licensing tiers",
      features: [
        "Visual chain of custody tracking",
        "License tiers (ZIP→PDF→API sync)",
        "Watermark insertion system",
        "Usage-based billing integration",
        "Enterprise feature gating"
      ],
      endpoint: "Billing & License APIs",
      status: "Production Ready"
    },
    {
      id: 6,
      title: "Full-stack Deployment Options",
      version: "Enhanced v7",
      icon: <Cloud className="h-6 w-6" />,
      description: "Vercel-deployable frontend with multiple backend integration options",
      features: [
        "[A] Vercel-deployable frontend ✅",
        "[F] Supabase-authenticated backend",
        "[W] Webhook connectors (Slack/email)",
        "CLI tools for automation",
        "Enterprise-grade monitoring"
      ],
      endpoint: "Multi-deployment",
      status: "Deployed"
    }
  ]

  const deploymentOptions = [
    {
      label: "Option A - Vercel Frontend",
      description: "Auto-deploy EXIF → KML → Report full-stack to Vercel",
      status: "ACTIVE",
      color: "bg-green-500"
    },
    {
      label: "Option F - Supabase Backend",
      description: "Authenticated backend with real-time data sync",
      status: "Available",
      color: "bg-blue-500"
    },
    {
      label: "Option W - Webhook Integration",
      description: "Connect to Slack, email, and FieldOps systems",
      status: "Available",
      color: "bg-purple-500"
    }
  ]

  const runDemo = async () => {
    setDemoProgress(0)

    // Simulate the full pipeline
    const steps = [
      { name: "Processing sample images...", progress: 20 },
      { name: "Extracting EXIF metadata...", progress: 40 },
      { name: "Generating KML visualization...", progress: 60 },
      { name: "Creating compliance report...", progress: 80 },
      { name: "Deploying to production...", progress: 100 }
    ]

    for (const step of steps) {
      await new Promise<void>(resolve => {
        const timeoutId = globalThis.setTimeout(() => resolve(), 1000)
        if (!timeoutId) resolve() // Fallback
      })
      setDemoProgress(step.progress)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <Eye className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">A3E Visual Intelligence Suite</h1>
              <p className="text-slate-300 text-lg">Recursive Enhancement Loop – 6 Layers of AI-Powered Environmental Analysis</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Zap className="h-3 w-3 mr-1" />
              Production Ready
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Globe className="h-3 w-3 mr-1" />
              Vercel Deployed
            </Badge>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Cpu className="h-3 w-3 mr-1" />
              6 Enhancement Layers
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="layers">Enhancement Layers</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  Recursive Enhancement Architecture
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Six interconnected layers that progressively enhance image intelligence and environmental compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enhancementLayers.map((layer) => (
                    <Card
                      key={layer.id}
                      className={`bg-slate-700 border-slate-600 cursor-pointer transition-all duration-200 hover:border-emerald-500 ${
                        selectedLayer === layer.id ? 'border-emerald-500 bg-slate-700/70' : ''
                      }`}
                      onClick={() => setSelectedLayer(layer.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {layer.icon}
                            <div>
                              <h3 className="font-semibold text-white text-sm">Layer {layer.id}</h3>
                              <p className="text-xs text-slate-300">{layer.version}</p>
                            </div>
                          </div>
                          <Badge
                            variant={layer.status === 'Deployed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {layer.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-white text-sm leading-tight">{layer.title}</h4>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-slate-400 mb-3">{layer.description}</p>
                        <div className="space-y-1">
                          {layer.features.slice(0, 2).map((feature, index) => (
                            <div key={index} className="text-xs text-slate-300 flex items-center gap-1">
                              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Processing Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Camera className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-slate-300">Image Ingestion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Layers className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-slate-300">EXIF Enhancement</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Map className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-slate-300">Geospatial Visualization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-orange-400" />
                      <span className="text-sm text-slate-300">Report Generation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">API Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="text-xs bg-slate-700 px-2 py-1 rounded text-emerald-400">/api/exif/parse</code>
                      <Badge variant="outline" className="text-xs">Layer 1</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-xs bg-slate-700 px-2 py-1 rounded text-blue-400">/api/kml/generate</code>
                      <Badge variant="outline" className="text-xs">Layer 2</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-xs bg-slate-700 px-2 py-1 rounded text-purple-400">/api/reports/generate</code>
                      <Badge variant="outline" className="text-xs">Layer 3</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Deployment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deploymentOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${option.color}`}></div>
                        <div>
                          <p className="text-sm font-medium text-white">{option.label}</p>
                          <p className="text-xs text-slate-400">{option.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="layers" className="space-y-6">
            {selectedLayer && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {enhancementLayers[selectedLayer - 1].icon}
                    <div>
                      <CardTitle className="text-white">
                        Layer {selectedLayer}: {enhancementLayers[selectedLayer - 1].title}
                      </CardTitle>
                      <CardDescription className="text-slate-300">
                        {enhancementLayers[selectedLayer - 1].description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-white mb-3">Key Features</h4>
                      <div className="space-y-2">
                        {enhancementLayers[selectedLayer - 1].features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <span className="text-sm text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-3">Technical Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">API Endpoint:</span>
                          <code className="text-xs bg-slate-700 px-2 py-1 rounded text-emerald-400">
                            {enhancementLayers[selectedLayer - 1].endpoint}
                          </code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Status:</span>
                          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                            {enhancementLayers[selectedLayer - 1].status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Version:</span>
                          <span className="text-sm text-white">
                            {enhancementLayers[selectedLayer - 1].version}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enhancementLayers.map((layer) => (
                <Card
                  key={layer.id}
                  className={`bg-slate-800 border-slate-700 cursor-pointer transition-all duration-200 ${
                    selectedLayer === layer.id ? 'border-emerald-500' : 'hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {layer.icon}
                      <div>
                        <h3 className="font-semibold text-white">Layer {layer.id}</h3>
                        <p className="text-xs text-slate-400">{layer.version}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium text-white mb-2">{layer.title}</h4>
                    <p className="text-sm text-slate-300 mb-3">{layer.description}</p>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                      {layer.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Deployment Options</CardTitle>
                <CardDescription className="text-slate-300">
                  Choose your deployment strategy for the A3E Visual Intelligence Suite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {deploymentOptions.map((option, index) => (
                    <Card key={index} className="bg-slate-700 border-slate-600">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                          <CardTitle className="text-white text-lg">{option.label}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm mb-4">{option.description}</p>
                        <Badge
                          variant={option.status === 'ACTIVE' ? 'default' : 'secondary'}
                          className="w-full justify-center"
                        >
                          {option.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">CLI Tools</CardTitle>
                <CardDescription className="text-slate-300">
                  Command-line interface for automated workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 p-4 rounded-lg">
                  <h4 className="text-emerald-400 font-mono text-sm mb-2">a3e-exif-kml</h4>
                  <p className="text-slate-300 text-sm mb-3">Generate KML from image directories</p>
                  <code className="text-xs text-slate-400 bg-slate-800 p-2 rounded block">
                    a3e-exif-kml --input ./images --output ./report.kml --style "clustered"
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Live Demo Pipeline</CardTitle>
                <CardDescription className="text-slate-300">
                  Experience the complete EXIF → KML → Report workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Button
                    onClick={runDemo}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={demoProgress > 0 && demoProgress < 100}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    {demoProgress === 0 ? 'Run Complete Pipeline Demo' :
                     demoProgress === 100 ? 'Demo Complete - Run Again' :
                     'Processing...'}
                  </Button>

                  {demoProgress > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Pipeline Progress</span>
                        <span className="text-sm text-emerald-400">{demoProgress}%</span>
                      </div>
                      <Progress value={demoProgress} className="h-2" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-700 border-slate-600">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-sm">Sample Output</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-xs">
                          <div className="text-slate-300">✓ Processed 24 images</div>
                          <div className="text-slate-300">✓ Generated 18 GPS placemarks</div>
                          <div className="text-slate-300">✓ Created 3 clusters</div>
                          <div className="text-slate-300">✓ PDF report with appendices</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700 border-slate-600">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-sm">Downloads</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="h-3 w-3 mr-2" />
                            Sample KML File
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="h-3 w-3 mr-2" />
                            Compliance Report PDF
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}