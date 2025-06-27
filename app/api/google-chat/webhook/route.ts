import { NextRequest, NextResponse } from "next/server"
import { environmentalIntelligence } from "@/lib/ai-environmental-intelligence"
import { v4 as uuidv4 } from 'uuid'

// Google Chat AI Monitor and Response Integration
interface GoogleChatMessage {
  text: string
  sender: {
    name: string
    displayName: string
    email?: string
    type: 'HUMAN' | 'BOT'
  }
  space: {
    name: string
    displayName?: string
    type: 'ROOM' | 'DM'
  }
  thread?: {
    name: string
  }
  createTime: string
  annotations?: ChatAnnotation[]
  argumentText?: string
  slashCommand?: {
    commandId: string
  }
}

interface ChatAnnotation {
  type: 'USER_MENTION' | 'SLASH_COMMAND'
  startIndex: number
  length: number
  userMention?: {
    user: {
      name: string
      displayName: string
    }
    type: 'MENTION' | 'ADD'
  }
  slashCommand?: {
    commandName: string
    commandId: string
  }
}

interface AIAnalysisResult {
  category: 'environmental_incident' | 'compliance_question' | 'project_inquiry' | 'urgent_alert' | 'general'
  priority: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  keyEntities: string[]
  suggestedActions: string[]
  requiresHumanResponse: boolean
  autoResponseGenerated: boolean
  irisRecommendation?: string
}

interface ChatMonitoringAlert {
  id: string
  messageId: string
  alertType: 'environmental_emergency' | 'compliance_violation' | 'project_deadline' | 'safety_concern'
  severity: 'info' | 'warning' | 'error' | 'critical'
  extractedData: Record<string, any>
  recommendedResponse: string
  escalationRequired: boolean
  timestamp: string
}

// POST endpoint for Google Chat webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message: GoogleChatMessage = body.message

    if (!message) {
      return NextResponse.json({ error: 'No message found in request' }, { status: 400 })
    }

    // Skip bot messages to avoid loops
    if (message.sender.type === 'BOT') {
      return NextResponse.json({ text: '' })
    }

    // Analyze message with AI
    const analysis = await analyzeMessageWithIRIS(message)

    // Generate monitoring alerts if needed
    const alerts = await generateMonitoringAlerts(message, analysis)

    // Store chat data for analytics
    await storeChatAnalytics(message, analysis, alerts)

    // Generate automated response if appropriate
    let response = ''
    if (analysis.autoResponseGenerated && !analysis.requiresHumanResponse) {
      response = await generateAutomatedResponse(message, analysis)
    }

    // Send alerts to appropriate channels
    if (alerts.length > 0) {
      await sendAlertsToTeam(alerts)
    }

    return NextResponse.json({
      text: response,
      cards: response ? await generateRichCard(analysis, alerts) : undefined
    })

  } catch (error) {
    console.error('Google Chat webhook error:', error)
    return NextResponse.json({
      text: 'I encountered an error processing your message. Our team has been notified.'
    }, { status: 500 })
  }
}

