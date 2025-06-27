// --- Agent Definition ---
// Base interface for all purpose-built agents.
export interface Agent {
  name: string
  purpose: string
  execute: (params: Record<string, any>) => Promise<AgentResult>
}

export interface AgentResult {
  success: boolean
  summary: string
  data: Record<string, any>
}

// --- Concrete Agent Implementations ---

// 1. ProjectAnalysisAgent: Fetches raw data and provides a technical summary.
export class ProjectAnalysisAgent implements Agent {
  name = "ProjectAnalysisAgent"
  purpose = "Fetches and provides a detailed technical analysis of a specific project category."

  async execute(params: { category: string }): Promise<AgentResult> {
    if (!params.category) {
      return { success: false, summary: "Analysis failed: Project category not specified.", data: {} }
    }

    try {
      const response = await fetch(`/api/projects?query=${params.category}`)
      if (!response.ok) throw new Error("Project not found")
      const projectData = await response.json()

      return {
        success: true,
        summary: `Analysis complete for ${projectData.title}.`,
        data: {
          title: projectData.title,
          category: projectData.category,
          details: projectData.details,
          budget: projectData.budget,
          duration: projectData.duration,
        },
      }
    } catch (error) {
      return { success: false, summary: `Analysis failed for ${params.category}.`, data: { error } }
    }
  }
}

// 2. CostBenefitAgent: Performs a higher-level analysis on project data.
export class CostBenefitAgent implements Agent {
  name = "CostBenefitAgent"
  purpose = "Analyzes the cost-benefit ratio of a project based on its budget and potential impact."

  async execute(params: { category: string }): Promise<AgentResult> {
    if (!params.category) {
      return { success: false, summary: "Cost-benefit analysis failed: Category not specified.", data: {} }
    }

    try {
      // This agent also fetches data, demonstrating agent independence.
      const response = await fetch(`/api/projects?query=${params.category}`)
      if (!response.ok) throw new Error("Project data not found for cost analysis.")
      const projectData = await response.json()

      // Mock analysis logic
      const impactScore = projectData.budget > 1000000 ? "High" : "Medium"
      const riskFactor = projectData.duration.includes("months") ? "Low" : "Medium"
      const recommendation = impactScore === "High" && riskFactor === "Low" ? "Highly Recommended" : "Recommended"

      const summary = `Cost-Benefit Analysis for ${projectData.title}: Impact Score: ${impactScore}, Risk Factor: ${riskFactor}. Verdict: ${recommendation}.`

      return {
        success: true,
        summary,
        data: {
          title: projectData.title,
          category: projectData.category,
          impactScore,
          riskFactor,
          recommendation,
          budget: projectData.budget,
          duration: projectData.duration,
        },
      }
    } catch (error) {
      return { success: false, summary: `Cost-benefit analysis failed for ${params.category}.`, data: { error } }
    }
  }
}

// 3. ReportGeneratorAgent: Generates downloadable PDF reports from analysis data
export class ReportGeneratorAgent implements Agent {
  name = "ReportGeneratorAgent"
  purpose = "Generates professional PDF reports from project analysis data."

  async execute(params: { analysisData?: any; reportType?: string; category?: string }): Promise<AgentResult> {
    try {
      // If no analysis data is provided, we can fetch it ourselves
      let analysisData = params.analysisData

      if (!analysisData && params.category) {
        const response = await fetch(`/api/projects?query=${params.category}`)
        if (!response.ok) throw new Error("Could not fetch project data for report")
        analysisData = await response.json()
      }

      if (!analysisData) {
        return {
          success: false,
          summary: "Report generation failed: No analysis data provided.",
          data: {},
        }
      }

      // Generate the PDF report
      const reportData = await this.generatePDFReport(analysisData, params.reportType || "standard")

      return {
        success: true,
        summary: `PDF report generated successfully for ${analysisData.title || "project"}.`,
        data: {
          reportUrl: reportData.url,
          reportName: reportData.filename,
          generatedAt: new Date().toISOString(),
        },
      }
    } catch (error) {
      return {
        success: false,
        summary: "Report generation failed due to an unexpected error.",
        data: { error },
      }
    }
  }

  private async generatePDFReport(data: any, reportType: string): Promise<{ url: string; filename: string }> {
    // Call our PDF generation API
    const response = await fetch("/api/generate-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, reportType }),
    })

    if (!response.ok) {
      throw new Error("PDF generation API failed")
    }

    const result = await response.json()
    return result
  }
}

// --- Iris Forge Definition ---
// The Forge is a registry for creating and accessing agents.
class Forge {
  private agentRegistry = new Map<string, Agent>()

  defineAgent(agent: Agent) {
    this.agentRegistry.set(agent.name, agent)
  }

  getAgent(name: string): Agent | undefined {
    return this.agentRegistry.get(name)
  }

  listAgents(): string[] {
    return Array.from(this.agentRegistry.keys())
  }
}

// Export a singleton instance of the Forge
export const IrisForge = new Forge()
