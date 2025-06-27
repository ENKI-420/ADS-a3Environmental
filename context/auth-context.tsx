"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

export type UserRole = "Director" | "Project Manager" | "Client" | "Technician" | null

interface AuthContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  user: { name: string } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const users: Record<string, { name: string }> = {
  Director: { name: "Bob Williams" },
  "Project Manager": { name: "Alice Johnson" },
  Client: { name: "John Doe (Client)" },
  Technician: { name: "Charlie Brown" },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null)

  const value = {
    role,
    setRole: (newRole: UserRole) => {
      setRole(newRole)
    },
    user: role ? users[role] : null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
