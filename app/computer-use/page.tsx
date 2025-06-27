import React from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Monitor,
  FolderOpen,
  Globe,
  Database,
  Cpu,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Activity
} from 'lucide-react'

export default function ComputerUsePage() {
  const agents = [
    {
      id: 'screen',
      name: 'Screen Orchestration Agent',
      icon: <Monitor className="h-8 w-8 text-blue-600" />,
      description: 'Advanced computer vision and UI automation with real-time screen analysis',
      capabilities: [
        'Screen capture and analysis',
        'UI element detection',
        'Automated interactions',
        'Real-time monitoring'
      ],
      status: 'active',
      performance: { accuracy: 95.2, reliability: 99.1, speed: '0.8s' }
    },
    {
      id: 'filesystem',
      name: 'File System Intelligence Agent',
      icon: <FolderOpen className="h-8 w-8 text-green-600" />,
      description: 'Intelligent file operations with content understanding and smart organization',
      capabilities: [
        'Content-aware file analysis',
        'Automated organization',
        'Duplicate detection',
        'Intelligent search'
      ],
      status: 'ready',
      performance: { accuracy: 97.8, reliability: 98.9, speed: '1.2s' }
    },
    {
      id: 'browser',
      name: 'Browser Automation Agent',
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      description: 'Intelligent web automation with context understanding and adaptive workflows',
      capabilities: [
        'Smart navigation',
        'Data extraction',
        'Form automation',
        'Change monitoring'
      ],
      status: 'optimized',
      performance: { accuracy: 94.6, reliability: 97.5, speed: '2.1s' }
    },
    {
      id: 'api',
      name: 'API Orchestration Agent',
      icon: <Database className="h-8 w-8 text-orange-600" />,
      description: 'Intelligent API integration and orchestration with adaptive routing',
      capabilities: [
        'API discovery',
        'Intelligent routing',
        'Error handling',
        'Performance optimization'
      ],
      status: 'active',
      performance: { accuracy: 98.9, reliability: 99.8, speed: '0.5s' }
    },
    {
      id: 'system',
      name: 'System Intelligence Agent',
      icon: <Cpu className="h-8 w-8 text-red-600" />,
      description: 'Real-time system monitoring and intelligent resource management',
      capabilities: [
        'Performance monitoring',
        'Predictive analysis',
        'Security scanning',
        'Automated optimization'
      ],
      status: 'monitoring',
      performance: { accuracy: 96.4, reliability: 99.2, speed: '1.8s' }
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, color: 'bg-green-500' },
      ready: { variant: 'secondary' as const, color: 'bg-blue-500' },
      optimized: { variant: 'outline' as const, color: 'bg-purple-500' },
      monitoring: { variant: 'destructive' as const, color: 'bg-orange-500' }
    }

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.ready
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <Bot className="h-12 w-12 text-blue-600" />
                <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Computer Use Agents
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              First-of-its-kind AI agents with computer use capabilities for autonomous system interaction,
              environmental monitoring, and intelligent automation
            </p>
          </div>

          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">System Health</h3>
                <p className="text-2xl font-bold text-green-600">Optimal</p>
                <p className="text-sm text-muted-foreground">All agents operational</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">Success Rate</h3>
                <p className="text-2xl font-bold text-blue-600">98.7%</p>
                <p className="text-sm text-muted-foreground">Task completion</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Bot className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold">Active Agents</h3>
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-sm text-muted-foreground">Computer use agents</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-semibold">Security Level</h3>
                <p className="text-2xl font-bold text-orange-600">High</p>
                <p className="text-sm text-muted-foreground">Permissions granted</p>
              </CardContent>
            </Card>
          </div>

          {/* Agent Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {agent.icon}
                      <div>
                        <CardTitle className="text-xl">{agent.name}</CardTitle>
                        <Badge
                          variant={getStatusBadge(agent.status).variant}
                          className="mt-1"
                        >
                          {agent.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base mt-3">
                    {agent.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Capabilities */}
                  <div>
                    <h4 className="font-semibold mb-3">Core Capabilities</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {agent.capabilities.map((capability, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h4 className="font-semibold mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-lg font-bold">{agent.performance.accuracy}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Reliability</p>
                        <p className="text-lg font-bold">{agent.performance.reliability}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Avg Speed</p>
                        <p className="text-lg font-bold">{agent.performance.speed}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Execute Agent
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Agent Activity */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Live Agent Activity</span>
              </CardTitle>
              <CardDescription>
                Real-time monitoring of computer use agent operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 font-mono text-sm p-6 rounded-lg">
                <div className="space-y-1">
                  <p>[{new Date().toLocaleTimeString()}] Screen Agent: Analyzing display content...</p>
                  <p>[{new Date().toLocaleTimeString()}] File System Agent: Scanning for environmental documents...</p>
                  <p>[{new Date().toLocaleTimeString()}] Browser Agent: Extracting compliance data from EPA portal...</p>
                  <p>[{new Date().toLocaleTimeString()}] API Agent: Orchestrating environmental data APIs...</p>
                  <p>[{new Date().toLocaleTimeString()}] System Agent: Monitoring performance metrics...</p>
                  <p className="text-blue-400">[{new Date().toLocaleTimeString()}] All agents: Operating within normal parameters</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}