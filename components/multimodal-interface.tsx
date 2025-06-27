"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Camera,
  Mic,
  Video,
  Image,
  FileText,
  MapPin,
  HeartHandshake,
  Bot,
  Sparkles,
  Zap,
  Eye,
  Brain,
  Activity,
  Upload,
  Play,
  Square,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Monitor,
  Cpu,
  Database
} from 'lucide-react'

interface MultiModalInput {
  text?: string
  audio?: Blob
  image?: File
  video?: File
  documents?: File[]
  location?: GeolocationPosition
  biometric?: {
    heartRate?: number
    temperature?: number
    airQuality?: number
  }
}

interface ProcessingState {
  isProcessing: boolean
  currentStep: string
  progress: number
  results: any[]
  modalities: string[]
}

export default function MultiModalInterface() {
  const [input, setInput] = useState<MultiModalInput>({
    text: '',
    documents: []
  })

  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    currentStep: '',
    progress: 0,
    results: [],
    modalities: []
  })

  const [capabilities, setCapabilities] = useState({
    voiceRecognition: true,
    computerVision: true,
    documentAnalysis: true,
    spatialAwareness: true,
    biometricIntegration: false,
    realTimeProcessing: true
  })

  const [isRecording, setIsRecording] = useState(false)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Voice recording functionality
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        setInput(prev => ({ ...prev, audio: audioBlob }))
      }

      mediaRecorderRef.current = mediaRecorder
      setMediaStream(stream)
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting voice recording:', error)
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaStream) {
      mediaRecorderRef.current.stop()
      mediaStream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      setMediaStream(null)
    }
  }

  // Screen capture functionality
  const captureScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      })

      const video = document.createElement('video')
      video.srcObject = stream
      video.play()

      video.onloadedmetadata = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(video, 0, 0)

        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'screen-capture.png', { type: 'image/png' })
            setInput(prev => ({ ...prev, image: file }))
          }
        })

        stream.getTracks().forEach(track => track.stop())
      }
    } catch (error) {
      console.error('Error capturing screen:', error)
    }
  }

  // Location tracking
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setInput(prev => ({ ...prev, location: position }))
        },
        (error) => console.error('Error getting location:', error)
      )
    }
  }

  // Simulate biometric data collection
  const collectBiometricData = () => {
    const biometricData = {
      heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
      temperature: Math.random() * 4 + 96, // 96-100°F
      airQuality: Math.floor(Math.random() * 100) + 1 // 1-100 AQI
    }
    setInput(prev => ({ ...prev, biometric: biometricData }))
  }

  // File upload handlers
  const handleFileUpload = (type: keyof MultiModalInput, files: FileList | null) => {
    if (!files) return

    if (type === 'documents') {
      setInput(prev => ({ ...prev, documents: Array.from(files) }))
    } else {
      setInput(prev => ({ ...prev, [type]: files[0] }))
    }
  }

  // Multi-modal processing simulation
  const processMultiModalInput = async () => {
    setProcessing({
      isProcessing: true,
      currentStep: 'Initializing multi-modal processing...',
      progress: 0,
      results: [],
      modalities: []
    })

    const steps = [
      { step: 'Analyzing text input...', modality: 'text', duration: 800 },
      { step: 'Processing audio stream...', modality: 'audio', duration: 1200 },
      { step: 'Computer vision analysis...', modality: 'vision', duration: 1500 },
      { step: 'Document intelligence extraction...', modality: 'documents', duration: 1000 },
      { step: 'Spatial context integration...', modality: 'location', duration: 600 },
      { step: 'Biometric data correlation...', modality: 'biometric', duration: 400 },
      { step: 'Cross-modal fusion and reasoning...', modality: 'fusion', duration: 2000 },
      { step: 'Generating intelligent insights...', modality: 'insights', duration: 800 }
    ]

    for (let i = 0; i < steps.length; i++) {
      const { step, modality, duration } = steps[i]

      setProcessing(prev => ({
        ...prev,
        currentStep: step,
        progress: (i / steps.length) * 100,
        modalities: [...prev.modalities, modality]
      }))

      await new Promise(resolve => setTimeout(resolve, duration))

      // Simulate results for each modality
      const result = generateModalityResult(modality)
      setProcessing(prev => ({
        ...prev,
        results: [...prev.results, result]
      }))
    }

    setProcessing(prev => ({
      ...prev,
      isProcessing: false,
      currentStep: 'Multi-modal processing complete!',
      progress: 100
    }))
  }

  const generateModalityResult = (modality: string) => {
    const results = {
      text: {
        type: 'Natural Language Understanding',
        insights: ['Environmental compliance query detected', 'Risk assessment context identified'],
        confidence: 0.94
      },
      audio: {
        type: 'Speech Recognition & Analysis',
        insights: ['Voice pattern: Professional consultation tone', 'Key terms: Environmental, Compliance, Assessment'],
        confidence: 0.87
      },
      vision: {
        type: 'Computer Vision Analysis',
        insights: ['Site imagery detected', 'Potential contamination markers identified', 'Safety equipment visible'],
        confidence: 0.91
      },
      documents: {
        type: 'Document Intelligence',
        insights: ['EPA compliance forms recognized', 'Missing signatures detected', 'Regulatory requirements mapped'],
        confidence: 0.96
      },
      location: {
        type: 'Spatial Context Analysis',
        insights: ['Industrial zone detected', 'Proximity to water sources noted', 'Environmental sensitivity high'],
        confidence: 0.89
      },
      biometric: {
        type: 'Biometric Data Correlation',
        insights: ['Stress levels normal', 'Environmental exposure within limits', 'Health monitoring active'],
        confidence: 0.78
      },
      fusion: {
        type: 'Cross-Modal Intelligence Fusion',
        insights: [
          'Comprehensive environmental assessment context established',
          'Multi-source data correlation successful',
          'Intelligent recommendations generated'
        ],
        confidence: 0.95
      },
      insights: {
        type: 'AI-Generated Insights',
        insights: [
          'Site requires immediate attention for compliance',
          'Recommend soil sampling in sectors 3-7',
          'Air quality monitoring system needed'
        ],
        confidence: 0.92
      }
    }

    return results[modality as keyof typeof results] || { type: 'Unknown', insights: [], confidence: 0 }
  }

  // Reset all inputs
  const resetInputs = () => {
    setInput({
      text: '',
      documents: []
    })
    setProcessing({
      isProcessing: false,
      currentStep: '',
      progress: 0,
      results: [],
      modalities: []
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Eye className="h-12 w-12 text-purple-600" />
              <Sparkles className="h-6 w-6 text-pink-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Multi-Modal AI Processing
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Revolutionary multi-sensory AI that processes text, audio, images, video, documents,
            location, and biometric data simultaneously for unprecedented environmental intelligence
          </p>
        </div>

        <Tabs defaultValue="input" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Multi-Modal Input</TabsTrigger>
            <TabsTrigger value="processing">AI Processing</TabsTrigger>
            <TabsTrigger value="results">Intelligent Results</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Text and Audio Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Natural Language & Audio</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="text-input">Text Input</Label>
                    <Textarea
                      id="text-input"
                      placeholder="Describe your environmental consulting needs..."
                      value={input.text}
                      onChange={(e) => setInput(prev => ({ ...prev, text: e.target.value }))}
                      className="min-h-24"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      variant={isRecording ? "destructive" : "default"}
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      className="flex items-center space-x-2"
                    >
                      {isRecording ? (
                        <>
                          <Square className="h-4 w-4" />
                          <span>Stop Recording</span>
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          <span>Start Voice Input</span>
                        </>
                      )}
                    </Button>

                                         {input.audio && (
                       <Badge variant="secondary" className="flex items-center space-x-1">
                         <Radio className="h-3 w-3" />
                         <span>Audio Captured</span>
                       </Badge>
                     )}
                  </div>
                </CardContent>
              </Card>

              {/* Visual Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5" />
                    <span>Visual Intelligence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="image-input">Image Upload</Label>
                      <Input
                        id="image-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('image', e.target.files)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="video-input">Video Upload</Label>
                      <Input
                        id="video-input"
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload('video', e.target.files)}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={captureScreen}
                    variant="outline"
                    className="w-full flex items-center space-x-2"
                  >
                    <Monitor className="h-4 w-4" />
                    <span>Capture Screen</span>
                  </Button>

                  <canvas ref={canvasRef} className="hidden" />

                  {(input.image || input.video) && (
                    <div className="flex items-center space-x-2">
                      {input.image && (
                        <Badge variant="secondary">
                          <Image className="h-3 w-3 mr-1" />
                          Image Ready
                        </Badge>
                      )}
                      {input.video && (
                        <Badge variant="secondary">
                          <Video className="h-3 w-3 mr-1" />
                          Video Ready
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Document Intelligence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Document Intelligence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="documents-input">Document Upload</Label>
                    <Input
                      id="documents-input"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.ppt,.pptx"
                      onChange={(e) => handleFileUpload('documents', e.target.files)}
                    />
                  </div>

                  {input.documents && input.documents.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Uploaded Documents:</p>
                      {input.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="mr-2">
                          {doc.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Context & Sensors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Contextual Intelligence</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={getCurrentLocation}
                    variant="outline"
                    className="w-full flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Get Location Context</span>
                  </Button>

                  <Button
                    onClick={collectBiometricData}
                    variant="outline"
                    className="w-full flex items-center space-x-2"
                    disabled={!capabilities.biometricIntegration}
                  >
                    <HeartHandshake className="h-4 w-4" />
                    <span>Collect Biometric Data</span>
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    {input.location && (
                      <Badge variant="secondary">
                        <MapPin className="h-3 w-3 mr-1" />
                        Location Set
                      </Badge>
                    )}
                    {input.biometric && (
                      <Badge variant="secondary">
                        <HeartHandshake className="h-3 w-3 mr-1" />
                        Biometrics Active
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Process Button */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={processMultiModalInput}
                    disabled={processing.isProcessing}
                    size="lg"
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {processing.isProcessing ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        <span>Process Multi-Modal Input</span>
                      </>
                    )}
                  </Button>

                  <Button onClick={resetInputs} variant="outline">
                    Reset All Inputs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5" />
                  <span>Real-Time AI Processing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Processing Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(processing.progress)}%
                    </span>
                  </div>
                  <Progress value={processing.progress} className="w-full" />

                  {processing.currentStep && (
                    <p className="text-sm text-muted-foreground">
                      {processing.currentStep}
                    </p>
                  )}
                </div>

                {processing.modalities.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Active Modalities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {processing.modalities.map((modality, index) => (
                        <Badge key={index} variant="default" className="flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{modality}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {processing.results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {processing.results.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm">{result.type}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          Confidence: {(result.confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.insights.map((insight: string, i: number) => (
                          <li key={i} className="text-sm flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No results yet. Process multi-modal input to see AI-generated insights.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}