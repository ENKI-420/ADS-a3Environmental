import { useState, useEffect } from 'react'

export interface UserExperienceProfile {
  cognitivePreferences: {
    informationDensity: 'minimal' | 'balanced' | 'detailed'
    workflowSpeed: 'methodical' | 'balanced' | 'rapid'
    assistanceLevel: 'minimal' | 'guided' | 'comprehensive'
    visualStyle: 'clean' | 'colorful' | 'data-rich'
  }
  behaviorPatterns: {
    peakProductivityHours: number[]
    averageSessionDuration: number
    preferredTaskOrder: string[]
    interactionFrequency: 'low' | 'medium' | 'high'
  }
  accessibilityNeeds: {
    highContrast: boolean
    largeText: boolean
    reducedMotion: boolean
    screenReader: boolean
  }
  contextAwareness: {
    timeZone: string
    workSchedule: { start: number; end: number }
    urgencyTolerance: 'low' | 'medium' | 'high'
    multitaskingPreference: boolean
  }
}

export interface AdaptiveRecommendation {
  type: 'efficiency' | 'wellbeing' | 'learning' | 'accessibility'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  effort: 'minimal' | 'moderate' | 'significant'
  confidence: number
  isTransparent: boolean
  userConsent: boolean
}

export class EnhancedUserExperience {
  private profile: UserExperienceProfile
  private recommendations: AdaptiveRecommendation[] = []
  private consentGiven: boolean = false

  constructor() {
    this.profile = this.getDefaultProfile()
    this.loadUserConsent()
  }

  // Transparent user consent management
  requestUserConsent(): Promise<boolean> {
    return new Promise((resolve) => {
      // This would show a clear consent dialog
      const consent = confirm(
        "IRIS can provide personalized assistance by learning your preferences. " +
        "All data stays local and you maintain full control. " +
        "Would you like to enable adaptive assistance?"
      )
      this.consentGiven = consent
      this.saveUserConsent(consent)
      resolve(consent)
    })
  }

  // Cognitive load assessment (transparent and helpful)
  assessCognitiveLoad(context: {
    timeOnPage: number
    interactionCount: number
    taskComplexity: 'low' | 'medium' | 'high'
    timeOfDay: number
  }): number {
    if (!this.consentGiven) return 0

    let load = 0

    // Time-based factors
    if (context.timeOnPage > 300) load += 20 // 5+ minutes
    if (context.timeOnPage > 600) load += 20 // 10+ minutes

    // Interaction intensity
    if (context.interactionCount > 50) load += 15
    if (context.interactionCount > 100) load += 15

    // Task complexity
    switch (context.taskComplexity) {
      case 'high': load += 30; break
      case 'medium': load += 15; break
      case 'low': load += 5; break
    }

    // Time of day adjustment
    const isOffHours = context.timeOfDay < 8 || context.timeOfDay > 18
    if (isOffHours) load += 10

    return Math.min(load, 100)
  }

  // Generate transparent, helpful recommendations
  generateRecommendations(context: {
    currentPage: string
    cognitiveLoad: number
    timeOfDay: number
    sessionDuration: number
  }): AdaptiveRecommendation[] {
    if (!this.consentGiven) return []

    const recommendations: AdaptiveRecommendation[] = []

    // Cognitive load management
    if (context.cognitiveLoad > 70) {
      recommendations.push({
        type: 'wellbeing',
        title: 'Take a Short Break',
        description: 'Your cognitive load is high. A 5-minute break could improve focus and decision-making.',
        impact: 'high',
        effort: 'minimal',
        confidence: 0.85,
        isTransparent: true,
        userConsent: true
      })
    }

    // Efficiency optimization
    if (context.sessionDuration > 45 && this.profile.workflowSpeed === 'rapid') {
      recommendations.push({
        type: 'efficiency',
        title: 'Use Keyboard Shortcuts',
        description: 'Press Ctrl+K for quick navigation - saves 3-5 seconds per action.',
        impact: 'medium',
        effort: 'minimal',
        confidence: 0.92,
        isTransparent: true,
        userConsent: true
      })
    }

    // Time-based suggestions
    if (context.timeOfDay >= 14 && context.timeOfDay <= 16) {
      recommendations.push({
        type: 'efficiency',
        title: 'Optimal Time for Analysis',
        description: 'Afternoon hours are typically best for analytical tasks. Consider tackling complex reports now.',
        impact: 'medium',
        effort: 'minimal',
        confidence: 0.78,
        isTransparent: true,
        userConsent: true
      })
    }

    return recommendations
  }

