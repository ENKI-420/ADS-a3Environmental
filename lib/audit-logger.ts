"use server"

export interface AuditEvent {
  timestamp: string
  actor: string
  action: string
  details?: Record<string, any>
}

// Helper function to get the correct base URL
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client side - use current origin
    return window.location.origin
  }

  // Server side - try environment variables
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Fallback for local development
  return 'http://localhost:3000'
}

export const logAuditEvent = async (contractId: string, event: Omit<AuditEvent, "timestamp">) => {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/audit-trail`

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contractId, event }),
    })

    if (!response.ok) {
      throw new Error(`Audit logging failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to log audit event:", error)

    // Store in localStorage as fallback for client-side operations
    if (typeof window !== 'undefined') {
      try {
        const fallbackKey = `audit_fallback_${contractId}`
        const existing = localStorage.getItem(fallbackKey)
        const events = existing ? JSON.parse(existing) : []

        events.push({
          ...event,
          timestamp: new Date().toISOString(),
          _fallback: true
        })

        localStorage.setItem(fallbackKey, JSON.stringify(events))
        console.warn("Audit event stored locally as fallback")
      } catch (storageError) {
        console.error("Failed to store audit event in localStorage:", storageError)
      }
    }

    throw error
  }
}

// Function to retrieve and sync fallback audit events
export const syncFallbackAuditEvents = async (): Promise<void> => {
  if (typeof window === 'undefined') return

  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('audit_fallback_'))

    for (const key of keys) {
      const contractId = key.replace('audit_fallback_', '')
      const events = JSON.parse(localStorage.getItem(key) || '[]')

      for (const event of events) {
        if (event._fallback) {
          try {
            await logAuditEvent(contractId, {
              actor: event.actor,
              action: event.action,
              details: { ...event.details, _recovered: true }
            })
          } catch (error) {
            console.error(`Failed to sync fallback event for contract ${contractId}:`, error)
            break // Stop trying for this contract if one fails
          }
        }
      }

      // Clear the fallback data after successful sync
      localStorage.removeItem(key)
    }
  } catch (error) {
    console.error("Failed to sync fallback audit events:", error)
  }
}
