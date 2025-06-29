import type { Agent, AgentResult } from "./iris-agents"

// Dynamic imports for better error handling
const loadExifReader = async () => {
  try {
    const ExifReader = await import("exifreader")
    return ExifReader.default || ExifReader
  } catch (error) {
    console.error("Failed to load ExifReader:", error)
    throw new Error("EXIF reading functionality not available")
  }
}

const loadJSZip = async () => {
  try {
    const JSZip = await import("jszip")
    return JSZip.default || JSZip
  } catch (error) {
    console.error("Failed to load JSZip:", error)
    throw new Error("ZIP compression functionality not available")
  }
}

interface ExtractedMetadata {
  basic: {
    fileName: string
    fileSize: number
    fileSizeFormatted: string
    mimeType: string
    lastModified: string
  }
  camera: {
    make: string
    model: string
    software: string
    dateTimeOriginal: string
    dateTime: string
    orientation: string
  }
  technical: {
    imageWidth: number
    imageHeight: number
    colorSpace: string
    pixelDensity: string
    bitDepth: string
    compression: string
  }
  photography: {
    fNumber: string
    exposureTime: string
    iso: string
    flash: string
    focalLength: string
    whiteBalance: string
    meteringMode: string
    exposureMode: string
  }
  gps: {
    hasGps: boolean
    latitude: string
    longitude: string
    altitude: string
    timestamp: string
    direction: string
    speed: string
    accuracy: string
  }
  analysis: {
    quality: 'High' | 'Medium' | 'Low'
    technicalIssues: string[]
    recommendations: string[]
    processingNotes: string[]
  }
}

interface ProcessingStep {
  name: string
  description: string
  progress: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  details?: string
  timestamp?: string
}

/**
 * Enhanced agent for comprehensive field data processing with advanced metadata extraction,
 * sophisticated KML generation, and detailed reporting capabilities.
 */
export class FieldDataProcessingAgent implements Agent {
  name = "FieldDataProcessingAgent"
  purpose = "Advanced field image processing with comprehensive metadata extraction, GPS analysis, and professional KMZ report generation."

