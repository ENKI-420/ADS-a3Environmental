"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Search,
  Zap,
  Clock,
  Star,
  TrendingUp,
  ArrowRight,
  Brain,
  Target,
  Gauge,
  ChevronRight,
  Keyboard
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NavigationItem {
  id: string
  title: string
  description: string
  path: string
  category: 'dashboard' | 'ai' | 'tools' | 'reports' | 'admin'
  priority: number
  estimatedTime: string
  keywords: string[]
  icon?: string
  isNew?: boolean
  isPremium?: boolean
}

interface UserNavigationPattern {
  frequentRoutes: { path: string; visits: number; lastVisit: number }[]
  currentWorkflow: string[]
  predictedNext: string[]
  timePatterns: { [hour: number]: string[] }
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Overview of all operations',
    path: '/dashboard',
    category: 'dashboard',
    priority: 10,
    estimatedTime: '2min',
    keywords: ['overview', 'metrics', 'stats', 'home']
  },
  {
    id: 'ai-features',
    title: 'AI Features',
    description: 'Advanced AI capabilities',
    path: '/ai-features',
    category: 'ai',
    priority: 9,
    estimatedTime: '5min',
    keywords: ['artificial intelligence', 'ai', 'smart', 'automated'],
    isNew: true
  },
  {
    id: 'orchestration',
    title: 'Agent Orchestration',
    description: 'Multi-agent workflow management',
    path: '/orchestration',
    category: 'ai',
    priority: 8,
    estimatedTime: '8min',
    keywords: ['agents', 'workflow', 'automation', 'orchestration']
  },
  {
    id: 'ai-content-studio',
    title: 'AI Content Studio',
    description: 'Generate marketing content',
    path: '/ai-content-studio',
    category: 'ai',
    priority: 8,
    estimatedTime: '10min',
    keywords: ['content', 'marketing', 'generate', 'writing'],
    isNew: true,
    isPremium: true
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Performance metrics and insights',
    path: '/analytics',
    category: 'reports',
    priority: 7,
    estimatedTime: '6min',
    keywords: ['analytics', 'metrics', 'performance', 'data']
  },
  {
    id: 'field-capture',
    title: 'Field Data Capture',
    description: 'Mobile data collection',
    path: '/field-capture',
    category: 'tools',
    priority: 7,
    estimatedTime: '3min',
    keywords: ['field', 'mobile', 'capture', 'data', 'site']
  },
  {
    id: 'report-studio',
    title: 'Report Studio',
    description: 'AI-powered report generation',
    path: '/analyst/report-studio',
    category: 'reports',
    priority: 6,
    estimatedTime: '12min',
    keywords: ['reports', 'documents', 'generation', 'analysis']
  },
  {
    id: 'contracts',
    title: 'Contract Management',
    description: 'Contract lifecycle management',
    path: '/contracts',
    category: 'admin',
    priority: 5,
    estimatedTime: '7min',
    keywords: ['contracts', 'agreements', 'legal', 'documents']
  },
  {
    id: 'portal',
    title: 'Client Portal',
    description: 'Client self-service interface',
    path: '/portal',
    category: 'tools',
    priority: 5,
    estimatedTime: '4min',
    keywords: ['client', 'portal', 'customer', 'self-service']
  }
]

