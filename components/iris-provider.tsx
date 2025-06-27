"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { IrisOverlay } from "@/components/iris-overlay"
import { VoiceControlButton } from "@/components/voice-control-button"
import { useVoiceRecognition } from "@/hooks/use-voice-recognition"
import { irisMCP, type IrisState } from "@/lib/iris-mcp-sdk"
import { OrchestrationEngine, type OrchestratorState } from "@/lib/iris-orchestrator"
import { IrisForge, ProjectAnalysisAgent, CostBenefitAgent, ReportGeneratorAgent } from "@/lib/iris-agents"
import {
  SiteInspectionAgent,
  ContaminantDetectionAgent,
  ComplianceDocumentationAgent,
} from "@/lib/environmental-agents"
import { GISDataAgent, RegulatoryMatchAgent, SmartIncidentAgent } from "@/lib/advanced-agents"
import { ContractAnalysisAgent, ComplianceTrackerAgent, AutomatedReportAgent } from "@/lib/contract-agents"
import { FieldDataProcessingAgent } from "@/lib/field-data-agents"
import { ErrorBoundary } from "@/components/error-boundary"

const setupSystems = () => {
  try {
    // --- 1. Forge Agents ---
    if (typeof IrisForge.defineAgent === 'function') {
      IrisForge.defineAgent(new ProjectAnalysisAgent())
      IrisForge.defineAgent(new CostBenefitAgent())
      IrisForge.defineAgent(new ReportGeneratorAgent())
      IrisForge.defineAgent(new SiteInspectionAgent())
      IrisForge.defineAgent(new ContaminantDetectionAgent())
      IrisForge.defineAgent(new ComplianceDocumentationAgent())

      // --- 2. Add Advanced Agents from the new strategy ---
      IrisForge.defineAgent(new GISDataAgent())
      IrisForge.defineAgent(new RegulatoryMatchAgent())
      IrisForge.defineAgent(new SmartIncidentAgent())

      // --- Add Contract & Compliance Agents ---
      IrisForge.defineAgent(new ContractAnalysisAgent())
      IrisForge.defineAgent(new ComplianceTrackerAgent())
      IrisForge.defineAgent(new AutomatedReportAgent())

      // --- Add Field Data Agents ---
      IrisForge.defineAgent(new FieldDataProcessingAgent())
    }
  } catch (error) {
    console.error("Error setting up IRIS agents:", error)
  }
}

function IrisProviderContent({ children }: { children: React.ReactNode }) {
  const [mcpState, setMcpState] = useState<IrisState | null>(null)
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorState>({
    status: "IDLE",
    workflow: null,
    currentStep: 0,
    activeAgents: [],
    workflowResults: [],
  })
  const [isMounted, setIsMounted] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [initError, setInitError] = useState<string | null>(null)

  const handleTranscript = useCallback(async (transcript: string) => {
    try {
      if (irisMCP && typeof irisMCP.process === 'function') {
        await irisMCP.process(transcript)
      }
    } catch (error) {
      console.error("Error processing transcript:", error)
      setVoiceError("Failed to process voice command")
    }
  }, [])

  const handleVoiceError = useCallback((error: string) => {
    setVoiceError(error)
    console.error("Voice recognition error:", error)
    // Clear error after 5 seconds
    const timeoutId = setTimeout(() => setVoiceError(null), 5000)
    return () => clearTimeout(timeoutId)
  }, [])

  const {
    isListening,
    isSupported,
    error: voiceRecognitionError,
    toggleListening
  } = useVoiceRecognition(handleTranscript, {
    onError: handleVoiceError,
    language: "en-US",
    continuous: true,
    interimResults: false
  })

  useEffect(() => {
    let mounted = true

    const initializeSystem = async () => {
      try {
        setIsMounted(true)

        // Safe agent setup with error handling
        if (IrisForge && typeof IrisForge.listAgents === 'function') {
          const agentCount = IrisForge.listAgents().length
          if (agentCount < 13) {
            setupSystems()
          }
        } else {
          setupSystems()
        }

        // Safe MCP state initialization
        if (irisMCP && typeof irisMCP.getState === 'function') {
          const initialState = irisMCP.getState()
          if (mounted) {
            setMcpState(initialState)
          }
        }

        // Safe subscription setup
        const mcpUnsubscribe = irisMCP && typeof irisMCP.subscribe === 'function'
          ? irisMCP.subscribe((state: IrisState) => {
              if (mounted) {
                setMcpState(state)
              }
            })
          : () => {}

        const orchestratorUnsubscribe = OrchestrationEngine && typeof OrchestrationEngine.subscribe === 'function'
          ? OrchestrationEngine.subscribe((state: OrchestratorState) => {
              if (mounted) {
                setOrchestratorState(state)
              }
            })
          : () => {}

        return () => {
          mounted = false
          if (typeof mcpUnsubscribe === 'function') mcpUnsubscribe()
          if (typeof orchestratorUnsubscribe === 'function') orchestratorUnsubscribe()
        }
      } catch (error) {
        console.error("Error initializing IRIS system:", error)
        if (mounted) {
          setInitError(error instanceof Error ? error.message : "Failed to initialize IRIS system")
        }
      }
    }

    const cleanup = initializeSystem()

    return () => {
      mounted = false
      cleanup?.then(cleanupFn => {
        if (typeof cleanupFn === 'function') {
          cleanupFn()
        }
      })
    }
  }, [])

  // Handle report download from parallel workflows
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      if (orchestratorState.status === "SUCCESS" && orchestratorState.workflowResults.length > 0) {
        orchestratorState.workflowResults.flat().forEach((result) => {
          if (result.success && result.data.reportUrl) {
            const { reportUrl, reportName } = result.data
            const link = document.createElement("a")
            link.href = reportUrl
            link.download = reportName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      }
    } catch (error) {
      console.error("Error handling report download:", error)
    }
  }, [orchestratorState.status, orchestratorState.workflowResults])

  // Show error notifications
  useEffect(() => {
    if (voiceError || voiceRecognitionError || initError) {
      console.warn("System error:", voiceError || voiceRecognitionError || initError)
    }
  }, [voiceError, voiceRecognitionError, initError])

  // If there's a critical initialization error, show a simplified version
  if (initError) {
    return (
      <>
        {children}
        <div className="fixed bottom-8 right-8 z-[101] p-4 bg-red-100 border border-red-400 rounded-lg shadow-lg max-w-sm">
          <p className="text-red-800 text-sm">
            IRIS system encountered an error. Basic functionality available.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      {children}
      {isMounted && isSupported && mcpState && (
        <>
          <ErrorBoundary>
            <IrisOverlay mcpState={mcpState} orchestratorState={orchestratorState} />
          </ErrorBoundary>
          <ErrorBoundary>
            <VoiceControlButton
              isListening={isListening}
              onClick={toggleListening}
              error={voiceError || voiceRecognitionError}
            />
          </ErrorBoundary>
        </>
      )}
      {!isSupported && isMounted && (
        <div className="fixed bottom-8 right-8 z-[101] p-4 bg-yellow-100 border border-yellow-400 rounded-lg shadow-lg max-w-sm">
          <p className="text-yellow-800 text-sm">
            Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari for voice features.
          </p>
        </div>
      )}
    </>
  )
}

export function IrisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <IrisProviderContent>{children}</IrisProviderContent>
    </ErrorBoundary>
  )
}
