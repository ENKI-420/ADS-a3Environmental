"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Upload } from "lucide-react"
import type { AgentWorkflow } from "@/lib/iris-orchestrator"

interface SavedWorkflow {
  id: string
  name: string
  workflow: AgentWorkflow
}

interface WorkflowLibraryProps {
  onLoadWorkflow: (workflow: AgentWorkflow, name: string) => void
}

export function WorkflowLibrary({ onLoadWorkflow }: WorkflowLibraryProps) {
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("iris_workflows")
    if (stored) {
      setSavedWorkflows(JSON.parse(stored))
    }
  }, [])

  const deleteWorkflow = (id: string) => {
    const updatedWorkflows = savedWorkflows.filter((w) => w.id !== id)
    setSavedWorkflows(updatedWorkflows)
    localStorage.setItem("iris_workflows", JSON.stringify(updatedWorkflows))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Library</CardTitle>
        <CardDescription>Load or delete saved workflows.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          {savedWorkflows.length > 0 ? (
            <div className="space-y-2">
              {savedWorkflows.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
                  <span className="font-medium text-sm">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7"
                      onClick={() => onLoadWorkflow(item.workflow, item.name)}
                    >
                      <Upload className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => deleteWorkflow(item.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">No saved workflows.</div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
