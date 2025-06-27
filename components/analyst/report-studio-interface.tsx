"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Upload, X, Eye, Download, MapPin, AlertTriangle, CheckCircle2,
  FileText, Map, Camera, Brain, Shield, Zap, BarChart3, Settings
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Layer 9: Drag-Drop Intelligence UI Types
interface UploadedImage {
  id: string
  file: File
  url: string
  analysis?: AIImageAnalysis
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  phaseIIRecommended: boolean
  status: 'analyzing' | 'complete' | 'error'
}

interface AIImageAnalysis {
  objects: DetectedObject[]
  sceneType: string
  hazards: string[]
  confidence: number
  recommendations: string[]
  coordinates?: { lat: number; lng: number }
  findings: EnvironmentalFinding[]
}

interface DetectedObject {
  label: string
  confidence: number
  bbox: [number, number, number, number]
  category: 'hazard' | 'equipment' | 'vegetation' | 'structure'
}

interface EnvironmentalFinding {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  recommendation: string
}

interface ReportSection {
  id: string
  title: string
  content: string
  images: string[]
  aiGenerated: boolean
  lastModified: string
}

export function ReportStudioInterface() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [reportSections, setReportSections] = useState<ReportSection[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [progress, setProgress] = useState(0)
  const [analysisOptions, setAnalysisOptions] = useState({
    threshold: 0.65,
    enableRiskAssessment: true,
    generateRecommendations: true,
    evidenceChain: false
  })
  const [projectInfo, setProjectInfo] = useState({
    name: '',
    analyst: '',
    phase: 'Phase I' as 'Phase I' | 'Phase II' | 'Phase III',
    client: ''
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    const newImages: UploadedImage[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        newImages.push({
          id,
          file,
          url: URL.createObjectURL(file),
          riskLevel: 'low',
          phaseIIRecommended: false,
          status: 'analyzing'
        })
      }
    })

    setImages(prev => [...prev, ...newImages])

    // Process each image with AI
    for (const image of newImages) {
      await processImageWithAI(image)
    }
  }, [])

  // AI Scene Recognition Processing
  const processImageWithAI = async (image: UploadedImage) => {
    try {
      setProcessingStep(`Analyzing ${image.file.name}...`)

      // Simulate AI processing (in production, call actual API)
      const analysis = await simulateAIAnalysis(image.file)

      setImages(prev => prev.map(img =>
        img.id === image.id
          ? {
              ...img,
              analysis,
              riskLevel: analysis.riskLevel,
              phaseIIRecommended: analysis.phaseIIRecommended,
              status: 'complete'
            }
          : img
      ))
    } catch (error) {
      setImages(prev => prev.map(img =>
        img.id === image.id ? { ...img, status: 'error' } : img
      ))
      toast({
        title: "Analysis Error",
        description: `Failed to analyze ${image.file.name}`,
        variant: "destructive"
      })
    }
  }

  // Simulate AI analysis (replace with actual API call)
  const simulateAIAnalysis = async (file: File): Promise<AIImageAnalysis> => {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time

    const mockObjects = [
      { label: 'oil_drum', confidence: 0.89, bbox: [150, 100, 80, 120] as [number, number, number, number], category: 'hazard' as const },
      { label: 'surface_staining', confidence: 0.76, bbox: [200, 250, 120, 60] as [number, number, number, number], category: 'hazard' as const }
    ]

    const riskLevel = mockObjects.some(obj => obj.confidence > 0.8) ? 'high' : 'medium'

    return {
      objects: mockObjects,
      sceneType: 'industrial_storage_area',
      hazards: mockObjects.map(obj => obj.label),
      confidence: 0.85,
      riskLevel: riskLevel as 'high' | 'medium',
      phaseIIRecommended: riskLevel === 'high',
      recommendations: [
        'Phase II Environmental Site Assessment recommended',
        'Soil sampling required around detected hazards',
        'Implement immediate containment measures'
      ],
      findings: [
        {
          type: 'contamination',
          severity: riskLevel as 'high' | 'medium',
          description: 'Potential hydrocarbon contamination detected',
          recommendation: 'Conduct soil sampling and analysis'
        }
      ]
    }
  }

  // Generate report section from selected images
  const generateReportSection = async (images: UploadedImage[]) => {
    if (images.length === 0) return

    setIsProcessing(true)
    setProgress(0)

    try {
      const content = generateSectionContent(images)
      const newSection: ReportSection = {
        id: `section_${Date.now()}`,
        title: `Environmental Findings - ${new Date().toLocaleDateString()}`,
        content,
        images: images.map(img => img.id),
        aiGenerated: true,
        lastModified: new Date().toISOString()
      }

      setReportSections(prev => [...prev, newSection])
      setProgress(100)

      toast({
        title: "Report Section Generated",
        description: `Added section with ${images.length} images and AI analysis`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report section",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const generateSectionContent = (images: UploadedImage[]): string => {
    const highRiskImages = images.filter(img => img.riskLevel === 'high' || img.riskLevel === 'critical')
    const phaseIIRecommended = images.some(img => img.phaseIIRecommended)

    let content = "## Environmental Site Assessment Findings\n\n"

    if (highRiskImages.length > 0) {
      content += "### High-Risk Areas Identified\n\n"
      content += `${highRiskImages.length} high-risk areas have been identified through AI-assisted image analysis.\n\n`
    }

    images.forEach((img, index) => {
      if (img.analysis) {
        content += `### Image ${index + 1}: ${img.file.name}\n\n`
        content += `**Risk Level:** ${img.riskLevel.toUpperCase()}\n\n`
        content += `**Scene Type:** ${img.analysis.sceneType}\n\n`

        if (img.analysis.hazards.length > 0) {
          content += `**Detected Hazards:** ${img.analysis.hazards.join(', ')}\n\n`
        }

        if (img.analysis.recommendations.length > 0) {
          content += "**Recommendations:**\n"
          img.analysis.recommendations.forEach(rec => {
            content += `- ${rec}\n`
          })
          content += "\n"
        }
      }
    })

    if (phaseIIRecommended) {
      content += "### Phase II ESA Recommendation\n\n"
      content += "Based on the AI analysis of site conditions and detected environmental concerns, a Phase II Environmental Site Assessment is recommended to further evaluate potential contamination.\n\n"
    }

    return content
  }

  // Export functions
  const exportReport = () => {
    const reportData = {
      project: projectInfo,
      sections: reportSections,
      images: images.map(img => ({
        id: img.id,
        name: img.file.name,
        analysis: img.analysis,
        riskLevel: img.riskLevel
      })),
      generated: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectInfo.name || 'A3E_Report'}_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateKMLPreview = () => {
    const geoTaggedImages = images.filter(img => img.analysis?.coordinates)

    if (geoTaggedImages.length === 0) {
      toast({
        title: "No GPS Data",
        description: "No images with GPS coordinates found",
        variant: "destructive"
      })
      return
    }

    // Generate KML content (simplified)
    let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>A3E Environmental Analysis</name>
    <description>AI-Enhanced Environmental Site Assessment</description>`

    geoTaggedImages.forEach(img => {
      if (img.analysis?.coordinates) {
        kmlContent += `
    <Placemark>
      <name>${img.file.name}</name>
      <description>Risk Level: ${img.riskLevel} | Scene: ${img.analysis.sceneType}</description>
      <Point>
        <coordinates>${img.analysis.coordinates.lng},${img.analysis.coordinates.lat},0</coordinates>
      </Point>
    </Placemark>`
      }
    })

    kmlContent += `
  </Document>
</kml>`

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectInfo.name || 'A3E_Analysis'}.kml`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-black'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzing': return <Brain className="h-4 w-4 animate-spin text-blue-500" />
      case 'complete': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-emerald-600" />
            AI-Enhanced Report Studio
            <Badge variant="outline" className="ml-2">Layer 9</Badge>
          </CardTitle>
          <CardDescription>
            Drag-drop intelligence UI for rapid environmental report composition with AI scene recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectInfo.name}
                onChange={(e) => setProjectInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Site Assessment Project"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analyst">Analyst</Label>
              <Input
                id="analyst"
                value={projectInfo.analyst}
                onChange={(e) => setProjectInfo(prev => ({ ...prev, analyst: e.target.value }))}
                placeholder="Jane Doe, P.E."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phase">Assessment Phase</Label>
                             <select
                 id="phase"
                 aria-label="Assessment Phase"
                 value={projectInfo.phase}
                 onChange={(e) => setProjectInfo(prev => ({ ...prev, phase: e.target.value as any }))}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
               >
                <option value="Phase I">Phase I ESA</option>
                <option value="Phase II">Phase II ESA</option>
                <option value="Phase III">Phase III ESA</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={projectInfo.client}
                onChange={(e) => setProjectInfo(prev => ({ ...prev, client: e.target.value }))}
                placeholder="Client Name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="images">Images & Analysis</TabsTrigger>
          <TabsTrigger value="report">Report Builder</TabsTrigger>
          <TabsTrigger value="preview">KML Preview</TabsTrigger>
          <TabsTrigger value="settings">AI Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-6">
          {/* Image Upload Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Image Upload & AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors"
              >
                <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop images here or click to upload</p>
                <p className="text-gray-500 mb-4">Supports JPG, PNG, and other image formats</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {isProcessing && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm">{processingStep}</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image Grid */}
          {images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Analyzed Images ({images.length})</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const selected = images.filter(img => selectedImages.has(img.id))
                        generateReportSection(selected)
                      }}
                      disabled={selectedImages.size === 0}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Section
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateKMLPreview}
                    >
                      <Map className="h-4 w-4 mr-2" />
                      Export KML
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={image.file.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge className={getRiskBadgeColor(image.riskLevel)}>
                            {image.riskLevel}
                          </Badge>
                          {getStatusIcon(image.status)}
                        </div>
                                                 <div className="absolute top-2 left-2">
                           <input
                             type="checkbox"
                             aria-label={`Select image ${image.file.name}`}
                             checked={selectedImages.has(image.id)}
                             onChange={(e) => {
                               const newSelected = new Set(selectedImages)
                               if (e.target.checked) {
                                 newSelected.add(image.id)
                               } else {
                                 newSelected.delete(image.id)
                               }
                               setSelectedImages(newSelected)
                             }}
                             className="w-4 h-4"
                           />
                         </div>
                      </div>
                      <CardContent className="p-3">
                        <p className="font-medium text-sm truncate mb-2">{image.file.name}</p>
                        {image.analysis && (
                          <div className="space-y-1 text-xs">
                            <p><strong>Scene:</strong> {image.analysis.sceneType}</p>
                            <p><strong>Confidence:</strong> {(image.analysis.confidence * 100).toFixed(0)}%</p>
                            {image.analysis.hazards.length > 0 && (
                              <p><strong>Hazards:</strong> {image.analysis.hazards.join(', ')}</p>
                            )}
                            {image.phaseIIRecommended && (
                              <Badge variant="destructive" className="text-xs">
                                Phase II Recommended
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Report Sections</span>
                <Button onClick={exportReport} disabled={reportSections.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportSections.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No report sections generated yet</p>
                  <p className="text-sm text-gray-400">Select images and generate sections to build your report</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportSections.map((section) => (
                    <Card key={section.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{section.title}</span>
                          <div className="flex items-center gap-2">
                            {section.aiGenerated && (
                              <Badge variant="outline">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Generated
                              </Badge>
                            )}
                            <Badge variant="secondary">
                              {section.images.length} images
                            </Badge>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={section.content}
                          onChange={(e) => {
                            setReportSections(prev => prev.map(s =>
                              s.id === section.id
                                ? { ...s, content: e.target.value, lastModified: new Date().toISOString() }
                                : s
                            ))
                          }}
                          className="min-h-32"
                          placeholder="Section content..."
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Last modified: {new Date(section.lastModified).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                KML Map Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Interactive map preview will appear here</p>
                <p className="text-sm text-gray-500 mb-4">
                  GPS-tagged images will be displayed as placemarks with AI analysis data
                </p>
                <Button onClick={generateKMLPreview} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download KML File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Analysis Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                             <div className="space-y-2">
                 <Label id="threshold-label" htmlFor="threshold">Detection Threshold: {analysisOptions.threshold}</Label>
                                 <input
                   id="threshold"
                   aria-labelledby="threshold-label"
                   type="range"
                   min="0.1"
                   max="1"
                   step="0.05"
                   value={analysisOptions.threshold}
                   onChange={(e) => setAnalysisOptions(prev => ({
                     ...prev,
                     threshold: parseFloat(e.target.value)
                   }))}
                   className="w-full"
                 />
               </div>

               <div className="flex items-center space-x-2">
                 <input
                   id="risk-assessment"
                   type="checkbox"
                   checked={analysisOptions.enableRiskAssessment}
                   onChange={(e) => setAnalysisOptions(prev => ({
                     ...prev,
                     enableRiskAssessment: e.target.checked
                   }))}
                 />
                 <Label htmlFor="risk-assessment">Enable Risk Assessment</Label>
               </div>

               <div className="flex items-center space-x-2">
                 <input
                   id="recommendations"
                   type="checkbox"
                   checked={analysisOptions.generateRecommendations}
                   onChange={(e) => setAnalysisOptions(prev => ({
                     ...prev,
                     generateRecommendations: e.target.checked
                   }))}
                 />
                 <Label htmlFor="recommendations">Generate Recommendations</Label>
               </div>

               <div className="flex items-center space-x-2">
                 <input
                   id="evidence-chain"
                   type="checkbox"
                   checked={analysisOptions.evidenceChain}
                   onChange={(e) => setAnalysisOptions(prev => ({
                     ...prev,
                     evidenceChain: e.target.checked
                   }))}
                 />
                 <Label htmlFor="evidence-chain">Generate Evidence Chain (Layer 8)</Label>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}