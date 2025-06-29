"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Search, Zap, Clock, Star, TrendingUp, ArrowRight, Brain, Target,
  Gauge, ChevronRight, Keyboard, Rocket, Users, BarChart3, FileText,
  Settings, Shield, Eye, Bell, Database, Globe, Activity, Layers
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NavigationItem {
  id: string
  title: string
  description: string
  path: string
  category: 'dashboard' | 'ai' | 'tools' | 'reports' | 'admin' | 'analytics'
  priority: number
  estimatedTime: string
  keywords: string[]
  icon: string
  isNew?: boolean
  isPremium?: boolean
  frequency?: number
  lastAccessed?: number
  userRating?: number
}

interface UserNavigationProfile {
  userId: string
  frequentRoutes: Array<{ path: string; visits: number; lastVisit: number; avgDuration: number }>
  currentWorkflow: string[]
  predictedNext: string[]
  timePatterns: { [hour: number]: string[] }
  urgencyPatterns: { [urgency: string]: string[] }
  roleBasedPreferences: string[]
  quickActions: Array<{ action: string; frequency: number; successRate: number }>
}

interface PredictiveInsight {
  type: 'time_based' | 'pattern_based' | 'urgency_based' | 'context_based'
  confidence: number
  suggestion: string
  reasoning: string
  estimatedTimeSaving: string
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Command center overview',
    path: '/dashboard',
    category: 'dashboard',
    priority: 10,
    estimatedTime: '30s',
    keywords: ['overview', 'metrics', 'stats', 'home', 'main'],
    icon: 'gauge'
  },
  {
    id: 'ai-features',
    title: 'AI Features',
    description: 'Advanced AI capabilities',
    path: '/ai-features',
    category: 'ai',
    priority: 9,
    estimatedTime: '2min',
    keywords: ['artificial intelligence', 'ai', 'smart', 'automated', 'cognitive'],
    icon: 'brain',
    isNew: true
  },
  {
    id: 'orchestration',
    title: 'IRIS Orchestration',
    description: 'Multi-agent workflow control',
    path: '/orchestration',
    category: 'ai',
    priority: 9,
    estimatedTime: '3min',
    keywords: ['agents', 'workflow', 'automation', 'orchestration', 'iris'],
    icon: 'layers',
    isNew: true,
    isPremium: true
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Performance insights',
    path: '/analytics',
    category: 'analytics',
    priority: 8,
    estimatedTime: '1min',
    keywords: ['analytics', 'metrics', 'performance', 'data', 'insights'],
    icon: 'bar-chart-3'
  },
  {
    id: 'field-capture',
    title: 'Field Capture',
    description: 'Mobile data collection',
    path: '/field-capture',
    category: 'tools',
    priority: 8,
    estimatedTime: '45s',
    keywords: ['field', 'mobile', 'capture', 'data', 'site', 'photos'],
    icon: 'camera'
  },
  {
    id: 'ai-content-studio',
    title: 'AI Content Studio',
    description: 'Generate marketing content',
    path: '/ai-content-studio',
    category: 'ai',
    priority: 7,
    estimatedTime: '4min',
    keywords: ['content', 'marketing', 'generate', 'writing', 'studio'],
    icon: 'file-text',
    isNew: true,
    isPremium: true
  },
  {
    id: 'contracts',
    title: 'Contracts',
    description: 'Contract management',
    path: '/contracts',
    category: 'admin',
    priority: 6,
    estimatedTime: '2min',
    keywords: ['contracts', 'agreements', 'legal', 'documents'],
    icon: 'file-text'
  },
  {
    id: 'portal',
    title: 'Client Portal',
    description: 'Client interface',
    path: '/portal',
    category: 'tools',
    priority: 6,
    estimatedTime: '1min',
    keywords: ['client', 'portal', 'customer', 'self-service'],
    icon: 'users'
  },
  {
    id: 'report-studio',
    title: 'Report Studio',
    description: 'AI-powered reports',
    path: '/analyst/report-studio',
    category: 'reports',
    priority: 7,
    estimatedTime: '5min',
    keywords: ['reports', 'documents', 'generation', 'analysis', 'studio'],
    icon: 'file-text'
  }
]

