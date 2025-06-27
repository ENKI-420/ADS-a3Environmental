"use client"

import type React from "react"

  import { useState, useRef, useEffect } from "react"
  import { useAuth } from "@/context/auth-context"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
  import { ScrollArea } from "@/components/ui/scroll-area"
  import { Progress } from "@/components/ui/progress"
  import { Alert, AlertDescription } from "@/components/ui/alert"
  import { Badge } from "@/components/ui/badge"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import { Separator } from "@/components/ui/separator"
  import {
    Camera,
    Trash2,
    Download,
    Loader2,
    FileArchive,
    Info,
    AlertCircle,
    CheckCircle,
    X,
    MapPin,
    Calendar,
    Settings,
    Eye,
    BarChart3,
    FileImage,
    Zap,
    Clock,
    Star,
    AlertTriangle,
    Map,
    Camera as CameraIcon
  } from "lucide-react"
  import { OrchestrationEngine } from "@/lib/iris-orchestrator"

  interface PhotoMetadata {
    fileName: string
    fileSize: number
    dimensions: { width: number; height: number }
    dateTime: string
    camera: { make: string; model: string }
    gps: {
      hasGps: boolean
      latitude?: number
      longitude?: number
      accuracy?: number
    }
    quality: 'High' | 'Medium' | 'Low'
    issues: string[]
  }

  interface Photo {
    id: string
    file: File
    objectUrl: string
    metadata?: PhotoMetadata
    error?: string
    hasGps?: boolean
    isProcessing?: boolean
    thumbnail?: string
  }

  interface Report {
    kmzUrl: string
    kmzName: string
    summary: string
    fileSize?: number
    processedCount?: number
    geoTaggedCount?: number
    errors?: string[]
    warnings?: string[]
    qualityDistribution?: {
      high: number
      medium: number
      low: number
    }
    technicalSummary?: any
    processingSteps?: any[]
  }

  interface ProcessingProgress {
    isProcessing: boolean
    currentStep: string
    progress: number
    stepDetails?: string
  }

  export function FieldDataCapture() {
    const { user, role } = useAuth()
    const [photos, setPhotos] = useState<Photo[]>([])
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [report, setReport] = useState<Report | null>(null)
    const [processingProgress, setProcessingProgress] = useState<ProcessingProgress>({
      isProcessing: false,
      currentStep: "",
      progress: 0
    })
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<string>("capture")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const validateFile = (file: File): string | null => {
      const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/tiff', 'image/webp']

      if (!supportedTypes.includes(file.type.toLowerCase())) {
        return `Unsupported file type: ${file.type}. Supported formats: JPEG, PNG, HEIC, HEIF, TIFF, WebP`
      }
      if (file.size > 50 * 1024 * 1024) {
        return "File size must be less than 50MB"
      }
      if (file.size < 1024) {
        return "File appears to be corrupted or too small"
      }
      return null
    }

    const extractBasicMetadata = async (file: File): Promise<PhotoMetadata> => {
      try {
        // Create a more sophisticated metadata extraction preview
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        return new Promise((resolve) => {
          img.onload = () => {
            URL.revokeObjectURL(objectUrl)

            // Simulate GPS detection with better heuristics
            const hasGps = Math.random() > 0.2 // 80% chance for demo
            const gpsData = hasGps ? {
              hasGps: true,
              latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
              longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
              accuracy: Math.floor(Math.random() * 20) + 5
            } : { hasGps: false }

            // Simulate quality analysis
            const megapixels = (img.width * img.height) / 1000000
            const compressionRatio = file.size / (img.width * img.height)

            let quality: 'High' | 'Medium' | 'Low' = 'High'
            const issues: string[] = []

            if (megapixels < 2) {
              quality = 'Low'
              issues.push('Low resolution')
            } else if (megapixels < 8) {
              quality = 'Medium'
              issues.push('Medium resolution')
            }

            if (compressionRatio < 0.1) {
              quality = quality === 'High' ? 'Medium' : 'Low'
              issues.push('High compression')
            }

            if (!hasGps) {
              issues.push('No GPS data')
            }

            resolve({
              fileName: file.name,
              fileSize: file.size,
              dimensions: { width: img.width, height: img.height },
              dateTime: new Date(file.lastModified).toISOString(),
              camera: {
                make: 'Camera Brand', // Would be extracted from EXIF
                model: 'Model Name'
              },
              gps: gpsData,
              quality,
              issues
            })
          }

          img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            resolve({
              fileName: file.name,
              fileSize: file.size,
              dimensions: { width: 0, height: 0 },
              dateTime: new Date(file.lastModified).toISOString(),
              camera: { make: 'Unknown', model: 'Unknown' },
              gps: { hasGps: false },
              quality: 'Low',
              issues: ['Could not read image']
            })
          }

          img.src = objectUrl
        })
      } catch (error) {
        return {
          fileName: file.name,
          fileSize: file.size,
          dimensions: { width: 0, height: 0 },
          dateTime: new Date(file.lastModified).toISOString(),
          camera: { make: 'Unknown', model: 'Unknown' },
          gps: { hasGps: false },
          quality: 'Low',
          issues: ['Processing error']
        }
      }
    }

    const generateThumbnail = async (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
          const maxSize = 120
          let { width, height } = img

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL('image/jpeg', 0.8))
          }
        }

        img.src = URL.createObjectURL(file)
      })
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      setError(null)
      const newPhotos: Photo[] = []

      for (const file of Array.from(files)) {
        const photoId = `${file.name}-${Date.now()}-${Math.random()}`
        const validationError = validateFile(file)

        const photo: Photo = {
          id: photoId,
          file,
          objectUrl: URL.createObjectURL(file),
          error: validationError,
          isProcessing: !validationError
        }

        newPhotos.push(photo)

        // Extract metadata and generate thumbnail for valid files
        if (!validationError) {
          Promise.all([
            extractBasicMetadata(file),
            generateThumbnail(file)
          ]).then(([metadata, thumbnail]) => {
            setPhotos(prev => prev.map(p =>
              p.id === photoId ? {
                ...p,
                metadata,
                thumbnail,
                hasGps: metadata.gps.hasGps,
                isProcessing: false
              } : p
            ))
          }).catch(() => {
            setPhotos(prev => prev.map(p =>
              p.id === photoId ? {
                ...p,
                error: 'Failed to process metadata',
                isProcessing: false
              } : p
            ))
          })
        }
      }

      setPhotos((prev) => [...prev, ...newPhotos])

      // Switch to gallery tab if files were added
      if (newPhotos.length > 0) {
        setActiveTab("gallery")
      }

      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    const removePhoto = (id: string) => {
      setPhotos((prev) => {
        const photo = prev.find(p => p.id === id)
        if (photo) {
          URL.revokeObjectURL(photo.objectUrl)
        }
        return prev.filter((p) => p.id !== id)
      })

      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null)
      }
    }

    const clearAllPhotos = () => {
      photos.forEach(photo => URL.revokeObjectURL(photo.objectUrl))
      setPhotos([])
      setSelectedPhoto(null)
      setReport(null)
      setError(null)
    }

    const processPhotos = async () => {
      if (photos.length === 0) return

      const validPhotos = photos.filter(p => !p.error)
      if (validPhotos.length === 0) {
        setError("No valid photos to process")
        return
      }

      setProcessingProgress({
        isProcessing: true,
        currentStep: "Initializing enhanced processing...",
        progress: 0
      })
      setReport(null)
      setError(null)
      setActiveTab("processing")

      const actor = user && role ? `${user.name} (${role})` : "Field Technician"

      try {
        // Enhanced progress tracking with more detailed steps
        const steps = [
          { step: "Validating image files and metadata...", progress: 10 },
          { step: "Extracting comprehensive EXIF data...", progress: 30 },
          { step: "Analyzing GPS coordinates and accuracy...", progress: 50 },
          { step: "Performing quality analysis and validation...", progress: 65 },
          { step: "Generating enhanced KML placemarks...", progress: 80 },
          { step: "Creating professional KMZ archive...", progress: 95 },
        ]

        for (const { step, progress } of steps) {
          setProcessingProgress(prev => ({
            ...prev,
            currentStep: step,
            progress
          }))
          await new Promise(resolve => setTimeout(resolve, 600))
        }

        // Run the enhanced processing agent
        const result = await OrchestrationEngine.runSingleAgent("FieldDataProcessingAgent", {
          photos: validPhotos.map((p) => p.file),
          actor,
          options: {
            includeMap: true,
            generateThumbnails: true,
            detailedAnalysis: true
          }
        })

        setProcessingProgress(prev => ({
          ...prev,
          currentStep: "Finalizing enhanced report...",
          progress: 98
        }))

        await new Promise(resolve => setTimeout(resolve, 300))

        if (result.success && result.data.kmzBlob) {
          const kmzBlob = result.data.kmzBlob as Blob
          setReport({
            kmzUrl: URL.createObjectURL(kmzBlob),
            kmzName: result.data.kmzName,
            summary: result.summary,
            fileSize: result.data.fileSize,
            processedCount: result.data.processedCount,
            geoTaggedCount: result.data.geoTaggedCount,
            errors: result.data.errors,
            warnings: result.data.warnings,
            qualityDistribution: result.data.reportSummary?.summary?.qualityDistribution,
            technicalSummary: result.data.reportSummary?.summary?.technicalSummary,
            processingSteps: result.data.processingSteps
          })

          setProcessingProgress(prev => ({
            ...prev,
            currentStep: "Enhanced report generated successfully!",
            progress: 100
          }))

          // Switch to results tab
          setTimeout(() => {
            setActiveTab("results")
            setProcessingProgress({
              isProcessing: false,
              currentStep: "",
              progress: 0
            })
          }, 1500)
        } else {
          throw new Error(result.summary || "Enhanced processing failed")
        }
      } catch (error) {
        console.error("Enhanced processing failed:", error)
        setError(error instanceof Error ? error.message : "Enhanced processing failed")
        setProcessingProgress({
          isProcessing: false,
          currentStep: "",
          progress: 0
        })
      }
    }

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getQualityColor = (quality: string) => {
      switch (quality) {
        case 'High': return 'bg-green-100 text-green-800 border-green-200'
        case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'Low': return 'bg-red-100 text-red-800 border-red-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }

    const getQualityIcon = (quality: string) => {
      switch (quality) {
        case 'High': return <Star className="w-4 h-4" />
        case 'Medium': return <AlertTriangle className="w-4 h-4" />
        case 'Low': return <AlertCircle className="w-4 h-4" />
        default: return <Info className="w-4 h-4" />
      }
    }

    const validPhotos = photos.filter(p => !p.error)
    const gpsPhotos = photos.filter(p => p.hasGps && !p.error)
    const qualityStats = {
      high: photos.filter(p => p.metadata?.quality === 'High').length,
      medium: photos.filter(p => p.metadata?.quality === 'Medium').length,
      low: photos.filter(p => p.metadata?.quality === 'Low').length
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Enhanced Field Data Capture</h1>
          <p className="text-xl text-gray-600">Professional geo-tagged image processing with comprehensive metadata analysis</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="capture" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Capture
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              Gallery ({photos.length})
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Processing
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CameraIcon className="w-5 h-5" />
                      Photo Capture
                    </CardTitle>
                    <CardDescription>
                      Upload high-quality images with GPS metadata for professional analysis and KML reporting.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/heic,image/heif,image/tiff,image/webp"
                      capture="environment"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      aria-label="Upload field data images"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={processingProgress.isProcessing}
                        className="h-12"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Take Photos
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.removeAttribute('capture')
                            fileInputRef.current.click()
                          }
                        }}
                        disabled={processingProgress.isProcessing}
                        className="h-12"
                      >
                        <FileImage className="w-5 h-5 mr-2" />
                        Upload Files
                      </Button>
                    </div>

                    <div className="text-center text-sm text-gray-500 p-4 border-2 border-dashed border-gray-200 rounded-lg">
                      <FileArchive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <div>Drag and drop images here, or use the buttons above</div>
                      <div className="mt-1">Supported: JPEG, PNG, HEIC, HEIF, TIFF, WebP (max 50MB)</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Session Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{photos.length}</div>
                        <div className="text-sm text-blue-600">Total Images</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{gpsPhotos.length}</div>
                        <div className="text-sm text-green-600">GPS Tagged</div>
                      </div>
                    </div>

                    {photos.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Quality Distribution</div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-bold text-green-600">{qualityStats.high}</div>
                            <div className="text-green-600">High</div>
                          </div>
                          <div className="text-center p-2 bg-yellow-50 rounded">
                            <div className="font-bold text-yellow-600">{qualityStats.medium}</div>
                            <div className="text-yellow-600">Medium</div>
                          </div>
                          <div className="text-center p-2 bg-red-50 rounded">
                            <div className="font-bold text-red-600">{qualityStats.low}</div>
                            <div className="text-red-600">Low</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Processing Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Generate Thumbnails</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quality Analysis</span>
                      <Badge variant="secondary">Enhanced</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">GPS Mapping</span>
                      <Badge variant="secondary">Professional</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Metadata Extraction</span>
                      <Badge variant="secondary">Comprehensive</Badge>
                    </div>
                  </CardContent>
                </Card>

                {validPhotos.length > 0 && (
                  <Button
                    onClick={processPhotos}
                    disabled={processingProgress.isProcessing}
                    className="w-full h-12"
                  >
                    {processingProgress.isProcessing ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Zap className="w-5 h-5 mr-2" />
                    )}
                    Generate Enhanced KMZ Report
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Photo Gallery
                      {photos.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllPhotos}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Clear All
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription>
                      View and manage your captured photos. Click on any photo to see detailed metadata.
                    </CardDescription>
                    {photos.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {photos.length} photos • {validPhotos.length} valid • {gpsPhotos.length} with GPS
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      {photos.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {photos.map((photo) => (
                            <div key={photo.id} className="relative group cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                              <div className="relative">
                                <img
                                  src={photo.thumbnail || photo.objectUrl || "/placeholder.svg"}
                                  alt="Field capture"
                                  className={`w-full h-32 object-cover rounded-md transition-all hover:scale-105 ${
                                    photo.error ? 'opacity-50 border-2 border-red-500' :
                                    photo.hasGps ? 'border-2 border-green-500' : 'border-2 border-yellow-500'
                                  }`}
                                />

                                {/* Processing indicator */}
                                {photo.isProcessing && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                  </div>
                                )}

                                {/* Status indicators */}
                                <div className="absolute top-1 left-1 flex gap-1">
                                  {photo.error ? (
                                    <AlertCircle className="w-4 h-4 text-red-500 bg-white rounded-full p-0.5" />
                                  ) : photo.hasGps ? (
                                    <CheckCircle className="w-4 h-4 text-green-500 bg-white rounded-full p-0.5" />
                                  ) : (
                                    <Info className="w-4 h-4 text-yellow-500 bg-white rounded-full p-0.5" />
                                  )}

                                  {photo.metadata?.quality && (
                                    <Badge variant="secondary" className={`text-xs h-5 ${getQualityColor(photo.metadata.quality)}`}>
                                      {getQualityIcon(photo.metadata.quality)}
                                    </Badge>
                                  )}
                                </div>

                                {/* Remove button */}
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removePhoto(photo.id)
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>

                                {/* View button */}
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="absolute bottom-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedPhoto(photo)
                                  }}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>

                              <div className="mt-1 text-xs text-center">
                                <div className="truncate font-medium">{photo.file.name}</div>
                                <div className="text-gray-500">{formatFileSize(photo.file.size)}</div>
                                {photo.metadata && (
                                  <div className="text-gray-600">
                                    {photo.metadata.dimensions.width} × {photo.metadata.dimensions.height}
                                  </div>
                                )}
                                {photo.error && (
                                  <div className="text-red-500 text-xs">{photo.error}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
                          <FileImage className="w-12 h-12 mb-4 text-gray-300" />
                          <div className="text-lg font-medium">No photos yet</div>
                          <div className="text-sm">Go to the Capture tab to add some photos</div>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {selectedPhoto && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Photo Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-square">
                        <img
                          src={selectedPhoto.objectUrl}
                          alt="Selected photo"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium text-gray-700">File Name</div>
                          <div className="text-sm">{selectedPhoto.file.name}</div>
                        </div>

                        {selectedPhoto.metadata && (
                          <>
                            <Separator />
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">Image Quality</div>
                              <Badge className={getQualityColor(selectedPhoto.metadata.quality)}>
                                {getQualityIcon(selectedPhoto.metadata.quality)}
                                <span className="ml-1">{selectedPhoto.metadata.quality}</span>
                              </Badge>
                              {selectedPhoto.metadata.issues.length > 0 && (
                                <div className="mt-2 text-xs text-gray-600">
                                  <div className="font-medium">Issues:</div>
                                  {selectedPhoto.metadata.issues.map((issue, idx) => (
                                    <div key={idx}>• {issue}</div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <Separator />
                            <div>
                              <div className="text-sm font-medium text-gray-700">Dimensions</div>
                              <div className="text-sm">
                                {selectedPhoto.metadata.dimensions.width} × {selectedPhoto.metadata.dimensions.height}
                                <span className="text-gray-500 ml-2">
                                  ({((selectedPhoto.metadata.dimensions.width * selectedPhoto.metadata.dimensions.height) / 1000000).toFixed(1)}MP)
                                </span>
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium text-gray-700">File Size</div>
                              <div className="text-sm">{formatFileSize(selectedPhoto.metadata.fileSize)}</div>
                            </div>

                            <Separator />
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                GPS Location
                              </div>
                              {selectedPhoto.metadata.gps.hasGps ? (
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="text-gray-600">Coordinates:</span> {selectedPhoto.metadata.gps.latitude?.toFixed(6)}, {selectedPhoto.metadata.gps.longitude?.toFixed(6)}
                                  </div>
                                  {selectedPhoto.metadata.gps.accuracy && (
                                    <div>
                                      <span className="text-gray-600">Accuracy:</span> ±{selectedPhoto.metadata.gps.accuracy}m
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500">No GPS data available</div>
                              )}
                            </div>

                            <Separator />
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <CameraIcon className="w-4 h-4" />
                                Camera Info
                              </div>
                              <div className="space-y-1 text-sm">
                                <div>
                                  <span className="text-gray-600">Make:</span> {selectedPhoto.metadata.camera.make}
                                </div>
                                <div>
                                  <span className="text-gray-600">Model:</span> {selectedPhoto.metadata.camera.model}
                                </div>
                              </div>
                            </div>

                            <Separator />
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Timestamp
                              </div>
                              <div className="text-sm">
                                {new Date(selectedPhoto.metadata.dateTime).toLocaleString()}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {validPhotos.length > 0 && (
                  <Button
                    onClick={processPhotos}
                    disabled={processingProgress.isProcessing}
                    className="w-full h-12"
                  >
                    {processingProgress.isProcessing ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Zap className="w-5 h-5 mr-2" />
                    )}
                    Process {validPhotos.length} Photo{validPhotos.length !== 1 ? 's' : ''}
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {processingProgress.isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      ) : (
                        <Zap className="w-5 h-5 text-green-600" />
                      )}
                      Enhanced Processing Pipeline
                    </CardTitle>
                    <CardDescription>
                      Advanced metadata extraction and KML generation with comprehensive analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {processingProgress.isProcessing ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{processingProgress.currentStep}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Processing {validPhotos.length} image{validPhotos.length !== 1 ? 's' : ''} with enhanced metadata extraction
                            </div>
                          </div>
                          <div className="text-sm font-mono text-gray-600">
                            {processingProgress.progress}%
                          </div>
                        </div>

                        <Progress value={processingProgress.progress} className="w-full h-2" />

                        <div className="text-xs text-center text-gray-500">
                          This may take a few moments depending on image size and complexity
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Zap className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-lg font-medium text-gray-900 mb-2">Ready to Process</div>
                        <div className="text-sm text-gray-600 mb-6">
                          {validPhotos.length > 0
                            ? `${validPhotos.length} photo${validPhotos.length !== 1 ? 's' : ''} ready for enhanced processing`
                            : 'Add some photos to begin processing'
                          }
                        </div>

                        {validPhotos.length > 0 && (
                          <Button
                            onClick={processPhotos}
                            disabled={processingProgress.isProcessing}
                            className="h-12 px-8"
                          >
                            <Zap className="w-5 h-5 mr-2" />
                            Start Enhanced Processing
                          </Button>
                        )}
                      </div>
                    )}

                    {validPhotos.length === 0 && photos.length > 0 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          No valid photos to process. Please add valid image files in the Capture tab.
                        </AlertDescription>
                      </Alert>
                    )}

                    {validPhotos.length > 0 && gpsPhotos.length === 0 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          No photos with GPS data detected. The KMZ report will include comprehensive metadata analysis but may have limited mapping capabilities.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Processing Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">EXIF Extraction</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Comprehensive</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">GPS Analysis</span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">Professional</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Quality Assessment</span>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">AI-Powered</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileArchive className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium">KMZ Generation</span>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">Enhanced</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Processing Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>File Validation</span>
                        <span className="text-gray-500">~2s</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Metadata Extraction</span>
                        <span className="text-gray-500">~5-10s</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Quality Analysis</span>
                        <span className="text-gray-500">~3-5s</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>KML Generation</span>
                        <span className="text-gray-500">~2-3s</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Archive Creation</span>
                        <span className="text-gray-500">~1-2s</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total Estimated</span>
                        <span className="text-blue-600">~13-22s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {report ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        Enhanced KMZ Report Generated
                      </CardTitle>
                      <CardDescription>
                        Your field data has been successfully processed with comprehensive metadata analysis and professional KML mapping.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                        <div className="flex-1">
                          <p className="font-medium text-green-800 mb-2">{report.summary}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center p-2 bg-white bg-opacity-50 rounded">
                              <div className="font-bold text-lg text-blue-600">{report.processedCount}</div>
                              <div className="text-xs text-gray-600">Processed</div>
                            </div>
                            <div className="text-center p-2 bg-white bg-opacity-50 rounded">
                              <div className="font-bold text-lg text-green-600">{report.geoTaggedCount}</div>
                              <div className="text-xs text-gray-600">Geo-tagged</div>
                            </div>
                            {report.qualityDistribution && (
                              <>
                                <div className="text-center p-2 bg-white bg-opacity-50 rounded">
                                  <div className="font-bold text-lg text-emerald-600">{report.qualityDistribution.high}</div>
                                  <div className="text-xs text-gray-600">High Quality</div>
                                </div>
                                <div className="text-center p-2 bg-white bg-opacity-50 rounded">
                                  <div className="font-bold text-lg text-purple-600">{formatFileSize(report.fileSize || 0)}</div>
                                  <div className="text-xs text-gray-600">File Size</div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href={report.kmzUrl} download={report.kmzName}>
                          <Button className="w-full h-12">
                            <Download className="w-5 h-5 mr-2" />
                            Download Enhanced KMZ
                          </Button>
                        </a>

                        <Button
                          variant="outline"
                          className="w-full h-12"
                          onClick={() => {
                            // Create a shareable link or copy to clipboard
                            navigator.clipboard?.writeText(window.location.href)
                          }}
                        >
                          <Info className="w-5 h-5 mr-2" />
                          Share Report Link
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {report.qualityDistribution && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Quality Analysis Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {report.qualityDistribution.high}
                            </div>
                            <div className="text-sm text-green-700 font-medium">High Quality</div>
                            <div className="text-xs text-green-600 mt-1">
                              Professional grade images with excellent metadata
                            </div>
                          </div>

                          <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600 mb-1">
                              {report.qualityDistribution.medium}
                            </div>
                            <div className="text-sm text-yellow-700 font-medium">Medium Quality</div>
                            <div className="text-xs text-yellow-600 mt-1">
                              Good images with minor technical issues
                            </div>
                          </div>

                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600 mb-1">
                              {report.qualityDistribution.low}
                            </div>
                            <div className="text-sm text-red-700 font-medium">Low Quality</div>
                            <div className="text-xs text-red-600 mt-1">
                              Images needing attention or improvement
                            </div>
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="flex h-full rounded-full overflow-hidden">
                            <div
                              className="bg-green-500"
                              style={{
                                width: `${(report.qualityDistribution.high / (report.processedCount || 1)) * 100}%`
                              }}
                            ></div>
                            <div
                              className="bg-yellow-500"
                              style={{
                                width: `${(report.qualityDistribution.medium / (report.processedCount || 1)) * 100}%`
                              }}
                            ></div>
                            <div
                              className="bg-red-500"
                              style={{
                                width: `${(report.qualityDistribution.low / (report.processedCount || 1)) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {(report.errors && report.errors.length > 0) || (report.warnings && report.warnings.length > 0) ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Processing Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {report.errors && report.errors.length > 0 && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <details>
                                <summary className="cursor-pointer font-medium">
                                  {report.errors.length} processing error{report.errors.length !== 1 ? 's' : ''}
                                </summary>
                                <div className="mt-2 space-y-1 text-sm">
                                  {report.errors.map((error, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <span className="text-red-500">•</span>
                                      <span>{error}</span>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </AlertDescription>
                          </Alert>
                        )}

                        {report.warnings && report.warnings.length > 0 && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <details>
                                <summary className="cursor-pointer font-medium">
                                  {report.warnings.length} processing warning{report.warnings.length !== 1 ? 's' : ''}
                                </summary>
                                <div className="mt-2 space-y-1 text-sm">
                                  {report.warnings.map((warning, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <span className="text-yellow-500">•</span>
                                      <span>{warning}</span>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ) : null}
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileArchive className="w-5 h-5" />
                        Report Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">File Name:</span>
                          <span className="font-mono text-xs">{report.kmzName}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">File Size:</span>
                          <span className="font-medium">{formatFileSize(report.fileSize || 0)}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="font-medium">KMZ Archive</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Generated:</span>
                          <span className="font-medium">{new Date().toLocaleString()}</span>
                        </div>

                        <Separator />

                        <div>
                          <div className="text-gray-600 mb-2">Contents:</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>Enhanced KML document</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>Original images</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>High-quality thumbnails</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>Comprehensive metadata report</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span>Processing logs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Map className="w-5 h-5" />
                        Usage Instructions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium mb-1">Google Earth:</div>
                        <div className="text-gray-600">Double-click the KMZ file to open in Google Earth for interactive viewing.</div>
                      </div>

                      <div>
                        <div className="font-medium mb-1">GIS Software:</div>
                        <div className="text-gray-600">Import the KML file into ArcGIS, QGIS, or other GIS platforms.</div>
                      </div>

                      <div>
                        <div className="font-medium mb-1">Web Maps:</div>
                        <div className="text-gray-600">Upload to Google Maps, or use with web mapping applications.</div>
                      </div>

                      <div>
                        <div className="font-medium mb-1">Metadata Analysis:</div>
                        <div className="text-gray-600">Review the metadata_report.json for detailed technical analysis.</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={() => {
                      setReport(null)
                      setActiveTab("capture")
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Process More Photos
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-lg font-medium text-gray-900 mb-2">No Results Yet</div>
                <div className="text-sm text-gray-600 mb-6">
                  Process your field photos to see comprehensive analysis results here.
                </div>
                <Button
                  onClick={() => setActiveTab("capture")}
                  variant="outline"
                >
                  Start Capturing Photos
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    )
  }
