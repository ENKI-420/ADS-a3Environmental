"use client"

import { useState, useEffect } from "react"
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import type { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core"
import { AgentPalette } from "./agent-palette"
import { WorkflowCanvas } from "./workflow-canvas"
import { AgentCard } from "./agent-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { IrisForge } from "@/lib/iris-agents"
import { OrchestrationEngine, type AgentTask, type AgentWorkflow } from "@/lib/iris-orchestrator"
import { Play, Trash2, Save } from "lucide-react"
import { WorkflowLibrary } from "./workflow-library"

export function WorkflowEditor() {
  const [availableAgents, setAvailableAgents] = useState<string[]>([])
  const [workflow, setWorkflow] = useState<AgentWorkflow>([[]])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [workflowName, setWorkflowName] = useState("My Custom Workflow")
  const [libraryKey, setLibraryKey] = useState(Date.now()) // To force library refresh

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  useEffect(() => {
    setAvailableAgents(IrisForge.listAgents())
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const isActiveFromPalette = active.id.toString().startsWith("palette-")
    const isOverCanvas = over.id.toString().startsWith("canvas-")

    if (isActiveFromPalette && isOverCanvas) {
      const agentName = active.id.toString().replace("palette-", "")
      const [stepIndex, taskIndex] = over.id.toString().replace("canvas-", "").split("-").map(Number) || [0, 0]

      if (workflow[stepIndex]?.[taskIndex]?.agentName === agentName) return

      setWorkflow((prev) => {
        const newWorkflow = prev.map((step) => step.filter((task) => task.agentName !== "placeholder"))
        const newTask: AgentTask = {
          type: "AGENT_EXECUTION",
          agentName,
          params: { category: "industrial" },
        }
        if (!newWorkflow[stepIndex]) newWorkflow[stepIndex] = []
        newWorkflow[stepIndex].splice(taskIndex, 0, newTask)
        return newWorkflow
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    const cleanedWorkflow = workflow.map((step) => step.filter((task) => task.agentName !== "placeholder"))

    if (!over) {
      setWorkflow(cleanedWorkflow)
      return
    }

    const isActiveFromPalette = active.id.toString().startsWith("palette-")
    const isOverCanvas = over.id.toString().startsWith("canvas-")

    if (isActiveFromPalette && isOverCanvas) {
      const agentName = active.id.toString().replace("palette-", "")
      const [stepIndex, taskIndex] = over.id.toString().replace("canvas-", "").split("-").map(Number)
      setWorkflow((prev) => {
        const newWorkflow = prev.map((step) => step.filter((task) => task.agentName !== "placeholder"))
        const newTask: AgentTask = {
          type: "AGENT_EXECUTION",
          agentName,
          params: { category: "industrial" },
        }
        if (!newWorkflow[stepIndex]) newWorkflow[stepIndex] = []
        newWorkflow[stepIndex][taskIndex] = newTask
        return newWorkflow.filter((step) => step.length > 0)
      })
      return
    }

    if (active.id.toString().startsWith("canvas-") && over.id.toString().startsWith("canvas-")) {
      const [oldStepIndex, oldTaskIndex] = active.id.toString().replace("canvas-", "").split("-").map(Number)
      const [newStepIndex, newTaskIndex] = over.id.toString().replace("canvas-", "").split("-").map(Number)

      setWorkflow((prev) => {
        const newWorkflow = prev.map((step) => step.filter((task) => task.agentName !== "placeholder"))
        const taskToMove = newWorkflow[oldStepIndex][oldTaskIndex]
        newWorkflow[oldStepIndex].splice(oldTaskIndex, 1)
        if (newWorkflow[newStepIndex]) {
          newWorkflow[newStepIndex].splice(newTaskIndex, 0, taskToMove)
        }
        return newWorkflow.filter((step) => step.length > 0)
      })
    }
  }

  const runWorkflow = () => {
    const validWorkflow = workflow.filter((step) => step.length > 0)
    if (validWorkflow.length > 0) {
      OrchestrationEngine.startWorkflow(validWorkflow)
    }
  }

  const addStep = () => {
    setWorkflow((prev) => [...prev.filter((step) => step.length > 0), []])
  }

  const removeTask = (stepIndex: number, taskIndex: number) => {
    setWorkflow((prev) => {
      const newWorkflow = [...prev]
      newWorkflow[stepIndex].splice(taskIndex, 1)
      return newWorkflow.filter((step) => step.length > 0)
    })
  }

  const saveWorkflow = () => {
    const validWorkflow = workflow.filter((step) => step.length > 0)
    if (validWorkflow.length === 0 || !workflowName) return

    const stored = localStorage.getItem("iris_workflows")
    const savedWorkflows = stored ? JSON.parse(stored) : []

    const newSavedWorkflow = {
      id: `wf-${Date.now()}`,
      name: workflowName,
      workflow: validWorkflow,
    }

    const updatedWorkflows = [...savedWorkflows, newSavedWorkflow]
    localStorage.setItem("iris_workflows", JSON.stringify(updatedWorkflows))
    setLibraryKey(Date.now()) // Force refresh
  }

  const loadWorkflow = (wf: AgentWorkflow, name: string) => {
    setWorkflow(wf)
    setWorkflowName(name)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>IRIS Workflow Forge</CardTitle>
        <CardDescription>
          Build, save, and load custom automation workflows. Drag agents into steps to build your sequence.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <AgentPalette agents={availableAgents} />
            <div className="mt-6">
              <WorkflowLibrary key={libraryKey} onLoadWorkflow={loadWorkflow} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCenter}
            >
              <WorkflowCanvas workflow={workflow} onRemoveTask={removeTask} onAddStep={addStep} />
              <DragOverlay>
                {activeId ? (
                  <AgentCard
                    agentName={activeId.replace(/palette-|canvas-\d+-\d+-/, "")}
                    isOverlay
                    onRemove={() => {}}
                    stepIndex={0}
                    taskIndex={0}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
        <div className="mt-6 border-t pt-6 flex flex-col sm:flex-row items-center gap-4">
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Enter workflow name"
            className="max-w-xs"
          />
          <Button
            variant="outline"
            onClick={saveWorkflow}
            disabled={workflow.every((step) => step.length === 0) || !workflowName}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Workflow
          </Button>
          <div className="flex-grow" />
          <Button
            variant="outline"
            onClick={() => {
              setWorkflow([[]])
              setWorkflowName("My Custom Workflow")
            }}
            disabled={workflow.every((step) => step.length === 0)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button onClick={runWorkflow} disabled={workflow.every((step) => step.length === 0)}>
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
