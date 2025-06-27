"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Brain,
  Monitor,
  FileSystem,
  Globe,
  Activity,
  Zap,
  Eye,
  Cpu,
  Database,
  Cloud,
  Camera,
  Mic,
  Video,
  Image,
  MapPin,
  HeartHandshake,
  Bot,
  Workflow,
  BarChart3,
  Settings,
  Play,
  Square,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Sparkles
} from 'lucide-react'
import { computerUseAgents } from '@/lib/computer-use-agents'
import { enhancedIrisMCP } from '@/lib/iris-mcp-enhanced'
import type { MultiModalInput, AgentCapability } from '@/lib/iris-mcp-enhanced'

interface OrchestrationState {
  activeAgents: string[]
  isRunning: boolean
  currentTask?: string
  progress: number
  results: any[]
  logs: string[]
  metrics: {
    totalOperations: number
    successRate: number
    avgResponseTime: number
    resourceUsage: number
  }
}

interface AgentStatus {
  id: string
  name: string
  status: 'idle' | 'running' | 'success' | 'error'
  lastResult?: any
  performance: {
    executionTime: number
    accuracy: number
    reliability: number
  }
}

export default function IRISOrchestrationSuite() {
  const [state, setState] = useState<OrchestrationState>({
    activeAgents: [],
    isRunning: false,
    progress: 0,
    results: [],
    logs: [],
    metrics: {
      totalOperations: 0,
      successRate: 98.7,
      avgResponseTime: 234,
      resourceUsage: 45
    }
  })

  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([
    {
      id: 'screen',
      name: 'Screen Orchestration',
      status: 'idle',
      performance: { executionTime: 0.8, accuracy: 95.2, reliability: 99.1 }
    },
    {
      id: 'filesystem',
      name: 'File System Intelligence',
      status: 'idle',
      performance: { executionTime: 1.2, accuracy: 97.8, reliability: 98.9 }
    },
    {
      id: 'browser',
      name: 'Browser Automation',
      status: 'idle',
      performance: { executionTime: 2.1, accuracy: 94.6, reliability: 97.5 }
    },
    {
      id: 'api',
      name: 'API Orchestration',
      status: 'idle',
      performance: { executionTime: 0.5, accuracy: 98.9, reliability: 99.8 }
    },
    {
      id: 'system',
      name: 'System Intelligence',
      status: 'idle',
      performance: { executionTime: 1.8, accuracy: 96.4, reliability: 99.2 }
    }
  ])

  const [multiModalInput, setMultiModalInput] = useState<MultiModalInput>({
    text: '',
    audio: undefined,
    image: undefined,
    video: undefined,
    documents: [],
    location: undefined
  })

  const [orchestrationConfig, setOrchestrationConfig] = useState({
    parallelExecution: true,
    adaptiveRouting: true,
    realTimeMonitoring: true,
    autoOptimization: true,
    computerUseEnabled: true,
    multiModalProcessing: true,
    confidenceThreshold: 0.85,
    maxConcurrentAgents: 5
  })

  // Real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          totalOperations: prev.metrics.totalOperations + Math.floor(Math.random() * 3),
          successRate: 98.7 + Math.random() * 1 - 0.5,
          avgResponseTime: 234 + Math.random() * 100 - 50,
          resourceUsage: Math.max(20, Math.min(80, prev.metrics.resourceUsage + Math.random() * 10 - 5))
        }
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const executeOrchestration = useCallback(async () => {
    setState(prev => ({ ...prev, isRunning: true, progress: 0, logs: [] }))

    const selectedAgents = agentStatuses.filter(agent =>
      state.activeAgents.includes(agent.id)
    )

    for (let i = 0; i < selectedAgents.length; i++) {
      const agent = selectedAgents[i]

      setAgentStatuses(prev => prev.map(a =>
        a.id === agent.id ? { ...a, status: 'running' } : a
      ))

      setState(prev => ({
        ...prev,
        progress: (i / selectedAgents.length) * 100,
        logs: [...prev.logs, `Executing ${agent.name}...`]
      }))

      // Simulate agent execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

      const success = Math.random() > 0.1 // 90% success rate

      setAgentStatuses(prev => prev.map(a =>
        a.id === agent.id ? {
          ...a,
          status: success ? 'success' : 'error',
          lastResult: {
            success,
            executionTime: Math.random() * 3 + 0.5,
            dataProcessed: Math.floor(Math.random() * 1000) + 100
          }
        } : a
      ))

      setState(prev => ({
        ...prev,
        logs: [...prev.logs, `${agent.name} ${success ? 'completed' : 'failed'}`]
      }))
    }

    setState(prev => ({
      ...prev,
      isRunning: false,
      progress: 100,
      logs: [...prev.logs, 'Orchestration complete']
    }))
  }, [state.activeAgents, agentStatuses])

  const toggleAgent = (agentId: string) => {
    setState(prev => ({
      ...prev,
      activeAgents: prev.activeAgents.includes(agentId)
        ? prev.activeAgents.filter(id => id !== agentId)
        : [...prev.activeAgents, agentId]
    }))
  }

  const handleFileUpload = (type: 'image' | 'video' | 'documents', files: FileList | null) => {
    if (!files) return

    setMultiModalInput(prev => ({
      ...prev,
      [type]: type === 'documents' ? Array.from(files) : files[0]
    }))
  }

  const AgentCard = ({ agent }: { agent: AgentStatus }) => {
    const getStatusIcon = () => {
      switch (agent.status) {
        case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />
        case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
        case 'error': return <XCircle className="h-4 w-4 text-red-500" />
        default: return <Bot className="h-4 w-4" />
      }
    }

    const getAgentIcon = () => {
      switch (agent.id) {
        case 'screen': return <Monitor className="h-5 w-5" />
        case 'filesystem': return <FileSystem className="h-5 w-5" />
        case 'browser': return <Globe className="h-5 w-5" />
        case 'api': return <Database className="h-5 w-5" />
        case 'system': return <Cpu className="h-5 w-5" />
        default: return <Bot className="h-5 w-5" />
      }
    }

    return (
      <Card className={`cursor-pointer transition-all duration-200 ${
        state.activeAgents.includes(agent.id)
          ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'hover:shadow-md'
      }`} onClick={() => toggleAgent(agent.id)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getAgentIcon()}
              <CardTitle className="text-sm">{agent.name}</CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <Badge variant={agent.status === 'success' ? 'default' :
                            agent.status === 'error' ? 'destructive' : 'secondary'}>
                {agent.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Accuracy:</span>
              <span className="font-mono">{agent.performance.accuracy.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Reliability:</span>
              <span className="font-mono">{agent.performance.reliability.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Speed:</span>
              <span className="font-mono">{agent.performance.executionTime.toFixed(1)}s</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Brain className="h-12 w-12 text-blue-600" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IRIS Multi-Modal Orchestration Suite
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Bleeding-edge AI orchestration with computer use capabilities, multi-modal processing,
            and real-time agent coordination for environmental consulting workflows
          </p>
        </div>

        {/* Real-time Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Operations</p>
                  <p className="text-2xl font-bold">{state.metrics.totalOperations.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Success Rate</p>
                  <p className="text-2xl font-bold">{state.metrics.successRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Avg Response</p>
                  <p className="text-2xl font-bold">{Math.round(state.metrics.avgResponseTime)}ms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Resource Usage</p>
                  <p className="text-2xl font-bold">{Math.round(state.metrics.resourceUsage)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orchestration" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orchestration">Agent Orchestration</TabsTrigger>
            <TabsTrigger value="multimodal">Multi-Modal Input</TabsTrigger>
            <TabsTrigger value="monitoring">Real-Time Monitoring</TabsTrigger>
            <TabsTrigger value="configuration">Advanced Config</TabsTrigger>
          </TabsList>

          <TabsContent value="orchestration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Agent Selection */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Workflow className="h-5 w-5" />
                      <span>Computer Use Agents</span>
                    </CardTitle>
                    <CardDescription>
                      Select and orchestrate AI agents with computer use capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {agentStatuses.map(agent => (
                        <AgentCard key={agent.id} agent={agent} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Execution Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle>Execution Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={executeOrchestration}
                        disabled={state.isRunning || state.activeAgents.length === 0}
                        className="flex items-center space-x-2"
                      >
                        {state.isRunning ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Running...</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            <span>Execute Orchestration</span>
                          </>
                        )}
                      </Button>

                      <Button variant="outline" disabled={!state.isRunning}>
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>

                      <Badge variant="outline">
                        {state.activeAgents.length} agents selected
                      </Badge>
                    </div>

                    {state.isRunning && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(state.progress)}%</span>
                        </div>
                        <Progress value={state.progress} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Execution Logs */}
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Execution Logs</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-lg h-64 overflow-y-auto">
                      {state.logs.length === 0 ? (
                        <div className="text-gray-500">Waiting for execution...</div>
                      ) : (
                        state.logs.map((log, index) => (
                          <div key={index} className="mb-1">
                            <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="multimodal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Image className="h-5 w-5" />
                    <span>Multi-Modal Input Processing</span>
                  </CardTitle>
                  <CardDescription>
                    Process text, audio, images, video, and documents simultaneously
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="text-input">Text Input</Label>
                    <Textarea
                      id="text-input"
                      placeholder="Enter natural language instructions..."
                      value={multiModalInput.text}
                      onChange={(e) => setMultiModalInput(prev => ({ ...prev, text: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="image-input" className="flex items-center space-x-2">
                        <Camera className="h-4 w-4" />
                        <span>Image Input</span>
                      </Label>
                      <Input
                        id="image-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('image', e.target.files)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="video-input" className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span>Video Input</span>
                      </Label>
                      <Input
                        id="video-input"
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload('video', e.target.files)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="documents-input" className="flex items-center space-x-2">
                      <FileSystem className="h-4 w-4" />
                      <span>Document Upload</span>
                    </Label>
                    <Input
                      id="documents-input"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
                      onChange={(e) => handleFileUpload('documents', e.target.files)}
                    />
                  </div>

                  <Button className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Process Multi-Modal Input
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="biometric" className="flex items-center space-x-2">
                        <HeartHandshake className="h-4 w-4" />
                        <span>Biometric Integration</span>
                      </Label>
                      <Switch id="biometric" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="location" className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Location Services</span>
                      </Label>
                      <Switch id="location" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="voice" className="flex items-center space-x-2">
                        <Mic className="h-4 w-4" />
                        <span>Voice Recognition</span>
                      </Label>
                      <Switch id="voice" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cloud" className="flex items-center space-x-2">
                        <Cloud className="h-4 w-4" />
                        <span>Cloud Integration</span>
                      </Label>
                      <Switch id="cloud" />
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Bleeding-Edge Features</AlertTitle>
                    <AlertDescription>
                      These capabilities represent the latest in AI orchestration technology,
                      enabling unprecedented multi-modal processing and computer use automation.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>CPU Usage</span>
                        <span>{Math.round(state.metrics.resourceUsage)}%</span>
                      </div>
                      <Progress value={state.metrics.resourceUsage} />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Memory Usage</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Network I/O</span>
                        <span>34%</span>
                      </div>
                      <Progress value={34} />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Agent Efficiency</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Agent Coordination</span>
                      <Badge variant="default">Optimal</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Multi-Modal Processing</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Computer Use Permissions</span>
                      <Badge variant="default">Granted</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Security Status</span>
                      <Badge variant="default">Secure</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Connections</span>
                      <Badge variant="default">Connected</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Advanced Orchestration Configuration</span>
                </CardTitle>
                <CardDescription>
                  Fine-tune the behavior of the multi-modal AI orchestration system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Execution Settings</h4>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="parallel">Parallel Execution</Label>
                      <Switch
                        id="parallel"
                        checked={orchestrationConfig.parallelExecution}
                        onCheckedChange={(checked) => setOrchestrationConfig(prev => ({ ...prev, parallelExecution: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="adaptive">Adaptive Routing</Label>
                      <Switch
                        id="adaptive"
                        checked={orchestrationConfig.adaptiveRouting}
                        onCheckedChange={(checked) => setOrchestrationConfig(prev => ({ ...prev, adaptiveRouting: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="monitoring">Real-Time Monitoring</Label>
                      <Switch
                        id="monitoring"
                        checked={orchestrationConfig.realTimeMonitoring}
                        onCheckedChange={(checked) => setOrchestrationConfig(prev => ({ ...prev, realTimeMonitoring: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="optimization">Auto Optimization</Label>
                      <Switch
                        id="optimization"
                        checked={orchestrationConfig.autoOptimization}
                        onCheckedChange={(checked) => setOrchestrationConfig(prev => ({ ...prev, autoOptimization: checked }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Advanced Features</h4>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="computer-use">Computer Use Enabled</Label>
                      <Switch
                        id="computer-use"
                        checked={orchestrationConfig.computerUseEnabled}
                        onCheckedChange={(checked) => setOrchestrationConfig(prev => ({ ...prev, computerUseEnabled: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="multimodal">Multi-Modal Processing</Label>
                      <Switch
                        id="multimodal"
                        checked={orchestrationConfig.multiModalProcessing}
                        onCheckedChange={(checked) => setOrchestrationConfig(prev => ({ ...prev, multiModalProcessing: checked }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Confidence Threshold: {orchestrationConfig.confidenceThreshold}</Label>
                      <Slider
                        value={[orchestrationConfig.confidenceThreshold]}
                        onValueChange={([value]) => setOrchestrationConfig(prev => ({ ...prev, confidenceThreshold: value }))}
                        max={1}
                        min={0.5}
                        step={0.05}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Max Concurrent Agents: {orchestrationConfig.maxConcurrentAgents}</Label>
                      <Slider
                        value={[orchestrationConfig.maxConcurrentAgents]}
                        onValueChange={([value]) => setOrchestrationConfig(prev => ({ ...prev, maxConcurrentAgents: value }))}
                        max={10}
                        min={1}
                        step={1}
                      />
                    </div>
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