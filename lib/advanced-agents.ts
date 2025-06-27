import type { Agent, AgentResult } from "./iris-agents"
import { logAuditEvent } from "./audit-logger"

// --- Environmental Intelligence Layer Agents ---

/**
 * Simulates fetching and fusing GIS data with project information.
 */
export class GISDataAgent implements Agent {
  name = "GISDataAgent"
  purpose = "Fuses project location with GIS layers like soil, floodplains, and EPA data."

  async execute(params: { location?: string }): Promise<AgentResult> {
    if (!params.location) {
      return { success: false, summary: "GIS Fusion failed: Location required.", data: {} }
    }
    // Mocked GIS data
    const gisData = {
      soilType: "Silty Clay Loam",
      inFloodplain: Math.random() > 0.8,
      nearbySuperfundSites: Math.floor(Math.random() * 3),
    }
    return {
      success: true,
      summary: `GIS data fused for ${params.location}. Soil: ${gisData.soilType}.`,
      data: gisData,
    }
  }
}

/**
 * Simulates matching a project to relevant environmental regulations.
 */
export class RegulatoryMatchAgent implements Agent {
  name = "RegulatoryMatchAgent"
  purpose = "Identifies relevant NEPA, HUD, DOT, EPA regulations for a project."

  async execute(params: { projectType?: string }): Promise<AgentResult> {
    const regulations = [
      { name: "NEPA Compliance", status: "Required", details: "Environmental assessment needed." },
      { name: "EPA Clean Water Act", status: "Applicable", details: "Runoff management plan required." },
      { name: "HUD Guidelines", status: "Not Applicable", details: "" },
    ]
    return {
      success: true,
      summary: `Found ${regulations.filter((r) => r.status !== "Not Applicable").length} relevant regulations.`,
      data: { regulations },
    }
  }
}

// --- Field Ops Automation Layer Agents ---

/**
 * Handles the logic for logging a smart incident.
 */
export class SmartIncidentAgent implements Agent {
  name = "SmartIncidentAgent"
  purpose = "Logs a timestamped environmental incident with photos and details."

  async execute(params: {
    description: string
    location: string
    photoUrl?: string
    contractId?: string
    relatedComplianceItem?: string
    actor?: string
  }): Promise<AgentResult> {
    const { description, location, photoUrl, contractId, relatedComplianceItem, actor } = params

    const incidentRecord = {
      id: `INC-${Date.now()}`,
      timestamp: new Date().toISOString(),
      description,
      location,
      photoUrl,
      contractId,
      relatedComplianceItem,
    }

    // In a real app, this would save to a secure database.
    // We'll use a mock API endpoint for this demo.
    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incidentRecord),
      })
      if (!response.ok) throw new Error("Failed to save incident.")

      // If the incident was successfully logged AND linked to a contract, log the audit event.
      if (contractId && relatedComplianceItem) {
        await logAuditEvent(contractId, {
          actor: actor || this.name, // Use the provided actor or default to the agent name
          action: "Incident Linked to Compliance Item",
          details: {
            incidentId: incidentRecord.id,
            incidentDescription: description,
            linkedItem: relatedComplianceItem,
          },
        })
      }

      return {
        success: true,
        summary: `Incident logged at ${location}.`,
        data: incidentRecord,
      }
    } catch (error) {
      return {
        success: false,
        summary: "Failed to log incident.",
        data: { error: (error as Error).message },
      }
    }
  }
}
