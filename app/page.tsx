import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Bot, Sparkles, Monitor, Eye, Cpu, Activity } from 'lucide-react'
import Link from 'next/link'
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Projects } from "@/components/projects"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

const BleedingEdgeFeatures = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "Multi-Modal AI Orchestration",
      description: "Revolutionary AI that processes text, audio, images, video, and biometric data simultaneously",
      link: "/orchestration",
      badge: "BLEEDING EDGE"
    },
    {
      icon: <Monitor className="h-8 w-8 text-purple-600" />,
      title: "Computer Use Agents",
      description: "AI agents with screen capture, file system access, and browser automation capabilities",
      link: "/computer-use",
      badge: "FIRST OF ITS KIND"
    },
    {
      icon: <Eye className="h-8 w-8 text-green-600" />,
      title: "Advanced Computer Vision",
      description: "Real-time visual analysis with environmental hazard detection and safety monitoring",
      link: "/ai-features",
      badge: "CUTTING EDGE"
    },
    {
      icon: <Cpu className="h-8 w-8 text-red-600" />,
      title: "Intelligent System Orchestration",
      description: "Self-optimizing AI systems with predictive maintenance and resource management",
      link: "/analytics",
      badge: "NEXT GEN"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-orange-600" />,
      title: "AI Content Studio",
      description: "Automated content generation for marketing, case studies, and technical documentation",
      link: "/ai-content-studio",
      badge: "JUST LAUNCHED"
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
              IRIS: Advanced AI Platform
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Experience the world's most advanced multi-modal AI orchestration platform with
            cutting-edge environmental intelligence capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-500/50 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {feature.icon}
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <Badge variant="outline" className="mt-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none">
                        {feature.badge}
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  {feature.description}
                </CardDescription>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href={feature.link}>
                    Explore Capability
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Status Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2 border-green-500/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-2">
              <Activity className="h-6 w-6 text-green-500" />
              <span>Platform Status</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">✅ OPERATIONAL</div>
                  <p className="text-sm text-green-700">All systems running</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">🚀 DEPLOYED</div>
                  <p className="text-sm text-blue-700">Production ready</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">⚡ OPTIMIZED</div>
                  <p className="text-sm text-purple-700">Performance enhanced</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <BleedingEdgeFeatures />
      <Services />
      <Projects />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
