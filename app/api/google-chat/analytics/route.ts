import { NextRequest, NextResponse } from "next/server"

interface ChatAnalytics {
  totalMessages: number
  messagesByCategory: Record<string, number>
  messagesByPriority: Record<string, number>
  averageConfidence: number
  autoResponseRate: number
  escalationRate: number
  emergencyAlerts: number
  topSenders: Array<{ name: string; count: number }>
  topEntities: Array<{ entity: string; count: number }>
  responseTimeMetrics: {
    average: number
    p95: number
    p99: number
  }
  timeSeriesData: Array<{
    timestamp: string
    messages: number
    alerts: number
    autoResponses: number
  }>
}

// Mock data - in production, this would come from your database
let analyticsData: ChatAnalytics = {
  totalMessages: 0,
  messagesByCategory: {
    environmental_incident: 0,
    compliance_question: 0,
    project_inquiry: 0,
    urgent_alert: 0,
    general: 0
  },
  messagesByPriority: {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  },
  averageConfidence: 0,
  autoResponseRate: 0,
  escalationRate: 0,
  emergencyAlerts: 0,
  topSenders: [],
  topEntities: [],
  responseTimeMetrics: {
    average: 0,
    p95: 0,
    p99: 0
  },
  timeSeriesData: []
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '24h'
    const groupBy = searchParams.get('groupBy') || 'hour'

    // In production, fetch real data from database based on timeRange
    const filteredData = await getAnalyticsData(timeRange)

    return NextResponse.json({
      success: true,
      data: filteredData,
      metadata: {
        timeRange,
        groupBy,
        lastUpdated: new Date().toISOString(),
        dataPoints: filteredData.timeSeriesData.length
      }
    })

  } catch (error) {
    console.error('Error fetching chat analytics:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const analyticsUpdate = await request.json()

    // Update analytics data
    analyticsData.totalMessages += 1
    analyticsData.messagesByCategory[analyticsUpdate.category] += 1
    analyticsData.messagesByPriority[analyticsUpdate.priority] += 1

    // Update confidence average
    const newTotal = analyticsData.totalMessages
    const oldAvg = analyticsData.averageConfidence
    analyticsData.averageConfidence = ((oldAvg * (newTotal - 1)) + analyticsUpdate.confidence) / newTotal

    // Update rates
    if (analyticsUpdate.autoResponseGenerated) {
      analyticsData.autoResponseRate = calculateRate('autoResponse')
    }

    if (analyticsUpdate.humanEscalationRequired) {
      analyticsData.escalationRate = calculateRate('escalation')
    }

    if (analyticsUpdate.alertsGenerated > 0) {
      analyticsData.emergencyAlerts += analyticsUpdate.alertsGenerated
    }

    // Update top senders
    updateTopSenders(analyticsUpdate.sender)

    // Update top entities
    analyticsUpdate.keyEntities?.forEach((entity: string) => {
      updateTopEntities(entity)
    })

    // Add to time series
    addToTimeSeries(analyticsUpdate)

    return NextResponse.json({
      success: true,
      message: 'Analytics updated successfully'
    })

  } catch (error) {
    console.error('Error updating analytics:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update analytics'
    }, { status: 500 })
  }
}

async function getAnalyticsData(timeRange: string): Promise<ChatAnalytics> {
  // In production, this would query your database
  // For now, return mock data with some realistic values

  return {
    ...analyticsData,
    totalMessages: Math.max(analyticsData.totalMessages, 156),
    messagesByCategory: {
      environmental_incident: 8,
      compliance_question: 23,
      project_inquiry: 67,
      urgent_alert: 12,
      general: 46
    },
    messagesByPriority: {
      low: 89,
      medium: 45,
      high: 18,
      critical: 4
    },
    averageConfidence: 0.847,
    autoResponseRate: 0.734,
    escalationRate: 0.141,
    emergencyAlerts: 12,
    topSenders: [
      { name: 'Sarah Johnson', count: 23 },
      { name: 'Mike Chen', count: 19 },
      { name: 'Emily Davis', count: 15 },
      { name: 'Alex Rodriguez', count: 12 },
      { name: 'Jessica Lee', count: 11 }
    ],
    topEntities: [
      { entity: 'phase ii', count: 34 },
      { entity: 'epa', count: 28 },
      { entity: 'contamination', count: 21 },
      { entity: 'compliance', count: 19 },
      { entity: 'groundwater', count: 16 }
    ],
    responseTimeMetrics: {
      average: 1.2,
      p95: 2.8,
      p99: 4.1
    },
    timeSeriesData: generateTimeSeriesData(timeRange)
  }
}

function calculateRate(type: 'autoResponse' | 'escalation'): number {
  // Calculate rates based on current data
  const total = analyticsData.totalMessages
  if (total === 0) return 0

  // This would be calculated from actual data in production
  return type === 'autoResponse' ? 0.73 : 0.14
}

function updateTopSenders(sender: string) {
  const existing = analyticsData.topSenders.find(s => s.name === sender)
  if (existing) {
    existing.count += 1
  } else {
    analyticsData.topSenders.push({ name: sender, count: 1 })
  }

  // Keep only top 10
  analyticsData.topSenders.sort((a, b) => b.count - a.count)
  analyticsData.topSenders = analyticsData.topSenders.slice(0, 10)
}

function updateTopEntities(entity: string) {
  const existing = analyticsData.topEntities.find(e => e.entity === entity)
  if (existing) {
    existing.count += 1
  } else {
    analyticsData.topEntities.push({ entity, count: 1 })
  }

  // Keep only top 15
  analyticsData.topEntities.sort((a, b) => b.count - a.count)
  analyticsData.topEntities = analyticsData.topEntities.slice(0, 15)
}

function addToTimeSeries(data: any) {
  const now = new Date()
  const timestamp = now.toISOString()

  // Add to time series (simplified - in production, you'd aggregate by time periods)
  analyticsData.timeSeriesData.push({
    timestamp,
    messages: 1,
    alerts: data.alertsGenerated || 0,
    autoResponses: data.autoResponseGenerated ? 1 : 0
  })

  // Keep only last 24 hours of data points
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  analyticsData.timeSeriesData = analyticsData.timeSeriesData.filter(
    point => new Date(point.timestamp) > twentyFourHoursAgo
  )
}

function generateTimeSeriesData(timeRange: string) {
  const data = []
  const now = new Date()
  const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720 // 30d

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      timestamp: timestamp.toISOString(),
      messages: Math.floor(Math.random() * 15) + 1,
      alerts: Math.floor(Math.random() * 3),
      autoResponses: Math.floor(Math.random() * 10) + 1
    })
  }

  return data
}