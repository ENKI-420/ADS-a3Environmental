"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, RefreshCw, Loader2 } from "lucide-react"
import { OrchestrationEngine } from "@/lib/iris-orchestrator"

interface ComplianceChecklistProps {
  contractId: string
  initialDeadlines: { name: string; due: string }[]
}

interface ComplianceItem {
  name: string
  status: "Completed" | "Pending" | "In Progress"
}

interface Incident {
  relatedComplianceItem?: string
}

export function ComplianceChecklist({ contractId, initialDeadlines }: ComplianceChecklistProps) {
  const [checklist, setChecklist] = useState<ComplianceItem[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [relatedIncidents, setRelatedIncidents] = useState<Incident[]>([])

  useEffect(() => {
    const initialChecklist = initialDeadlines.map((d) => ({ name: d.name, status: "Pending" }))
    setChecklist(initialChecklist)

    const fetchIncidents = async () => {
      const response = await fetch(`/api/incidents?contractId=${contractId}`)
      if (response.ok) {
        const data = await response.json()
        setRelatedIncidents(data)
      }
    }
    fetchIncidents()
  }, [initialDeadlines, contractId])

  const dynamicChecklist = useMemo(() => {
    return checklist.map((item) => {
      const isInProgress = relatedIncidents.some((incident) => incident.relatedComplianceItem === item.name)
      if (isInProgress && item.status === "Pending") {
        return { ...item, status: "In Progress" }
      }
      return item
    })
  }, [checklist, relatedIncidents])

  const runComplianceCheck = async () => {
    setIsChecking(true)
    const result = await OrchestrationEngine.runSingleAgent("ComplianceTrackerAgent", {
      contractId,
      deadlines: initialDeadlines,
    })
    if (result.success) {
      // Agent check only sets 'Completed' or 'Pending'. 'In Progress' is from live data.
      setChecklist(result.data.complianceStatus)
    }
    setIsChecking(false)
  }

  const getStatusIcon = (status: ComplianceItem["status"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
      case "In Progress":
        return <Loader2 className="w-5 h-5 text-blue-500 mr-3 animate-spin" />
      case "Pending":
      default:
        return <Circle className="w-5 h-5 text-gray-400 mr-3" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Compliance Checklist</CardTitle>
        <Button variant="outline" size="sm" onClick={runComplianceCheck} disabled={isChecking}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
          Check Status
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {dynamicChecklist.map((item, index) => (
            <li key={index} className="flex items-center">
              {getStatusIcon(item.status)}
              <span
                className={`flex-grow ${
                  item.status === "Completed" ? "text-gray-500 line-through" : ""
                } ${item.status === "In Progress" ? "text-blue-600" : ""}`}
              >
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
