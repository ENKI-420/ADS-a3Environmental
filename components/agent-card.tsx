"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cpu, FileText, Bot, Trash2 } from "lucide-react"

interface AgentCardProps {
  agentName: string
  isOverlay?: boolean
  onRemove: (stepIndex: number, taskIndex: number) => void
  stepIndex: number
  taskIndex: number
}

const getAgentIcon = (name: string) => {
  if (name.includes("Analysis")) return <Cpu className="w-4 h-4" />
  if (name.includes("Report") || name.includes("Documentation")) return <FileText className="w-4 h-4" />
  return <Bot className="w-4 h-4" />
}

export function AgentCard({ agentName, isOverlay = false, onRemove, stepIndex, taskIndex }: AgentCardProps) {
  return (
    <Card className={`transition-shadow hover:shadow-md ${isOverlay ? "shadow-xl" : ""}`}>
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-emerald-600">{getAgentIcon(agentName)}</div>
          <span className="font-medium">{agentName.replace(/Agent$/, "")}</span>
        </div>
        {!isOverlay && (
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => onRemove(stepIndex, taskIndex)}>
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
