import { NextRequest, NextResponse } from "next/server"

// CRM Integration for A3E Strategic Transformation
// Phase 1: Foundation Build - CRM Integration

interface CRMLead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  projectType: 'Phase I ESA' | 'Phase II ESA' | 'Remediation' | 'Compliance' | 'Other'
  source: 'website' | 'referral' | 'cold_call' | 'linkedin' | 'trade_show' | 'other'
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  value?: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  notes?: string
  lastActivity?: string
  createdAt: string
  updatedAt: string
}

interface CRMActivity {
  id: string
  leadId: string
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'follow_up' | 'note'
  description: string
  outcome?: string
  nextAction?: string
  scheduledDate?: string
  completedAt?: string
  createdBy: string
}

interface CRMAnalytics {
  totalLeads: number
  conversionRate: number
  averageDealValue: number
  salesCycle: number
  leadsBySource: Record<string, number>
  leadsByStatus: Record<string, number>
  monthlyTrends: {
    month: string
    leads: number
    conversions: number
    revenue: number
  }[]
}

// In-memory storage (replace with actual CRM integration)
let leads: CRMLead[] = [
  {
    id: "lead-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "(555) 123-4567",
    company: "TechCorp Industries",
    projectType: "Phase I ESA",
    source: "website",
    status: "qualified",
    value: 15000,
    priority: "high",
    assignedTo: "Mike Chen",
    notes: "Interested in due diligence for potential acquisition",
    lastActivity: "Sent Phase I proposal",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "lead-002",
    firstName: "David",
    lastName: "Martinez",
    email: "d.martinez@construction.com",
    phone: "(555) 987-6543",
    company: "Martinez Construction",
    projectType: "Phase II ESA",
    source: "referral",
    status: "proposal",
    value: 45000,
    priority: "urgent",
    assignedTo: "Lisa Thompson",
    notes: "Contamination found in Phase I, needs immediate Phase II",
    lastActivity: "Proposal sent, awaiting response",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "lead-003",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.r@greendev.com",
    phone: "(555) 456-7890",
    company: "Green Development LLC",
    projectType: "Compliance",
    source: "linkedin",
    status: "new",
    value: 8500,
    priority: "medium",
    notes: "Needs help with EPA compliance for new facility",
    lastActivity: "Initial contact made",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
]

let activities: CRMActivity[] = [
  {
    id: "activity-001",
    leadId: "lead-001",
    type: "call",
    description: "Initial consultation call",
    outcome: "Qualified lead, interested in Phase I ESA",
    nextAction: "Send proposal",
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "Mike Chen"
  },
  {
    id: "activity-002",
    leadId: "lead-002",
    type: "proposal",
    description: "Phase II ESA proposal submitted",
    outcome: "Awaiting client response",
    nextAction: "Follow up in 3 days",
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    createdBy: "Lisa Thompson"
  }
]

// GET - Retrieve CRM data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const leadId = searchParams.get('leadId')

    switch (type) {
      case 'leads':
        const status = searchParams.get('status')
        const assignedTo = searchParams.get('assignedTo')

        let filteredLeads = leads
        if (status) {
          filteredLeads = filteredLeads.filter(lead => lead.status === status)
        }
        if (assignedTo) {
          filteredLeads = filteredLeads.filter(lead => lead.assignedTo === assignedTo)
        }

        return NextResponse.json({
          success: true,
          data: filteredLeads,
          total: filteredLeads.length
        })

      case 'activities':
        let filteredActivities = activities
        if (leadId) {
          filteredActivities = filteredActivities.filter(activity => activity.leadId === leadId)
        }

        return NextResponse.json({
          success: true,
          data: filteredActivities,
          total: filteredActivities.length
        })

      case 'analytics':
        const analytics: CRMAnalytics = {
          totalLeads: leads.length,
          conversionRate: (leads.filter(l => l.status === 'won').length / leads.length) * 100,
          averageDealValue: leads.reduce((sum, lead) => sum + (lead.value || 0), 0) / leads.length,
          salesCycle: 14, // Average days
          leadsBySource: leads.reduce((acc, lead) => {
            acc[lead.source] = (acc[lead.source] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          leadsByStatus: leads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          monthlyTrends: [
            { month: 'Jan 2024', leads: 45, conversions: 12, revenue: 180000 },
            { month: 'Feb 2024', leads: 52, conversions: 15, revenue: 225000 },
            { month: 'Mar 2024', leads: 38, conversions: 11, revenue: 165000 }
          ]
        }

        return NextResponse.json({
          success: true,
          data: analytics
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('CRM API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST - Create new lead or activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'lead':
        const newLead: CRMLead = {
          id: `lead-${Date.now()}`,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          company: data.company,
          projectType: data.projectType || 'Other',
          source: data.source || 'website',
          status: 'new',
          value: data.value,
          priority: data.priority || 'medium',
          assignedTo: data.assignedTo,
          notes: data.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        leads.push(newLead)

        // Auto-assign based on project type
        if (!newLead.assignedTo) {
          if (newLead.projectType.includes('Phase I')) {
            newLead.assignedTo = 'Mike Chen'
          } else if (newLead.projectType.includes('Phase II')) {
            newLead.assignedTo = 'Lisa Thompson'
          } else if (newLead.projectType === 'Remediation') {
            newLead.assignedTo = 'David Rodriguez'
          }
        }

        // Create initial activity
        const initialActivity: CRMActivity = {
          id: `activity-${Date.now()}`,
          leadId: newLead.id,
          type: 'note',
          description: 'Lead created from website form',
          nextAction: 'Initial contact within 24 hours',
          createdBy: 'System'
        }
        activities.push(initialActivity)

        return NextResponse.json({
          success: true,
          data: newLead,
          message: 'Lead created successfully'
        })

      case 'activity':
        const newActivity: CRMActivity = {
          id: `activity-${Date.now()}`,
          leadId: data.leadId,
          type: data.type,
          description: data.description,
          outcome: data.outcome,
          nextAction: data.nextAction,
          scheduledDate: data.scheduledDate,
          completedAt: data.completedAt,
          createdBy: data.createdBy || 'Unknown'
        }

        activities.push(newActivity)

        // Update lead's last activity
        const lead = leads.find(l => l.id === data.leadId)
        if (lead) {
          lead.lastActivity = data.description
          lead.updatedAt = new Date().toISOString()
        }

        return NextResponse.json({
          success: true,
          data: newActivity,
          message: 'Activity logged successfully'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('CRM API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT - Update lead or activity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id, data } = body

    switch (type) {
      case 'lead':
        const leadIndex = leads.findIndex(l => l.id === id)
        if (leadIndex === -1) {
          return NextResponse.json({
            success: false,
            error: 'Lead not found'
          }, { status: 404 })
        }

        leads[leadIndex] = {
          ...leads[leadIndex],
          ...data,
          updatedAt: new Date().toISOString()
        }

        return NextResponse.json({
          success: true,
          data: leads[leadIndex],
          message: 'Lead updated successfully'
        })

      case 'activity':
        const activityIndex = activities.findIndex(a => a.id === id)
        if (activityIndex === -1) {
          return NextResponse.json({
            success: false,
            error: 'Activity not found'
          }, { status: 404 })
        }

        activities[activityIndex] = {
          ...activities[activityIndex],
          ...data
        }

        return NextResponse.json({
          success: true,
          data: activities[activityIndex],
          message: 'Activity updated successfully'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('CRM API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Webhook endpoint for external CRM integrations (HubSpot, Salesforce, etc.)
export async function POST_WEBHOOK(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, event, data } = body

    // Process webhook from external CRM
    switch (source) {
      case 'hubspot':
        // Handle HubSpot webhook
        console.log('HubSpot webhook received:', event, data)
        break

      case 'salesforce':
        // Handle Salesforce webhook
        console.log('Salesforce webhook received:', event, data)
        break

      default:
        console.log('Unknown CRM webhook:', source, event, data)
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    })
  } catch (error) {
    console.error('CRM Webhook Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Webhook processing failed'
    }, { status: 500 })
  }
}