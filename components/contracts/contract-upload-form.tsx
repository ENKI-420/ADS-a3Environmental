"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import { OrchestrationEngine } from "@/lib/iris-orchestrator"
import { logAuditEvent } from "@/lib/audit-logger"
import { useAuth } from "@/context/auth-context"

interface ContractUploadFormProps {
  onContractAdded: () => void
}

export function ContractUploadForm({ onContractAdded }: ContractUploadFormProps) {
  const { user, role } = useAuth()
  const [contractName, setContractName] = useState("")
  const [contractType, setContractType] = useState<"Federal" | "State" | "Local">("Federal")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcure = async () => {
    if (!contractName || !contractType || !user || !role) return
    setIsProcessing(true)

    const newContractData = {
      contractName,
      contractType,
      status: "Pending",
      scope: "Awaiting analysis...",
      deadlines: [],
      reportingRequirements: "Awaiting analysis...",
    }

    const createResponse = await fetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContractData),
    })

    if (!createResponse.ok) {
      setIsProcessing(false)
      return
    }

    const { contract: createdContract } = await createResponse.json()
    const contractId = createdContract.id

    await logAuditEvent(contractId, {
      actor: `User: ${user.name} (${role})`,
      action: "Contract Procured",
      details: { name: contractName, type: contractType },
    })

    await OrchestrationEngine.runSingleAgent("ContractAnalysisAgent", {
      contractId,
      contractName,
      contractType,
    })

    onContractAdded()
    setContractName("")
    setIsProcessing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Procure New Contract</CardTitle>
        <CardDescription>Simulate uploading a new contract for IRIS to analyze and manage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Contract Name (e.g., City Park Remediation)"
          value={contractName}
          onChange={(e) => setContractName(e.target.value)}
        />
        <Select onValueChange={(v: any) => setContractType(v)} defaultValue={contractType}>
          <SelectTrigger>
            <SelectValue placeholder="Select contract type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Federal">Federal</SelectItem>
            <SelectItem value="State">State</SelectItem>
            <SelectItem value="Local">Local</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleProcure} disabled={isProcessing || !contractName} className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          {isProcessing ? "Analyzing..." : "Procure and Analyze"}
        </Button>
      </CardContent>
    </Card>
  )
}
