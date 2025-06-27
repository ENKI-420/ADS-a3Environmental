import { useDraggable } from "@dnd-kit/core"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AgentCard } from "./agent-card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AgentPaletteProps {
  agents: string[]
}

export function AgentPalette({ agents }: AgentPaletteProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Palette</CardTitle>
        <CardDescription>Drag an agent to the canvas</CardDescription>
      </CardHeader>
      <ScrollArea className="h-48 p-4">
        <div className="space-y-3">
          {agents.map((agentName) => (
            <DraggableAgent key={agentName} agentName={agentName} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}

function DraggableAgent({ agentName }: { agentName: string }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette-${agentName}`,
    data: { agentName },
  })

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <AgentCard agentName={agentName} onRemove={() => {}} stepIndex={0} taskIndex={0} />
    </div>
  )
}
