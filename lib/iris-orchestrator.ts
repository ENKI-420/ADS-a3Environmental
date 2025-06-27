import { type AgentResult, IrisForge } from "./iris-agents"

// --- Orchestrator State and Types ---
export type OrchestratorStatus = "IDLE" | "RUNNING" | "SUCCESS" | "FAILED"

export interface AgentTask {
  agentName: string
  params: Record<string, any>
}

// A workflow is now an array of "steps". Each step is an array of tasks.
// Tasks within a step run in parallel. Steps run sequentially.
export type AgentWorkflow = AgentTask[][]

export interface OrchestratorState {
  status: OrchestratorStatus
  workflow: AgentWorkflow | null
  currentStep: number
  activeAgents: string[]
  workflowResults: AgentResult[][] // Results are now stored per step
}

type Listener = (state: OrchestratorState) => void

// --- Orchestration Engine Class ---
class Engine {
  private listeners: Listener[] = []
  private state: OrchestratorState = {
    status: "IDLE",
    workflow: null,
    currentStep: 0,
    activeAgents: [],
    workflowResults: [],
  }

  // --- New Method: Run Single Agent ---
  async runSingleAgent(agentName: string, params: Record<string, any>): Promise<AgentResult> {
    const agent = IrisForge.getAgent(agentName)
    if (!agent) {
      const errorMsg = `Agent '${agentName}' not found.`
      console.error(errorMsg)
      return { success: false, summary: errorMsg, data: {} }
    }

    try {
      this.updateState({ activeAgents: [agentName] })
      const result = await agent.execute(params)
      this.updateState({ activeAgents: [] })
      return result
    } catch (error: any) {
      this.updateState({ activeAgents: [] })
      return { success: false, summary: error.message, data: { error } }
    }
  }

  // --- Core Method: Start Workflow ---
  async startWorkflow(workflow: AgentWorkflow): Promise<void> {
    if (this.state.status === "RUNNING") {
      console.warn("Orchestrator is already running a workflow.")
      return
    }
    this.updateState({
      status: "RUNNING",
      workflow,
      currentStep: 0,
      workflowResults: [],
      activeAgents: [],
    })
    this.executeNextStep()
  }

  private async executeNextStep(): Promise<void> {
    const { workflow, currentStep, workflowResults } = this.state
    if (!workflow || currentStep >= workflow.length) {
      this.updateState({ status: "SUCCESS", activeAgents: [] })
      return
    }

    const currentStepTasks = workflow[currentStep]
    this.updateState({ activeAgents: currentStepTasks.map((t) => t.agentName) })

    try {
      // Combine data from all tasks in the *previous* step
      const previousStepResults = currentStep > 0 ? workflowResults[currentStep - 1] || [] : []
      const previousData = previousStepResults.reduce((acc, result) => ({ ...acc, ...result.data }), {})

      // Execute all tasks in the current step in parallel
      const promises = currentStepTasks.map((task) => {
        const agent = IrisForge.getAgent(task.agentName)
        if (!agent) throw new Error(`Agent '${task.agentName}' not found.`)
        const params = { ...previousData, ...task.params }
        return agent.execute(params)
      })

      const results = await Promise.all(promises)
      const newResults = [...workflowResults, results]
      this.updateState({ workflowResults: newResults })

      // If any agent in the parallel step failed, fail the whole workflow
      if (results.some((res) => !res.success)) {
        throw new Error("One or more agents in the parallel step failed.")
      }

      // If successful, move to the next step
      this.updateState({ currentStep: currentStep + 1 })
      this.executeNextStep()
    } catch (error: any) {
      this.failWorkflow(error.message)
    }
  }

  private failWorkflow(summary: string) {
    this.updateState({
      status: "FAILED",
      activeAgents: [],
      workflowResults: [...this.state.workflowResults, [{ success: false, summary, data: {} }]],
    })
  }

  // --- State Management ---
  subscribe(listener: Listener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private updateState(newState: Partial<OrchestratorState>) {
    this.state = { ...this.state, ...newState }
    this.notifyListeners()
  }
}

export const OrchestrationEngine = new Engine()
