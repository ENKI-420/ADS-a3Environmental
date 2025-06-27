import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'

// Enhanced KML + Geospatial Visual Layer v3
interface KMLGenerationOptions {
  style: 'geo-thumbs' | 'clustered' | 'heatmap' | '3d-flythrough'
  includeClustering: boolean
  clusterRadius: number
  includeContextOverlays: boolean
  environmentalZones: boolean
  remediationSites: boolean
  projectStages: boolean
  enable3D: boolean
  customIcon?: string
  colorScheme: 'default' | 'severity' | 'date' | 'quality'
}

interface GeospatialContext {
  environmentalZones: {
    type: 'wetland' | 'industrial' | 'residential' | 'remediation'
    coordinates: number[][]
    name: string
    description: string
  }[]
  remediationSites: {
    id: string
    name: string
    status: 'active' | 'completed' | 'planned'
    coordinates: [number, number]
    type: 'soil' | 'groundwater' | 'air' | 'waste'
  }[]
  projectBoundaries: {
    name: string
    coordinates: number[][]
    stage: 'planning' | 'phase-i' | 'phase-ii' | 'remediation' | 'monitoring'
  }[]
}

interface ImagePlacemark {
  id: string
  name: string
  coordinates: [number, number, number] // lat, lng, alt
  description: string
  thumbnail: string
  metadata: any
  clusterId?: string
  style: string
}

interface KMLCluster {
  id: string
  center: [number, number]
  radius: number
  imageCount: number
  images: ImagePlacemark[]
  representativeImage: ImagePlacemark
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      exifData,
      options = {} as KMLGenerationOptions,
      projectInfo = {},
      customContext = {} as GeospatialContext
    } = body

    if (!exifData || !Array.isArray(exifData)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid EXIF data provided'
      }, { status: 400 })
    }

    const kmlId = uuidv4()
    const startTime = Date.now()

    // Filter images with GPS data
    const geoTaggedImages = exifData.filter((img: any) => img.gps?.hasGps)

    if (geoTaggedImages.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No geo-tagged images found'
      }, { status: 400 })
    }

    // Generate placemarks
    const placemarks = await generateImagePlacemarks(geoTaggedImages, options)

    // Apply clustering if enabled
    const clusters = options.includeClustering ?
      generateClusters(placemarks, options.clusterRadius || 100) : null

    // Generate context overlays
    const contextLayers = options.includeContextOverlays ?
      await generateContextOverlays(customContext, options) : []

    // Generate KML document
    const kmlContent = generateAdvancedKML({
      placemarks,
      clusters,
      contextLayers,
      options,
      projectInfo,
      metadata: {
        generated: new Date().toISOString(),
        totalImages: exifData.length,
        geoTaggedImages: geoTaggedImages.length,
        clustersGenerated: clusters?.length || 0
      }
    })

    // Generate supporting files
    const supportingFiles = await generateSupportingFiles(placemarks, options)

    const processingTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      data: {
        kmlId,
        kmlContent,
        filename: `A3E_GeoSpatial_${kmlId}.kml`,
        processingTime,
        statistics: {
          totalPlacemarks: placemarks.length,
          clustersGenerated: clusters?.length || 0,
          contextLayersIncluded: contextLayers.length,
          coverageArea: calculateCoverageArea(placemarks),
          dateRange: getDateRange(geoTaggedImages)
        },
        supportingFiles,
        webGLViewer: options.enable3D ? generateWebGLViewerConfig(placemarks) : null
      }
    })

  } catch (error) {
    console.error('KML generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate KML'
    }, { status: 500 })
  }
}

async function generateImagePlacemarks(images: any[], options: KMLGenerationOptions): Promise<ImagePlacemark[]> {
  return images.map((img, index) => {
    const coordinates: [number, number, number] = [
      img.gps.latitude,
      img.gps.longitude,
      img.gps.altitude || 0
    ]

    const style = generatePlacemarkStyle(img, options, index)

    return {
      id: img.id || `img_${index}`,
      name: img.fileName,
      coordinates,
      description: generateRichDescription(img),
      thumbnail: generateThumbnailData(img),
      metadata: img,
      style
    }
  })
}

