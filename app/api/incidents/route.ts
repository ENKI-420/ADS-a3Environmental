import { NextResponse } from "next/server"
import { database, getIncidents, createIncident, type Incident } from "@/lib/database"

// In-memory storage for demo purposes.
const incidents: any[] = []

// Add some mock initial data if the list is empty
if (incidents.length === 0) {
  incidents.push({
    id: `INC-${Date.now() - 100000}`,
    timestamp: new Date(Date.now() - 100000).toISOString(),
    location: "Lab #3",
    description: "Minor chemical spill contained.",
    photoUrl: "/placeholder.svg?height=100&width=100",
    contractId: "fed-001",
    relatedComplianceItem: "Initial Site Assessment Report",
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get("contractId")

    const incidents = await getIncidents()

    if (contractId) {
      // Filter by contract if needed (you can add contractId to incident model)
      return NextResponse.json({
        incidents: incidents.filter(i => (i as any).contractId === contractId),
        success: true
      })
    }

    return NextResponse.json({
      incidents,
      success: true
    })
  } catch (error) {
    console.error("Failed to fetch incidents:", error)
    return NextResponse.json(
      { error: "Failed to fetch incidents", success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title && !body.description) {
      return NextResponse.json(
        { error: "Either title or description is required", success: false },
        { status: 400 }
      )
    }

    const incidentData = {
      title: body.title || "Incident Report",
      description: body.description || "",
      severity: body.severity || "Medium" as const,
      status: body.status || "Open" as const,
      reportedBy: body.reportedBy || "System",
      assignedTo: body.assignedTo,
      location: body.location,
      images: body.images || [],
    }

    const newIncident = await createIncident(incidentData)

    return NextResponse.json({
      incident: newIncident,
      success: true
    })
  } catch (error) {
    console.error("Failed to create incident:", error)
    return NextResponse.json(
      { error: "Failed to create incident", success: false },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: "Incident ID is required", success: false },
        { status: 400 }
      )
    }

    const updatedIncident = await database.updateIncident(id, updates)

    if (!updatedIncident) {
      return NextResponse.json(
        { error: "Incident not found", success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      incident: updatedIncident,
      success: true
    })
  } catch (error) {
    console.error("Failed to update incident:", error)
    return NextResponse.json(
      { error: "Failed to update incident", success: false },
      { status: 500 }
    )
  }
}

