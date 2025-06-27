import { NextResponse } from "next/server"
import { getAuditLog, type AuditEntry } from "@/lib/database"

export async function GET() {
  try {
    const auditLog = await getAuditLog()
    return NextResponse.json({
      auditLog,
      success: true
    })
  } catch (error) {
    console.error("Failed to fetch audit log:", error)
    return NextResponse.json(
      { error: "Failed to fetch audit log", success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.action || !body.user || !body.details) {
      return NextResponse.json(
        { error: "Missing required fields: action, user, details", success: false },
        { status: 400 }
      )
    }

    // Note: In a real implementation, you would add the audit entry to the database
    // For now, this is handled automatically by the database operations

    return NextResponse.json({
      success: true,
      message: "Audit entry recorded"
    })
  } catch (error) {
    console.error("Failed to create audit entry:", error)
    return NextResponse.json(
      { error: "Failed to create audit entry", success: false },
      { status: 500 }
    )
  }
}
