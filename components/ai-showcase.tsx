"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  Eye,
  Globe,
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Cpu,
  Database,
  Zap,
  Clock,
  DollarSign,
  Award,
  ChevronRight,
  CheckCircle,
  ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface AIFeature {
  id: string
  title: string
  description: string
  icon: React.ElementType
  benefits: string[]
  metrics: {
    label: string
    value: string
    improvement: string
  }[]
  status: 'live' | 'beta' | 'coming-soon'
  color: string
}

const aiFeatures: AIFeature[] = [
  {
    id: 'predictive',
    title: 'Predictive Environmental Analytics',
    description: 'First-to-market AI predicting environmental risks 3-6 months in advance',
    icon: Brain,
    benefits: [
      'Contamination spread prediction with 85% accuracy',
      'Compliance risk forecasting before issues occur',
      'Weather impact analysis for project planning',
      'Cost overrun prevention using ML models'
    ],
    metrics: [
      { label: 'Advance Warning', value: '3-6 months', improvement: 'Industry First' },
      { label: 'Cost Reduction', value: '40%', improvement: 'Remediation Savings' },
      { label: 'Accuracy Rate', value: '85%', improvement: 'Prediction Accuracy' }
    ],
    status: 'live',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'compliance',
    title: 'Automated Compliance Intelligence',
    description: 'Real-time monitoring across EPA, NEPA, HUD, DOT with automated reporting',
    icon: Shield,
    benefits: [
      'Multi-agency regulatory integration',
      'Automated report generation and filing',
      'Real-time compliance monitoring',
      'Smart deadline tracking and alerts'
    ],
    metrics: [
      { label: 'Time Savings', value: '75%', improvement: 'Faster Compliance' },
      { label: 'Violation Reduction', value: '90%', improvement: 'Fewer Issues' },
      { label: 'Agencies Covered', value: '15+', improvement: 'Full Coverage' }
    ],
    status: 'live',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'vision',
    title: 'Computer Vision Site Analysis',
    description: 'Advanced AI for automated site assessment and contamination detection',
    icon: Eye,
    benefits: [
      'Automatic contamination detection from images',
      'Safety hazard recognition and alerts',
      'Vegetation health and NDVI analysis',
      '3D site modeling from photos/video'
    ],
    metrics: [
      { label: 'Analysis Speed', value: '90%', improvement: 'Faster Than Manual' },
      { label: 'Detection Accuracy', value: '95%', improvement: 'Contamination ID' },
      { label: 'Processing Time', value: '2-3 days', improvement: 'vs 2-3 weeks' }
    ],
    status: 'live',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'data',
    title: 'Real-Time Data Integration Hub',
    description: 'Unparalleled integration with 15+ environmental databases',
    icon: Database,
    benefits: [
      'EPA, NOAA, USGS database integration',
      'IoT sensor network connectivity',
      'Real-time data fusion and analysis',
      'Predictive insights from multiple sources'
    ],
    metrics: [
      { label: 'Data Sources', value: '15+', improvement: 'Simultaneous Access' },
      { label: 'Update Frequency', value: 'Real-time', improvement: 'Live Data' },
      { label: 'Data Quality', value: '98%', improvement: 'Accuracy Score' }
    ],
    status: 'live',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'portal',
    title: 'Client Self-Service Portal',
    description: '24/7 AI-powered client access with automated reporting',
    icon: Users,
    benefits: [
      'IRIS AI consultant available 24/7',
      'Real-time project tracking and alerts',
      'Automated custom report generation',
      'Virtual AR/VR site inspections'
    ],
    metrics: [
      { label: 'Availability', value: '24/7', improvement: 'Always On' },
      { label: 'Response Time', value: '80%', improvement: 'Faster Service' },
      { label: 'Cost Reduction', value: '60%', improvement: 'Lower Overhead' }
    ],
    status: 'live',
    color: 'from-indigo-500 to-purple-500'
  }
]

const competitiveAdvantages = [
  { icon: Zap, label: 'First-to-Market', value: 'Industry\'s First AI Integration' },
  { icon: Clock, label: '80% Faster', value: 'Project Delivery Time' },
  { icon: DollarSign, label: '40-60%', value: 'Cost Efficiency Gain' },
  { icon: Award, label: '3-5x', value: 'Project Capacity Increase' }
]

