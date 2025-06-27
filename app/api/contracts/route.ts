import { NextResponse } from "next/server"
import { database, getContracts, createContract, type Contract } from "@/lib/database"

// In-memory storage for demo. Use a database in production.
const contracts = [
  {
    id: "fed-001",
    contractName: "Federal Courthouse Site Assessment",
    contractType: "Federal",
    status: "Active",
    budget: 250000,
    scope: "Phase I & II ESA for new federal courthouse construction.",
    deadlines: [
      { name: "Initial Site Assessment Report", due: "2025-07-30" },
      { name: "Quarterly Progress Report", due: "2025-09-30" },
    ],
    reportingRequirements: "EPA Standard Format, submitted via portal.",
  },
  {
    id: "state-001",
    contractName: "State Highway Expansion Project",
    contractType: "State",
    status: "Completed",
    budget: 1200000,
    scope: "Wetland delineation and environmental impact study for highway expansion.",
    deadlines: [{ name: "Final Report", due: "2024-05-15" }],
    reportingRequirements: "State DOT environmental report format.",
  },
  {
    id: "local-001",
    contractName: "City Park Remediation",
    contractType: "Local",
    status: "Active",
    budget: 75000,
    scope: "Soil testing and remediation for former industrial site.",
    deadlines: [{ name: "Final Report", due: "2025-08-15" }],
    reportingRequirements: "Local government format.",
  },
]

export async function GET() {
  try {
    const contracts = await getContracts()
    return NextResponse.json({
      contracts,
      success: true
    })
  } catch (error) {
    console.error("Failed to fetch contracts:", error)
    return NextResponse.json(
      { error: "Failed to fetch contracts", success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title && !body.contractName) {
      return NextResponse.json(
        { error: "Contract name/title is required", success: false },
        { status: 400 }
      )
    }

    const contractData = {
      title: body.title || body.contractName,
      clientName: body.clientName || "Unknown Client",
      value: Number(body.value || body.budget || 0),
      status: body.status || "Draft" as const,
      startDate: body.startDate || new Date().toISOString(),
      endDate: body.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      description: body.description || body.scope || "",
    }

    const newContract = await createContract(contractData)

    return NextResponse.json({
      contract: newContract,
      success: true
    })
  } catch (error) {
    console.error("Failed to create contract:", error)
    return NextResponse.json(
      { error: "Failed to create contract", success: false },
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
        { error: "Contract ID is required", success: false },
        { status: 400 }
      )
    }

    const contract = await database.getContract(id)
    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found", success: false },
        { status: 404 }
      )
    }

    // Update the contract (you'll need to add updateContract method to database)
    const updatedContract = {
      ...contract,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      contract: updatedContract,
      success: true
    })
  } catch (error) {
    console.error("Failed to update contract:", error)
    return NextResponse.json(
      { error: "Failed to update contract", success: false },
      { status: 500 }
    )
  }
}
