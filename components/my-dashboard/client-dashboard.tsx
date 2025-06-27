"use client"

import { useState, useEffect } from "react"
import { AskIrisChat } from "@/components/client-portal/ask-iris-chat"
import { ComplianceChecklist } from "@/components/contracts/compliance-checklist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Contract {
  id: string
  contractName: string
  deadlines: { name: string; due: string }[]
}

export function ClientDashboard() {
  const [myContract, setMyContract] = useState<Contract | null>(null)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/contracts")
      const data = await res.json()
      // Mock: Assign the first federal contract to this client
      setMyContract(data.find((c: Contract) => c.id === "fed-001") || null)
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, Client</h1>
      {myContract ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Status: {myContract.contractName}</CardTitle>
            </CardHeader>
            <CardContent>
              <ComplianceChecklist contractId={myContract.id} initialDeadlines={myContract.deadlines} />
            </CardContent>
          </Card>
          <AskIrisChat />
        </div>
      ) : (
        <p>Loading your project information...</p>
      )}
    </div>
  )
}