function generateClusters(placemarks: ImagePlacemark[], radiusMeters: number): KMLCluster[] {
  const clusters: KMLCluster[] = []
  const processed = new Set<string>()

  placemarks.forEach(placemark => {
    if (processed.has(placemark.id)) return

    const cluster: KMLCluster = {
      id: uuidv4(),
      center: [placemark.coordinates[0], placemark.coordinates[1]],
      radius: radiusMeters,
      imageCount: 1,
      images: [placemark],
      representativeImage: placemark
    }

    // Find nearby images
    placemarks.forEach(other => {
      if (other.id === placemark.id || processed.has(other.id)) return

      const distance = calculateDistance(
        placemark.coordinates[0], placemark.coordinates[1],
        other.coordinates[0], other.coordinates[1]
      )

      if (distance <= radiusMeters) {
        cluster.images.push(other)
        cluster.imageCount++
        processed.add(other.id)

        // Update representative image (use highest quality)
        if (other.metadata.basic.quality === 'High' &&
            cluster.representativeImage.metadata.basic.quality !== 'High') {
          cluster.representativeImage = other
        }
      }
    })

    processed.add(placemark.id)
    clusters.push(cluster)
  })

  return clusters
}

async function generateContextOverlays(context: GeospatialContext, options: KMLGenerationOptions): Promise<string[]> {
  const overlays: string[] = []

  if (options.environmentalZones && context.environmentalZones) {
    const envZoneKML = context.environmentalZones.map(zone => `
      <Placemark>
        <name>${zone.name}</name>
        <description>Environmental Zone: ${zone.type}</description>
        <Style>
          <PolyStyle>
            <color>${getZoneColor(zone.type)}</color>
            <fill>1</fill>
            <outline>1</outline>
          </PolyStyle>
        </Style>
        <Polygon>
          <outerBoundaryIs>
            <LinearRing>
              <coordinates>
                ${zone.coordinates.map(coord => `${coord[1]},${coord[0]},0`).join(' ')}
              </coordinates>
            </LinearRing>
          </outerBoundaryIs>
        </Polygon>
      </Placemark>
    `).join('')
    overlays.push(envZoneKML)
  }

  if (options.remediationSites && context.remediationSites) {
    const remediationKML = context.remediationSites.map(site => `
      <Placemark>
        <name>${site.name}</name>
        <description>
          <![CDATA[
            <h3>Remediation Site</h3>
            <p><strong>Status:</strong> ${site.status}</p>
            <p><strong>Type:</strong> ${site.type}</p>
            <p><strong>ID:</strong> ${site.id}</p>
          ]]>
        </description>
        <Style>
          <IconStyle>
            <Icon>
              <href>${getRemediationIcon(site.type, site.status)}</href>
            </Icon>
            <scale>1.2</scale>
          </IconStyle>
        </Style>
        <Point>
          <coordinates>${site.coordinates[1]},${site.coordinates[0]},0</coordinates>
        </Point>
      </Placemark>
    `).join('')
    overlays.push(remediationKML)
  }

  return overlays
}

