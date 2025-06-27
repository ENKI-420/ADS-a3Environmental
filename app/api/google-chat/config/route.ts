import { NextRequest, NextResponse } from "next/server"

interface MonitoringConfig {
  autoResponseEnabled: boolean
  emergencyAlertsEnabled: boolean
  confidenceThreshold: number
  escalationThreshold: number
  realTimeMonitoring: boolean
  emergencyKeywords: string[]
  complianceTerms: string[]
  notificationChannels: {
    slack?: string
    teams?: string
    email?: string[]
    sms?: string[]
  }
  businessHours: {
    start: string
    end: string
    timezone: string
    weekdays: number[]
  }
  rateLimiting: {
    maxMessagesPerMinute: number
    maxAlertsPerHour: number
  }
}

// Default configuration
let config: MonitoringConfig = {
  autoResponseEnabled: true,
  emergencyAlertsEnabled: true,
  confidenceThreshold: 0.7,
  escalationThreshold: 0.9,
  realTimeMonitoring: true,
  emergencyKeywords: [
    'spill', 'leak', 'contamination found', 'exposure', 'emergency',
    'vapor', 'fumes', 'evacuation', 'hazmat', 'toxic release',
    'chemical emergency', 'environmental incident', 'immediate danger'
  ],
  complianceTerms: [
    'epa', 'regulation', 'permit', 'compliance', 'violation',
    'cercla', 'rcra', 'clean water act', 'air quality', 'superfund',
    'phase i', 'phase ii', 'phase iii', 'esa', 'due diligence'
  ],
  notificationChannels: {
    slack: process.env.SLACK_WEBHOOK_URL,
    teams: process.env.TEAMS_WEBHOOK_URL,
    email: ['emergency@a3e-environmental.com'],
    sms: ['+1-555-EMERGENCY']
  },
  businessHours: {
    start: '08:00',
    end: '18:00',
    timezone: 'America/New_York',
    weekdays: [1, 2, 3, 4, 5] // Monday to Friday
  },
  rateLimiting: {
    maxMessagesPerMinute: 100,
    maxAlertsPerHour: 50
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      config: config,
      lastModified: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching config:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch configuration'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()

    // Validate configuration updates
    const validatedConfig = validateConfig(updates)

    // Update configuration
    config = { ...config, ...validatedConfig }

    // Log configuration change
    console.log('Configuration updated:', {
      timestamp: new Date().toISOString(),
      changes: validatedConfig,
      updatedBy: request.headers.get('x-user-id') || 'system'
    })

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
      config: config
    })

  } catch (error) {
    console.error('Error updating config:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update configuration'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json()

    switch (action) {
      case 'reset':
        return await resetToDefaults()
      case 'test':
        return await testConfiguration(params)
      case 'backup':
        return await backupConfiguration()
      case 'restore':
        return await restoreConfiguration(params.backupData)
      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Error processing config action:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process configuration action'
    }, { status: 500 })
  }
}

function validateConfig(updates: Partial<MonitoringConfig>): Partial<MonitoringConfig> {
  const validated: Partial<MonitoringConfig> = {}

  // Validate thresholds
  if (updates.confidenceThreshold !== undefined) {
    if (updates.confidenceThreshold >= 0 && updates.confidenceThreshold <= 1) {
      validated.confidenceThreshold = updates.confidenceThreshold
    } else {
      throw new Error('Confidence threshold must be between 0 and 1')
    }
  }

  if (updates.escalationThreshold !== undefined) {
    if (updates.escalationThreshold >= 0 && updates.escalationThreshold <= 1) {
      validated.escalationThreshold = updates.escalationThreshold
    } else {
      throw new Error('Escalation threshold must be between 0 and 1')
    }
  }

  // Validate boolean flags
  if (updates.autoResponseEnabled !== undefined) {
    validated.autoResponseEnabled = Boolean(updates.autoResponseEnabled)
  }

  if (updates.emergencyAlertsEnabled !== undefined) {
    validated.emergencyAlertsEnabled = Boolean(updates.emergencyAlertsEnabled)
  }

  if (updates.realTimeMonitoring !== undefined) {
    validated.realTimeMonitoring = Boolean(updates.realTimeMonitoring)
  }

  // Validate keywords arrays
  if (updates.emergencyKeywords && Array.isArray(updates.emergencyKeywords)) {
    validated.emergencyKeywords = updates.emergencyKeywords.filter(
      keyword => typeof keyword === 'string' && keyword.length > 0
    )
  }

  if (updates.complianceTerms && Array.isArray(updates.complianceTerms)) {
    validated.complianceTerms = updates.complianceTerms.filter(
      term => typeof term === 'string' && term.length > 0
    )
  }

  // Validate notification channels
  if (updates.notificationChannels) {
    validated.notificationChannels = {}

    if (updates.notificationChannels.slack) {
      validated.notificationChannels.slack = updates.notificationChannels.slack
    }

    if (updates.notificationChannels.teams) {
      validated.notificationChannels.teams = updates.notificationChannels.teams
    }

    if (updates.notificationChannels.email && Array.isArray(updates.notificationChannels.email)) {
      validated.notificationChannels.email = updates.notificationChannels.email.filter(
        email => typeof email === 'string' && email.includes('@')
      )
    }

    if (updates.notificationChannels.sms && Array.isArray(updates.notificationChannels.sms)) {
      validated.notificationChannels.sms = updates.notificationChannels.sms.filter(
        phone => typeof phone === 'string' && phone.length > 0
      )
    }
  }

  // Validate business hours
  if (updates.businessHours) {
    validated.businessHours = { ...config.businessHours, ...updates.businessHours }
  }

  // Validate rate limiting
  if (updates.rateLimiting) {
    validated.rateLimiting = {}

    if (updates.rateLimiting.maxMessagesPerMinute !== undefined) {
      validated.rateLimiting.maxMessagesPerMinute = Math.max(1,
        Math.min(1000, updates.rateLimiting.maxMessagesPerMinute)
      )
    }

    if (updates.rateLimiting.maxAlertsPerHour !== undefined) {
      validated.rateLimiting.maxAlertsPerHour = Math.max(1,
        Math.min(200, updates.rateLimiting.maxAlertsPerHour)
      )
    }
  }

  return validated
}

