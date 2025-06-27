"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  Settings,
  RefreshCw,
  Users,
  Brain,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Shield,
  Eye,
  Bell,
  Database,
  Globe,
  ChevronRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsData {
  totalMessages: number
  messagesByCategory: Record<string, number>
  messagesByPriority: Record<string, number>
  averageConfidence: number
  autoResponseRate: number
  escalationRate: number
  emergencyAlerts: number
  topSenders: Array<{ name: string; count: number }>
  topEntities: Array<{ entity: string; count: number }>
  responseTimeMetrics: {
    average: number
    p95: number
    p99: number
  }
  timeSeriesData: Array<{
    timestamp: string
    messages: number
    alerts: number
    autoResponses: number
  }>
}

interface SystemStatus {
  status: 'active' | 'warning' | 'error'
  uptime: number
  lastProcessed: string
  processingRate: number
  errorRate: number
  integrations: {
    iris: 'connected' | 'disconnected' | 'warning'
    environmentalIntelligence: 'connected' | 'disconnected' | 'warning'
    alerting: 'active' | 'inactive' | 'warning'
    analytics: 'enabled' | 'disabled'
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function GoogleChatMonitorDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: 'active',
    uptime: 99.97,
    lastProcessed: new Date().toISOString(),
    processingRate: 23.4,
    errorRate: 0.03,
    integrations: {
      iris: 'connected',
      environmentalIntelligence: 'connected',
      alerting: 'active',
      analytics: 'enabled'
    }
  })
  const [timeRange, setTimeRange] = useState('24h')
  const [loading, setLoading] = useState(true)
  const [monitoringConfig, setMonitoringConfig] = useState({
    autoResponseEnabled: true,
    emergencyAlertsEnabled: true,
    confidenceThreshold: 0.7,
    escalationThreshold: 0.9,
    realTimeMonitoring: true
  })

  useEffect(() => {
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/google-chat/analytics?timeRange=${timeRange}`)
      const data = await response.json()
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    setLoading(true)
    fetchAnalytics()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'enabled':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
      case 'disconnected':
      case 'disabled':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
      case 'enabled':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'error':
      case 'disconnected':
      case 'disabled':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <p className="ml-3 text-lg">Loading Google Chat monitoring dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
              Google Chat AI Monitor
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time monitoring and analytics for A3E Environmental's Google Chat AI integration
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* System Status */}
        <Alert className={systemStatus.status === 'active' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          <Activity className="h-4 w-4" />
          <AlertTitle>System Status: {systemStatus.status.toUpperCase()}</AlertTitle>
          <AlertDescription>
            Uptime: {systemStatus.uptime}% | Processing Rate: {systemStatus.processingRate} msg/min | Error Rate: {systemStatus.errorRate}%
          </AlertDescription>
        </Alert>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalMessages.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto Response Rate</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analytics?.autoResponseRate * 100 || 0).toFixed(1)}%</div>
              <Progress value={analytics?.autoResponseRate * 100 || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{analytics?.emergencyAlerts}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.emergencyAlerts > 5 ? 'High activity' : 'Normal levels'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analytics?.averageConfidence * 100 || 0).toFixed(1)}%</div>
              <Progress value={analytics?.averageConfidence * 100 || 0} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Message Volume Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Message Volume & Alerts</CardTitle>
                  <CardDescription>Track message volume and alert generation over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="messages" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="alerts" stroke="#ff7300" strokeWidth={2} />
                      <Line type="monotone" dataKey="autoResponses" stroke="#00ff00" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Message Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Message Categories</CardTitle>
                  <CardDescription>Distribution of message types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics?.messagesByCategory || {}).map(([key, value]) => ({ name: key, value }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(analytics?.messagesByCategory || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Priority Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Priority Distribution</CardTitle>
                  <CardDescription>Message priority levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={Object.entries(analytics?.messagesByPriority || {}).map(([key, value]) => ({ priority: key, count: value }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="priority" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Senders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Top Senders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {analytics?.topSenders.map((sender, index) => (
                        <div key={sender.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="font-medium">{sender.name}</span>
                          </div>
                          <span className="text-muted-foreground">{sender.count} messages</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Top Entities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Top Environmental Entities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {analytics?.topEntities.map((entity, index) => (
                        <div key={entity.entity} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                              {index + 1}
                            </Badge>
                            <span className="font-medium">{entity.entity}</span>
                          </div>
                          <span className="text-muted-foreground">{entity.count} mentions</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {/* Mock real-time activity */}
                      <div className="flex items-start space-x-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium">High Priority Message Detected</p>
                          <p className="text-xs text-muted-foreground">Sarah Johnson mentioned "contamination spill" - Auto-escalated to emergency team</p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border border-green-200 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Auto Response Sent</p>
                          <p className="text-xs text-muted-foreground">Compliance question from Mike Chen - IRIS provided EPA regulation guidance</p>
                          <p className="text-xs text-muted-foreground">5 minutes ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                        <Eye className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Project Inquiry Processed</p>
                          <p className="text-xs text-muted-foreground">Emily Davis asked about "Project A3E-2024-001" status - Routed to project dashboard</p>
                          <p className="text-xs text-muted-foreground">8 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Response Time</span>
                      <span>{analytics?.responseTimeMetrics.average.toFixed(1)}s</span>
                    </div>
                    <Progress value={75} className="mt-1" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span>P95 Response Time</span>
                      <span>{analytics?.responseTimeMetrics.p95.toFixed(1)}s</span>
                    </div>
                    <Progress value={60} className="mt-1" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Escalation Rate</span>
                      <span>{(analytics?.escalationRate * 100 || 0).toFixed(1)}%</span>
                    </div>
                    <Progress value={analytics?.escalationRate * 100 || 0} className="mt-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Monitoring Configuration
                </CardTitle>
                <CardDescription>
                  Configure AI monitoring rules and response behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-response">Auto Response</Label>
                      <Switch
                        id="auto-response"
                        checked={monitoringConfig.autoResponseEnabled}
                        onCheckedChange={(checked) =>
                          setMonitoringConfig(prev => ({ ...prev, autoResponseEnabled: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                      <Switch
                        id="emergency-alerts"
                        checked={monitoringConfig.emergencyAlertsEnabled}
                        onCheckedChange={(checked) =>
                          setMonitoringConfig(prev => ({ ...prev, emergencyAlertsEnabled: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="realtime-monitoring">Real-time Monitoring</Label>
                      <Switch
                        id="realtime-monitoring"
                        checked={monitoringConfig.realTimeMonitoring}
                        onCheckedChange={(checked) =>
                          setMonitoringConfig(prev => ({ ...prev, realTimeMonitoring: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                      <Input
                        id="confidence-threshold"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={monitoringConfig.confidenceThreshold}
                        onChange={(e) =>
                          setMonitoringConfig(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="escalation-threshold">Escalation Threshold</Label>
                      <Input
                        id="escalation-threshold"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={monitoringConfig.escalationThreshold}
                        onChange={(e) =>
                          setMonitoringConfig(prev => ({ ...prev, escalationThreshold: parseFloat(e.target.value) }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button>Save Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  System Integrations
                </CardTitle>
                <CardDescription>
                  Monitor the status of all integrated systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(systemStatus.integrations).map(([name, status]) => (
                    <div key={name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(status)}
                        <div>
                          <p className="font-medium capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-sm text-muted-foreground">
                            {name === 'iris' && 'IRIS AI Assistant Integration'}
                            {name === 'environmentalIntelligence' && 'Environmental Intelligence System'}
                            {name === 'alerting' && 'Alert Routing & Notifications'}
                            {name === 'analytics' && 'Data Analytics & Storage'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={status === 'connected' || status === 'active' || status === 'enabled' ? 'default' : 'destructive'}>
                          {status}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}