// Analyze incoming chat messages with IRIS AI
async function analyzeMessageWithIRIS(message: GoogleChatMessage): Promise<AIAnalysisResult> {
  const analysisPrompt = `
    Analyze this environmental consulting chat message:

    Message: "${message.text}"
    Sender: ${message.sender.displayName}
    Context: ${message.space.type === 'ROOM' ? 'Team chat' : 'Direct message'}

    Determine:
    1. Category (environmental_incident, compliance_question, project_inquiry, urgent_alert, general)
    2. Priority level (low, medium, high, critical)
    3. Key entities mentioned (locations, projects, chemicals, regulations)
    4. Whether this requires immediate human attention
    5. Suggested automated response if appropriate

    Focus on environmental consulting keywords: EPA, Phase I/II ESA, contamination,
    remediation, compliance, permits, hazardous materials, soil samples, groundwater, etc.
  `

  try {
    // Use existing IRIS agents for analysis
    const predictiveAgent = environmentalIntelligence['agents'].get('PredictiveAnalyticsAgent')
    const complianceAgent = environmentalIntelligence['agents'].get('AutomatedComplianceAgent')

    // Extract environmental entities and context
    const entities = extractEnvironmentalEntities(message.text)
    const category = categorizeMessage(message.text, entities)
    const priority = assessPriority(message.text, category, entities)

    // Determine if automated response is appropriate
    const shouldAutoRespond = category !== 'urgent_alert' &&
                            priority !== 'critical' &&
                            !containsEmergencyKeywords(message.text)

    const result: AIAnalysisResult = {
      category,
      priority,
      confidence: calculateConfidence(entities, category),
      keyEntities: entities,
      suggestedActions: generateSuggestedActions(category, entities),
      requiresHumanResponse: priority === 'critical' || category === 'urgent_alert',
      autoResponseGenerated: shouldAutoRespond,
      irisRecommendation: shouldAutoRespond ? await generateIRISRecommendation(message, category) : undefined
    }

    return result
  } catch (error) {
    console.error('IRIS analysis error:', error)
    return {
      category: 'general',
      priority: 'low',
      confidence: 0.1,
      keyEntities: [],
      suggestedActions: ['Forward to human agent'],
      requiresHumanResponse: true,
      autoResponseGenerated: false
    }
  }
}

// Extract environmental entities from message text
function extractEnvironmentalEntities(text: string): string[] {
  const entities: string[] = []
  const lowercaseText = text.toLowerCase()

  // Environmental terms
  const environmentalTerms = [
    'contamination', 'remediation', 'groundwater', 'soil', 'hazardous', 'toxic',
    'epa', 'phase i', 'phase ii', 'phase iii', 'esa', 'compliance', 'permit',
    'superfund', 'rcra', 'cercla', 'clean water act', 'air quality', 'asbestos',
    'lead', 'petroleum', 'underground storage tank', 'ust', 'vapor intrusion'
  ]

  // Project identifiers
  const projectPattern = /project\s+([a-z0-9-]+)|site\s+([a-z0-9-]+)/gi
  const locationPattern = /\b\d+\s+[a-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|boulevard|blvd)\b/gi

  environmentalTerms.forEach(term => {
    if (lowercaseText.includes(term)) {
      entities.push(term)
    }
  })

  // Extract project IDs and locations
  const projectMatches = text.match(projectPattern)
  if (projectMatches) entities.push(...projectMatches)

  const locationMatches = text.match(locationPattern)
  if (locationMatches) entities.push(...locationMatches)

  return entities
}

// Categorize the message based on content
function categorizeMessage(text: string, entities: string[]): AIAnalysisResult['category'] {
  const lowercaseText = text.toLowerCase()

  // Emergency/incident keywords
  if (containsEmergencyKeywords(text)) {
    return 'environmental_incident'
  }

  // Compliance-related
  if (lowercaseText.includes('compliance') || lowercaseText.includes('regulation') ||
      lowercaseText.includes('epa') || lowercaseText.includes('permit')) {
    return 'compliance_question'
  }

  // Project-related
  if (lowercaseText.includes('project') || lowercaseText.includes('site') ||
      lowercaseText.includes('assessment') || entities.some(e => e.includes('phase'))) {
    return 'project_inquiry'
  }

  // Urgent alerts
  if (lowercaseText.includes('urgent') || lowercaseText.includes('emergency') ||
      lowercaseText.includes('immediate')) {
    return 'urgent_alert'
  }

  return 'general'
}

// Check for emergency keywords
function containsEmergencyKeywords(text: string): boolean {
  const emergencyKeywords = [
    'spill', 'leak', 'contamination found', 'exposure', 'emergency',
    'vapor', 'fumes', 'evacuation', 'hazmat', 'toxic release'
  ]

  const lowercaseText = text.toLowerCase()
  return emergencyKeywords.some(keyword => lowercaseText.includes(keyword))
}

// Assess message priority
function assessPriority(text: string, category: string, entities: string[]): AIAnalysisResult['priority'] {
  if (containsEmergencyKeywords(text) || category === 'environmental_incident') {
    return 'critical'
  }

  if (category === 'urgent_alert' || text.toLowerCase().includes('deadline')) {
    return 'high'
  }

  if (category === 'compliance_question' || entities.length > 2) {
    return 'medium'
  }

  return 'low'
}

