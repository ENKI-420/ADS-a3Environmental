"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Zap
} from "lucide-react"

interface KPIMetric {
  label: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  target?: number
  icon: React.ElementType
  color: string
}

interface PhaseProgress {
  phase: string
  description: string
  progress: number
  status: 'completed' | 'in-progress' | 'planned'
  milestones: {
    name: string
    completed: boolean
    dueDate: string
  }[]
}

export function KPIDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [kpiData, setKpiData] = useState<KPIMetric[]>([
    {
      label: "Lead Conversion Rate",
      value: "23.4%",
      change: 8.2,
      changeType: 'increase',
      target: 25,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      label: "Portal Usage",
      value: "1,247",
      change: 15.7,
      changeType: 'increase',
      icon: Users,
      color: "text-blue-600"
    },
    {
      label: "Document Processing",
      value: "342",
      change: -2.1,
      changeType: 'decrease',
      icon: FileText,
      color: "text-orange-600"
    },
    {
      label: "Cost Savings",
      value: "$47,290",
      change: 12.5,
      changeType: 'increase',
      icon: DollarSign,
      color: "text-emerald-600"
    },
    {
      label: "Client Satisfaction",
      value: "4.8/5",
      change: 0.3,
      changeType: 'increase',
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      label: "Response Time",
      value: "2.3h",
      change: -18.5,
      changeType: 'increase',
      icon: Clock,
      color: "text-indigo-600"
    }
  ])

  const [phaseProgress, setPhaseProgress] = useState<PhaseProgress[]>([
    {
      phase: "Phase 1",
      description: "Foundational Build - Core Functionality & CRM",
      progress: 85,
      status: 'in-progress',
      milestones: [
        { name: "Route Auto-Healing", completed: true, dueDate: "2024-01-15" },
        { name: "CRM Integration", completed: true, dueDate: "2024-01-20" },
        { name: "Knowledge Base", completed: false, dueDate: "2024-01-30" },
        { name: "SEO Optimization", completed: false, dueDate: "2024-02-05" }
      ]
    },
    {
      phase: "Phase 2",
      description: "Stakeholder Empowerment - Portals & Content Strategy",
      progress: 45,
      status: 'in-progress',
      milestones: [
        { name: "Enhanced Client Portal", completed: true, dueDate: "2024-02-15" },
        { name: "Employee Intranet", completed: false, dueDate: "2024-02-28" },
        { name: "Content Management", completed: false, dueDate: "2024-03-15" },
        { name: "Real-time Messaging", completed: false, dueDate: "2024-03-30" }
      ]
    },
    {
      phase: "Phase 3",
      description: "Advanced Optimization - AI Automation & Predictive Analytics",
      progress: 20,
      status: 'planned',
      milestones: [
        { name: "Interactive Dashboards", completed: false, dueDate: "2024-04-15" },
        { name: "AI Risk Prediction", completed: false, dueDate: "2024-05-01" },
        { name: "Automated Onboarding", completed: false, dueDate: "2024-05-15" },
        { name: "Full AI Integration", completed: false, dueDate: "2024-06-01" }
      ]
    }
  ])

  const refreshData = () => {
    // Simulate real-time data updates
    setKpiData(prev => prev.map(kpi => ({
      ...kpi,
      change: kpi.change + (Math.random() - 0.5) * 2
    })))
    setLastUpdated(new Date())
  }

  useEffect(() => {
    const interval = setInterval(refreshData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getChangeIcon = (changeType: 'increase' | 'decrease' | 'neutral') => {
    if (changeType === 'increase') return <TrendingUp className="h-4 w-4 text-green-500" />
    if (changeType === 'decrease') return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const getPhaseStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in-progress': return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'planned': return <Badge className="bg-gray-100 text-gray-800">Planned</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">A3E Strategic KPI Dashboard</h1>
          <p className="text-xl text-gray-600 mt-2">
            Digital Transformation Progress & Performance Metrics
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={refreshData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Strategic Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Strategic Transformation Progress
          </CardTitle>
          <CardDescription>
            Track progress across the three-phase digital transformation roadmap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phaseProgress.map((phase, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{phase.phase}</h3>
                  {getPhaseStatusBadge(phase.status)}
                </div>
                <p className="text-sm text-gray-600">{phase.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-2" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Milestones</h4>
                  {phase.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {milestone.completed ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Clock className="h-3 w-3 text-gray-400" />
                      )}
                      <span className={milestone.completed ? "line-through text-gray-500" : ""}>
                        {milestone.name}
                      </span>
                      <span className="text-gray-400">({milestone.dueDate})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPI Metrics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpiData.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                    <div className="flex items-center gap-1">
                      {getChangeIcon(metric.changeType)}
                      <span className={`text-sm font-medium ${
                        metric.changeType === 'increase' ? 'text-green-600' :
                        metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {Math.abs(metric.change).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{metric.value}</h3>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    {metric.target && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Target: {metric.target}%</span>
                          <span>Current: {typeof metric.value === 'string' ?
                            parseFloat(metric.value.replace('%', '')) : metric.value}%</span>
                        </div>
                        <Progress
                          value={typeof metric.value === 'string' ?
                            parseFloat(metric.value.replace('%', '')) : metric.value}
                          className="h-1"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Real-time Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Real-time Alerts & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Client Portal Usage Spike</p>
                    <p className="text-sm text-green-600">15.7% increase in document downloads this week</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">AI Automation Success</p>
                    <p className="text-sm text-blue-600">Phase I report processing time reduced by 18.5%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">CRM Integration Attention</p>
                    <p className="text-sm text-yellow-600">2 leads pending follow-up for over 48 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Portal Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Daily Active Users</span>
                    <span className="font-bold">247</span>
                  </div>
                  <Progress value={68} />
                  <div className="flex justify-between items-center">
                    <span>Document Downloads</span>
                    <span className="font-bold">1,523</span>
                  </div>
                  <Progress value={85} />
                  <div className="flex justify-between items-center">
                    <span>Support Tickets</span>
                    <span className="font-bold">12</span>
                  </div>
                  <Progress value={15} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employee Tool Interaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>CRM Usage</span>
                    <span className="font-bold">94%</span>
                  </div>
                  <Progress value={94} />
                  <div className="flex justify-between items-center">
                    <span>Field Data Capture</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <Progress value={78} />
                  <div className="flex justify-between items-center">
                    <span>AI Assistant Usage</span>
                    <span className="font-bold">89%</span>
                  </div>
                  <Progress value={89} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Operational Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Project Completion Rate</span>
                    <span className="font-bold">96.7%</span>
                  </div>
                  <Progress value={96.7} />
                  <div className="flex justify-between items-center">
                    <span>On-time Delivery</span>
                    <span className="font-bold">92.3%</span>
                  </div>
                  <Progress value={92.3} />
                  <div className="flex justify-between items-center">
                    <span>Resource Utilization</span>
                    <span className="font-bold">87.5%</span>
                  </div>
                  <Progress value={87.5} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Document Processing</span>
                    <span className="font-bold">+340%</span>
                  </div>
                  <Progress value={85} />
                  <div className="flex justify-between items-center">
                    <span>Lead Response Time</span>
                    <span className="font-bold">-65%</span>
                  </div>
                  <Progress value={75} />
                  <div className="flex justify-between items-center">
                    <span>Manual Tasks Reduced</span>
                    <span className="font-bold">-45%</span>
                  </div>
                  <Progress value={60} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">+23.4%</p>
                  <p className="text-sm text-gray-600">YoY Growth</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">$47,290</p>
                  <p className="text-sm text-gray-600">Monthly Savings</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">340%</p>
                  <p className="text-sm text-gray-600">12-Month ROI</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}