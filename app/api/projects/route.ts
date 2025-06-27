import { NextResponse } from "next/server"
import { database, getProjects, createProject, type Project } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    const projects = await getProjects()

    if (query) {
      const filteredProjects = projects.filter(
        (p) =>
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.title.toLowerCase().includes(query.toLowerCase())
      )
      if (filteredProjects.length > 0) {
        return NextResponse.json({ projects: filteredProjects, success: true })
      }
      return NextResponse.json({ error: "No projects found", success: false }, { status: 404 })
    }

    return NextResponse.json({ projects, success: true })
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects", success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.category || !body.budget) {
      return NextResponse.json(
        { error: "Missing required fields: title, category, budget", success: false },
        { status: 400 }
      )
    }

    const projectData = {
      title: body.title,
      description: body.description || body.details || "",
      status: body.status || "Planning" as const,
      category: body.category,
      budget: Number(body.budget),
      duration: body.duration || "TBD",
      clientId: body.clientId || "default-client",
      managerId: body.managerId || "default-manager",
    }

    const newProject = await createProject(projectData)

    return NextResponse.json({
      project: newProject,
      success: true
    })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json(
      { error: "Failed to create project", success: false },
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
        { error: "Project ID is required", success: false },
        { status: 400 }
      )
    }

    const updatedProject = await database.updateProject(id, updates)

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Project not found", success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      project: updatedProject,
      success: true
    })
  } catch (error) {
    console.error("Failed to update project:", error)
    return NextResponse.json(
      { error: "Failed to update project", success: false },
      { status: 500 }
    )
  }
}
