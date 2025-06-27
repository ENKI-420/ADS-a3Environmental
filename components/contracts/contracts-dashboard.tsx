"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { ContractUploadForm } from "./contract-upload-form"
import { ComplianceChecklist } from "./compliance-checklist"
import { ReportGenerator } from "./report-generator"
import { AuditTrail } from "./audit-trail"
import { ContractActions } from "./contract-actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { List, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Contract {
  id: string
  contractName: string
  contractType: "Federal" | "State" | "Local"
  status: "Active" | "Completed" | "Pending"
  scope: string
  deadlines: { name: string; due: string }[]
  reportingRequirements: string
}

export function ContractsDashboard() {
  const { role } = useAuth()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [auditRefreshKey, setAuditRefreshKey] = useState(Date.now())

  const fetchContracts = async () => {
    const response = await fetch("/api/contracts")
    const data = await response.json()
    setContracts(data)
    if (!selectedContract && data.length > 0) {
      setSelectedContract(data[0])
    } else if (selectedContract) {
      const refreshed = data.find((c: Contract) => c.id === selectedContract.id)
      setSelectedContract(refreshed || data[0] || null)
    }
    setAuditRefreshKey(Date.now())
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  const getBadgeColor = (type: string) => {
    if (type === "Federal") return "bg-blue-100 text-blue-800"
    if (type === "State") return "bg-green-100 text-green-800"
    return "bg-yellow-100 text-yellow-800"
  }

  const canProcure = role === "Project Manager" || role === "Director"

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Contracts & Compliance</h1>
        <p className="text-xl text-gray-600">IRIS-powered procurement, management, and automated reporting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {canProcure && <ContractUploadForm onContractAdded={fetchContracts} />}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Contracts</CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-3 ${viewMode === "grid" ? "grid-cols-1" : "grid-cols-1"}`}>
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    onClick={() => setSelectedContract(contract)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedContract?.id === contract.id ? "border-emerald-500 bg-emerald-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm">{contract.contractName}</p>
                      <Badge className={getBadgeColor(contract.contractType)}>{contract.contractType}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{contract.status}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {selectedContract ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedContract.contractName}</CardTitle>
                  <CardDescription>
                    <Badge className={getBadgeColor(selectedContract.contractType)}>
                      {selectedContract.contractType}
                    </Badge>
                    <span className="mx-2">|</span>
                    Status: <span className="font-semibold">{selectedContract.status}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Scope of Work</h3>
                    <p className="text-sm text-gray-600">{selectedContract.scope}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ComplianceChecklist
                      contractId={selectedContract.id}
                      initialDeadlines={selectedContract.deadlines}
                    />
                    <ReportGenerator
                      contractId={selectedContract.id}
                      contractName={selectedContract.contractName}
                      contractType={selectedContract.contractType}
                    />
                  </div>
                </CardContent>
              </Card>
              <ContractActions contractId={selectedContract.id} onAction={fetchContracts} />
              <AuditTrail contractId={selectedContract.id} refreshKey={auditRefreshKey} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
              <p className="text-gray-500">Select a contract to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
