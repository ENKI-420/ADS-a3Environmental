import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Sparkles, Zap, Brain, Network, Monitor, Cpu, Eye, FileText, Globe, Shield } from "lucide-react"

// IRIS MCP SDK Feature Showcase
const IrisMCPFeatures = () => {
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-blue-600" />,
      title: "Computer Use Agents",
      description: "Advanced AI agents that can interact directly with computer systems and automate complex workflows",
      link: "/computer-use",
      badge: "LIVE DEMO"
    },
    {
      icon: <Network className="h-8 w-8 text-purple-600" />,
      title: "Agent Orchestration",
      description: "Sophisticated multi-agent coordination with real-time workflow management and intelligent task delegation",
      link: "/orchestration",
      badge: "INTERACTIVE"
    },
    {
      icon: <Brain className="h-8 w-8 text-green-600" />,
      title: "Multi-Modal AI",
      description: "Voice, visual, and text processing unified through the IRIS MCP SDK with context-aware intelligence",
      link: "/ai-features",
      badge: "AI POWERED"
    },
    {
      icon: <Monitor className="h-8 w-8 text-orange-600" />,
      title: "Real-Time Analytics",
      description: "Live performance monitoring and predictive analytics powered by IRIS MCP SDK intelligence",
      link: "/analytics",
      badge: "REAL-TIME"
    },
    {
      icon: <Eye className="h-8 w-8 text-teal-600" />,
      title: "Visual Intelligence",
      description: "Advanced computer vision and spatial analysis with 3D visualization capabilities",
      link: "/visual-intelligence",
      badge: "3D ENABLED"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-yellow-600" />,
      title: "AI Content Studio",
      description: "Automated content generation for technical documentation and professional reports",
      link: "/ai-content-studio",
      badge: "CONTENT AI"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <Bot className="h-12 w-12 text-blue-600" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IRIS MCP SDK Platform Demonstration
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Experience the world's most advanced Model Context Protocol platform with
            cutting-edge AI orchestration, computer use agents, and multi-modal intelligence
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="text-sm px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
              🚀 Next-Generation AI Platform • Environmental Consulting Use Case
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 bg-white/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 group-hover:from-blue-100/50 group-hover:to-purple-100/50 transition-all duration-300" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm group-hover:shadow-md transition-shadow">
                    {feature.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </CardDescription>
                <Link href={feature.link}>
                  <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                    Explore Demo
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// IRIS MCP SDK Statistics
const IRISStats = () => {
  const stats = [
    { value: "13+", label: "Specialized AI Agents", icon: <Bot className="h-6 w-6" /> },
    { value: "5", label: "Computer Use Capabilities", icon: <Cpu className="h-6 w-6" /> },
    { value: "99.97%", label: "System Uptime", icon: <Shield className="h-6 w-6" /> },
    { value: "340%", label: "Efficiency Improvement", icon: <Zap className="h-6 w-6" /> },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">IRIS MCP SDK Performance Metrics</h2>
          <p className="text-blue-100 text-lg">Real-world performance data from our environmental consulting demonstration</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-blue-100 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main Page Component
export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <Badge className="text-sm px-4 py-2 bg-blue-500/20 text-blue-200 border-blue-400/30 backdrop-blur-sm">
                🚀 IRIS MCP SDK v2.0 • Live Demonstration Platform
              </Badge>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Experience the{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Future of AI
              </span>{" "}
              with IRIS MCP SDK
            </h1>

            <p className="text-xl lg:text-2xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto">
              Advanced Model Context Protocol platform featuring computer use agents,
              multi-modal AI orchestration, and intelligent workflow automation —
              demonstrated through a comprehensive environmental consulting platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/computer-use">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  <Bot className="mr-2 h-5 w-5" />
                  Explore Computer Use Agents
                </Button>
              </Link>
              <Link href="/orchestration">
                <Button size="lg" variant="outline" className="border-blue-400 text-blue-100 hover:bg-blue-800/20 px-8 py-4 text-lg backdrop-blur-sm">
                  <Network className="mr-2 h-5 w-5" />
                  Agent Orchestration Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* IRIS MCP SDK Features */}
      <IrisMCPFeatures />

      {/* Performance Statistics */}
      <IRISStats />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Ready to Build with IRIS MCP SDK?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Explore our comprehensive demonstration to see how the IRIS MCP SDK can transform
              your industry with advanced AI orchestration and computer use capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://web-bice-two-75.vercel.app/">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4">
                  <Globe className="mr-2 h-5 w-5" />
                  Visit IRIS MCP SDK Platform
                </Button>
              </Link>
              <Link href="/ai-features">
                <Button size="lg" variant="outline" className="px-8 py-4">
                  <FileText className="mr-2 h-5 w-5" />
                  View All Demonstrations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
