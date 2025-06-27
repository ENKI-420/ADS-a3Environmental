"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"
import { OrchestrationEngine } from "@/lib/iris-orchestrator"

interface ReportGeneratorProps {
  contractId: string
  contractName: string
  contractType: "Federal" | "State" | "Local"
}

interface Template {
  id: string
  name: string
  type: string
}

export function ReportGenerator({ contractId, contractName, contractType }: ReportGeneratorProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await fetch("/api/compliance-templates")
      const data = await response.json()
      const filteredTemplates = data.filter((t: Template) => t.type === contractType)
      setTemplates(filteredTemplates)
      setSelectedTemplate("") // Reset selection when contract changes
    }
    fetchTemplates()
  }, [contractType])

  const handleGenerate = async () => {
    if (!selectedTemplate) return
    setIsGenerating(true)
    const result = await OrchestrationEngine.runSingleAgent("AutomatedReportAgent", {
      contractId,
      contractName,
      reportTemplate: selectedTemplate,
      projectData: {
        /* In real app, pass relevant project data */
      },
    })

    if (result.success && result.data.reportUrl) {
      const link = document.createElement("a")
      link.href = result.data.reportUrl
      link.download = result.data.reportName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    setIsGenerating(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Reporting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
          <SelectTrigger>
            <SelectValue placeholder="Select a report template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerate} disabled={!selectedTemplate || isGenerating} className="w-full">
          <FileText className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </CardContent>
    </Card>
  )
}
