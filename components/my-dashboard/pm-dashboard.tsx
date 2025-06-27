"use client"

import { useState, useEffect } from "react"
import { StatCard } from "./stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Contract {
  id: string
  contractName: string
  status: string
  deadlines: { name: string; due: string }[]
}

export function ProjectManagerDashboard() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState(0)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/contracts")
      const data = await res.json()
      const activeContracts = data.filter((c: Contract) => c.status === "Active")
      setContracts(activeContracts)

      const deadlines = activeContracts.flatMap((c: Contract) => c.deadlines)
      const upcoming = deadlines.filter((d: { due: string }) => new Date(d.due) > new Date()).length
      setUpcomingDeadlines(upcoming)
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Project Manager's Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="My Active Contracts"
          value={contracts.length.toString()}
          icon={<Briefcase className="w-4 h-4" />}
        />
        <StatCard
          title="Upcoming Deadlines"
          value={upcomingDeadlines.toString()}
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard title="Pending Reviews" value="2" icon={<AlertTriangle className="w-4 h-4" />} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Active Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {contracts.map((c) => (
              <li key={c.id} className="text-sm">
                <Link href="/contracts" className="text-blue-500 hover:underline">
                  {c.contractName}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