function generateAdvancedKML(params: {
  placemarks: ImagePlacemark[]
  clusters: KMLCluster[] | null
  contextLayers: string[]
  options: KMLGenerationOptions
  projectInfo: any
  metadata: any
}): string {
  const { placemarks, clusters, contextLayers, options, projectInfo, metadata } = params

  const styles = generateKMLStyles(options)
  const placemarksKML = clusters ?
    generateClusteredPlacemarks(clusters, options) :
    generateStandardPlacemarks(placemarks, options)

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>A3E Environmental Geospatial Analysis</name>
    <description><![CDATA[
      <h2>A3E Environmental Field Data Collection</h2>
      <p><strong>Project:</strong> ${projectInfo.name || 'Unnamed Project'}</p>
      <p><strong>Analyst:</strong> ${projectInfo.analyst || 'A3E Team'}</p>
      <p><strong>Generated:</strong> ${metadata.generated}</p>
      <p><strong>Total Images:</strong> ${metadata.totalImages}</p>
      <p><strong>Geo-tagged Images:</strong> ${metadata.geoTaggedImages}</p>
      ${clusters ? `<p><strong>Clusters:</strong> ${metadata.clustersGenerated}</p>` : ''}

      <h3>Legend</h3>
      <ul>
        <li>🔴 High Priority Findings</li>
        <li>🟡 Medium Priority Findings</li>
        <li>🟢 Standard Documentation</li>
        <li>📍 Remediation Sites</li>
        <li>🏭 Environmental Zones</li>
      </ul>

      <hr/>
      <p><em>Generated by A3E Visual Intelligence Suite v3.0</em></p>
    ]]></description>

    ${styles}

    <!-- Environmental Context Layers -->
    ${contextLayers.length > 0 ? `
    <Folder>
      <name>Environmental Context</name>
      <description>Environmental zones, remediation sites, and project boundaries</description>
      ${contextLayers.join('')}
    </Folder>
    ` : ''}

    <!-- Image Documentation -->
    <Folder>
      <name>Field Documentation</name>
      <description>GPS-tagged field images with metadata</description>
      ${placemarksKML}
    </Folder>

    ${options.enable3D ? generateFlyThroughTour(placemarks) : ''}

  </Document>
</kml>`
}

function generateClusteredPlacemarks(clusters: KMLCluster[], options: KMLGenerationOptions): string {
  return clusters.map(cluster => {
    if (cluster.imageCount === 1) {
      return generateSinglePlacemark(cluster.representativeImage, options)
    }

    return `
    <Folder>
      <name>Image Cluster (${cluster.imageCount} images)</name>
      <description>
        <![CDATA[
          <h3>Clustered Images</h3>
          <p><strong>Images in cluster:</strong> ${cluster.imageCount}</p>
          <p><strong>Cluster radius:</strong> ${cluster.radius}m</p>
          <p><strong>Representative image:</strong> ${cluster.representativeImage.name}</p>
        ]]>
      </description>

      <!-- Cluster center marker -->
      <Placemark>
        <name>Cluster Center (${cluster.imageCount} images)</name>
        <description>This cluster contains ${cluster.imageCount} images within ${cluster.radius}m radius</description>
        <styleUrl>#clusterStyle</styleUrl>
        <Point>
          <coordinates>${cluster.center[1]},${cluster.center[0]},0</coordinates>
        </Point>
      </Placemark>

      <!-- Individual images in cluster -->
      ${cluster.images.map(img => generateSinglePlacemark(img, options)).join('')}
    </Folder>
    `
  }).join('')
}

function generateStandardPlacemarks(placemarks: ImagePlacemark[], options: KMLGenerationOptions): string {
  return placemarks.map(placemark => generateSinglePlacemark(placemark, options)).join('')
}

function generateSinglePlacemark(placemark: ImagePlacemark, options: KMLGenerationOptions): string {
  return `
  <Placemark>
    <name>${placemark.name}</name>
    <description>${placemark.description}</description>
    <styleUrl>#${placemark.style}</styleUrl>
    <Point>
      <coordinates>${placemark.coordinates[1]},${placemark.coordinates[0]},${placemark.coordinates[2]}</coordinates>
    </Point>
    <ExtendedData>
      <Data name="fileSize">
        <value>${placemark.metadata.fileSizeFormatted}</value>
      </Data>
      <Data name="quality">
        <value>${placemark.metadata.basic.quality}</value>
      </Data>
      <Data name="cameraModel">
        <value>${placemark.metadata.camera.model}</value>
      </Data>
      <Data name="gpsAccuracy">
        <value>${placemark.metadata.gps.accuracy || 'Unknown'}m</value>
      </Data>
      <Data name="gpsSource">
        <value>${placemark.metadata.gps.source}</value>
      </Data>
    </ExtendedData>
  </Placemark>
  `
}

function generateRichDescription(img: any): string {
  const quality = img.basic.quality
  const qualityEmoji = quality === 'High' ? '🟢' : quality === 'Medium' ? '🟡' : '🔴'

  return `<![CDATA[
    <div style="font-family: Arial, sans-serif; max-width: 400px;">
      <h3>${qualityEmoji} ${img.fileName}</h3>

      <div style="margin: 10px 0;">
        <img src="${img.thumbnail || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='}"
             alt="Thumbnail" style="max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 4px;"/>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tr><td><strong>File Size:</strong></td><td>${img.fileSizeFormatted}</td></tr>
        <tr><td><strong>Dimensions:</strong></td><td>${img.basic.dimensions.width} × ${img.basic.dimensions.height}</td></tr>
        <tr><td><strong>Quality:</strong></td><td>${img.basic.quality}</td></tr>
        <tr><td><strong>Camera:</strong></td><td>${img.camera.make} ${img.camera.model}</td></tr>
        <tr><td><strong>Date:</strong></td><td>${new Date(img.camera.dateTimeOriginal).toLocaleString()}</td></tr>
        <tr><td><strong>GPS Source:</strong></td><td>${img.gps.source}</td></tr>
        <tr><td><strong>Accuracy:</strong></td><td>${img.gps.accuracy || 'Unknown'}m</td></tr>
        ${img.enrichment?.environmentalContext ? `
        <tr><td><strong>EPA Region:</strong></td><td>${img.enrichment.environmentalContext.epaRegion}</td></tr>
        <tr><td><strong>Zone Type:</strong></td><td>${img.enrichment.environmentalContext.zoneType}</td></tr>
        ` : ''}
      </table>

      ${img.enrichment?.suggestedLocation ? `
      <div style="margin-top: 10px; padding: 8px; background: #f0f8ff; border-radius: 4px;">
        <strong>📍 Suggested Location:</strong> ${img.enrichment.suggestedLocation.name}
        <br><em>Confidence: ${Math.round(img.enrichment.suggestedLocation.confidence * 100)}%</em>
      </div>
      ` : ''}

      <div style="margin-top: 10px; font-size: 10px; color: #666;">
        Processed by A3E Visual Intelligence Suite
      </div>
    </div>
  ]]>`
}

function generateKMLStyles(options: KMLGenerationOptions): string {
  return `
  <Style id="highQuality">
    <IconStyle>
      <Icon><href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href></Icon>
      <scale>1.0</scale>
    </IconStyle>
  </Style>

  <Style id="mediumQuality">
    <IconStyle>
      <Icon><href>http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png</href></Icon>
      <scale>0.8</scale>
    </IconStyle>
  </Style>

  <Style id="lowQuality">
    <IconStyle>
      <Icon><href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href></Icon>
      <scale>0.6</scale>
    </IconStyle>
  </Style>

  <Style id="clusterStyle">
    <IconStyle>
      <Icon><href>http://maps.google.com/mapfiles/kml/shapes/shaded_dot.png</href></Icon>
      <scale>1.5</scale>
    </IconStyle>
  </Style>
  `
}

function generatePlacemarkStyle(img: any, options: KMLGenerationOptions, index: number): string {
  switch (options.colorScheme) {
    case 'quality':
      return img.basic.quality.toLowerCase() + 'Quality'
    case 'severity':
      return img.enrichment?.riskLevel ? img.enrichment.riskLevel + 'Risk' : 'highQuality'
    case 'date':
      return index % 2 === 0 ? 'highQuality' : 'mediumQuality'
    default:
      return 'highQuality'
  }
}

function generateFlyThroughTour(placemarks: ImagePlacemark[]): string {
  const tourPoints = placemarks.slice(0, 10) // Limit tour to first 10 points

  return `
  <gx:Tour>
    <name>A3E Site Flythrough</name>
    <description>Automated flythrough of documented locations</description>
    <gx:Playlist>
      ${tourPoints.map((placemark, index) => `
      <gx:FlyTo>
        <gx:duration>3.0</gx:duration>
        <gx:flyToMode>smooth</gx:flyToMode>
        <Camera>
          <longitude>${placemark.coordinates[1]}</longitude>
          <latitude>${placemark.coordinates[0]}</latitude>
          <altitude>100</altitude>
          <heading>0</heading>
          <tilt>45</tilt>
          <roll>0</roll>
        </Camera>
      </gx:FlyTo>
      <gx:Wait>
        <gx:duration>2.0</gx:duration>
      </gx:Wait>
      `).join('')}
    </gx:Playlist>
  </gx:Tour>
  `
}

async function generateSupportingFiles(placemarks: ImagePlacemark[], options: KMLGenerationOptions) {
  return {
    csvExport: generateCSVExport(placemarks),
    geoJson: generateGeoJSON(placemarks),
    webMapConfig: generateWebMapConfig(placemarks, options)
  }
}

function generateCSVExport(placemarks: ImagePlacemark[]): string {
  const headers = ['Name', 'Latitude', 'Longitude', 'Altitude', 'Quality', 'FileSize', 'Camera', 'Date', 'GPS_Source']
  const rows = placemarks.map(p => [
    p.name,
    p.coordinates[0],
    p.coordinates[1],
    p.coordinates[2],
    p.metadata.basic.quality,
    p.metadata.fileSizeFormatted,
    `${p.metadata.camera.make} ${p.metadata.camera.model}`,
    p.metadata.camera.dateTimeOriginal,
    p.metadata.gps.source
  ])

  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

function generateGeoJSON(placemarks: ImagePlacemark[]) {
  return {
    type: 'FeatureCollection',
    features: placemarks.map(p => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [p.coordinates[1], p.coordinates[0], p.coordinates[2]]
      },
      properties: {
        name: p.name,
        quality: p.metadata.basic.quality,
        fileSize: p.metadata.fileSize,
        camera: `${p.metadata.camera.make} ${p.metadata.camera.model}`,
        date: p.metadata.camera.dateTimeOriginal,
        gpsSource: p.metadata.gps.source
      }
    }))
  }
}

function generateWebMapConfig(placemarks: ImagePlacemark[], options: KMLGenerationOptions) {
  const bounds = calculateBounds(placemarks)

  return {
    center: [(bounds.north + bounds.south) / 2, (bounds.east + bounds.west) / 2],
    zoom: calculateOptimalZoom(bounds),
    layers: [
      {
        type: 'markers',
        data: placemarks,
        style: options.style
      }
    ],
    controls: {
      clustering: options.includeClustering,
      heatmap: options.style === 'heatmap',
      flythrough: options.enable3D
    }
  }
}

function generateWebGLViewerConfig(placemarks: ImagePlacemark[]) {
  return {
    scene: '3d-environmental',
    camera: {
      position: calculateCenterPoint(placemarks),
      target: calculateCenterPoint(placemarks),
      fov: 60
    },
    objects: placemarks.map(p => ({
      type: 'marker',
      position: p.coordinates,
      metadata: p.metadata,
      style: 'environmental-pin'
    })),
    environment: {
      skybox: 'environmental',
      lighting: 'outdoor',
      fog: true
    }
  }
}

// Utility functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function calculateCoverageArea(placemarks: ImagePlacemark[]): number {
  if (placemarks.length < 3) return 0

  const bounds = calculateBounds(placemarks)
  const latDiff = bounds.north - bounds.south
  const lonDiff = bounds.east - bounds.west

  // Approximate area in square kilometers
  return latDiff * lonDiff * 111 * 111 * Math.cos(((bounds.north + bounds.south) / 2) * Math.PI / 180)
}

function calculateBounds(placemarks: ImagePlacemark[]) {
  const lats = placemarks.map(p => p.coordinates[0])
  const lngs = placemarks.map(p => p.coordinates[1])

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs)
  }
}

function calculateCenterPoint(placemarks: ImagePlacemark[]): [number, number, number] {
  const bounds = calculateBounds(placemarks)
  return [
    (bounds.north + bounds.south) / 2,
    (bounds.east + bounds.west) / 2,
    100 // Default altitude
  ]
}

function calculateOptimalZoom(bounds: any): number {
  const latDiff = bounds.north - bounds.south
  const lonDiff = bounds.east - bounds.west
  const maxDiff = Math.max(latDiff, lonDiff)

  if (maxDiff > 10) return 5
  if (maxDiff > 1) return 10
  if (maxDiff > 0.1) return 13
  return 16
}

function getDateRange(images: any[]) {
  const dates = images.map(img => new Date(img.camera.dateTimeOriginal)).sort()
  return {
    earliest: dates[0]?.toISOString() || '',
    latest: dates[dates.length - 1]?.toISOString() || ''
  }
}

function generateThumbnailData(img: any): string {
  // In production, generate actual thumbnails
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRTBFMEUwIi8+CjxwYXRoIGQ9Ik0xMiAxNkwyMCAxMkwyOCAxNlYyOEgyOFYxNloiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+'
}

function getZoneColor(type: string): string {
  const colors = {
    'wetland': '7f0000ff', // Blue
    'industrial': '7fff0000', // Red
    'residential': '7f00ff00', // Green
    'remediation': '7fff8800' // Orange
  }
  return colors[type as keyof typeof colors] || '7f808080'
}

function getRemediationIcon(type: string, status: string): string {
  return `http://maps.google.com/mapfiles/kml/shapes/${status === 'completed' ? 'grn' : status === 'active' ? 'ylw' : 'red'}-pushpin.png`
}

// GET endpoint for CLI generator info
export async function GET() {
  return NextResponse.json({
    service: 'A3E KML Geospatial Generator v3',
    version: '3.0.0',
    status: 'operational',
    features: [
      'Interactive clustering',
      'Context overlays',
      'Environmental zones',
      'Remediation site mapping',
      '3D flythrough tours',
      'WebGL rendering support',
      'Multi-format export'
    ],
    cli: {
      command: 'a3e-exif-kml',
      usage: 'a3e-exif-kml --input ./album --output ./out.kml --style "geo-thumbs"',
      options: [
        '--input: Input directory or ZIP file',
        '--output: Output KML file path',
        '--style: geo-thumbs | clustered | heatmap | 3d-flythrough',
        '--cluster-radius: Clustering radius in meters (default: 100)',
        '--include-context: Include environmental context layers',
        '--enable-3d: Enable 3D flythrough tour'
      ]
    }
  })
}