export function EnhancedNavigation() {
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState(navigationItems)
  const [userPatterns, setUserPatterns] = useState<UserNavigationPattern>({
    frequentRoutes: [],
    currentWorkflow: [],
    predictedNext: [],
    timePatterns: {}
  })
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  const router = useRouter()
  const pathname = usePathname()

  // Update current time for time-based predictions
  useEffect(() => {
    // Set initial time after hydration
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandOpen(true)
      }
      if (e.key === 'Escape') {
        setIsCommandOpen(false)
      }
      if (e.key === 'q' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowQuickActions(!showQuickActions)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showQuickActions])

  // Smart filtering with intent recognition
  const performSmartSearch = useCallback((term: string) => {
    if (!term) {
      setFilteredItems(navigationItems)
      return
    }

    const results = navigationItems
      .map(item => {
        let score = 0

        // Exact title match
        if (item.title.toLowerCase().includes(term.toLowerCase())) score += 10

        // Keyword matching
        const keywordMatches = item.keywords.filter(keyword =>
          keyword.toLowerCase().includes(term.toLowerCase())
        ).length
        score += keywordMatches * 5

        // Description matching
        if (item.description.toLowerCase().includes(term.toLowerCase())) score += 3

        // Intent-based scoring
        const intents = {
          'quick': ['dashboard', 'field-capture'],
          'analysis': ['analytics', 'report-studio'],
          'ai': ['ai-features', 'orchestration', 'ai-content-studio'],
          'manage': ['contracts', 'portal']
        }

        Object.entries(intents).forEach(([intent, itemIds]) => {
          if (term.toLowerCase().includes(intent) && itemIds.includes(item.id)) {
            score += 8
          }
        })

        return { ...item, score }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)

    setFilteredItems(results)
  }, [])

  useEffect(() => {
    performSmartSearch(searchTerm)
  }, [searchTerm, performSmartSearch])

  // Generate time-based predictions
  const generateTimePredictions = useCallback(() => {
    if (!currentTime) return
    
    const hour = currentTime.getHours()
    const predictions = []

    // Morning patterns (7-11 AM): Focus on planning and analysis
    if (hour >= 7 && hour <= 11) {
      predictions.push('/dashboard', '/analytics', '/ai-features')
    }
    // Afternoon patterns (12-5 PM): Active work and field operations
    else if (hour >= 12 && hour <= 17) {
      predictions.push('/field-capture', '/orchestration', '/report-studio')
    }
    // Evening patterns (6-8 PM): Administrative and review tasks
    else if (hour >= 18 && hour <= 20) {
      predictions.push('/contracts', '/portal', '/analytics')
    }
    // Default patterns
    else {
      predictions.push('/dashboard', '/ai-features')
    }

    setUserPatterns(prev => ({ ...prev, predictedNext: predictions }))
  }, [currentTime])

  useEffect(() => {
    generateTimePredictions()
  }, [generateTimePredictions])

  const handleNavigation = (path: string) => {
    setIsCommandOpen(false)
    router.push(path)

    // Update user patterns
    setUserPatterns(prev => {
      const existingRoute = prev.frequentRoutes.find(r => r.path === path)
      const updatedRoutes = existingRoute
        ? prev.frequentRoutes.map(r =>
            r.path === path
              ? { ...r, visits: r.visits + 1, lastVisit: Date.now() }
              : r
          )
        : [...prev.frequentRoutes, { path, visits: 1, lastVisit: Date.now() }]

      return {
        ...prev,
        frequentRoutes: updatedRoutes.sort((a, b) => b.visits - a.visits).slice(0, 10),
        currentWorkflow: [...prev.currentWorkflow.slice(-4), path]
      }
    })
  }

  const getFrequentlyUsed = () => {
    return userPatterns.frequentRoutes
      .slice(0, 4)
      .map(route => navigationItems.find(item => item.path === route.path))
      .filter(Boolean) as NavigationItem[]
  }

  const getPredictedItems = () => {
    return userPatterns.predictedNext
      .map(path => navigationItems.find(item => item.path === path))
      .filter(Boolean) as NavigationItem[]
  }

  const getQuickActions = () => {
    const currentHour = currentTime.getHours()
    const actions = []

    // Context-aware quick actions
    if (pathname === '/dashboard') {
      actions.push({
        label: 'Generate Report',
        action: () => handleNavigation('/analyst/report-studio'),
        time: '2min',
        priority: 'high'
      })
    }

    if (currentHour >= 9 && currentHour <= 17) {
      actions.push({
        label: 'Check Field Data',
        action: () => handleNavigation('/field-capture'),
        time: '1min',
        priority: 'medium'
      })
    }

    actions.push({
      label: 'AI Analysis',
      action: () => handleNavigation('/ai-features'),
      time: '3min',
      priority: 'high'
    })

    return actions
  }

  return (
    <>
      {/* Floating Quick Access Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <Button
          onClick={() => setIsCommandOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
        >
          <Search className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Quick Actions Panel */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            className="fixed top-20 left-4 z-40 w-64"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium">Quick Actions</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuickActions(false)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
                <div className="space-y-2">
                  {getQuickActions().map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={action.action}
                      className="w-full justify-start h-auto p-2"
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{action.label}</span>
                          <Badge variant={action.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                            {action.time}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Button>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t text-xs text-gray-500 flex items-center">
                  <Keyboard className="h-3 w-3 mr-1" />
                  Press Ctrl+Q to toggle
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Dialog */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput
          placeholder="Type to search or navigate..."
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList className="max-h-[600px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Frequently Used */}
          {getFrequentlyUsed().length > 0 && (
            <CommandGroup heading="Frequently Used">
              {getFrequentlyUsed().map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleNavigation(item.path)}
                  className="flex items-center space-x-3 p-3"
                >
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.title}</span>
                      <div className="flex items-center space-x-2">
                        {item.isNew && <Badge className="text-xs">NEW</Badge>}
                        <Badge variant="outline" className="text-xs">
                          {item.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* AI-Predicted Next Actions */}
          {getPredictedItems().length > 0 && (
            <CommandGroup heading="Predicted for You">
              {getPredictedItems().map((item) => (
                <CommandItem
                  key={`predicted-${item.id}`}
                  onSelect={() => handleNavigation(item.path)}
                  className="flex items-center space-x-3 p-3"
                >
                  <Brain className="h-4 w-4 text-purple-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.title}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          AI Suggested
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />

          {/* All Results */}
          <CommandGroup heading="All Pages">
            {filteredItems.map((item) => (
              <CommandItem
                key={`all-${item.id}`}
                onSelect={() => handleNavigation(item.path)}
                className="flex items-center space-x-3 p-3"
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  item.category === 'ai' ? 'bg-purple-100 text-purple-600' :
                  item.category === 'dashboard' ? 'bg-blue-100 text-blue-600' :
                  item.category === 'reports' ? 'bg-green-100 text-green-600' :
                  item.category === 'tools' ? 'bg-orange-100 text-orange-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.category === 'ai' && <Brain className="h-4 w-4" />}
                  {item.category === 'dashboard' && <Gauge className="h-4 w-4" />}
                  {item.category === 'reports' && <TrendingUp className="h-4 w-4" />}
                  {item.category === 'tools' && <Target className="h-4 w-4" />}
                  {item.category === 'admin' && <Clock className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.title}</span>
                    <div className="flex items-center space-x-2">
                      {item.isNew && <Badge className="text-xs bg-emerald-600">NEW</Badge>}
                      {item.isPremium && <Badge variant="secondary" className="text-xs">PRO</Badge>}
                      <Badge variant="outline" className="text-xs">
                        {item.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>

        <div className="border-t p-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Keyboard className="h-3 w-3" />
                <span>Ctrl+K to open</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>↑↓ to navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Enter to select</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Enhanced</span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  )
}