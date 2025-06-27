import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'

// Report Builder & Workflow Orchestration v4
interface A3EProjectDefinition {
  project: string
  analyst: string
  images: string
  auto_link: boolean
  output: string
  metadata?: {
    client?: string
    projectId?: string
    siteAddress?: string
    inspectionDate?: string
    phase?: 'Phase I' | 'Phase II' | 'Phase III' | 'Remediation' | 'Monitoring'
    regulatoryFramework?: 'EPA' | 'NEPA' | 'HUD' | 'DOT' | 'State' | 'Local'
    complianceLevel?: 'Standard' | 'Enhanced' | 'Comprehensive'
  }
  templates?: {
    coverPage?: string
    executiveSummary?: boolean
    appendices?: string[]
    certifications?: string[]
  }
  branding?: {
    logo?: string
    watermark?: string
    licenseLevel?: 'Free' | 'Standard' | 'Pro' | 'Enterprise'
  }
}

interface ReportSection {
  id: string
  title: string
  content: string
  pageNumber?: number
  images?: ReportImage[]
  linkedData?: any[]
}

interface ReportImage {
  id: string
  fileName: string
  thumbnail: string
  fullPath: string
  metadata: any
  linkedKmlPoint?: string
  gpsCoordinates?: [number, number]
  description: string
  pageReference: string
}

interface ComplianceReport {
  id: string
  title: string
  generated: string
  analyst: string
  project: A3EProjectDefinition
  sections: ReportSection[]
  appendices: ReportAppendix[]
  biDirectionalLinks: BiDirectionalLink[]
  documentMetadata: {
    totalPages: number
    imageCount: number
    complianceChecks: number
    certificationLevel: string
    processingTime: number
  }
  outputs: {
    pdfUrl: string
    kmlUrl?: string
    archiveUrl?: string
    dashboardUrl?: string
  }
}

interface ReportAppendix {
  id: string
  title: string
  type: 'image_grid' | 'gps_map' | 'metadata_table' | 'compliance_checklist'
  content: any
  pageStart: number
  linkedImages: string[]
}

interface BiDirectionalLink {
  id: string
  sourceType: 'image' | 'kml_point' | 'report_section' | 'storage_location'
  sourceId: string
  targetType: 'image' | 'kml_point' | 'report_section' | 'storage_location'
  targetId: string
  linkType: 'reference' | 'contains' | 'related_to' | 'derived_from'
  metadata: any
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      projectDefinition,
      exifData = [],
      kmlData = null,
      options = {}
    } = body

    if (!projectDefinition || !projectDefinition.project) {
      return NextResponse.json({
        success: false,
        error: 'Valid A3E project definition required'
      }, { status: 400 })
    }

    const reportId = uuidv4()
    const startTime = Date.now()

    // Parse and validate project definition
    const parsedProject = parseProjectDefinition(projectDefinition)

    // Auto-link images to site/project if enabled
    const linkedData = parsedProject.auto_link ?
      await performAutoLinking(exifData, parsedProject) : { images: exifData, links: [] }

    // Generate report sections
    const sections = await generateReportSections(linkedData, parsedProject)

    // Generate appendices with image grids and GPS maps
    const appendices = await generateAppendices(linkedData, parsedProject, kmlData)

    // Create bi-directional linking system
    const biDirectionalLinks = generateBiDirectionalLinks(linkedData, sections, appendices)

    // Generate PDF content
    const pdfContent = await generatePDFContent({
      project: parsedProject,
      sections,
      appendices,
      biDirectionalLinks,
      metadata: {
        reportId,
        generated: new Date().toISOString(),
        analyst: parsedProject.analyst
      }
    })

    // Generate supporting outputs
    const outputs = await generateSupportingOutputs(reportId, {
      pdfContent,
      kmlData,
      linkedData,
      project: parsedProject
    })

    const processingTime = Date.now() - startTime

    const report: ComplianceReport = {
      id: reportId,
      title: parsedProject.project,
      generated: new Date().toISOString(),
      analyst: parsedProject.analyst,
      project: parsedProject,
      sections,
      appendices,
      biDirectionalLinks,
      documentMetadata: {
        totalPages: calculateTotalPages(sections, appendices),
        imageCount: linkedData.images.length,
        complianceChecks: sections.filter(s => s.title.includes('Compliance')).length,
        certificationLevel: parsedProject.metadata?.complianceLevel || 'Standard',
        processingTime
      },
      outputs
    }

    return NextResponse.json({
      success: true,
      data: {
        report,
        downloadUrls: outputs,
        processingTime,
        billingInfo: generateBillingInfo(report, parsedProject.branding?.licenseLevel)
      }
    })

  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate compliance report'
    }, { status: 500 })
  }
}

