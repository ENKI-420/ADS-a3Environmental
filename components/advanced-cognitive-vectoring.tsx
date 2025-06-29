"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain, Eye, Zap, Target, Activity, Clock, ArrowRight, Lightbulb,
  TrendingUp, MessageCircle, Settings, Shield, Users, BarChart3,
  Layers, Workflow, Database, AlertTriangle, CheckCircle2, Star,
  Gauge, Network, Cpu, HardDrive, Wifi, Battery, Thermometer
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CognitiveProfile {
  userId: string
  cognitivePreferences: {
    workflowSpeed: 'methodical' | 'balanced' | 'rapid'
    informationDensity: 'minimal' | 'balanced' | 'comprehensive'
    assistanceLevel: 'minimal' | 'guided' | 'proactive'
    visualStyle: 'clean' | 'professional' | 'data-rich'
  }
  behaviorPatterns: {
    peakProductivityHours: number[]
    averageTaskDuration: number
    preferredNavigationStyle: 'linear' | 'contextual' | 'exploratory'
    interactionFrequency: 'low' | 'medium' | 'high'
  }
  cognitiveMetrics: {
    currentLoad: number
    focusLevel: number
    decisionConfidence: number
    taskProgress: number
  }
  contextualFactors: {
    timeOfDay: number
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
    multitaskingActive: boolean
    environmentalFactors: {
      noiseLevel: number
      lightingCondition: 'optimal' | 'suboptimal' | 'poor'
      deviceType: 'desktop' | 'tablet' | 'mobile'
    }
  }
}

interface RecursiveAssessment {
  depth: number
  convergenceScore: number
  assessmentLayers: Array<{
    layer: number
    focus: string
    insights: string[]
    confidence: number
    recommendations: string[]
  }>
  finalSynthesis: {
    primaryInsights: string[]
    actionableRecommendations: string[]
    confidenceScore: number
    nextOptimalActions: string[]
  }
}

interface IRISOrchestrationState {
  activeAgents: number
  processingLoad: number
  coordinationEfficiency: number
  realTimeOptimization: boolean
  multiModalActive: boolean
  contextualAwareness: number
  adaptiveLearning: boolean
}

