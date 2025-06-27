import { NextResponse } from "next/server"

const templates = [
  { id: "epa-risk-matrix", name: "EPA Risk Matrix", type: "Federal" },
  { id: "hud-4010", name: "HUD Form 4010", type: "Federal" },
  { id: "dot-env-impact", name: "DOT Environmental Impact Statement", type: "State" },
  { id: "local-zoning-compliance", name: "Local Zoning Compliance Report", type: "Local" },
]

export async function GET() {
  return NextResponse.json(templates)
}