export function AIShowcase() {
  const [selectedFeature, setSelectedFeature] = useState<AIFeature>(aiFeatures[0])
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="w-full space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-900 via-blue-900 to-emerald-900 p-8 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative z-10">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
            Industry First
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            AI-Powered Environmental Intelligence
          </h1>
          <p className="text-xl mb-6 text-white/90">
            The future of environmental consulting is here. A3E's revolutionary AI platform delivers
            predictive insights, automated compliance, and real-time intelligence that competitors can't match.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {competitiveAdvantages.map((advantage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <advantage.icon className="h-8 w-8 mb-2 text-white/80" />
                <div className="text-2xl font-bold">{advantage.value}</div>
                <div className="text-sm text-white/70">{advantage.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">AI Features</TabsTrigger>
          <TabsTrigger value="comparison">Competitive Edge</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiFeatures.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer transition-all duration-300",
                    selectedFeature.id === feature.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedFeature(feature)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-r",
                        feature.color
                      )}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant={
                        feature.status === 'live' ? 'default' :
                        feature.status === 'beta' ? 'secondary' : 'outline'
                      }>
                        {feature.status === 'live' ? 'Live' :
                         feature.status === 'beta' ? 'Beta' : 'Coming Soon'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.metrics.slice(0, 2).map((metric, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          <span className="font-semibold">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6 mt-6">
          {/* Detailed Feature View */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-lg bg-gradient-to-r",
                  selectedFeature.color
                )}>
                  <selectedFeature.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{selectedFeature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {selectedFeature.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Benefits */}
              <div>
                <h3 className="font-semibold mb-3">Key Capabilities</h3>
                <div className="space-y-2">
                  {selectedFeature.benefits.map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div>
                <h3 className="font-semibold mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedFeature.metrics.map((metric, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-muted/50 rounded-lg p-4"
                    >
                      <div className="text-2xl font-bold mb-1">{metric.value}</div>
                      <div className="text-sm font-medium">{metric.label}</div>
                      <div className="text-xs text-muted-foreground">{metric.improvement}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-4">
                <Button size="lg" className="gap-2">
                  Schedule Demo
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6 mt-6">
          {/* Competitive Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>A3E vs Traditional Environmental Consultants</CardTitle>
              <CardDescription>
                See how our AI-powered platform transforms environmental consulting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    feature: 'Site Assessment',
                    traditional: '2-3 weeks',
                    a3e: '2-3 days',
                    improvement: 90
                  },
                  {
                    feature: 'Compliance Checking',
                    traditional: 'Manual, 1-2 days',
                    a3e: 'Instant, automated',
                    improvement: 95
                  },
                  {
                    feature: 'Predictive Capabilities',
                    traditional: 'None',
                    a3e: '3-6 month forecasting',
                    improvement: 100
                  },
                  {
                    feature: 'Data Integration',
                    traditional: 'Limited, manual',
                    a3e: '15+ sources, real-time',
                    improvement: 85
                  },
                  {
                    feature: 'Client Access',
                    traditional: 'Business hours',
                    a3e: '24/7 self-service',
                    improvement: 80
                  }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.feature}</span>
                      <Badge variant="default" className="bg-green-500">
                        {item.improvement}% Better
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Traditional</div>
                        <div className="font-medium text-red-600 dark:text-red-400">
                          {item.traditional}
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">A3E with AI</div>
                        <div className="font-medium text-green-600 dark:text-green-400">
                          {item.a3e}
                        </div>
                      </div>
                    </div>
                    <Progress value={item.improvement} className="h-2" />
                  </motion.div>
                ))}
              </div>

              {/* ROI Calculator */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                <h3 className="font-semibold mb-4">Estimated ROI with A3E AI Platform</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">300%</div>
                    <div className="text-sm text-muted-foreground">Project Capacity</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">50%</div>
                    <div className="text-sm text-muted-foreground">Time Reduction</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">40%</div>
                    <div className="text-sm text-muted-foreground">Cost Savings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">95%</div>
                    <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Ready to Transform Your Environmental Consulting?
              </h2>
              <p className="text-primary-foreground/90">
                Join the AI revolution and gain an unbeatable competitive advantage
              </p>
            </div>
            <div className="flex gap-4">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                View Case Studies
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}