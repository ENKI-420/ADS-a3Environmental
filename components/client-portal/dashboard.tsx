"use client"

import { useState, useEffect } from "react"
import { IncidentLogger } from "./incident-logger"
import { AskIrisChat } from "./ask-iris-chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, MapPin, Link2 } from "lucide-react"

interface Incident {
  id: string
  timestamp: string
  location: string
  description: string
  photoUrl?: string
  contractId?: string
  relatedComplianceItem?: string
}

interface Contract {
  id: string
  contractName: string
  deadlines: { name: string; due: string }[]
}

export function ClientPortalDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])

  const fetchIncidents = async () => {
    const response = await fetch("/api/incidents")
    const data = await response.json()
    setIncidents(data)
  }

  const fetchContracts = async () => {
    const response = await fetch("/api/contracts")
    const data = await response.json()
    setContracts(data)
  }

  useEffect(() => {
    fetchIncidents()
    fetchContracts()
    const interval = setInterval(fetchIncidents, 5000) // Poll for new incidents
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Client Command Center</h1>
        <p className="text-xl text-gray-600">Real-time project visibility powered by IRIS.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Incident Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[440px]">
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="flex items-start gap-4 p-3 border rounded-lg">
                      {incident.photoUrl && (
                        <img
                          src={incident.photoUrl || "/placeholder.svg"}
                          alt="Incident"
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-grow">
                        <p className="font-medium">{incident.description}</p>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {incident.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(incident.timestamp).toLocaleString()}
                          </span>
                          {incident.relatedComplianceItem && (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <Link2 className="w-3 h-3" /> {incident.relatedComplianceItem}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">New</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <IncidentLogger contracts={contracts} />
        </div>
        <div className="lg:col-span-1">
          <AskIrisChat />
        </div>
      </div>
    </div>
  )
}
