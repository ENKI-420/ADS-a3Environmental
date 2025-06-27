"use client"

import type { IrisState } from "@/lib/iris-mcp-sdk"
import type { OrchestratorState } from "@/lib/iris-orchestrator"
import { motion, AnimatePresence } from "framer-motion"

interface IrisOverlayProps {
  mcpState: IrisState
  orchestratorState: OrchestratorState
}

export function IrisOverlay({ mcpState, orchestratorState }: IrisOverlayProps) {
  const getOrchestratorStatusText = () => {
    const { status, workflow, currentStep, activeAgents } = orchestratorState
    if (status === "IDLE") return null
    if (status === "RUNNING" && workflow) {
      const agentNames = activeAgents.join(", ")
      return `STEP ${currentStep + 1}/${workflow.length}: [${agentNames}]`
    }
    return status
  }

  const getFinalWorkflowSummary = () => {
    if (orchestratorState.status !== "SUCCESS" && orchestratorState.status !== "FAILED") return null
    const lastStepResults = orchestratorState.workflowResults[orchestratorState.workflowResults.length - 1] || []
    const summaries = lastStepResults.map((res) => res.summary).join(" | ")
    return `Workflow ${orchestratorState.status}: ${summaries || "Completed."}`
  }

  const contextInfo = getFinalWorkflowSummary() || mcpState.contextInfo
  const contextTitle = orchestratorState.status !== "IDLE" ? "ORCHESTRATOR" : "MCP CONTEXT"

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none text-white font-mono p-4 md:p-8">
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
        {/* Top Left: System Status */}
        <div className="col-start-1 row-start-1 flex items-start justify-start space-x-4">
          <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg">
            <p className="text-sm text-emerald-300">MCP STATUS</p>
            <p className="text-lg font-bold tracking-widest">{mcpState.status}</p>
          </div>
          <AnimatePresence>
            {orchestratorState.status !== "IDLE" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-black/30 backdrop-blur-sm p-3 rounded-lg"
              >
                <p className="text-sm text-cyan-300">WORKFLOW STATUS</p>
                <p className="text-lg font-bold tracking-widest">{getOrchestratorStatusText()}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Center: Context / Prompt */}
        <div className="col-span-3 col-start-1 row-start-3 flex items-end justify-center">
          <AnimatePresence>
            {contextInfo && (
              <motion.div
                key={contextInfo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-black/30 backdrop-blur-sm p-4 rounded-lg text-center max-w-3xl"
              >
                <p className="text-sm text-emerald-300">{contextTitle}</p>
                <p className="text-lg">{contextInfo}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