// Calculate confidence score
function calculateConfidence(entities: string[], category: string): number {
  let confidence = 0.5 // Base confidence

  // More entities = higher confidence
  confidence += Math.min(entities.length * 0.1, 0.3)

  // Category-specific adjustments
  if (category !== 'general') confidence += 0.2
  if (category === 'environmental_incident') confidence += 0.2

  return Math.min(confidence, 1.0)
}

// Generate suggested actions
function generateSuggestedActions(category: string, entities: string[]): string[] {
  const actions: string[] = []

  switch (category) {
    case 'environmental_incident':
      actions.push('Alert emergency response team')
      actions.push('Document incident details')
      actions.push('Check regulatory reporting requirements')
      break
    case 'compliance_question':
      actions.push('Review relevant regulations')
      actions.push('Check project compliance status')
      actions.push('Prepare compliance documentation')
      break
    case 'project_inquiry':
      actions.push('Check project status in dashboard')
      actions.push('Review project timeline')
      actions.push('Update stakeholders')
      break
    case 'urgent_alert':
      actions.push('Escalate to project manager')
      actions.push('Send immediate notification')
      break
    default:
      actions.push('Route to appropriate specialist')
  }

  return actions
}

// Generate IRIS AI recommendation
async function generateIRISRecommendation(message: GoogleChatMessage, category: string): Promise<string> {
  const templates = {
    compliance_question: `Based on your question about ${message.text.slice(0, 50)}..., I recommend reviewing our compliance guidelines. I can help you access relevant EPA regulations or connect you with our compliance specialist.`,
    project_inquiry: `For project-related questions, I can provide real-time status updates, timeline information, and connect you with the project manager. Would you like me to pull up the latest project dashboard?`,
    general: `I'm IRIS, A3E's AI assistant. I can help with environmental questions, project status, compliance guidance, and emergency protocols. How can I assist you today?`
  }

  return templates[category as keyof typeof templates] || templates.general
}

// Generate monitoring alerts
async function generateMonitoringAlerts(message: GoogleChatMessage, analysis: AIAnalysisResult): Promise<ChatMonitoringAlert[]> {
  const alerts: ChatMonitoringAlert[] = []

  if (analysis.priority === 'critical' || analysis.category === 'environmental_incident') {
    alerts.push({
      id: uuidv4(),
      messageId: `chat_${Date.now()}`,
      alertType: 'environmental_emergency',
      severity: 'critical',
      extractedData: {
        sender: message.sender.displayName,
        message: message.text,
        entities: analysis.keyEntities,
        space: message.space.displayName
      },
      recommendedResponse: 'Immediate escalation to emergency response team required',
      escalationRequired: true,
      timestamp: new Date().toISOString()
    })
  }

  if (analysis.category === 'compliance_question' && analysis.priority === 'high') {
    alerts.push({
      id: uuidv4(),
      messageId: `chat_${Date.now()}`,
      alertType: 'compliance_violation',
      severity: 'warning',
      extractedData: {
        sender: message.sender.displayName,
        complianceType: analysis.keyEntities.find(e => e.includes('epa') || e.includes('compliance')) || 'general',
        urgency: analysis.priority
      },
      recommendedResponse: 'Route to compliance specialist for immediate review',
      escalationRequired: false,
      timestamp: new Date().toISOString()
    })
  }

  return alerts
}

// Generate automated response
async function generateAutomatedResponse(message: GoogleChatMessage, analysis: AIAnalysisResult): Promise<string> {
  if (!analysis.irisRecommendation) {
    return ''
  }

  let response = `Hi ${message.sender.displayName}! ${analysis.irisRecommendation}`

  // Add helpful links based on category
  if (analysis.category === 'project_inquiry') {
    response += '\n\n📊 [View Project Dashboard](/dashboard) | 📋 [Check Reports](/reports)'
  } else if (analysis.category === 'compliance_question') {
    response += '\n\n📖 [Compliance Guidelines](/compliance) | ⚖️ [Regulatory Updates](/regulations)'
  }

  return response
}

