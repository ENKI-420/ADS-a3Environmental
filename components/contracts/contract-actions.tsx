"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { logAuditEvent } from "@/lib/audit-logger"
import { useAuth } from "@/context/auth-context"
import { ThumbsUp, Eye } from "lucide-react"

interface ContractActionsProps {
  contractId: string
  onAction: () => void
}

export function ContractActions({ contractId, onAction }: ContractActionsProps) {
  const { role, user } = useAuth()

  const handleReview = async () => {
    if (!user || !role) return
    await logAuditEvent(contractId, {
      actor: `User: ${user.name} (${role})`,
      action: "Contract Reviewed",
      details: { reviewer: user.name, comments: "Scope and deadlines are clear. Proceed." },
    })
    onAction()
  }

  const handleApprove = async () => {
    if (!user || !role) return
    await logAuditEvent(contractId, {
      actor: `User: ${user.name} (${role})`,
      action: "Contract Approved",
      details: { approver: user.name, approvalType: "Final" },
    })
    onAction()
  }

  const canReview = role === "Project Manager" || role === "Director"
  const canApprove = role === "Director"

  if (!canReview && !canApprove) {
    return null // Don't show the card if the user has no actions
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifecycle Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        {canReview && (
          <Button variant="outline" onClick={handleReview}>
            <Eye className="w-4 h-4 mr-2" />
            Mark as Reviewed
          </Button>
        )}
        {canApprove && (
          <Button onClick={handleApprove}>
            <ThumbsUp className="w-4 h-4 mr-2" />
            Approve Contract
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
