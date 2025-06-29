"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Eye,
  Zap,
  Target,
  Activity,
  Clock,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  MessageCircle,
  Settings
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface UserContext {
  role: string
  currentPage: string
  timeOnPage: number
  clickPatterns: Array<{ element: string; timestamp: number }>
  preferences: {
    workflowSpeed: 'fast' | 'normal' | 'detailed'
    informationDensity: 'minimal' | 'balanced' | 'comprehensive'
    assistanceLevel: 'minimal' | 'guided' | 'proactive'
  }
  cognitiveLoad: number // 0-100
  taskContext: {
    urgency: 'low' | 'medium' | 'high' | 'critical'
    complexity: 'simple' | 'moderate' | 'complex'
    completionProgress: number
  }
}

interface CognitiveInsight {
  type: 'efficiency' | 'assistance' | 'prediction' | 'optimization'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  confidence: number
}

export function CognitiveOverlay() {
  const [isVisible, setIsVisible] = useState(true)
  const [userContext, setUserContext] = useState<UserContext>({
    role: 'Director',
    currentPage: '/dashboard',
    timeOnPage: 0,
    clickPatterns: [],
    preferences: {
      workflowSpeed: 'fast',
      informationDensity: 'balanced',
      assistanceLevel: 'proactive'
    },
    cognitiveLoad: 35,
    taskContext: {
      urgency: 'medium',
      complexity: 'moderate',
      completionProgress: 67
    }
  })

  const [insights, setInsights] = useState<CognitiveInsight[]>([])
  const [adaptiveActions, setAdaptiveActions] = useState<Array<{
    id: string
    label: string
    description: string
    urgency: 'low' | 'medium' | 'high'
    onClick: () => void
  }>>([])

  // Cognitive Load Analysis
  const analyzeCognitiveLoad = useCallback(() => {
    const factors = {
      timeOnPage: Math.min(userContext.timeOnPage / 300, 1) * 30, // 5 min = full factor
      clickFrequency: Math.min(userContext.clickPatterns.length / 10, 1) * 25,
      taskComplexity: userContext.taskContext.complexity === 'complex' ? 30 :
                      userContext.taskContext.complexity === 'moderate' ? 15 : 5,
      urgency: userContext.taskContext.urgency === 'critical' ? 25 :
               userContext.taskContext.urgency === 'high' ? 15 : 5
    }

    const totalLoad = Object.values(factors).reduce((sum, val) => sum + val, 0)
    setUserContext(prev => ({ ...prev, cognitiveLoad: Math.min(totalLoad, 100) }))
  }, [userContext.timeOnPage, userContext.clickPatterns, userContext.taskContext])

  // Generate Intelligent Insights
  const generateInsights = useCallback(() => {
    const newInsights: CognitiveInsight[] = []

    // Efficiency Insights
    if (userContext.cognitiveLoad > 70) {
      newInsights.push({
        type: 'efficiency',
        priority: 'high',
        title: 'Cognitive Load Detected',
        description: 'Consider simplifying your current workflow or taking a brief break',
        action: {
          label: 'Simplify View',
          onClick: () => {
            setUserContext(prev => ({
              ...prev,
              preferences: { ...prev.preferences, informationDensity: 'minimal' }
            }))
          }
        },
        confidence: 0.85
      })
    }

    // Task Completion Prediction
    if (userContext.taskContext.completionProgress > 50) {
      newInsights.push({
        type: 'prediction',
        priority: 'medium',
        title: 'Task Near Completion',
        description: `You're ${userContext.taskContext.completionProgress}% complete. Estimated 5-8 minutes remaining`,
        confidence: 0.78
      })
    }

    // Speed Optimization
    if (userContext.preferences.workflowSpeed === 'fast' && userContext.timeOnPage > 180) {
      newInsights.push({
        type: 'optimization',
        priority: 'medium',
        title: 'Quick Actions Available',
        description: 'Based on your fast workflow preference, try keyboard shortcuts: Ctrl+K for command palette',
        confidence: 0.92
      })
    }

    // Proactive Assistance
    if (userContext.preferences.assistanceLevel === 'proactive') {
      newInsights.push({
        type: 'assistance',
        priority: 'low',
        title: 'Next Logical Step',
        description: 'Based on your current task, you might want to check the compliance reports next',
        action: {
          label: 'Go to Reports',
          onClick: () => window.location.href = '/analyst/report-studio'
        },
        confidence: 0.73
      })
    }

    setInsights(newInsights)
  }, [userContext])

  // Generate Adaptive Actions
  const generateAdaptiveActions = useCallback(() => {
    const actions = []

    // Quick Navigation for Impatient Users
    if (userContext.preferences.workflowSpeed === 'fast') {
      actions.push({
        id: 'quick-nav',
        label: 'Quick Jump',
        description: 'Jump to most relevant section',
        urgency: 'medium' as const,
        onClick: () => {
          // Implement smart navigation based on context
          if (userContext.role === 'Director') {
            window.location.href = '/analytics'
          } else {
            window.location.href = '/dashboard'
          }
        }
      })
    }

    // Context-Aware Shortcuts
    actions.push({
      id: 'context-action',
      label: 'Smart Action',
      description: 'AI-suggested next best action',
      urgency: userContext.taskContext.urgency,
      onClick: () => {
        // Dynamic action based on current context
        const contextActions = {
          'Director': () => window.location.href = '/ai-content-studio',
          'Project Manager': () => window.location.href = '/projects',
          'Client': () => window.location.href = '/portal',
          'Technician': () => window.location.href = '/field-capture'
        }
        contextActions[userContext.role as keyof typeof contextActions]?.()
      }
    })

    setAdaptiveActions(actions)
  }, [userContext])

  // Real-time Context Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUserContext(prev => ({
        ...prev,
        timeOnPage: prev.timeOnPage + 1
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    analyzeCognitiveLoad()
    generateInsights()
    generateAdaptiveActions()
  }, [analyzeCognitiveLoad, generateInsights, generateAdaptiveActions])

  // Track user interactions
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const elementInfo = target.tagName + (target.className ? '.' + target.className.split(' ')[0] : '')

      setUserContext(prev => ({
        ...prev,
        clickPatterns: [
          ...prev.clickPatterns.slice(-9), // Keep last 10 clicks
          { element: elementInfo, timestamp: Date.now() }
        ]
      }))
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-20 right-4 z-40 w-80 max-h-[80vh] overflow-hidden">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="space-y-2"
        >
          {/* Cognitive Status Bar */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">IRIS Cognitive Overlay</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Cognitive Load</span>
                  <span className={`font-medium ${
                    userContext.cognitiveLoad > 70 ? 'text-red-600' :
                    userContext.cognitiveLoad > 40 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {userContext.cognitiveLoad}%
                  </span>
                </div>
                <Progress
                  value={userContext.cognitiveLoad}
                  className={`h-2 ${
                    userContext.cognitiveLoad > 70 ? 'bg-red-100' :
                    userContext.cognitiveLoad > 40 ? 'bg-yellow-100' : 'bg-green-100'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                <span>Task: {userContext.taskContext.completionProgress}% complete</span>
                <Badge variant="outline" className="text-xs">
                  {userContext.taskContext.urgency}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Adaptive Quick Actions */}
          {adaptiveActions.length > 0 && (
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">Smart Actions</span>
                </div>
                <div className="space-y-2">
                  {adaptiveActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={action.onClick}
                      className="w-full justify-start text-left h-auto p-2"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{action.label}</span>
                          <Badge variant={action.urgency === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                            {action.urgency}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                      </div>
                      <ArrowRight className="h-3 w-3 ml-auto" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Intelligent Insights */}
          {insights.length > 0 && (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">AI Insights</span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2 bg-white/50 rounded border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="text-xs font-medium">{insight.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(insight.confidence * 100)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{insight.description}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          insight.priority === 'high' ? 'bg-red-400' :
                          insight.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                      </div>
                      {insight.action && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={insight.action.onClick}
                          className="mt-1 h-6 text-xs p-1"
                        >
                          {insight.action.label}
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Context Awareness Display */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium">Context Awareness</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <Badge variant="secondary">{userContext.role}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Time on page:</span>
                  <span>{Math.floor(userContext.timeOnPage / 60)}m {userContext.timeOnPage % 60}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Workflow speed:</span>
                  <Badge variant="outline">{userContext.preferences.workflowSpeed}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Interactions:</span>
                  <span>{userContext.clickPatterns.length} clicks</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}