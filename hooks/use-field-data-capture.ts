"use client"

import { useState, useCallback, useRef } from "react"
import { browserAPI, fileUtils, type TechnicalSummary, type ProcessingStep } from "@/lib/utils"

export interface PhotoMetadata {
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

export interface Photo {
  id: string
  file: File
  objectUrl: string
  metadata?: PhotoMetadata
  error?: string
  hasGps?: boolean
  isProcessing?: boolean
  thumbnail?: string
}

export interface Report {
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
  technicalSummary?: TechnicalSummary
  processingSteps?: ProcessingStep[]
}

export interface ProcessingProgress {
  isProcessing: boolean
  currentStep: string
  progress: number
  stepDetails?: string
}

export interface FieldDataCaptureState {
  photos: Photo[]
  selectedPhoto: Photo | null
  report: Report | null
  processingProgress: ProcessingProgress
  error: string | null
  isDragActive: boolean
}

export interface FieldDataCaptureOptions {
  maxFiles?: number
  maxFileSize?: number
  autoProcess?: boolean
  enableDragDrop?: boolean
  enableRealTimeProcessing?: boolean
}

export function useFieldDataCapture(options: FieldDataCaptureOptions = {}) {
  const {
    maxFiles = 50,
    maxFileSize = 50 * 1024 * 1024, // 50MB
    autoProcess = false,
    enableDragDrop = true,
    enableRealTimeProcessing = true
  } = options

  const [state, setState] = useState<FieldDataCaptureState>({
    photos: [],
    selectedPhoto: null,
    report: null,
    processingProgress: {
      isProcessing: false,
      currentStep: "",
      progress: 0
    },
    error: null,
    isDragActive: false
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  // Enhanced file validation
  const validateFile = useCallback((file: File): string | undefined => {
    const validation = fileUtils.validateImageFile(file)
    if (!validation.isValid) {
      return validation.error
    }

    if (file.size > maxFileSize) {
      return `File size must be less than ${fileUtils.formatFileSize(maxFileSize)}`
    }

    return undefined
  }, [maxFileSize])

  // Enhanced metadata extraction with performance monitoring
  const extractEnhancedMetadata = useCallback(async (file: File): Promise<PhotoMetadata> => {
    try {
      const img = browserAPI.createImage()
      const objectUrl = browserAPI.createObjectURL(file)

      if (!img || !objectUrl) {
        throw new Error('Browser API not available')
      }

      return new Promise((resolve) => {
        img.onload = () => {
          browserAPI.revokeObjectURL(objectUrl)

          // Enhanced GPS simulation with more realistic patterns
          const hasGps = Math.random() > 0.15 // 85% chance for demo
          const gpsData = hasGps ? {
            hasGps: true,
            latitude: 37.7749 + (Math.random() - 0.5) * 0.2, // Wider range
            longitude: -122.4194 + (Math.random() - 0.5) * 0.2,
            accuracy: Math.floor(Math.random() * 25) + 3 // 3-28m accuracy
          } : { hasGps: false }

          // Enhanced quality analysis
          const megapixels = (img.width * img.height) / 1000000
          const compressionRatio = file.size / (img.width * img.height)
          const aspectRatio = img.width / img.height

          let quality: 'High' | 'Medium' | 'Low' = 'High'
          const issues: string[] = []

          // Resolution analysis
          if (megapixels < 1) {
            quality = 'Low'
            issues.push('Very low resolution')
          } else if (megapixels < 2) {
            quality = 'Low'
            issues.push('Low resolution')
          } else if (megapixels < 8) {
            quality = 'Medium'
            issues.push('Medium resolution')
          }

          // Compression analysis
          if (compressionRatio < 0.05) {
            quality = quality === 'High' ? 'Medium' : 'Low'
            issues.push('High compression')
          } else if (compressionRatio < 0.08) {
            issues.push('Moderate compression')
          }

          // Aspect ratio analysis
          if (aspectRatio < 0.5 || aspectRatio > 2) {
            issues.push('Unusual aspect ratio')
          }

          // File size analysis
          if (file.size < 50 * 1024) {
            quality = 'Low'
            issues.push('Very small file size')
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
              make: file.name.includes('IMG_') ? 'Apple' : file.name.includes('DSC') ? 'Sony' : 'Camera Brand',
              model: file.name.includes('IMG_') ? 'iPhone' : file.name.includes('DSC') ? 'Alpha Series' : 'Model Name'
            },
            gps: gpsData,
            quality,
            issues
          })
        }

        img.onerror = () => {
          browserAPI.revokeObjectURL(objectUrl)
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
    } catch {
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
  }, [])

  // Enhanced thumbnail generation with error handling
  const generateThumbnail = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = browserAPI.createElement('canvas')
      const img = browserAPI.createImage()

      if (!canvas || !img) {
        resolve('')
        return
      }

      const ctx = canvas.getContext('2d')
      const objectUrl = browserAPI.createObjectURL(file)

      img.onload = () => {
        const maxSize = 120
        let { width, height } = img

        // Calculate new dimensions
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
          // Add background for transparent images
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)

          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.85))
        } else {
          resolve('')
        }
        browserAPI.revokeObjectURL(objectUrl)
      }

      img.onerror = () => {
        browserAPI.revokeObjectURL(objectUrl)
        resolve('')
      }

      img.src = objectUrl
    })
  }, [])

  // Add photos with enhanced processing
  const addPhotos = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)

    if (state.photos.length + fileArray.length > maxFiles) {
      setState(prev => ({
        ...prev,
        error: `Cannot add more than ${maxFiles} files. Currently have ${prev.photos.length} files.`
      }))
      return
    }

    setState(prev => ({ ...prev, error: null }))
    const newPhotos: Photo[] = []

    for (const file of fileArray) {
      const photoId = `${file.name}-${Date.now()}-${Math.random()}`
      const validationError = validateFile(file)

      const photo: Photo = {
        id: photoId,
        file,
        objectUrl: browserAPI.createObjectURL(file),
        error: validationError,
        isProcessing: !validationError
      }

      newPhotos.push(photo)

      // Process valid files
      if (!validationError && enableRealTimeProcessing) {
        Promise.all([
          extractEnhancedMetadata(file),
          generateThumbnail(file)
        ]).then(([metadata, thumbnail]) => {
          setState(prev => ({
            ...prev,
            photos: prev.photos.map(p =>
              p.id === photoId ? {
                ...p,
                metadata,
                thumbnail,
                hasGps: metadata.gps.hasGps,
                isProcessing: false
              } : p
            )
          }))
        }).catch(() => {
          setState(prev => ({
            ...prev,
            photos: prev.photos.map(p =>
              p.id === photoId ? {
                ...p,
                error: 'Failed to process metadata',
                isProcessing: false
              } : p
            )
          }))
        })
      }
    }

    setState(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }))

    if (autoProcess && newPhotos.some(p => !p.error)) {
      // Auto-process logic would go here
    }
  }, [state.photos.length, maxFiles, validateFile, enableRealTimeProcessing, extractEnhancedMetadata, generateThumbnail, autoProcess])

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (enableDragDrop && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setState(prev => ({ ...prev, isDragActive: true }))
    }
  }, [enableDragDrop])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setState(prev => ({ ...prev, isDragActive: false }))
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState(prev => ({ ...prev, isDragActive: false }))
    dragCounter.current = 0

    if (enableDragDrop && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addPhotos(e.dataTransfer.files)
    }
  }, [enableDragDrop, addPhotos])

  // Remove photo
  const removePhoto = useCallback((id: string) => {
    setState(prev => {
      const photo = prev.photos.find(p => p.id === id)
      if (photo) {
        browserAPI.revokeObjectURL(photo.objectUrl)
      }

      return {
        ...prev,
        photos: prev.photos.filter(p => p.id !== id),
        selectedPhoto: prev.selectedPhoto?.id === id ? null : prev.selectedPhoto
      }
    })
  }, [])

  // Clear all photos
  const clearAllPhotos = useCallback(() => {
    state.photos.forEach(photo => browserAPI.revokeObjectURL(photo.objectUrl))
    setState(prev => ({
      ...prev,
      photos: [],
      selectedPhoto: null,
      report: null,
      error: null
    }))
  }, [state.photos])

  // Select photo
  const selectPhoto = useCallback((photo: Photo | null) => {
    setState(prev => ({ ...prev, selectedPhoto: photo }))
  }, [])

  // Set error
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  // Open file dialog
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      addPhotos(files)
    }
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [addPhotos])

  // Statistics
  const statistics = {
    totalPhotos: state.photos.length,
    validPhotos: state.photos.filter(p => !p.error).length,
    gpsPhotos: state.photos.filter(p => p.hasGps && !p.error).length,
    processingPhotos: state.photos.filter(p => p.isProcessing).length,
    qualityDistribution: {
      high: state.photos.filter(p => p.metadata?.quality === 'High').length,
      medium: state.photos.filter(p => p.metadata?.quality === 'Medium').length,
      low: state.photos.filter(p => p.metadata?.quality === 'Low').length
    },
    totalSize: state.photos.reduce((sum, p) => sum + p.file.size, 0)
  }

  return {
    // State
    ...state,
    statistics,

    // Refs
    fileInputRef,

    // Actions
    addPhotos,
    removePhoto,
    clearAllPhotos,
    selectPhoto,
    setError,
    openFileDialog,
    handleFileInputChange,

    // Drag and drop
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,

    // Utilities
    validateFile,
    extractEnhancedMetadata,
    generateThumbnail
  }
}