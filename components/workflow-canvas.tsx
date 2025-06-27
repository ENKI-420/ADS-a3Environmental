"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AgentCard } from "./agent-card"
import type { AgentWorkflow, AgentTask } from "@/lib/iris-orchestrator"
import { GripVertical, Plus, ArrowDown } from "lucide-react"

interface WorkflowCanvasProps {
  workflow: AgentWorkflow
  onRemoveTask: (stepIndex: number, taskIndex: number) => void
  onAddStep: () => void
}

export function WorkflowCanvas({ workflow, onRemoveTask, onAddStep }: WorkflowCanvasProps) {
  return (
    <Card className="bg-gray-50/50">
      <CardHeader>
        <CardTitle>Workflow Canvas</CardTitle>
        <CardDescription>Agents in the same step run in parallel.</CardDescription>
      </CardHeader>
      <div className="p-4 space-y-4">
        <SortableContext items={workflow.flatMap((step, i) => step.map((_, j) => `canvas-${i}-${j}`))}>
          {workflow.map((step, stepIndex) => (
            <div key={stepIndex}>
              <WorkflowStep step={step} stepIndex={stepIndex} onRemoveTask={onRemoveTask} />
              {stepIndex < workflow.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowDown className="w-5 h-5 text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </SortableContext>
        <Button variant="outline" className="w-full bg-transparent" onClick={onAddStep}>
          <Plus className="w-4 h-4 mr-2" />
          Add Sequential Step
        </Button>
      </div>
    </Card>
  )
}

function WorkflowStep({
  step,
  stepIndex,
  onRemoveTask,
}: { step: AgentTask[]; stepIndex: number; onRemoveTask: (stepIndex: number, taskIndex: number) => void }) {
  const { setNodeRef } = useDroppable({
    id: `step-${stepIndex}`,
  })

  return (
    <div ref={setNodeRef} className="p-4 border-2 border-dashed rounded-lg bg-white min-h-[100px]">
      <div className="text-xs font-semibold text-gray-400 mb-2 uppercase">Step {stepIndex + 1} (Parallel)</div>
      {step.length > 0 ? (
        <div className="space-y-2">
          {step.map((task, taskIndex) => (
            <SortableAgent
              key={taskIndex}
              task={task}
              stepIndex={stepIndex}
              taskIndex={taskIndex}
              onRemove={onRemoveTask}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">Drop agents here</div>
      )}
    </div>
  )
}

function SortableAgent({
  task,
  stepIndex,
  taskIndex,
  onRemove,
}: { task: AgentTask; stepIndex: number; taskIndex: number; onRemove: (si: number, ti: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `canvas-${stepIndex}-${taskIndex}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div {...attributes} {...listeners} className="cursor-grab p-2 text-gray-400">
        <GripVertical />
      </div>
      <div className="flex-grow">
        <AgentCard agentName={task.agentName} onRemove={onRemove} stepIndex={stepIndex} taskIndex={taskIndex} />
      </div>
    </div>
  )
}
