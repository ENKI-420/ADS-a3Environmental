import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Browser-safe utilities to prevent SSR issues
export const isBrowser = typeof window !== "undefined"
export const isServerSide = !isBrowser

// Safe browser API wrappers
export const browserAPI = {
  // Safe Image constructor
  createImage: (): HTMLImageElement | null => {
    return isBrowser ? new Image() : null
  },

  // Safe document access
  createElement: <T extends keyof HTMLElementTagNameMap>(
    tagName: T
  ): HTMLElementTagNameMap[T] | null => {
    return isBrowser ? document.createElement(tagName) : null
  },

  // Safe URL object access
  createObjectURL: (object: Blob | MediaSource): string => {
    return isBrowser ? URL.createObjectURL(object) : ""
  },

  revokeObjectURL: (url: string): void => {
    if (isBrowser) {
      URL.revokeObjectURL(url)
    }
  },

  // Safe navigator access
  writeToClipboard: async (text: string): Promise<boolean> => {
    if (isBrowser && navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        return true
      } catch {
        return false
      }
    }
    return false
  },

  // Safe console access
  log: (...args: any[]): void => {
    if (isBrowser && console?.log) {
      console.log(...args)
    }
  },

  error: (...args: any[]): void => {
    if (isBrowser && console?.error) {
      console.error(...args)
    }
  },

  // Safe setTimeout
  setTimeout: (callback: () => void, delay: number): number | null => {
    if (isBrowser && setTimeout) {
      return setTimeout(callback, delay)
    }
    return null
  },

  // Safe clearTimeout
  clearTimeout: (id: number | null): void => {
    if (isBrowser && id !== null && clearTimeout) {
      clearTimeout(id)
    }
  },

  // Safe window location access
  getCurrentUrl: (): string => {
    return isBrowser ? window.location.href : ""
  },

  // Safe media devices access
  getUserMedia: async (constraints: MediaStreamConstraints): Promise<MediaStream | null> => {
    if (isBrowser && navigator?.mediaDevices?.getUserMedia) {
      try {
        return await navigator.mediaDevices.getUserMedia(constraints)
      } catch {
        return null
      }
    }
    return null
  }
}

// Enhanced file utilities
export const fileUtils = {
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  },

  validateImageFile: (file: File): { isValid: boolean; error?: string } => {
    const supportedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/heic',
      'image/heif', 'image/tiff', 'image/webp', 'image/bmp'
    ]

    if (!supportedTypes.includes(file.type.toLowerCase())) {
      return {
        isValid: false,
        error: `Unsupported file type: ${file.type}. Supported formats: JPEG, PNG, HEIC, HEIF, TIFF, WebP, BMP`
      }
    }

    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than ${fileUtils.formatFileSize(maxSize)}`
      }
    }

    if (file.size < 1024) {
      return {
        isValid: false,
        error: "File appears to be corrupted or too small"
      }
    }

    return { isValid: true }
  },

  getImageDimensions: async (file: File): Promise<{ width: number; height: number } | null> => {
    if (!isBrowser) return null

    return new Promise<{ width: number; height: number } | null>((resolve) => {
      const img = browserAPI.createImage()
      if (!img) {
        resolve(null)
        return
      }

      img.onload = () => {
        resolve({ width: img.width, height: img.height })
        browserAPI.revokeObjectURL(img.src)
      }

      img.onerror = () => {
        resolve(null)
        browserAPI.revokeObjectURL(img.src)
      }

      img.src = browserAPI.createObjectURL(file)
    })
  }
}

// Enhanced metadata interfaces
export interface TechnicalSummary {
  totalImages: number
  totalSize: number
  averageResolution: { width: number; height: number }
  formatDistribution: Record<string, number>
  qualityMetrics: {
    highQuality: number
    mediumQuality: number
    lowQuality: number
  }
  gpsMetrics: {
    withGPS: number
    withoutGPS: number
    averageAccuracy: number
  }
}

export interface ProcessingStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startTime?: Date
  endTime?: Date
  details?: any
}

// Performance monitoring utilities
export const performanceUtils = {
  measureAsync: async <T>(
    label: string,
    asyncFn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> => {
    const start = performance.now()
    try {
      const result = await asyncFn()
      const duration = performance.now() - start
      browserAPI.log(`${label} completed in ${duration.toFixed(2)}ms`)
      return { result, duration }
    } catch (error) {
      const duration = performance.now() - start
      browserAPI.error(`${label} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }
}
