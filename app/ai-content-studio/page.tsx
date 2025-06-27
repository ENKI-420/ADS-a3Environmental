"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Sparkles, FileText, Lightbulb, Users, Building, Target, Shield, Bot, Zap } from 'lucide-react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface AIContentRequest {
  type: 'case-study' | 'blog-ideas' | 'marketing-copy' | 'technical-report'
  content: string
  keywords?: string
  targetAudience?: string
}

interface AIContentResponse {
  success: boolean
  content: string
  suggestions?: string[]
  metadata?: {
    wordCount: number
    readingTime: number
    seoScore?: number
  }
}

export default function AIContentStudioPage() {
  const [caseStudyInput, setCaseStudyInput] = useState('')
  const [blogKeywords, setBlogKeywords] = useState('')
  const [caseStudyOutput, setCaseStudyOutput] = useState('')
  const [blogIdeasOutput, setBlogIdeasOutput] = useState('')
  const [isLoadingCaseStudy, setIsLoadingCaseStudy] = useState(false)
  const [isLoadingBlogIdeas, setIsLoadingBlogIdeas] = useState(false)
  const [marketingCopyInput, setMarketingCopyInput] = useState('')
  const [marketingCopyOutput, setMarketingCopyOutput] = useState('')
  const [isLoadingMarketingCopy, setIsLoadingMarketingCopy] = useState(false)

  const challenges = [
    {
      icon: <Building className="h-6 w-6" />,
      title: "Website Inaccessibility",
      description: "Core pages like 'Services' and 'Contact Us' are non-functional, creating a severe barrier for new leads and eroding trust.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Limited Client Self-Service",
      description: "Existing client portal lacks key features for document access and project tracking, increasing administrative workload.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Undeveloped Employee Digital Workspace",
      description: "Absence of a dedicated internal portal hinders productivity, knowledge sharing, and efficient internal communication.",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Underutilized Content Marketing",
      description: "Lack of strategic thought leadership and detailed case studies limits organic visibility and lead generation potential.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Absence of Automation",
      description: "Manual administrative tasks lead to higher operational costs and increased potential for human error.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Data Security & Compliance Concerns",
      description: "Without robust digital infrastructure, ensuring data confidentiality and regulatory compliance becomes challenging.",
      color: "bg-green-100 text-green-600"
    }
  ]

  const callAIContentAPI = async (request: AIContentRequest): Promise<AIContentResponse> => {
    try {
      // Integration with existing IRIS AI system
      const response = await fetch('/api/ai-content-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: request.type,
          content: request.content,
          keywords: request.keywords,
          targetAudience: request.targetAudience || 'environmental-professionals',
          useIRIS: true, // Use existing IRIS AI system
          contextAware: true
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('AI Content Generation Error:', error)
      return {
        success: false,
        content: `Error generating content: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
      }
    }
  }

  const generateCaseStudySummary = async () => {
    if (!caseStudyInput.trim()) {
      setCaseStudyOutput('Please enter some text for the case study summary.')
      return
    }

    setIsLoadingCaseStudy(true)
    setCaseStudyOutput('Generating case study summary with IRIS AI...')

    try {
      const response = await callAIContentAPI({
        type: 'case-study',
        content: caseStudyInput,
        targetAudience: 'potential-clients'
      })

      setCaseStudyOutput(response.content)
    } catch (error) {
      setCaseStudyOutput('An error occurred while generating the case study summary. Please try again.')
    } finally {
      setIsLoadingCaseStudy(false)
    }
  }

  const generateBlogIdeas = async () => {
    if (!blogKeywords.trim()) {
      setBlogIdeasOutput('Please enter some keywords to brainstorm blog post ideas.')
      return
    }

    setIsLoadingBlogIdeas(true)
    setBlogIdeasOutput('Brainstorming blog post ideas with environmental intelligence...')

    try {
      const response = await callAIContentAPI({
        type: 'blog-ideas',
        content: '',
        keywords: blogKeywords,
        targetAudience: 'environmental-professionals'
      })

      setBlogIdeasOutput(response.content)
    } catch (error) {
      setBlogIdeasOutput('An error occurred while generating blog ideas. Please try again.')
    } finally {
      setIsLoadingBlogIdeas(false)
    }
  }

  const generateMarketingCopy = async () => {
    if (!marketingCopyInput.trim()) {
      setMarketingCopyOutput('Please enter some content for marketing copy generation.')
      return
    }

    setIsLoadingMarketingCopy(true)
    setMarketingCopyOutput('Generating marketing copy with AI assistance...')

    try {
      const response = await callAIContentAPI({
        type: 'marketing-copy',
        content: marketingCopyInput,
        targetAudience: 'potential-clients'
      })

      setMarketingCopyOutput(response.content)
    } catch (error) {
      setMarketingCopyOutput('An error occurred while generating marketing copy. Please try again.')
    } finally {
      setIsLoadingMarketingCopy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              A3E AI Content Studio
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Leverage cutting-edge AI to streamline your content generation for marketing,
            case studies, and thought leadership in environmental consulting.
          </p>
          <Badge className="mt-4 bg-emerald-100 text-emerald-800 px-4 py-2">
            <Bot className="h-4 w-4 mr-2" />
            Powered by IRIS AI Intelligence
          </Badge>
        </div>
      </section>

      {/* Digital Transformation Challenge */}
      <section className="mb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Digital Transformation Challenges
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              A3E's strong foundation requires addressing key digital gaps to enhance
              stakeholder experience and drive sustainable growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {challenges.map((challenge, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={`flex items-center justify-center h-12 w-12 rounded-full ${challenge.color} mb-4`}>
                    {challenge.icon}
                  </div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {challenge.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Content Generation Tools */}
      <section className="mb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              AI-Powered Content Creation
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Transform your content strategy with intelligent AI tools designed
              specifically for environmental consulting professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Case Study Summary Generator */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Case Study Summary Generator</span>
                </CardTitle>
                <CardDescription>
                  Transform detailed project information into compelling, professional case study summaries.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your detailed project information or draft case study here..."
                  value={caseStudyInput}
                  onChange={(e) => setCaseStudyInput(e.target.value)}
                  className="min-h-32"
                />
                <Button
                  onClick={generateCaseStudySummary}
                  disabled={isLoadingCaseStudy}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoadingCaseStudy ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate Case Study Summary
                </Button>
                <div className="min-h-24 p-4 bg-gray-50 rounded-md border text-sm">
                  {caseStudyOutput || "Your summarized case study will appear here."}
                </div>
              </CardContent>
            </Card>

            {/* Blog Post Idea Brainstormer */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                  <span>Blog Post Idea Brainstormer</span>
                </CardTitle>
                <CardDescription>
                  Generate engaging blog post ideas based on environmental keywords and trends.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter keywords (e.g., environmental regulations, sustainability, remediation)..."
                  value={blogKeywords}
                  onChange={(e) => setBlogKeywords(e.target.value)}
                />
                <Button
                  onClick={generateBlogIdeas}
                  disabled={isLoadingBlogIdeas}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isLoadingBlogIdeas ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Lightbulb className="h-4 w-4 mr-2" />
                  )}
                  Brainstorm Blog Post Ideas
                </Button>
                <div className="min-h-24 p-4 bg-gray-50 rounded-md border text-sm">
                  {blogIdeasOutput || "Your blog post ideas will appear here."}
                </div>
              </CardContent>
            </Card>

            {/* Marketing Copy Generator */}
            <Card className="shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span>Marketing Copy Generator</span>
                </CardTitle>
                <CardDescription>
                  Create compelling marketing copy for proposals, website content, and client communications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your service, project, or key message you want to promote..."
                  value={marketingCopyInput}
                  onChange={(e) => setMarketingCopyInput(e.target.value)}
                  className="min-h-24"
                />
                <Button
                  onClick={generateMarketingCopy}
                  disabled={isLoadingMarketingCopy}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoadingMarketingCopy ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Target className="h-4 w-4 mr-2" />
                  )}
                  Generate Marketing Copy
                </Button>
                <div className="min-h-24 p-4 bg-gray-50 rounded-md border text-sm">
                  {marketingCopyOutput || "Your marketing copy will appear here."}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Notice */}
      <section className="mb-16 px-4">
        <div className="container mx-auto">
          <Alert className="max-w-4xl mx-auto border-emerald-200 bg-emerald-50">
            <Bot className="h-4 w-4" />
            <AlertDescription>
              <strong>AI Integration Active:</strong> This content studio is powered by your existing
              IRIS AI infrastructure, ensuring consistent quality and environmental expertise across
              all generated content. Content is contextually aware and optimized for environmental consulting.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <Footer />
    </div>
  )
}