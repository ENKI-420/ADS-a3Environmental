"use client"

import { useAuth, type UserRole } from "@/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"

export function RoleSwitcher() {
  const { role, setRole, user } = useAuth()

  if (!role) {
    return (
      <Select onValueChange={(value: UserRole) => setRole(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Login As..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Director">Director</SelectItem>
          <SelectItem value="Project Manager">Project Manager</SelectItem>
          <SelectItem value="Client">Client</SelectItem>
          <SelectItem value="Technician">Technician</SelectItem>
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4" />
        <span>{user?.name}</span>
        <span className="text-xs text-gray-500">({role})</span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => setRole(null)} className="w-8 h-8">
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  )
}
