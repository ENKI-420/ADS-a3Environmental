"use client"

import { useAuth } from "@/context/auth-context"
import { RoleSwitcher } from "@/components/auth/role-switcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DirectorDashboard } from "./director-dashboard"
import { ProjectManagerDashboard } from "./pm-dashboard"
import { ClientDashboard } from "./client-dashboard"
import { TechnicianDashboard } from "./technician-dashboard"

export function MyDashboard() {
  const { role } = useAuth()

  const renderDashboard = () => {
    switch (role) {
      case "Director":
        return <DirectorDashboard />
      case "Project Manager":
        return <ProjectManagerDashboard />
      case "Client":
        return <ClientDashboard />
      case "Technician":
        return <TechnicianDashboard />
      default:
        return null
    }
  }

  if (!role) {
    return (
      <div className="container mx-auto px-4 py-32">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Welcome to the A3E Command Center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Please select a role to log in and view your personalized dashboard.</p>
            <RoleSwitcher />
          </CardContent>
        </Card>
      </div>
    )
  }

  return <div className="container mx-auto px-4 py-8">{renderDashboard()}</div>
}