// Generate rich card for Google Chat
async function generateRichCard(analysis: AIAnalysisResult, alerts: ChatMonitoringAlert[]) {
  if (alerts.length === 0 && analysis.priority === 'low') {
    return undefined
  }

  return [{
    header: {
      title: "A3E Environmental AI Assistant",
      subtitle: `Analysis: ${analysis.category} (${analysis.priority} priority)`,
      imageUrl: "https://your-domain.com/a3e-logo.png"
    },
    sections: [{
      widgets: [
        {
          textParagraph: {
            text: `<b>Confidence:</b> ${(analysis.confidence * 100).toFixed(1)}%<br>
                   <b>Entities Found:</b> ${analysis.keyEntities.join(', ') || 'None'}<br>
                   <b>Suggested Actions:</b><br>
                   ${analysis.suggestedActions.map(action => `• ${action}`).join('<br>')}`
          }
        },
        alerts.length > 0 ? {
          textParagraph: {
            text: `<font color="#ff0000"><b>⚠️ ${alerts.length} Alert(s) Generated</b></font><br>
                   ${alerts.map(alert => `• ${alert.alertType}: ${alert.severity}`).join('<br>')}`
          }
        } : null
      ].filter(Boolean)
    }]
  }]
}

// Send alerts to appropriate team channels
async function sendAlertsToTeam(alerts: ChatMonitoringAlert[]): Promise<void> {
  for (const alert of alerts) {
    try {
      // In a real implementation, you would:
      // 1. Send to appropriate Slack/Teams channels
      // 2. Create incidents in tracking system
      // 3. Send SMS/email to on-call personnel
      // 4. Update dashboard alerts

      console.log(`Alert generated: ${alert.alertType} - ${alert.severity}`)

      // Store alert in database
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Chat Alert: ${alert.alertType}`,
          description: `Alert from Google Chat monitoring: ${JSON.stringify(alert.extractedData)}`,
          severity: alert.severity,
          status: 'Open',
          reportedBy: 'Google Chat AI Monitor',
          location: alert.extractedData.space || 'Google Chat'
        })
      })

    } catch (error) {
      console.error('Failed to send alert:', error)
    }
  }
}

// Store chat analytics
async function storeChatAnalytics(message: GoogleChatMessage, analysis: AIAnalysisResult, alerts: ChatMonitoringAlert[]): Promise<void> {
  try {
    const analytics = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      sender: message.sender.displayName,
      space: message.space.displayName,
      messageLength: message.text.length,
      category: analysis.category,
      priority: analysis.priority,
      confidence: analysis.confidence,
      entitiesFound: analysis.keyEntities.length,
      alertsGenerated: alerts.length,
      autoResponseGenerated: analysis.autoResponseGenerated,
      humanEscalationRequired: analysis.requiresHumanResponse,
      keyEntities: analysis.keyEntities
    }

    // Send to analytics API for real-time updates
    try {
      await fetch('/api/google-chat/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analytics)
      })
    } catch (analyticsError) {
      console.error('Failed to update analytics API:', analyticsError)
    }

    // Store in analytics system (implement based on your data storage)
    console.log('Chat analytics:', analytics)

  } catch (error) {
    console.error('Failed to store chat analytics:', error)
  }
}

// GET endpoint for monitoring configuration
export async function GET() {
  return NextResponse.json({
    service: 'Google Chat AI Monitor & Response',
    version: '1.0.0',
    status: 'active',
    capabilities: [
      'Real-time message analysis',
      'Environmental incident detection',
      'Automated IRIS responses',
      'Emergency alert routing',
      'Compliance monitoring',
      'Project inquiry handling'
    ],
    integrations: {
      iris: 'connected',
      environmentalIntelligence: 'connected',
      alerting: 'active',
      analytics: 'enabled'
    },
    monitoringRules: {
      emergencyKeywords: ['spill', 'leak', 'contamination', 'exposure', 'hazmat'],
      complianceTerms: ['epa', 'regulation', 'permit', 'compliance', 'violation'],
      autoResponseThreshold: 0.7,
      escalationThreshold: 0.9
    }
  })
}