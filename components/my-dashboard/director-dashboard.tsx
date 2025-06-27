"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StatCard } from "./stat-card"
import {
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface DashboardData {
  projects: any[]
  incidents: any[]
  contracts: any[]
  auditLog: any[]
}

export function DirectorDashboard() {
  const [data, setData] = useState<DashboardData>({
    projects: [],
    incidents: [],
    contracts: [],
    auditLog: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [projectsRes, incidentsRes, contractsRes, auditRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/incidents'),
        fetch('/api/contracts'),
        fetch('/api/audit-trail')
      ])

      const [projectsData, incidentsData, contractsData, auditData] = await Promise.all([
        projectsRes.json(),
        incidentsRes.json(),
        contractsRes.json(),
        auditRes.json()
      ])

      setData({
        projects: projectsData.projects || [],
        incidents: incidentsData.incidents || [],
        contracts: contractsData.contracts || [],
        auditLog: auditData.auditLog || []
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const calculateStats = () => {
    const totalRevenue = data.contracts.reduce((sum, contract) => sum + (contract.value || 0), 0)
    const activeProjects = data.projects.filter(p => p.status === 'Active').length
    const criticalIncidents = data.incidents.filter(i => i.severity === 'Critical' || i.severity === 'High').length
    const completedProjects = data.projects.filter(p => p.status === 'Completed').length

    return {
      totalRevenue,
      activeProjects,
      criticalIncidents,
      completedProjects
    }
  }

  const stats = calculateStats()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'planning':
        return 'bg-yellow-100 text-yellow-800'
      case 'on hold':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Director Dashboard</h1>
          <Button onClick={loadDashboardData} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Director Dashboard</h1>
          <p className="text-gray-600">Executive overview of company operations</p>
        </div>
        <Button onClick={loadDashboardData} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          description="From active contracts"
          icon={<DollarSign className="h-4 w-4" />}
          trend={stats.totalRevenue > 0 ? "up" : "neutral"}
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects.toString()}
          description="Currently in progress"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
        />
        <StatCard
          title="Critical Issues"
          value={stats.criticalIncidents.toString()}
          description="Requiring immediate attention"
          icon={<AlertTriangle className="h-4 w-4" />}
          trend={stats.criticalIncidents > 0 ? "down" : "neutral"}
        />
        <StatCard
          title="Completed Projects"
          value={stats.completedProjects.toString()}
          description="Successfully delivered"
          icon={<CheckCircle className="h-4 w-4" />}
          trend="up"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          onClick={() => window.location.href = '/ai-content-studio'}>
          <CardHeader className="text-center">
            <Badge className="mb-2 bg-purple-500 text-white w-fit mx-auto">NEW</Badge>
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">✨</span>
            </div>
            <CardTitle className="text-lg text-purple-900">AI Content Studio</CardTitle>
            <CardDescription className="text-purple-700 text-sm">
              Generate marketing content & case studies
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          onClick={() => window.location.href = '/analyst/report-studio'}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <CardTitle className="text-lg text-emerald-900">Report Studio</CardTitle>
            <CardDescription className="text-emerald-700 text-sm">
              AI-powered report generation
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          onClick={() => window.location.href = '/ai-nexus'}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-blue-900">AI Nexus</CardTitle>
            <CardDescription className="text-blue-700 text-sm">
              Central AI orchestration
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          onClick={() => window.location.href = '/google-chat-monitor'}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">💬</span>
            </div>
            <CardTitle className="text-lg text-orange-900">Chat Monitor</CardTitle>
            <CardDescription className="text-orange-700 text-sm">
              Google Chat AI monitoring
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Project Portfolio</CardTitle>
            <CardDescription>
              Current project status and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : data.projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No projects found
                </div>
              ) : (
                <div className="space-y-3">
                  {data.projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-gray-600">{project.category}</p>
                        <p className="text-sm text-gray-500">
                          Budget: ${project.budget?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Incidents</CardTitle>
            <CardDescription>
              Issues requiring executive attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : data.incidents.filter(i => i.severity === 'Critical' || i.severity === 'High').length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No critical incidents
                </div>
              ) : (
                <div className="space-y-3">
                  {data.incidents
                    .filter(i => i.severity === 'Critical' || i.severity === 'High')
                    .map((incident) => (
                      <div key={incident.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{incident.title}</h4>
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {incident.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(incident.createdAt).toLocaleDateString()}
                          <span>•</span>
                          <span>{incident.status}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Contract Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Portfolio</CardTitle>
          <CardDescription>
            Active contracts and revenue streams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : data.contracts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No contracts found
              </div>
            ) : (
              <div className="space-y-3">
                {data.contracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{contract.title}</h4>
                      <p className="text-sm text-gray-600">{contract.clientName}</p>
                      <p className="text-sm text-gray-500">
                        Value: ${contract.value?.toLocaleString() || 'N/A'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