export function AdvancedCognitiveVectoring() {
  const [isVisible, setIsVisible] = useState(true)
  const [userConsent, setUserConsent] = useState(false)
  const [cognitiveProfile, setCognitiveProfile] = useState<CognitiveProfile>({
    userId: 'anonymous',
    cognitivePreferences: {
      workflowSpeed: 'balanced',
      informationDensity: 'balanced',
      assistanceLevel: 'guided',
      visualStyle: 'professional'
    },
    behaviorPatterns: {
      peakProductivityHours: [9, 10, 11, 14, 15],
      averageTaskDuration: 12,
      preferredNavigationStyle: 'contextual',
      interactionFrequency: 'medium'
    },
    cognitiveMetrics: {
      currentLoad: 35,
      focusLevel: 78,
      decisionConfidence: 82,
      taskProgress: 67
    },
    contextualFactors: {
      timeOfDay: new Date().getHours(),
      urgencyLevel: 'medium',
      multitaskingActive: false,
      environmentalFactors: {
        noiseLevel: 0.3,
        lightingCondition: 'optimal',
        deviceType: 'desktop'
      }
    }
  })

  const [recursiveAssessment, setRecursiveAssessment] = useState<RecursiveAssessment>({
    depth: 0,
    convergenceScore: 0,
    assessmentLayers: [],
    finalSynthesis: {
      primaryInsights: [],
      actionableRecommendations: [],
      confidenceScore: 0,
      nextOptimalActions: []
    }
  })

  const [irisState, setIrisState] = useState<IRISOrchestrationState>({
    activeAgents: 13,
    processingLoad: 34,
    coordinationEfficiency: 94,
    realTimeOptimization: true,
    multiModalActive: true,
    contextualAwareness: 87,
    adaptiveLearning: true
  })

  const [activeTab, setActiveTab] = useState('overview')
  const [isProcessing, setIsProcessing] = useState(false)
  const assessmentIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Advanced Assessment Functions
  const performCognitiveAssessment = useCallback(async () => {
    if (!userConsent) return

    setIsProcessing(true)

    // Layer 1: Temporal Analysis
    const timeFactors = {
      timeOnPage: performance.now() / 1000,
      timeOfDay: new Date().getHours(),
      sessionDuration: (Date.now() - (performance.timeOrigin || Date.now())) / 1000
    }

    // Layer 2: Behavioral Patterns
    const interactionPatterns = {
      clickFrequency: cognitiveProfile.behaviorPatterns.interactionFrequency,
      navigationStyle: cognitiveProfile.behaviorPatterns.preferredNavigationStyle,
      taskSwitching: cognitiveProfile.contextualFactors.multitaskingActive
    }

    // Layer 3: Environmental Context
    const environmentalFactors = {
      deviceOptimization: cognitiveProfile.contextualFactors.environmentalFactors.deviceType === 'desktop' ? 1.0 : 0.8,
      lightingImpact: cognitiveProfile.contextualFactors.environmentalFactors.lightingCondition === 'optimal' ? 1.0 : 0.7,
      noiseDistraction: 1.0 - cognitiveProfile.contextualFactors.environmentalFactors.noiseLevel
    }

    // Generate assessment layers
    const layers = [
      {
        layer: 1,
        focus: 'Temporal Cognitive Analysis',
        insights: [
          `Current time: ${timeFactors.timeOfDay}:00 - Peak productivity window`,
          `Session duration: ${Math.floor(timeFactors.sessionDuration / 60)} minutes`,
          `Cognitive alignment: ${isPeakProductivityTime(timeFactors.timeOfDay) ? 'Optimal' : 'Suboptimal'}`
        ],
        confidence: 0.89,
        recommendations: [
          "Consider complex analytical tasks during peak hours",
          "Take strategic breaks every 45-60 minutes",
          "Align high-priority tasks with natural energy cycles"
        ]
      },
      {
        layer: 2,
        focus: 'Behavioral Pattern Recognition',
        insights: [
          `Navigation preference: ${interactionPatterns.navigationStyle} style detected`,
          `Interaction frequency: ${interactionPatterns.clickFrequency} engagement level`,
          `Multitasking status: ${interactionPatterns.taskSwitching ? 'Active' : 'Focused'}`
        ],
        confidence: 0.76,
        recommendations: [
          "Optimize navigation patterns for efficiency",
          "Use keyboard shortcuts for rapid workflows",
          "Focus on single-task completion for better outcomes"
        ]
      },
      {
        layer: 3,
        focus: 'Environmental Optimization',
        insights: [
          `Device optimization: ${(environmentalFactors.deviceOptimization * 100).toFixed(1)}%`,
          `Environmental conditions: ${environmentalFactors.lightingImpact > 0.9 ? 'Optimal' : 'Could be improved'}`,
          `Distraction level: ${(environmentalFactors.noiseDistraction * 100).toFixed(1)}% focus potential`
        ],
        confidence: 0.94,
        recommendations: [
          "Maintain optimal environmental conditions",
          "Consider desktop interface for complex tasks",
          "Minimize environmental distractions"
        ]
      }
    ]

    // Calculate cognitive load
    const cognitiveLoad = Math.min(100,
      (timeFactors.timeOnPage > 600 ? 25 : 0) +
      (timeFactors.sessionDuration > 3600 ? 20 : 0) +
      (!isPeakProductivityTime(timeFactors.timeOfDay) ? 15 : 0) +
      (interactionPatterns.clickFrequency === 'high' ? 20 : 0) +
      (interactionPatterns.taskSwitching ? 25 : 0) +
      ((1 - environmentalFactors.deviceOptimization) * 15) +
      ((1 - environmentalFactors.lightingImpact) * 20) +
      ((1 - environmentalFactors.noiseDistraction) * 25)
    )

    // Update cognitive metrics
    setCognitiveProfile(prev => ({
      ...prev,
      cognitiveMetrics: {
        ...prev.cognitiveMetrics,
        currentLoad: cognitiveLoad,
        focusLevel: Math.max(10, 100 - cognitiveLoad * 0.8),
        decisionConfidence: Math.max(50, 100 - cognitiveLoad * 0.6)
      }
    }))

    // Generate final synthesis
    const finalSynthesis = {
      primaryInsights: [
        `Cognitive load: ${cognitiveLoad.toFixed(1)}% - ${getCognitiveLoadCategory(cognitiveLoad)}`,
        `Optimal workflow speed: ${getOptimalWorkflowSpeed(cognitiveLoad, timeFactors.timeOfDay)}`,
        `Recommended assistance level: ${getOptimalAssistanceLevel(cognitiveLoad)}`
      ],
      actionableRecommendations: [
        ...layers.flatMap(layer => layer.recommendations.slice(0, 1)),
        generatePriorityAction(cognitiveLoad, timeFactors.timeOfDay)
      ],
      confidenceScore: layers.reduce((sum, layer) => sum + layer.confidence, 0) / layers.length,
      nextOptimalActions: generateNextOptimalActions(cognitiveProfile, cognitiveLoad)
    }

    setRecursiveAssessment({
      depth: layers.length,
      convergenceScore: finalSynthesis.confidenceScore,
      assessmentLayers: layers,
      finalSynthesis
    })

    setIsProcessing(false)
  }, [userConsent, cognitiveProfile])

  // Helper functions
  const isPeakProductivityTime = (hour: number): boolean => {
    return cognitiveProfile.behaviorPatterns.peakProductivityHours.includes(hour)
  }

  const getCognitiveLoadCategory = (load: number): string => {
    if (load < 30) return "Optimal"
    if (load < 50) return "Manageable"
    if (load < 70) return "Elevated"
    return "High - Action Needed"
  }

  const getOptimalWorkflowSpeed = (load: number, hour: number): string => {
    if (load > 70) return "methodical"
    if (isPeakProductivityTime(hour) && load < 40) return "rapid"
    return "balanced"
  }

  const getOptimalAssistanceLevel = (load: number): string => {
    if (load > 60) return "proactive"
    if (load < 30) return "minimal"
    return "guided"
  }

  const generatePriorityAction = (load: number, hour: number): string => {
    if (load > 80) return "Take immediate 5-minute break to reduce cognitive load"
    if (load > 60) return "Switch to simplified view and focus on single task"
    if (isPeakProductivityTime(hour) && load < 40) return "Optimal conditions - tackle most important task now"
    return "Continue current workflow with periodic assessment"
  }

  const generateNextOptimalActions = (profile: CognitiveProfile, load: number): string[] => {
    const actions = []
    const hour = profile.contextualFactors.timeOfDay

    if (hour >= 9 && hour <= 11) {
      actions.push("Morning productivity peak - tackle complex analysis tasks")
    }
    if (hour >= 14 && hour <= 16) {
      actions.push("Afternoon focus period - ideal for detailed work")
    }

    if (load < 40) {
      actions.push("Low cognitive load - good time for learning new features")
    }
    if (load > 60) {
      actions.push("High cognitive load - focus on routine, familiar tasks")
    }

    return actions
  }

  // Real-time IRIS updates
  useEffect(() => {
    const updateIRISState = () => {
      setIrisState(prev => ({
        ...prev,
        processingLoad: Math.max(10, prev.processingLoad + (Math.random() - 0.5) * 10),
        coordinationEfficiency: Math.min(100, Math.max(80, prev.coordinationEfficiency + (Math.random() - 0.5) * 5)),
        contextualAwareness: Math.min(100, Math.max(70, prev.contextualAwareness + (Math.random() - 0.5) * 8))
      }))
    }

    const interval = setInterval(updateIRISState, 2000)
    return () => clearInterval(interval)
  }, [])

  // Continuous assessment
  useEffect(() => {
    if (userConsent && !assessmentIntervalRef.current) {
      performCognitiveAssessment()
      assessmentIntervalRef.current = setInterval(performCognitiveAssessment, 15000)
    }

    return () => {
      if (assessmentIntervalRef.current) {
        clearInterval(assessmentIntervalRef.current)
        assessmentIntervalRef.current = null
      }
    }
  }, [userConsent, performCognitiveAssessment])

  // Privacy management
  const handleConsentChange = (consent: boolean) => {
    setUserConsent(consent)
    if (!consent) {
      setCognitiveProfile(prev => ({
        ...prev,
        userId: 'anonymous',
        cognitiveMetrics: { currentLoad: 0, focusLevel: 0, decisionConfidence: 0, taskProgress: 0 }
      }))
      setRecursiveAssessment({
        depth: 0,
        convergenceScore: 0,
        assessmentLayers: [],
        finalSynthesis: { primaryInsights: [], actionableRecommendations: [], confidenceScore: 0, nextOptimalActions: [] }
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-20 left-4 z-50 w-96 max-h-[85vh] overflow-hidden">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -400 }}
          className="space-y-3"
        >
          <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-purple-300 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-sm font-bold">IRIS Cognitive Vectoring</CardTitle>
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                    INDUSTRY FIRST
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={userConsent}
                    onCheckedChange={handleConsentChange}
                    className="scale-75"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              </div>
              {!userConsent && (
                <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded-md border border-yellow-200">
                  Enable cognitive assessment for personalized AI assistance. All data stays local and private.
                </div>
              )}
            </CardHeader>

            {userConsent && (
              <CardContent className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 text-xs">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="assessment">Assessment</TabsTrigger>
                    <TabsTrigger value="iris">IRIS</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-white rounded-lg border">
                        <div className="text-lg font-bold text-purple-600">
                          {cognitiveProfile.cognitiveMetrics.currentLoad}%
                        </div>
                        <div className="text-xs text-gray-600">Cognitive Load</div>
                        <Progress value={cognitiveProfile.cognitiveMetrics.currentLoad} className="h-1 mt-1" />
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg border">
                        <div className="text-lg font-bold text-blue-600">
                          {cognitiveProfile.cognitiveMetrics.focusLevel}%
                        </div>
                        <div className="text-xs text-gray-600">Focus Level</div>
                        <Progress value={cognitiveProfile.cognitiveMetrics.focusLevel} className="h-1 mt-1" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border">
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium">Context Awareness</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Time Context:</span>
                          <Badge variant="outline">Peak Hours</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Workflow Speed:</span>
                          <Badge variant="secondary">{cognitiveProfile.cognitivePreferences.workflowSpeed}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Urgency Level:</span>
                          <Badge variant={cognitiveProfile.contextualFactors.urgencyLevel === 'high' ? 'destructive' : 'default'}>
                            {cognitiveProfile.contextualFactors.urgencyLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {recursiveAssessment.finalSynthesis.nextOptimalActions.length > 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Optimal Next Actions</span>
                        </div>
                        <div className="space-y-1">
                          {recursiveAssessment.finalSynthesis.nextOptimalActions.slice(0, 2).map((action, index) => (
                            <div key={index} className="text-xs text-green-700 flex items-center space-x-1">
                              <ArrowRight className="h-3 w-3" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="assessment" className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Layers className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Recursive Assessment</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Depth: {recursiveAssessment.depth}
                        </Badge>
                      </div>

                      {isProcessing ? (
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                          <span>Processing cognitive vectors...</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Convergence Score:</span>
                            <span className="font-medium">{(recursiveAssessment.convergenceScore * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={recursiveAssessment.convergenceScore * 100} className="h-1" />
                        </div>
                      )}
                    </div>

                    {recursiveAssessment.assessmentLayers.map((layer, index) => (
                      <motion.div
                        key={layer.layer}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium">Layer {layer.layer}: {layer.focus}</span>
                          <Badge variant="outline" className="text-xs">
                            {(layer.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {layer.insights.slice(0, 2).map((insight, i) => (
                            <div key={i} className="text-xs text-gray-600 flex items-start space-x-1">
                              <Lightbulb className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                              <span>{insight}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}

                    {recursiveAssessment.finalSynthesis.primaryInsights.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Synthesis</span>
                          <Badge className="text-xs bg-blue-600">
                            {(recursiveAssessment.finalSynthesis.confidenceScore * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {recursiveAssessment.finalSynthesis.actionableRecommendations.slice(0, 3).map((rec, index) => (
                            <div key={index} className="text-xs text-blue-700 flex items-start space-x-1">
                              <CheckCircle2 className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="iris" className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border">
                      <div className="flex items-center space-x-2 mb-3">
                        <Network className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium">IRIS MCP SDK Status</span>
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          ACTIVE
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>Active Agents:</span>
                          <span className="font-medium">{irisState.activeAgents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Load:</span>
                          <span className="font-medium">{irisState.processingLoad.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Coordination:</span>
                          <span className="font-medium">{irisState.coordinationEfficiency.toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Context Aware:</span>
                          <span className="font-medium">{irisState.contextualAwareness.toFixed(0)}%</span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Multi-Modal AI:</span>
                          <Badge variant={irisState.multiModalActive ? "default" : "secondary"}>
                            {irisState.multiModalActive ? "ACTIVE" : "IDLE"}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Real-time Optimization:</span>
                          <Badge variant={irisState.realTimeOptimization ? "default" : "secondary"}>
                            {irisState.realTimeOptimization ? "ENABLED" : "DISABLED"}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Adaptive Learning:</span>
                          <Badge variant={irisState.adaptiveLearning ? "default" : "secondary"}>
                            {irisState.adaptiveLearning ? "LEARNING" : "STATIC"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border">
                      <div className="flex items-center space-x-2 mb-2">
                        <Gauge className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Performance Metrics</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Cpu className="h-3 w-3" />
                            <span>Processing Efficiency</span>
                          </div>
                          <span className="font-medium">94.2%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Zap className="h-3 w-3" />
                            <span>Response Time</span>
                          </div>
                          <span className="font-medium">0.12s</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3" />
                            <span>Security Level</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">MAXIMUM</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => window.location.href = '/orchestration'}
                      >
                        <Workflow className="h-3 w-3 mr-1" />
                        Orchestrate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => window.location.href = '/ai-features'}
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        AI Features
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            )}
          </Card>

          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="h-3 w-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Privacy First</span>
              </div>
              <p className="text-xs text-gray-600">
                All cognitive assessment data remains local. No personal information is transmitted or stored externally.
                You maintain complete control over your data.
              </p>
              <div className="flex items-center justify-between mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 p-1"
                  onClick={() => setActiveTab('overview')}
                >
                  View Settings
                </Button>
                <div className="text-xs text-gray-500">
                  Consent: {userConsent ? 'Active' : 'Inactive'}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}