  // Adaptive interface modifications (with user control)
  getAdaptiveInterfaceSettings(): {
    theme: 'light' | 'dark' | 'auto'
    density: 'comfortable' | 'compact' | 'spacious'
    animations: boolean
    notifications: boolean
  } {
    if (!this.consentGiven) {
      return {
        theme: 'light',
        density: 'comfortable',
        animations: true,
        notifications: false
      }
    }

    return {
      theme: this.profile.accessibilityNeeds.highContrast ? 'dark' : 'light',
      density: this.profile.cognitivePreferences.informationDensity === 'minimal' ? 'spacious' : 'comfortable',
      animations: !this.profile.accessibilityNeeds.reducedMotion,
      notifications: this.profile.behaviorPatterns.interactionFrequency !== 'low'
    }
  }

  // Predictive assistance (transparent and opt-in)
  predictNextAction(currentContext: {
    page: string
    role: string
    timeOfDay: number
    recentActions: string[]
  }): { suggestion: string; confidence: number; reasoning: string } | null {
    if (!this.consentGiven) return null

    const patterns = {
      'Director': {
        morning: ['/analytics', '/ai-content-studio', '/dashboard'],
        afternoon: ['/contracts', '/reports', '/analytics'],
        evening: ['/dashboard', '/analytics']
      },
      'Project Manager': {
        morning: ['/projects', '/field-capture', '/dashboard'],
        afternoon: ['/reports', '/analytics', '/projects'],
        evening: ['/dashboard', '/projects']
      },
      'Client': {
        morning: ['/portal', '/dashboard'],
        afternoon: ['/portal', '/analytics'],
        evening: ['/portal']
      }
    }

    const timeOfDay = currentContext.timeOfDay < 12 ? 'morning' :
                      currentContext.timeOfDay < 17 ? 'afternoon' : 'evening'

    const rolePatterns = patterns[currentContext.role as keyof typeof patterns]
    if (!rolePatterns) return null

    const suggestions = rolePatterns[timeOfDay as keyof typeof rolePatterns]
    const suggestion = suggestions[0]

    return {
      suggestion,
      confidence: 0.73,
      reasoning: `Based on ${currentContext.role} role patterns during ${timeOfDay} hours`
    }
  }

  // Transparent learning and adaptation
  learnFromUserBehavior(interaction: {
    action: string
    duration: number
    success: boolean
    context: string
  }): void {
    if (!this.consentGiven) return

    // Update user preferences based on successful interactions
    if (interaction.success && interaction.duration < 30) {
      // Quick successful actions indicate good UX
      this.profile.behaviorPatterns.preferredTaskOrder.unshift(interaction.action)
    }

    // Adjust cognitive preferences
    if (interaction.duration > 120) {
      // Long durations might indicate need for assistance
      if (this.profile.cognitivePreferences.assistanceLevel === 'minimal') {
        this.profile.cognitivePreferences.assistanceLevel = 'guided'
      }
    }

    this.saveProfile()
  }

  // Privacy-first data management
  private getDefaultProfile(): UserExperienceProfile {
    return {
      cognitivePreferences: {
        informationDensity: 'balanced',
        workflowSpeed: 'balanced',
        assistanceLevel: 'guided',
        visualStyle: 'clean'
      },
      behaviorPatterns: {
        peakProductivityHours: [9, 10, 11, 14, 15],
        averageSessionDuration: 25,
        preferredTaskOrder: [],
        interactionFrequency: 'medium'
      },
      accessibilityNeeds: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReader: false
      },
      contextAwareness: {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        workSchedule: { start: 9, end: 17 },
        urgencyTolerance: 'medium',
        multitaskingPreference: true
      }
    }
  }

  private loadUserConsent(): void {
    const stored = localStorage.getItem('iris-user-consent')
    this.consentGiven = stored === 'true'
  }

  private saveUserConsent(consent: boolean): void {
    localStorage.setItem('iris-user-consent', consent.toString())
  }

  private saveProfile(): void {
    if (this.consentGiven) {
      localStorage.setItem('iris-user-profile', JSON.stringify(this.profile))
    }
  }

  // User control methods
  exportUserData(): string {
    return JSON.stringify({
      profile: this.profile,
      consentGiven: this.consentGiven,
      exportDate: new Date().toISOString()
    }, null, 2)
  }

  deleteUserData(): void {
    localStorage.removeItem('iris-user-consent')
    localStorage.removeItem('iris-user-profile')
    this.consentGiven = false
    this.profile = this.getDefaultProfile()
  }

  updatePrivacySettings(settings: {
    allowLearning: boolean
    allowPredictions: boolean
    allowAdaptations: boolean
  }): void {
    // Update consent based on granular privacy settings
    this.consentGiven = settings.allowLearning || settings.allowPredictions || settings.allowAdaptations
    this.saveUserConsent(this.consentGiven)
  }
}

// Export singleton instance
export const userExperience = new EnhancedUserExperience()