  async execute(params: {
    photos: File[]
    actor: string
    options?: {
      includeMap?: boolean
      generateThumbnails?: boolean
      detailedAnalysis?: boolean
      customTemplate?: string
    }
  }): Promise<AgentResult> {
    if (!params.photos || params.photos.length === 0) {
      return {
        success: false,
        summary: "Processing failed: No photos provided.",
        data: { error: "No photos provided" }
      }
    }

    const options = {
      includeMap: true,
      generateThumbnails: true,
      detailedAnalysis: true,
      ...params.options
    }

    try {
      // Load required libraries
      const [ExifReader, JSZip] = await Promise.all([
        loadExifReader(),
        loadJSZip()
      ])

      const zip = new JSZip()
      const imagesFolder = zip.folder("images")
      const thumbnailsFolder = zip.folder("thumbnails")
      const dataFolder = zip.folder("data")

      let kmlPlacemarks = ""
      let geoTaggedCount = 0
      let processedCount = 0
      const errors: string[] = []
      const warnings: string[] = []
      const processedMetadata: ExtractedMetadata[] = []
      const processingSteps: ProcessingStep[] = []

      // Initialize processing steps
      this.initializeProcessingSteps(processingSteps, params.photos.length)

      // Step 1: Validate files
      this.updateStep(processingSteps, 'validation', 'processing', 'Validating image files...')
      const validFiles = this.validateFiles(params.photos, errors, warnings)
      this.updateStep(processingSteps, 'validation', 'completed', `Validated ${validFiles.length} of ${params.photos.length} files`)

      if (validFiles.length === 0) {
        return {
          success: false,
          summary: "Processing failed: No valid image files provided.",
          data: { errors, warnings, processingSteps }
        }
      }

      // Step 2: Extract comprehensive metadata
      this.updateStep(processingSteps, 'metadata', 'processing', 'Extracting comprehensive metadata...')

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        try {
          // Add original image to zip
          if (imagesFolder) {
            imagesFolder.file(file.name, file)
          }

          // Extract comprehensive metadata
          const arrayBuffer = await this.fileToArrayBuffer(file)
          const tags = ExifReader.load(arrayBuffer, { expanded: true })
          const metadata = await this.extractComprehensiveMetadata(tags, file)

          processedMetadata.push(metadata)
          processedCount++

          // Generate thumbnail if requested
          if (options.generateThumbnails && thumbnailsFolder) {
            const thumbnail = await this.generateThumbnail(file)
            thumbnailsFolder.file(`thumb_${file.name}`, thumbnail)
          }

          // Create KML placemark if GPS data is available
          if (metadata.gps.hasGps) {
            geoTaggedCount++
            kmlPlacemarks += this.createAdvancedKmlPlacemark(metadata, options.detailedAnalysis)
          } else {
            warnings.push(`${file.name}: No GPS location data found`)
          }

          // Update progress
          const progress = ((i + 1) / validFiles.length) * 100
          this.updateStep(processingSteps, 'metadata', 'processing',
            `Processing ${file.name}... (${i + 1}/${validFiles.length})`, progress.toString())

        } catch (error) {
          const errorMsg = `Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
          console.error(errorMsg, error)
          errors.push(errorMsg)
        }
      }

      this.updateStep(processingSteps, 'metadata', 'completed',
        `Extracted metadata from ${processedCount} files`)

      // Step 3: Generate enhanced KML document
      this.updateStep(processingSteps, 'kml', 'processing', 'Generating enhanced KML document...')

      const kmlContent = this.generateAdvancedKmlDocument(
        kmlPlacemarks,
        params.actor,
        processedMetadata,
        options
      )
      zip.file("doc.kml", kmlContent)

      // Generate metadata report
      const metadataReport = this.generateMetadataReport(processedMetadata, params.actor)
      if (dataFolder) {
        dataFolder.file("metadata_report.json", JSON.stringify(metadataReport, null, 2))
        dataFolder.file("processing_log.json", JSON.stringify(processingSteps, null, 2))
      }

      this.updateStep(processingSteps, 'kml', 'completed', 'KML document generated successfully')

      // Step 4: Create KMZ archive
      this.updateStep(processingSteps, 'archive', 'processing', 'Creating KMZ archive...')

      const kmzBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      })

      this.updateStep(processingSteps, 'archive', 'completed',
        `KMZ archive created (${this.formatFileSize(kmzBlob.size)})`)

      // Generate enhanced KMZ with IRIS MCP SDK branding
      const kmzName = `IRIS_MCP_SDK_Field_Demo_${new Date().toISOString().split('T')[0]}_${Date.now()}.kmz`

      const summary = geoTaggedCount > 0
        ? `Successfully processed ${processedCount} photos with ${geoTaggedCount} geo-tagged images. Enhanced KMZ report generated with comprehensive metadata analysis.`
        : `Processed ${processedCount} photos but no GPS location data found. Report includes complete metadata analysis.`

      return {
        success: true,
        summary,
        data: {
          kmzBlob,
          kmzName,
          photoCount: params.photos.length,
          processedCount,
          geoTaggedCount,
          validFileCount: validFiles.length,
          errors: errors.length > 0 ? errors : undefined,
          warnings: warnings.length > 0 ? warnings : undefined,
          fileSize: kmzBlob.size,
          mimeType: "application/vnd.google-earth.kmz",
          processingSteps,
          metadata: processedMetadata,
          reportSummary: metadataReport.summary,
          features: {
            thumbnailsGenerated: options.generateThumbnails,
            detailedAnalysis: options.detailedAnalysis,
            mapIncluded: options.includeMap && geoTaggedCount > 0
          }
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown processing error'
      console.error("Enhanced field data processing failed:", error)

      // Update processing steps to show error
      processingSteps.forEach(step => {
        if (step.status === 'processing') {
          step.status = 'error'
          step.details = errorMessage
        }
      })

      return {
        success: false,
        summary: `Enhanced processing failed: ${errorMessage}`,
        data: {
          error: errorMessage,
          photoCount: params.photos.length,
          processingSteps
        }
      }
    }
  }

  private initializeProcessingSteps(steps: ProcessingStep[], photoCount: number) {
    const stepDefinitions = [
      { name: 'validation', description: `Validate ${photoCount} image files`, progress: 0 },
      { name: 'metadata', description: 'Extract comprehensive metadata', progress: 0 },
      { name: 'kml', description: 'Generate enhanced KML document', progress: 0 },
      { name: 'archive', description: 'Create KMZ archive', progress: 0 }
    ]

    stepDefinitions.forEach(def => {
      steps.push({
        ...def,
        status: 'pending',
        timestamp: new Date().toISOString()
      })
    })
  }

  private updateStep(steps: ProcessingStep[], stepName: string, status: ProcessingStep['status'], details?: string, progress?: string) {
    const step = steps.find(s => s.name === stepName)
    if (step) {
      step.status = status
      step.details = details
      step.timestamp = new Date().toISOString()
      if (progress) {
        step.progress = parseFloat(progress)
      }
    }
  }

  private validateFiles(files: File[], errors: string[], warnings: string[]): File[] {
    const validFiles: File[] = []
    const maxFileSize = 50 * 1024 * 1024 // 50MB
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/tiff', 'image/webp']

    files.forEach(file => {
      if (!supportedTypes.includes(file.type.toLowerCase())) {
        errors.push(`${file.name}: Unsupported file type (${file.type})`)
        return
      }

      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File too large (${this.formatFileSize(file.size)}, max 50MB)`)
        return
      }

      if (file.size < 1024) {
        warnings.push(`${file.name}: Very small file size (${this.formatFileSize(file.size)})`)
      }

      validFiles.push(file)
    })

    return validFiles
  }

  private async extractComprehensiveMetadata(tags: any, file: File): Promise<ExtractedMetadata> {
    const metadata: ExtractedMetadata = {
      basic: {
        fileName: file.name,
        fileSize: file.size,
        fileSizeFormatted: this.formatFileSize(file.size),
        mimeType: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      },
      camera: {
        make: tags.Make?.description || "Unknown",
        model: tags.Model?.description || "Unknown",
        software: tags.Software?.description || "Unknown",
        dateTimeOriginal: tags.DateTimeOriginal?.description || "",
        dateTime: tags.DateTime?.description || "",
        orientation: this.getOrientationDescription(tags.Orientation?.value)
      },
      technical: {
        imageWidth: tags.ImageWidth?.value || 0,
        imageHeight: tags.ImageHeight?.value || 0,
        colorSpace: tags.ColorSpace?.description || "Unknown",
        pixelDensity: tags.XResolution?.description ? `${tags.XResolution.description} DPI` : "Unknown",
        bitDepth: tags.BitsPerSample?.description || "Unknown",
        compression: tags.Compression?.description || "Unknown"
      },
      photography: {
        fNumber: tags.FNumber?.description || "Unknown",
        exposureTime: tags.ExposureTime?.description || "Unknown",
        iso: tags.ISOSpeedRatings?.description || tags.ISO?.description || "Unknown",
        flash: tags.Flash?.description || "Unknown",
        focalLength: tags.FocalLength?.description || "Unknown",
        whiteBalance: tags.WhiteBalance?.description || "Unknown",
        meteringMode: tags.MeteringMode?.description || "Unknown",
        exposureMode: tags.ExposureMode?.description || "Unknown"
      },
      gps: this.extractGpsData(tags),
      analysis: this.analyzeImageQuality(tags, file)
    }

    return metadata
  }

  private extractGpsData(tags: any) {
    const hasGps = !!(tags.GPSLatitude?.description && tags.GPSLongitude?.description)

    return {
      hasGps,
      latitude: tags.GPSLatitude?.description || "",
      longitude: tags.GPSLongitude?.description || "",
      altitude: tags.GPSAltitude?.description || "",
      timestamp: tags.GPSTimeStamp?.description || "",
      direction: tags.GPSImgDirection?.description || "",
      speed: tags.GPSSpeed?.description || "",
      accuracy: tags.GPSHPositioningError?.description || ""
    }
  }

  private analyzeImageQuality(tags: any, file: File) {
    const issues: string[] = []
    const recommendations: string[] = []
    const notes: string[] = []

    // Analyze image dimensions
    const width = tags.ImageWidth?.value || 0
    const height = tags.ImageHeight?.value || 0
    const megapixels = (width * height) / 1000000

    if (megapixels < 2) {
      issues.push("Low resolution image")
      recommendations.push("Use higher resolution camera settings")
    } else if (megapixels > 20) {
      notes.push("High resolution image - excellent for detailed analysis")
    }

    // Analyze file size vs resolution ratio
    const compressionRatio = file.size / (width * height)
    if (compressionRatio < 0.1) {
      issues.push("High compression detected")
      recommendations.push("Use lower compression settings for better quality")
    }

    // Analyze GPS data
    if (!tags.GPSLatitude) {
      issues.push("No GPS location data")
      recommendations.push("Enable GPS/location services on camera")
    }

    // Analyze date/time
    if (!tags.DateTimeOriginal) {
      issues.push("No capture timestamp")
      recommendations.push("Ensure camera date/time is set correctly")
    }

    // Determine overall quality
    let quality: 'High' | 'Medium' | 'Low' = 'High'
    if (issues.length > 2) quality = 'Low'
    else if (issues.length > 0) quality = 'Medium'

    return {
      quality,
      technicalIssues: issues,
      recommendations,
      processingNotes: notes
    }
  }

  private getOrientationDescription(orientation?: number): string {
    const orientations: { [key: number]: string } = {
      1: "Normal",
      2: "Flip horizontal",
      3: "Rotate 180°",
      4: "Flip vertical",
      5: "Rotate 90° CW + flip horizontal",
      6: "Rotate 90° CW",
      7: "Rotate 90° CCW + flip horizontal",
      8: "Rotate 90° CCW"
    }
    return orientations[orientation || 1] || "Unknown"
  }

  private async generateThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate thumbnail dimensions (max 150px)
        const maxSize = 150
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
          canvas.toBlob(resolve, 'image/jpeg', 0.8)
        } else {
          reject(new Error('Could not get canvas context'))
        }
      }

      img.onerror = () => reject(new Error('Could not load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  private createAdvancedKmlPlacemark(metadata: ExtractedMetadata, includeAnalysis: boolean): string {
    const { basic, camera, technical, photography, gps, analysis } = metadata

    const analysisSection = includeAnalysis ? `
        <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
          <h4 style="margin: 0 0 8px 0; color: #059669;">Quality Analysis</h4>
          <div style="margin-bottom: 5px;">
            <span style="font-weight: bold;">Quality: </span>
            <span style="color: ${analysis.quality === 'High' ? '#059669' : analysis.quality === 'Medium' ? '#d97706' : '#dc2626'};">
              ${analysis.quality}
            </span>
          </div>
          ${analysis.technicalIssues.length > 0 ? `
            <div style="margin-bottom: 5px;">
              <span style="font-weight: bold; color: #dc2626;">Issues: </span>
              <span>${analysis.technicalIssues.join(', ')}</span>
            </div>
          ` : ''}
          ${analysis.recommendations.length > 0 ? `
            <div>
              <span style="font-weight: bold; color: #059669;">Recommendations: </span>
              <span>${analysis.recommendations.join(', ')}</span>
            </div>
          ` : ''}
        </div>
    ` : ''

    return `
  <Placemark>
    <name>${camera.make} ${camera.model} - ${basic.fileName}</name>
    <description><![CDATA[
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h3 style="margin: 0 0 15px 0; color: #059669; border-bottom: 2px solid #059669; padding-bottom: 5px;">
          ${basic.fileName}
        </h3>

        <div style="display: flex; gap: 15px; margin-bottom: 15px;">
          <img src="images/${basic.fileName}" style="max-width: 200px; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
          <img src="thumbnails/thumb_${basic.fileName}" style="max-width: 100px; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <h4 style="margin: 0 0 8px 0; color: #059669;">Camera Information</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Make:</td><td style="padding: 3px 8px;">${camera.make}</td></tr>
              <tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Model:</td><td style="padding: 3px 8px;">${camera.model}</td></tr>
              <tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Software:</td><td style="padding: 3px 8px;">${camera.software}</td></tr>
              <tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Captured:</td><td style="padding: 3px 8px;">${camera.dateTimeOriginal || camera.dateTime}</td></tr>
            </table>
          </div>

          <div>
            <h4 style="margin: 0 0 8px 0; color: #059669;">Technical Details</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Resolution:</td><td style="padding: 3px 8px;">${technical.imageWidth} × ${technical.imageHeight}</td></tr>
              <tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">File Size:</td><td style="padding: 3px 8px;">${basic.fileSizeFormatted}</td></tr>
              <tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Color Space:</td><td style="padding: 3px 8px;">${technical.colorSpace}</td></tr>
              <tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Density:</td><td style="padding: 3px 8px;">${technical.pixelDensity}</td></tr>
            </table>
          </div>
        </div>

        <div style="margin-top: 15px;">
          <h4 style="margin: 0 0 8px 0; color: #059669;">Photography Settings</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Aperture:</td><td style="padding: 3px 8px;">${photography.fNumber}</td>
              <td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Shutter:</td><td style="padding: 3px 8px;">${photography.exposureTime}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">ISO:</td><td style="padding: 3px 8px;">${photography.iso}</td>
              <td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Focal Length:</td><td style="padding: 3px 8px;">${photography.focalLength}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Flash:</td><td style="padding: 3px 8px;">${photography.flash}</td>
              <td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">White Balance:</td><td style="padding: 3px 8px;">${photography.whiteBalance}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 15px;">
          <h4 style="margin: 0 0 8px 0; color: #059669;">GPS Location</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Coordinates:</td><td style="padding: 3px 8px;">${gps.latitude}, ${gps.longitude}</td></tr>
            <tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Altitude:</td><td style="padding: 3px 8px;">${gps.altitude || 'Unknown'}</td></tr>
            ${gps.accuracy ? `<tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Accuracy:</td><td style="padding: 3px 8px;">${gps.accuracy}</td></tr>` : ''}
            ${gps.direction ? `<tr><td style="font-weight: bold; padding: 3px 8px; background: #f3f4f6;">Direction:</td><td style="padding: 3px 8px;">${gps.direction}</td></tr>` : ''}
          </table>
        </div>

        ${analysisSection}
      </div>
    ]]></description>
    <Point>
      <coordinates>${gps.longitude},${gps.latitude},0</coordinates>
    </Point>
    <Style>
      <IconStyle>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/paddle/${analysis.quality === 'High' ? 'grn' : analysis.quality === 'Medium' ? 'ylw' : 'red'}-circle.png</href>
        </Icon>
        <scale>1.2</scale>
      </IconStyle>
      <LabelStyle>
        <scale>0.9</scale>
      </LabelStyle>
    </Style>
  </Placemark>`
  }

  private generateAdvancedKmlDocument(
    placemarks: string,
    actor: string,
    metadata: ExtractedMetadata[],
    options: any
  ): string {
    const timestamp = new Date().toLocaleString()
    const totalFiles = metadata.length
    const geoTaggedFiles = metadata.filter(m => m.gps.hasGps).length
    const qualityDistribution = {
      high: metadata.filter(m => m.analysis.quality === 'High').length,
      medium: metadata.filter(m => m.analysis.quality === 'Medium').length,
      low: metadata.filter(m => m.analysis.quality === 'Low').length
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>IRIS MCP SDK Enhanced Field Data Demonstration</name>
    <description>
      <![CDATA[
      <h2 style="color: #059669; margin-bottom: 20px;">IRIS MCP SDK Visual Intelligence Suite</h2>
      <p><strong>Demonstration:</strong> Advanced field data processing capabilities</p>
      <p><strong>Features Showcased:</strong> Computer vision, geospatial analysis, automated reporting</p>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="font-weight: bold; padding: 5px 0;"><strong>Generated by:</strong></td><td style="padding: 5px 0;">${actor}</td></tr>
          <tr><td style="font-weight: bold; padding: 5px 0;"><strong>Generated on:</strong></td><td style="padding: 5px 0;">${timestamp}</td></tr>
          <tr><td style="font-weight: bold; padding: 5px 0;"><strong>Total Images:</strong></td><td style="padding: 5px 0;">${totalFiles}</td></tr>
          <tr><td style="font-weight: bold; padding: 5px 0;"><strong>Geo-tagged:</strong></td><td style="padding: 5px 0;">${geoTaggedFiles}</td></tr>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="color: #059669; margin-bottom: 10px;">Quality Analysis Summary</h4>
        <div style="display: flex; gap: 10px;">
          <div style="background: #dcfce7; padding: 10px; border-radius: 5px; text-align: center; flex: 1;">
            <div style="font-size: 18px; font-weight: bold; color: #059669;">${qualityDistribution.high}</div>
            <div style="font-size: 12px;">High Quality</div>
          </div>
          <div style="background: #fef3c7; padding: 10px; border-radius: 5px; text-align: center; flex: 1;">
            <div style="font-size: 18px; font-weight: bold; color: #d97706;">${qualityDistribution.medium}</div>
            <div style="font-size: 12px;">Medium Quality</div>
          </div>
          <div style="background: #fee2e2; padding: 10px; border-radius: 5px; text-align: center; flex: 1;">
            <div style="font-size: 18px; font-weight: bold; color: #dc2626;">${qualityDistribution.low}</div>
            <div style="font-size: 12px;">Low Quality</div>
          </div>
        </div>
      </div>

      <hr style="margin: 20px 0;">

      <p><strong>Features included:</strong></p>
      <ul>
        <li>Comprehensive EXIF metadata extraction</li>
        <li>GPS location mapping with accuracy indicators</li>
        <li>Automated image quality analysis</li>
        <li>Technical specifications and camera settings</li>
        ${options.generateThumbnails ? '<li>High-quality thumbnail generation</li>' : ''}
        ${options.detailedAnalysis ? '<li>Detailed technical analysis and recommendations</li>' : ''}
        <li>Professional KMZ packaging with organized file structure</li>
      </ul>

      <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
        This enhanced report provides comprehensive analysis of field-collected imagery with
        professional-grade metadata extraction, quality assessment, and geographic mapping capabilities.
      </p>
      ]]></description>

      <!-- Enhanced style definitions -->
      <Style id="highQuality">
        <IconStyle>
          <Icon><href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href></Icon>
          <scale>1.2</scale>
        </IconStyle>
        <LabelStyle><scale>0.9</scale></LabelStyle>
      </Style>

      <Style id="mediumQuality">
        <IconStyle>
          <Icon><href>http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png</href></Icon>
          <scale>1.1</scale>
        </IconStyle>
        <LabelStyle><scale>0.8</scale></LabelStyle>
      </Style>

      <Style id="lowQuality">
        <IconStyle>
          <Icon><href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href></Icon>
          <scale>1.0</scale>
        </IconStyle>
        <LabelStyle><scale>0.7</scale></LabelStyle>
      </Style>

      ${placemarks}
    </Document>
  </kml>`
  }

  private generateMetadataReport(metadata: ExtractedMetadata[], actor: string) {
    const summary = {
      generatedBy: actor,
      generatedAt: new Date().toISOString(),
      totalImages: metadata.length,
      geoTaggedImages: metadata.filter(m => m.gps.hasGps).length,
      qualityDistribution: {
        high: metadata.filter(m => m.analysis.quality === 'High').length,
        medium: metadata.filter(m => m.analysis.quality === 'Medium').length,
        low: metadata.filter(m => m.analysis.quality === 'Low').length
      },
      commonIssues: this.findCommonIssues(metadata),
      recommendations: this.generateRecommendations(metadata),
      technicalSummary: this.generateTechnicalSummary(metadata)
    }

    return {
      summary,
      detailedMetadata: metadata
    }
  }

  private findCommonIssues(metadata: ExtractedMetadata[]): string[] {
    const issueCount: { [key: string]: number } = {}

    metadata.forEach(m => {
      m.analysis.technicalIssues.forEach(issue => {
        issueCount[issue] = (issueCount[issue] || 0) + 1
      })
    })

    return Object.entries(issueCount)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .map(([issue, count]) => `${issue} (${count} images)`)
  }

  private generateRecommendations(metadata: ExtractedMetadata[]): string[] {
    const recommendations = new Set<string>()

    metadata.forEach(m => {
      m.analysis.recommendations.forEach(rec => recommendations.add(rec))
    })

    return Array.from(recommendations)
  }

  private generateTechnicalSummary(metadata: ExtractedMetadata[]) {
    const resolutions = metadata.map(m => m.technical.imageWidth * m.technical.imageHeight)
    const fileSizes = metadata.map(m => m.basic.fileSize)

    return {
      averageResolution: Math.round(resolutions.reduce((a, b) => a + b, 0) / resolutions.length),
      averageFileSize: Math.round(fileSizes.reduce((a, b) => a + b, 0) / fileSizes.length),
      totalDataSize: fileSizes.reduce((a, b) => a + b, 0),
      cameraModels: [...new Set(metadata.map(m => `${m.camera.make} ${m.camera.model}`))],
      dateRange: {
        earliest: metadata.reduce((earliest, m) => {
          const date = m.camera.dateTimeOriginal || m.camera.dateTime
          return date && date < earliest ? date : earliest
        }, '9999-12-31'),
        latest: metadata.reduce((latest, m) => {
          const date = m.camera.dateTimeOriginal || m.camera.dateTime
          return date && date > latest ? date : latest
        }, '0000-01-01')
      }
    }
  }

  private async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBuffer)
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`))
      reader.readAsArrayBuffer(file)
    })
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}
