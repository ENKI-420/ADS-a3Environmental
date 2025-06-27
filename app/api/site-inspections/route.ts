import { NextResponse } from "next/server"
import { database, type SiteInspection } from "@/lib/database"

// In-memory storage for demo (use a real database in production)
const inspections: any[] = []

export async function GET() {
  try {
    const inspections = await database.getSiteInspections()
    return NextResponse.json({
      inspections,
      success: true
    })
  } catch (error) {
    console.error("Failed to fetch site inspections:", error)
    return NextResponse.json(
      { error: "Failed to fetch site inspections", success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.siteAddress || !body.inspectionType || !body.inspectorId) {
      return NextResponse.json(
        { error: "Missing required fields: siteAddress, inspectionType, inspectorId", success: false },
        { status: 400 }
      )
    }

    const inspectionData = {
      siteAddress: body.siteAddress,
      inspectionType: body.inspectionType,
      findings: body.findings || [],
      status: body.status || "Scheduled" as const,
      inspectorId: body.inspectorId,
      reportUrl: body.reportUrl,
    }

    const newInspection = await database.createSiteInspection(inspectionData)

    return NextResponse.json({
      inspection: newInspection,
      success: true
    })
  } catch (error) {
    console.error("Failed to create site inspection:", error)
    return NextResponse.json(
      { error: "Failed to create site inspection", success: false },
      { status: 500 }
    )
  }
}
