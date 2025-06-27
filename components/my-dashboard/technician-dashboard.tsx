"use client"

import { useState, useEffect } from "react"
import { IncidentLogger } from "@/components/client-portal/incident-logger"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Clock } from "lucide-react"

interface Incident {
  id: string
  timestamp: string
  location: string
  description: string
}
interface Contract {
  id: string
  contractName: string
  deadlines: { name: string; due: string }[]
}

export function TechnicianDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])

  useEffect(() => {
    async function fetchData() {
      const incidentsRes = await fetch("/api/incidents")
      const incidentsData = await incidentsRes.json()
      setIncidents(incidentsData)

      const contractsRes = await fetch("/api/contracts")
      const contractsData = await contractsRes.json()
      setContracts(contractsData)
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Technician Field Hub</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncidentLogger contracts={contracts} />
        <Card>
          <CardHeader>
            <CardTitle>Recent Site Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="p-3 border rounded-lg">
                    <p className="font-medium">{incident.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {incident.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(incident.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