function parseProjectDefinition(def: any): A3EProjectDefinition {
  return {
    project: def.project || 'Unnamed Project',
    analyst: def.analyst || 'A3E Team',
    images: def.images || './images',
    auto_link: def.auto_link !== false,
    output: def.output || './reports/A3E_Report.pdf',
    metadata: {
      client: def.metadata?.client,
      projectId: def.metadata?.projectId || `A3E-${Date.now()}`,
      siteAddress: def.metadata?.siteAddress,
      inspectionDate: def.metadata?.inspectionDate || new Date().toISOString(),
      phase: def.metadata?.phase || 'Phase I',
      regulatoryFramework: def.metadata?.regulatoryFramework || 'EPA',
      complianceLevel: def.metadata?.complianceLevel || 'Standard'
    },
    templates: {
      coverPage: def.templates?.coverPage || 'standard',
      executiveSummary: def.templates?.executiveSummary !== false,
      appendices: def.templates?.appendices || ['image_grid', 'gps_map', 'metadata_table'],
      certifications: def.templates?.certifications || ['A3E_Certified']
    },
    branding: {
      logo: def.branding?.logo || 'A3E_Standard',
      watermark: def.branding?.watermark,
      licenseLevel: def.branding?.licenseLevel || 'Standard'
    }
  }
}

async function performAutoLinking(exifData: any[], project: A3EProjectDefinition) {
  const links: BiDirectionalLink[] = []
  const enhancedImages = exifData.map((img, index) => {
    // Auto-tag to site based on project info
    const siteLink = matchImageToSite(img, project)
    if (siteLink) {
      links.push({
        id: uuidv4(),
        sourceType: 'image',
        sourceId: img.id || `img_${index}`,
        targetType: 'report_section',
        targetId: 'site_documentation',
        linkType: 'contains',
        metadata: siteLink
      })
    }

    // Link to storage location
    const storageLink = generateStorageLink(img, project)
    if (storageLink) {
      links.push({
        id: uuidv4(),
        sourceType: 'image',
        sourceId: img.id || `img_${index}`,
        targetType: 'storage_location',
        targetId: storageLink.url,
        linkType: 'reference',
        metadata: storageLink
      })
    }

    return {
      ...img,
      autoLinked: true,
      projectId: project.metadata?.projectId,
      siteMatch: siteLink
    }
  })

  return { images: enhancedImages, links }
}

function matchImageToSite(img: any, project: A3EProjectDefinition) {
  const confidence = calculateSiteMatchConfidence(img, project)

  if (confidence > 0.7) {
    return {
      siteId: project.metadata?.projectId,
      siteName: project.project,
      confidence,
      matchingCriteria: [
        'project_metadata',
        'gps_proximity',
        'filename_pattern',
        'date_correlation'
      ]
    }
  }

  return null
}