async function resetToDefaults() {
  const defaultConfig: MonitoringConfig = {
    autoResponseEnabled: true,
    emergencyAlertsEnabled: true,
    confidenceThreshold: 0.7,
    escalationThreshold: 0.9,
    realTimeMonitoring: true,
    emergencyKeywords: [
      'spill', 'leak', 'contamination found', 'exposure', 'emergency',
      'vapor', 'fumes', 'evacuation', 'hazmat', 'toxic release'
    ],
    complianceTerms: [
      'epa', 'regulation', 'permit', 'compliance', 'violation',
      'cercla', 'rcra', 'clean water act', 'air quality', 'superfund'
    ],
    notificationChannels: {
      email: ['emergency@a3e-environmental.com']
    },
    businessHours: {
      start: '08:00',
      end: '18:00',
      timezone: 'America/New_York',
      weekdays: [1, 2, 3, 4, 5]
    },
    rateLimiting: {
      maxMessagesPerMinute: 100,
      maxAlertsPerHour: 50
    }
  }

  config = defaultConfig

  return NextResponse.json({
    success: true,
    message: 'Configuration reset to defaults',
    config: config
  })
}

async function testConfiguration(params: any) {
  const testResults = {
    configValid: true,
    tests: {
      thresholds: config.confidenceThreshold <= config.escalationThreshold,
      keywords: config.emergencyKeywords.length > 0,
      notifications: Object.keys(config.notificationChannels).length > 0,
      businessHours: isValidTimeFormat(config.businessHours.start) &&
                    isValidTimeFormat(config.businessHours.end),
      rateLimiting: config.rateLimiting.maxMessagesPerMinute > 0 &&
                   config.rateLimiting.maxAlertsPerHour > 0
    },
    warnings: []
  }

  // Add warnings for potential issues
  if (config.confidenceThreshold < 0.5) {
    testResults.warnings.push('Low confidence threshold may generate too many false positives')
  }

  if (config.emergencyKeywords.length < 5) {
    testResults.warnings.push('Consider adding more emergency keywords for better detection')
  }

  if (!config.notificationChannels.email?.length && !config.notificationChannels.slack) {
    testResults.warnings.push('No notification channels configured - alerts may not be delivered')
  }

  testResults.configValid = Object.values(testResults.tests).every(Boolean)

  return NextResponse.json({
    success: true,
    testResults: testResults
  })
}

async function backupConfiguration() {
  const backup = {
    config: config,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }

  return NextResponse.json({
    success: true,
    backup: backup,
    message: 'Configuration backup created'
  })
}

async function restoreConfiguration(backupData: any) {
  try {
    if (!backupData || !backupData.config) {
      throw new Error('Invalid backup data')
    }

    const restoredConfig = validateConfig(backupData.config)
    config = { ...config, ...restoredConfig }

    return NextResponse.json({
      success: true,
      message: 'Configuration restored from backup',
      config: config
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Failed to restore configuration: ${error}`
    }, { status: 400 })
  }
}

function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

// Export current configuration for use in other modules
export function getCurrentConfig(): MonitoringConfig {
  return config
}