"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Bot, User, FileText, CheckSquare, FileUp, Search, Download, ThumbsUp, Eye, Link2 } from "lucide-react"
import type { AuditEvent } from "@/lib/audit-logger"

interface AuditTrailProps {
  contractId: string
  refreshKey: number
}

const getEventIcon = (action: string) => {
  if (action.includes("Incident Linked")) return <Link2 className="w-4 h-4" />
  if (action.includes("Analyzed")) return <FileUp className="w-4 h-4" />
  if (action.includes("Report")) return <FileText className="w-4 h-4" />
  if (action.includes("Compliance") || action.includes("Checked")) return <CheckSquare className="w-4 h-4" />
  if (action.includes("Reviewed")) return <Eye className="w-4 h-4" />
  if (action.includes("Approved")) return <ThumbsUp className="w-4 h-4" />
  if (action.includes("Procured")) return <User className="w-4 h-4" />
  return <Bot className="w-4 h-4" />
}

const generateReport = (data: AuditEvent[], contractId: string) => {
  const headers = "Timestamp,Actor,Action,Details\n"
  const rows = data
    .map((event) => {
      const details = JSON.stringify(event.details || {}).replace(/"/g, '""')
      return `"${event.timestamp}","${event.actor}","${event.action}","${details}"`
    })
    .join("\n")

  const csvContent = headers + rows
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.setAttribute("download", `audit_trail_${contractId}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function AuditTrail({ contractId, refreshKey }: AuditTrailProps) {
  const [trail, setTrail] = useState<AuditEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actorFilter, setActorFilter] = useState<"all" | "user" | "agent">("all")

  useEffect(() => {
    const fetchTrail = async () => {
      setIsLoading(true)
      const response = await fetch(`/api/audit-trail?contractId=${contractId}`)
      if (response.ok) {
        const data = await response.json()
        setTrail(data)
      }
      setIsLoading(false)
    }
    fetchTrail()
  }, [contractId, refreshKey])

  const filteredTrail = useMemo(() => {
    return trail
      .filter((event) => {
        if (actorFilter === "user") return event.actor.toLowerCase().startsWith("user")
        if (actorFilter === "agent") return event.actor.toLowerCase().endsWith("agent")
        return true
      })
      .filter((event) => {
        const search = searchTerm.toLowerCase()
        return (
          event.action.toLowerCase().includes(search) ||
          event.actor.toLowerCase().includes(search) ||
          JSON.stringify(event.details).toLowerCase().includes(search)
        )
      })
  }, [trail, searchTerm, actorFilter])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Immutable Audit Trail</CardTitle>
        <CardDescription>A detailed, secure log of all actions performed on this contract.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search actions, actors, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <ToggleGroup
            type="single"
            value={actorFilter}
            onValueChange={(value: "all" | "user" | "agent") => value && setActorFilter(value)}
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="user">
              <User className="w-4 h-4 mr-2" /> Users
            </ToggleGroupItem>
            <ToggleGroupItem value="agent">
              <Bot className="w-4 h-4 mr-2" /> Agents
            </ToggleGroupItem>
          </ToggleGroup>
          <Button variant="outline" onClick={() => generateReport(filteredTrail, contractId)}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <ScrollArea className="h-96">
          {isLoading ? (
            <p className="text-gray-500">Loading audit trail...</p>
          ) : filteredTrail.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No matching audit events found.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredTrail.map((event, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:bg-gray-50/50 px-2 rounded-md">
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        {getEventIcon(event.action)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{event.action}</p>
                        <p className="text-xs text-gray-500">
                          by {event.actor} on {new Date(event.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 ml-12 border-l-2">
                    <h4 className="font-semibold text-xs uppercase text-gray-400 mb-2">Event Details</h4>
                    <div className="text-xs font-mono bg-gray-900 text-white p-3 rounded-md overflow-x-auto">
                      <pre>{JSON.stringify(event.details || {}, null, 2)}</pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