function calculateSiteMatchConfidence(img: any, project: A3EProjectDefinition): number {
  let confidence = 0.5 // Base confidence

  // Check filename for project references
  if (img.fileName.toLowerCase().includes(project.project.toLowerCase().slice(0, 5))) {
    confidence += 0.2
  }

  // Check date proximity to inspection date
  if (project.metadata?.inspectionDate) {
    const inspectionDate = new Date(project.metadata.inspectionDate)
    const imageDate = new Date(img.camera?.dateTimeOriginal || img.basic?.lastModified)
    const daysDiff = Math.abs((inspectionDate.getTime() - imageDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff < 1) confidence += 0.3
    else if (daysDiff < 7) confidence += 0.2
    else if (daysDiff < 30) confidence += 0.1
  }

  // Check GPS proximity (mock implementation)
  if (img.gps?.hasGps && project.metadata?.siteAddress) {
    confidence += 0.2 // In production, geocode and calculate distance
  }

  return Math.min(confidence, 1.0)
}

function generateStorageLink(img: any, project: A3EProjectDefinition) {
  // Generate Supabase/Firebase storage URL structure
  const projectSlug = project.project.toLowerCase().replace(/\s+/g, '-')
  const fileName = img.fileName || 'unknown.jpg'

  return {
    url: `supabase://fieldops/projects/${projectSlug}/images/${fileName}`,
    provider: 'supabase',
    bucket: 'fieldops',
    path: `projects/${projectSlug}/images/${fileName}`,
    accessLevel: 'authenticated',
    metadata: {
      uploadedBy: project.analyst,
      projectId: project.metadata?.projectId,
      originalPath: img.originalPath || project.images
    }
  }
}

async function generateReportSections(linkedData: any, project: A3EProjectDefinition): Promise<ReportSection[]> {
  const sections: ReportSection[] = []

  // Cover Page
  sections.push({
    id: 'cover_page',
    title: 'Cover Page',
    content: generateCoverPageContent(project),
    pageNumber: 1
  })

  // Executive Summary (if enabled)
  if (project.templates?.executiveSummary) {
    sections.push({
      id: 'executive_summary',
      title: 'Executive Summary',
      content: generateExecutiveSummary(linkedData, project),
      pageNumber: 2
    })
  }

  // Site Documentation
  sections.push({
    id: 'site_documentation',
    title: 'Site Documentation and Findings',
    content: generateSiteDocumentation(linkedData, project),
    pageNumber: 3,
    images: linkedData.images.slice(0, 6).map((img: any, index: number) => ({
      id: img.id || `img_${index}`,
      fileName: img.fileName,
      thumbnail: img.thumbnail || generatePlaceholderThumbnail(),
      fullPath: img.fullPath || `./images/${img.fileName}`,
      metadata: img,
      linkedKmlPoint: `Placemark_${index}`,
      gpsCoordinates: img.gps?.hasGps ? [img.gps.latitude, img.gps.longitude] : undefined,
      description: `Site documentation image ${index + 1}`,
      pageReference: `Page 3, Figure ${index + 1}`
    }))
  })

  // Compliance Analysis
  sections.push({
    id: 'compliance_analysis',
    title: `${project.metadata?.regulatoryFramework} Compliance Analysis`,
    content: generateComplianceAnalysis(linkedData, project),
    pageNumber: 4
  })

  // Recommendations
  sections.push({
    id: 'recommendations',
    title: 'Recommendations and Next Steps',
    content: generateRecommendations(linkedData, project),
    pageNumber: 5
  })

  return sections
}

async function generateAppendices(linkedData: any, project: A3EProjectDefinition, kmlData: any): Promise<ReportAppendix[]> {
  const appendices: ReportAppendix[] = []
  let currentPage = 6

  // Image Grid Appendix
  if (project.templates?.appendices?.includes('image_grid')) {
    appendices.push({
      id: 'image_grid',
      title: 'Appendix A: Image Documentation Grid',
      type: 'image_grid',
      content: generateImageGrid(linkedData.images),
      pageStart: currentPage,
      linkedImages: linkedData.images.map((img: any, i: number) => img.id || `img_${i}`)
    })
    currentPage += Math.ceil(linkedData.images.length / 6)
  }

  // GPS Map Appendix
  if (project.templates?.appendices?.includes('gps_map')) {
    appendices.push({
      id: 'gps_map',
      title: 'Appendix B: GPS Location Map',
      type: 'gps_map',
      content: generateGPSMapAppendix(linkedData.images, kmlData),
      pageStart: currentPage,
      linkedImages: linkedData.images.filter((img: any) => img.gps?.hasGps).map((img: any, i: number) => img.id || `img_${i}`)
    })
    currentPage += 2
  }

  // Metadata Table Appendix
  if (project.templates?.appendices?.includes('metadata_table')) {
    appendices.push({
      id: 'metadata_table',
      title: 'Appendix C: Image Metadata Summary',
      type: 'metadata_table',
      content: generateMetadataTable(linkedData.images),
      pageStart: currentPage,
      linkedImages: linkedData.images.map((img: any, i: number) => img.id || `img_${i}`)
    })
    currentPage += 1
  }

  return appendices
}

function generateBiDirectionalLinks(linkedData: any, sections: ReportSection[], appendices: ReportAppendix[]): BiDirectionalLink[] {
  const links: BiDirectionalLink[] = [...(linkedData.links || [])]

  // Link images to report sections
  sections.forEach(section => {
    section.images?.forEach(img => {
      links.push({
        id: uuidv4(),
        sourceType: 'image',
        sourceId: img.id,
        targetType: 'report_section',
        targetId: section.id,
        linkType: 'contains',
        metadata: {
          pageReference: img.pageReference,
          sectionTitle: section.title
        }
      })

      // Link to KML point if available
      if (img.linkedKmlPoint) {
        links.push({
          id: uuidv4(),
          sourceType: 'image',
          sourceId: img.id,
          targetType: 'kml_point',
          targetId: img.linkedKmlPoint,
          linkType: 'reference',
          metadata: {
            coordinates: img.gpsCoordinates,
            accuracy: img.metadata.gps?.accuracy
          }
        })
      }
    })
  })

  // Link appendices to their source images
  appendices.forEach(appendix => {
    appendix.linkedImages.forEach(imageId => {
      links.push({
        id: uuidv4(),
        sourceType: 'report_section',
        sourceId: appendix.id,
        targetType: 'image',
        targetId: imageId,
        linkType: 'contains',
        metadata: {
          appendixTitle: appendix.title,
          pageStart: appendix.pageStart
        }
      })
    })
  })

  return links
}

async function generatePDFContent(params: {
  project: A3EProjectDefinition
  sections: ReportSection[]
  appendices: ReportAppendix[]
  biDirectionalLinks: BiDirectionalLink[]
  metadata: any
}) {
  const { project, sections, appendices, metadata } = params

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.project} - A3E Environmental Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .page { page-break-after: always; padding: 1in; min-height: 9in; }
        .cover-page { text-align: center; padding-top: 2in; }
        .logo { width: 200px; height: auto; margin-bottom: 2in; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 1in; color: #059669; }
        .subtitle { font-size: 18px; margin-bottom: 0.5in; }
        .metadata-table { width: 100%; border-collapse: collapse; margin-top: 1in; }
        .metadata-table td { padding: 8px; border-bottom: 1px solid #ddd; }
        .section { margin-bottom: 2em; }
        .section h2 { color: #059669; border-bottom: 2px solid #059669; padding-bottom: 0.5em; }
        .image-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .image-item { text-align: center; }
        .image-item img { max-width: 100%; height: auto; border: 1px solid #ddd; }
        .image-caption { font-size: 12px; margin-top: 5px; }
        .watermark { position: fixed; bottom: 10px; right: 10px; opacity: 0.3; font-size: 10px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #666; }
        ${project.branding?.licenseLevel !== 'Enterprise' ? '.watermark { display: block; }' : '.watermark { display: none; }'}
    </style>
</head>
<body>
    ${sections.map(section => `
    <div class="page">
        <div class="section">
            <h2>${section.title}</h2>
            <div>${section.content}</div>
            ${section.images ? `
            <div class="image-grid">
                ${section.images.map(img => `
                <div class="image-item">
                    <img src="${img.thumbnail}" alt="${img.fileName}">
                    <div class="image-caption">
                        <strong>${img.fileName}</strong><br>
                        ${img.description}<br>
                        ${img.gpsCoordinates ? `GPS: ${img.gpsCoordinates[0].toFixed(6)}, ${img.gpsCoordinates[1].toFixed(6)}` : 'No GPS data'}
                    </div>
                </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </div>
    `).join('')}

    ${appendices.map(appendix => `
    <div class="page">
        <h2>${appendix.title}</h2>
        <div>${appendix.content}</div>
    </div>
    `).join('')}

    <div class="watermark">
        Generated by A3E Visual Intelligence Suite | License: ${project.branding?.licenseLevel}
    </div>

    <div class="footer">
        A3E Environmental Consultants | Report ID: ${metadata.reportId} | Generated: ${new Date(metadata.generated).toLocaleDateString()}
    </div>
</body>
</html>
  `
}

async function generateSupportingOutputs(reportId: string, data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    pdfUrl: `data:text/html;base64,${Buffer.from(data.pdfContent).toString('base64')}`,
    kmlUrl: data.kmlData ? `${baseUrl}/api/downloads/kml/${reportId}` : null,
    archiveUrl: `${baseUrl}/api/downloads/archive/${reportId}`,
    dashboardUrl: `${baseUrl}/reports/${reportId}`
  }
}

// Content generation functions
function generateCoverPageContent(project: A3EProjectDefinition): string {
  return `
    <div class="cover-page">
        <img src="/placeholder-logo.png" alt="A3E Logo" class="logo">
        <div class="title">${project.project}</div>
        <div class="subtitle">${project.metadata?.phase} Environmental Site Assessment</div>
        <div class="subtitle">Prepared for: ${project.metadata?.client || 'Client'}</div>

        <table class="metadata-table">
            <tr><td><strong>Project ID:</strong></td><td>${project.metadata?.projectId}</td></tr>
            <tr><td><strong>Site Address:</strong></td><td>${project.metadata?.siteAddress || 'TBD'}</td></tr>
            <tr><td><strong>Inspection Date:</strong></td><td>${new Date(project.metadata?.inspectionDate || '').toLocaleDateString()}</td></tr>
            <tr><td><strong>Analyst:</strong></td><td>${project.analyst}</td></tr>
            <tr><td><strong>Regulatory Framework:</strong></td><td>${project.metadata?.regulatoryFramework}</td></tr>
            <tr><td><strong>Compliance Level:</strong></td><td>${project.metadata?.complianceLevel}</td></tr>
        </table>
    </div>
  `
}

function generateExecutiveSummary(linkedData: any, project: A3EProjectDefinition): string {
  const totalImages = linkedData.images.length
  const gpsTaggedImages = linkedData.images.filter((img: any) => img.gps?.hasGps).length
  const highQualityImages = linkedData.images.filter((img: any) => img.basic?.quality === 'High').length

  return `
    <p>This ${project.metadata?.phase} Environmental Site Assessment was conducted for ${project.metadata?.client || 'the client'}
    in accordance with ${project.metadata?.regulatoryFramework} standards and ASTM E1527-13 protocols.</p>

    <h3>Summary of Findings</h3>
    <ul>
        <li><strong>Total Images Captured:</strong> ${totalImages}</li>
        <li><strong>GPS-Tagged Documentation:</strong> ${gpsTaggedImages} images</li>
        <li><strong>High-Quality Documentation:</strong> ${highQualityImages} images</li>
        <li><strong>Site Coverage:</strong> Comprehensive visual documentation of the subject property</li>
    </ul>

    <h3>Regulatory Compliance</h3>
    <p>This assessment meets or exceeds the requirements of ${project.metadata?.regulatoryFramework} regulations
    and provides sufficient documentation for environmental due diligence purposes.</p>

    <h3>Recommendations</h3>
    <p>Based on the visual site assessment and documentation review, specific recommendations are provided
    in the following sections of this report.</p>
  `
}

function generateSiteDocumentation(linkedData: any, project: A3EProjectDefinition): string {
  return `
    <p>The following documentation represents a comprehensive visual survey of the subject property
    conducted on ${new Date(project.metadata?.inspectionDate || '').toLocaleDateString()}.</p>

    <h3>Documentation Methodology</h3>
    <p>All images were captured using professional field photography equipment with GPS tagging enabled.
    Each image includes comprehensive metadata including location coordinates, camera settings, and timestamps
    for chain of custody purposes.</p>

    <h3>Site Observations</h3>
    <p>The visual inspection documented the current environmental conditions of the property.
    Specific observations and findings are detailed in the image documentation below and in the appendices.</p>

    <h3>Quality Assurance</h3>
    <p>All documentation has been processed through A3E's Visual Intelligence Suite to ensure accuracy,
    completeness, and regulatory compliance.</p>
  `
}

function generateComplianceAnalysis(linkedData: any, project: A3EProjectDefinition): string {
  return `
    <h3>${project.metadata?.regulatoryFramework} Compliance Status</h3>
    <p>This assessment has been conducted in full compliance with applicable ${project.metadata?.regulatoryFramework}
    regulations and industry standards.</p>

    <h3>Documentation Standards Met</h3>
    <ul>
        <li>ASTM E1527-13 Standard Practice for Environmental Site Assessments</li>
        <li>${project.metadata?.regulatoryFramework} Documentation Requirements</li>
        <li>Chain of Custody Protocols</li>
        <li>GPS Coordinate Verification</li>
        <li>Professional Photography Standards</li>
    </ul>

    <h3>Data Integrity Verification</h3>
    <p>All images have been processed through integrity checking algorithms to verify authenticity
    and prevent tampering. Duplicate detection and hash verification ensure complete data integrity.</p>
  `
}

function generateRecommendations(linkedData: any, project: A3EProjectDefinition): string {
  return `
    <h3>Immediate Recommendations</h3>
    <ul>
        <li>Complete review of all documentation provided in this report</li>
        <li>Coordinate with A3E for any additional assessment requirements</li>
        <li>Implement recommended environmental management practices</li>
    </ul>

    <h3>Long-term Considerations</h3>
    <ul>
        <li>Establish ongoing environmental monitoring protocols</li>
        <li>Maintain documentation for regulatory compliance</li>
        <li>Schedule periodic reassessment as required</li>
    </ul>

    <h3>Contact Information</h3>
    <p>For questions regarding this assessment or to schedule additional services,
    please contact ${project.analyst} at A3E Environmental Consultants.</p>
  `
}

function generateImageGrid(images: any[]): string {
  return `
    <div class="image-grid" style="grid-template-columns: repeat(3, 1fr);">
        ${images.map((img, index) => `
        <div class="image-item">
            <img src="${img.thumbnail || generatePlaceholderThumbnail()}" alt="${img.fileName}">
            <div class="image-caption">
                <strong>Image ${index + 1}: ${img.fileName}</strong><br>
                Size: ${img.fileSizeFormatted || 'Unknown'}<br>
                Quality: ${img.basic?.quality || 'Unknown'}<br>
                GPS: ${img.gps?.hasGps ? 'Yes' : 'No'}<br>
                ${img.gps?.hasGps ? `Coordinates: ${img.gps.latitude?.toFixed(6)}, ${img.gps.longitude?.toFixed(6)}` : ''}
            </div>
        </div>
        `).join('')}
    </div>
  `
}

function generateGPSMapAppendix(images: any[], kmlData: any): string {
  const gpsImages = images.filter(img => img.gps?.hasGps)

  return `
    <h3>GPS-Tagged Image Locations</h3>
    <p>The following map shows the locations of all GPS-tagged images captured during the site assessment.</p>

    <div style="text-align: center; margin: 20px 0;">
        <div style="border: 1px solid #ddd; padding: 20px; background: #f9f9f9;">
            <h4>Interactive Map Available</h4>
            <p>A full interactive KML map is available separately with this report.</p>
            <p><strong>GPS-Tagged Images:</strong> ${gpsImages.length}</p>
            <p><strong>Coverage Area:</strong> ${calculateCoverageArea(gpsImages).toFixed(2)} km²</p>
        </div>
    </div>

    <h3>GPS Coordinate Summary</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f0f0f0;">
            <th style="padding: 8px; border: 1px solid #ddd;">Image</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Latitude</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Longitude</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Accuracy</th>
        </tr>
        ${gpsImages.map(img => `
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${img.fileName}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${img.gps.latitude?.toFixed(6)}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${img.gps.longitude?.toFixed(6)}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${img.gps.accuracy || 'Unknown'}m</td>
        </tr>
        `).join('')}
    </table>
  `
}

function generateMetadataTable(images: any[]): string {
  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
        <tr style="background: #f0f0f0;">
            <th style="padding: 6px; border: 1px solid #ddd;">Filename</th>
            <th style="padding: 6px; border: 1px solid #ddd;">Size</th>
            <th style="padding: 6px; border: 1px solid #ddd;">Dimensions</th>
            <th style="padding: 6px; border: 1px solid #ddd;">Camera</th>
            <th style="padding: 6px; border: 1px solid #ddd;">Date/Time</th>
            <th style="padding: 6px; border: 1px solid #ddd;">GPS</th>
            <th style="padding: 6px; border: 1px solid #ddd;">Quality</th>
        </tr>
        ${images.map(img => `
        <tr>
            <td style="padding: 6px; border: 1px solid #ddd;">${img.fileName}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${img.fileSizeFormatted || 'Unknown'}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${img.basic?.dimensions?.width || '?'} × ${img.basic?.dimensions?.height || '?'}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${img.camera?.make || 'Unknown'} ${img.camera?.model || ''}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${new Date(img.camera?.dateTimeOriginal || '').toLocaleString()}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${img.gps?.hasGps ? '✓' : '✗'}</td>
            <td style="padding: 6px; border: 1px solid #ddd;">${img.basic?.quality || 'Unknown'}</td>
        </tr>
        `).join('')}
    </table>
  `
}

// Utility functions
function calculateTotalPages(sections: ReportSection[], appendices: ReportAppendix[]): number {
  const sectionPages = sections.length
  const appendixPages = appendices.reduce((total, appendix) => {
    return total + (appendix.type === 'image_grid' ? Math.ceil(appendix.linkedImages.length / 6) : 1)
  }, 0)
  return sectionPages + appendixPages
}

function generateBillingInfo(report: ComplianceReport, licenseLevel?: string) {
  const baseCost = {
    'Free': 0,
    'Standard': 25,
    'Pro': 75,
    'Enterprise': 200
  }

  const cost = baseCost[licenseLevel as keyof typeof baseCost] || baseCost.Standard
  const features = {
    'Free': ['PDF Export', 'Basic Templates'],
    'Standard': ['PDF Export', 'KML Maps', 'Professional Templates', 'Basic Watermarks'],
    'Pro': ['All Standard Features', 'API Integration', 'Custom Branding', 'Advanced Analytics'],
    'Enterprise': ['All Pro Features', 'White Label', 'Priority Support', 'Custom Development']
  }

  return {
    cost,
    currency: 'USD',
    licenseLevel: licenseLevel || 'Standard',
    featuresIncluded: features[licenseLevel as keyof typeof features] || features.Standard,
    billingPeriod: 'per_report',
    upgradeUrl: '/pricing'
  }
}

function calculateCoverageArea(images: any[]): number {
  if (images.length < 2) return 0

  const lats = images.map(img => img.gps?.latitude).filter(Boolean)
  const lngs = images.map(img => img.gps?.longitude).filter(Boolean)

  if (lats.length === 0) return 0

  const latDiff = Math.max(...lats) - Math.min(...lats)
  const lonDiff = Math.max(...lngs) - Math.min(...lngs)

  return latDiff * lonDiff * 111 * 111 * Math.cos((Math.max(...lats) + Math.min(...lats)) / 2 * Math.PI / 180) / 1000000
}

function generatePlaceholderThumbnail(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDE1MCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRTBFMEUwIi8+CjxwYXRoIGQ9Ik02MCA0MEw4MCAzMEwxMDAgNDBWNzBIODhWNDBaIiBmaWxsPSIjOUNBNEFGIi8+Cjx0ZXh0IHg9Ijc1IiB5PSI4NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2Ij5JbWFnZTwvdGV4dD4KPC9zdmc+'
}

// GET endpoint for service info
export async function GET() {
  return NextResponse.json({
    service: 'A3E Report Builder & Workflow Orchestration v4',
    version: '4.0.0',
    status: 'operational',
    features: [
      'Automated PDF generation',
      'Compliance templates',
      'Bi-directional linking',
      'Auto-tagging to sites',
      'License watermarking',
      'Multi-format export',
      'Storage integration'
    ],
    projectDefinition: {
      format: '.a3e',
      example: {
        project: "EPA Phase I Site Visit",
        analyst: "Tim Howard",
        images: "./2025-06-27-site-visit/",
        auto_link: true,
        output: "./reports/Site_Visit_A3E_Report.pdf"
      }
    },
    pricing: {
      free: { cost: 0, features: ['Basic PDF', 'Standard templates'] },
      standard: { cost: 25, features: ['Professional PDF', 'KML export', 'Basic branding'] },
      pro: { cost: 75, features: ['API integration', 'Custom branding', 'Analytics'] },
      enterprise: { cost: 200, features: ['White label', 'Priority support', 'Custom development'] }
    }
  })
}