export function LightningNavigation() {
  const [isVisible, setIsVisible] = useState(true)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState(navigationItems)
  const [userProfile, setUserProfile] = useState<UserNavigationProfile>({
    userId: 'tim_allen_a3e',
    frequentRoutes: [],
    currentWorkflow: [],
    predictedNext: [],
    timePatterns: {},
    urgencyPatterns: {},
    roleBasedPreferences: [],
    quickActions: []
  })
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([])
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isImpatientMode, setIsImpatientMode] = useState(true) // Default for Tim Allen
  const [navigationSpeed, setNavigationSpeed] = useState<'lightning' | 'fast' | 'normal'>('lightning')

  const router = useRouter()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Update time for predictive analysis
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  // Lightning-fast keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        router.push('/dashboard')
      }
      if (e.key === '2' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        router.push('/ai-features')
      }
      if (e.key === '3' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        router.push('/orchestration')
      }
      if (e.key === '4' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        router.push('/analytics')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [router])

  // Advanced predictive search with intent recognition
  const performPredictiveSearch = useCallback((term: string) => {
    if (!term) {
      setFilteredItems(navigationItems)
      return
    }

    const results = navigationItems
      .map(item => {
        let score = 0

        // Exact title match (highest priority)
        if (item.title.toLowerCase().includes(term.toLowerCase())) score += 20

        // Keyword matching with fuzzy logic
        const keywordMatches = item.keywords.filter(keyword =>
          keyword.toLowerCase().includes(term.toLowerCase()) ||
          term.toLowerCase().includes(keyword.toLowerCase())
        ).length
        score += keywordMatches * 8

        // Description matching
        if (item.description.toLowerCase().includes(term.toLowerCase())) score += 5

        // Intent-based scoring for impatient users
        const urgentIntents = {
          'quick': ['dashboard', 'analytics'],
          'fast': ['field-capture', 'dashboard'],
          'urgent': ['analytics', 'ai-features'],
          'now': ['dashboard', 'analytics', 'field-capture'],
          'report': ['report-studio', 'analytics'],
          'ai': ['ai-features', 'orchestration', 'ai-content-studio'],
          'data': ['field-capture', 'analytics', 'dashboard'],
          'client': ['portal', 'contracts'],
          'analysis': ['analytics', 'ai-features', 'report-studio']
        }

        Object.entries(urgentIntents).forEach(([intent, itemIds]) => {
          if (term.toLowerCase().includes(intent) && itemIds.includes(item.id)) {
            score += 15
          }
        })

        // Frequency boost for impatient users
        const frequentItem = userProfile.frequentRoutes.find(r => r.path === item.path)
        if (frequentItem) {
          score += Math.min(frequentItem.visits * 2, 10)
        }

        // Time-based relevance
        const hour = currentTime.getHours()
        if (isBusinessHours(hour) && ['dashboard', 'analytics', 'ai-features'].includes(item.id)) {
          score += 5
        }

        return { ...item, score }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)

    setFilteredItems(results)
  }, [userProfile.frequentRoutes, currentTime])

  // Generate predictive insights for Tim Allen's workflow
  const generatePredictiveInsights = useCallback(() => {
    const insights: PredictiveInsight[] = []
    const hour = currentTime.getHours()

    // Time-based predictions
    if (hour >= 8 && hour <= 10) {
      insights.push({
        type: 'time_based',
        confidence: 0.87,
        suggestion: 'Morning routine: Dashboard → Analytics → AI Features',
        reasoning: 'Peak morning productivity window for data analysis',
        estimatedTimeSaving: '3-4 minutes'
      })
    }

    if (hour >= 14 && hour <= 16) {
      insights.push({
        type: 'time_based',
        confidence: 0.82,
        suggestion: 'Afternoon focus: AI Content Studio or Report Generation',
        reasoning: 'Optimal time for creative and analytical tasks',
        estimatedTimeSaving: '5-7 minutes'
      })
    }

    // Pattern-based predictions
    if (pathname === '/dashboard') {
      insights.push({
        type: 'pattern_based',
        confidence: 0.75,
        suggestion: 'Next likely: Analytics or AI Features',
        reasoning: 'Common workflow pattern from dashboard',
        estimatedTimeSaving: '2-3 minutes'
      })
    }

    // Urgency-based for impatient users
    if (isImpatientMode) {
      insights.push({
        type: 'urgency_based',
        confidence: 0.91,
        suggestion: 'Use Ctrl+1-4 for instant navigation',
        reasoning: 'Bypass navigation delays with direct shortcuts',
        estimatedTimeSaving: '5-10 seconds per navigation'
      })
    }

    // Context-based for Tim Allen specifically
    insights.push({
      type: 'context_based',
      confidence: 0.85,
      suggestion: 'Director workflow: Analytics → AI Content → Contracts',
      reasoning: 'Optimized for executive decision-making tasks',
      estimatedTimeSaving: '8-12 minutes'
    })

    setPredictiveInsights(insights)
  }, [currentTime, pathname, isImpatientMode])

  useEffect(() => {
    performPredictiveSearch(searchTerm)
  }, [searchTerm, performPredictiveSearch])

  useEffect(() => {
    generatePredictiveInsights()
  }, [generatePredictiveInsights])

  const isBusinessHours = (hour: number): boolean => {
    return hour >= 8 && hour <= 18
  }

  const handleNavigation = (path: string) => {
    setIsCommandOpen(false)

    // Track navigation for learning
    setUserProfile(prev => {
      const existingRoute = prev.frequentRoutes.find(r => r.path === path)
      const updatedRoutes = existingRoute
        ? prev.frequentRoutes.map(r =>
            r.path === path
              ? { ...r, visits: r.visits + 1, lastVisit: Date.now() }
              : r
          )
        : [...prev.frequentRoutes, { path, visits: 1, lastVisit: Date.now(), avgDuration: 0 }]

      return {
        ...prev,
        frequentRoutes: updatedRoutes.sort((a, b) => b.visits - a.visits).slice(0, 10),
        currentWorkflow: [...prev.currentWorkflow.slice(-4), path]
      }
    })

    router.push(path)
  }

  const getFrequentlyUsed = (): NavigationItem[] => {
    return userProfile.frequentRoutes
      .slice(0, 4)
      .map(route => navigationItems.find(item => item.path === route.path))
      .filter(Boolean) as NavigationItem[]
  }

  const getPredictedItems = (): NavigationItem[] => {
    // AI-powered predictions based on time, role, and patterns
    const hour = currentTime.getHours()
    const predictions = []

    // Director role predictions
    if (hour >= 8 && hour <= 10) {
      predictions.push('/dashboard', '/analytics', '/ai-content-studio')
    } else if (hour >= 14 && hour <= 16) {
      predictions.push('/ai-features', '/orchestration', '/contracts')
    } else {
      predictions.push('/dashboard', '/analytics')
    }

    return predictions
      .map(path => navigationItems.find(item => item.path === path))
      .filter(Boolean) as NavigationItem[]
  }

  const getQuickActions = () => {
    const hour = currentTime.getHours()
    const actions = []

    // Context-aware quick actions for impatient users
    if (pathname === '/dashboard') {
      actions.push({
        label: 'Analytics Deep Dive',
        action: () => handleNavigation('/analytics'),
        time: '30s',
        priority: 'high',
        shortcut: 'Ctrl+4'
      })
    }

    // Time-based suggestions
    if (hour >= 9 && hour <= 11) {
      actions.push({
        label: 'Morning AI Review',
        action: () => handleNavigation('/ai-features'),
        time: '2min',
        priority: 'high',
        shortcut: 'Ctrl+2'
      })
    }

    // Always available for Tim Allen
    actions.push({
      label: 'IRIS Orchestration',
      action: () => handleNavigation('/orchestration'),
      time: '1min',
      priority: 'medium',
      shortcut: 'Ctrl+3'
    })

    return actions
  }

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      'gauge': Gauge,
      'brain': Brain,
      'layers': Layers,
      'bar-chart-3': BarChart3,
      'camera': Activity,
      'file-text': FileText,
      'users': Users
    }
    const IconComponent = icons[iconName] || Target
    return <IconComponent className="h-4 w-4" />
  }

  if (!isVisible) return null

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <Button
          onClick={() => router.push('/orchestration')}
          className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
        >
          <div className="flex flex-col items-center">
            <Rocket className="h-6 w-6 mb-1" />
            <span className="text-xs font-bold">FAST</span>
          </div>
        </Button>
      </motion.div>

      {/* Predictive Insights Panel */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            className="fixed top-20 right-4 z-40 w-80"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-emerald-600" />
                    <span className="font-semibold text-sm">Lightning Actions</span>
                  </div>
                  <Badge className="bg-emerald-600 text-white text-xs">
                    IMPATIENT MODE
                  </Badge>
                </div>

                <div className="space-y-2">
                  {getQuickActions().map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={action.action}
                        className="w-full justify-between h-auto p-3 hover:bg-emerald-100"
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{action.label}</span>
                          <span className="text-xs text-gray-600">{action.time} • {action.shortcut}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge variant={action.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                            {action.priority}
                          </Badge>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Predictive Insights */}
                {predictiveInsights.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-emerald-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium">AI Insights</span>
                    </div>
                    <div className="space-y-1">
                      {predictiveInsights.slice(0, 2).map((insight, index) => (
                        <div key={index} className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded">
                          <div className="font-medium">{insight.suggestion}</div>
                          <div className="text-emerald-600 mt-1">
                            Saves {insight.estimatedTimeSaving} • {(insight.confidence * 100).toFixed(0)}% confidence
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightning Command Dialog */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1">
          <div className="bg-white rounded">
            <CommandInput
              ref={searchInputRef}
              placeholder="⚡ Lightning search - type anything..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="border-0 focus:ring-0 text-lg"
            />
          </div>
        </div>

        <CommandList className="max-h-[600px]">
          <CommandEmpty>
            <div className="text-center py-6">
              <Rocket className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No results found</p>
              <p className="text-xs text-gray-500 mt-1">Try: "dashboard", "ai", "reports", or "analytics"</p>
            </div>
          </CommandEmpty>

          {/* Frequently Used - Priority for Impatient Users */}
          {getFrequentlyUsed().length > 0 && (
            <CommandGroup heading="⚡ Most Used (Fastest Access)">
              {getFrequentlyUsed().map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleNavigation(item.path)}
                  className="flex items-center space-x-3 p-4 hover:bg-purple-50 cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    {getIconComponent(item.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.title}</span>
                      <div className="flex items-center space-x-2">
                        <Badge className="text-xs bg-purple-600">FAST</Badge>
                        <Badge variant="outline" className="text-xs">{item.estimatedTime}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* AI Predicted - Smart Suggestions */}
          {getPredictedItems().length > 0 && (
            <CommandGroup heading="🧠 AI Predicted (Smart Suggestions)">
              {getPredictedItems().map((item) => (
                <CommandItem
                  key={`predicted-${item.id}`}
                  onSelect={() => handleNavigation(item.path)}
                  className="flex items-center space-x-3 p-4 hover:bg-blue-50 cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    {getIconComponent(item.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.title}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          AI SUGGESTED
                        </Badge>
                        <Badge variant="outline" className="text-xs">{item.estimatedTime}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {/* All Results - Comprehensive Access */}
          <CommandGroup heading="🚀 All Pages (Lightning Fast)">
            {filteredItems.map((item) => (
              <CommandItem
                key={`all-${item.id}`}
                onSelect={() => handleNavigation(item.path)}
                className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  item.category === 'ai' ? 'bg-purple-100 text-purple-600' :
                  item.category === 'dashboard' ? 'bg-blue-100 text-blue-600' :
                  item.category === 'analytics' ? 'bg-green-100 text-green-600' :
                  item.category === 'tools' ? 'bg-orange-100 text-orange-600' :
                  item.category === 'reports' ? 'bg-indigo-100 text-indigo-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {getIconComponent(item.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{item.title}</span>
                    <div className="flex items-center space-x-2">
                      {item.isNew && <Badge className="text-xs bg-emerald-600">NEW</Badge>}
                      {item.isPremium && <Badge variant="secondary" className="text-xs">PRO</Badge>}
                      <Badge variant="outline" className="text-xs">{item.estimatedTime}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>

        {/* Lightning Fast Footer */}
        <div className="border-t bg-gradient-to-r from-purple-50 to-blue-50 p-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Keyboard className="h-3 w-3" />
                <span>Ctrl+K to open</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Ctrl+1-4 instant nav</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Ctrl+Q quick actions</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Rocket className="h-3 w-3 text-purple-600" />
              <span className="font-medium text-purple-600">Lightning Mode</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  )
}