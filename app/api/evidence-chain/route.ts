import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Layer 8: Evidence Chain with Legal & Regulatory Readiness
interface EvidenceChainRequest {
  imageData: {
    fileName: string
    base64: string
    metadata: any
  }
  analystId: string
  projectId: string
  reportId?: string
  chainedImages?: string[]
}

interface EvidenceChainEntry {
  id: string
  imageFileName: string
  sha256Hash: string
  analystId: string
  projectId: string
  timestamp: string
  digitalSignature: string
  aiInference: {
    objects: Array<{
      label: string
      confidence: number
      category: string
    }>
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    recommendations: string[]
  }
  metadata: {
    exifData: any
    gpsCoordinates?: { lat: number; lng: number }
    cameraInfo?: string
    captureTime?: string
  }
  auditTrail: Array<{
    action: string
    timestamp: string
    userId: string
    details: string
  }>
  legalCompliance: {
    evidenceGrade: 'A' | 'B' | 'C'
    tamperResistance: boolean
    chainOfCustody: boolean
    regulatoryStandard: string
  }
  linkedReports: string[]
}

interface BlockchainHash {
  transactionId: string
  blockHash: string
  timestamp: string
  networkId: string
}

export async function POST(request: NextRequest) {
  try {
    const body: EvidenceChainRequest = await request.json()

    // Validate required fields
    if (!body.imageData?.fileName || !body.imageData?.base64 || !body.analystId || !body.projectId) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, base64, analystId, projectId' },
        { status: 400 }
      )
    }

    // Generate SHA256 hash of image data
    const imageBuffer = Buffer.from(body.imageData.base64, 'base64')
    const sha256Hash = crypto.createHash('sha256').update(imageBuffer).digest('hex')

    // Generate digital signature (simplified - in production use proper PKI)
    const signatureData = {
      fileName: body.imageData.fileName,
      hash: sha256Hash,
      analystId: body.analystId,
      timestamp: new Date().toISOString()
    }
    const digitalSignature = crypto
      .createHmac('sha256', process.env.EVIDENCE_CHAIN_SECRET || 'fallback-secret')
      .update(JSON.stringify(signatureData))
      .digest('hex')

    // Simulate AI inference (in production, call actual AI models)
    const aiInference = await generateAIInference(body.imageData.fileName, imageBuffer)

    // Determine evidence grade based on data completeness and AI confidence
    const evidenceGrade = determineEvidenceGrade(body.imageData.metadata, aiInference)

    // Create evidence chain entry
    const evidenceEntry: EvidenceChainEntry = {
      id: `evidence_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      imageFileName: body.imageData.fileName,
      sha256Hash,
      analystId: body.analystId,
      projectId: body.projectId,
      timestamp: new Date().toISOString(),
      digitalSignature,
      aiInference,
      metadata: {
        exifData: body.imageData.metadata,
        gpsCoordinates: extractGPSCoordinates(body.imageData.metadata),
        cameraInfo: extractCameraInfo(body.imageData.metadata),
        captureTime: extractCaptureTime(body.imageData.metadata)
      },
      auditTrail: [
        {
          action: 'EVIDENCE_CREATED',
          timestamp: new Date().toISOString(),
          userId: body.analystId,
          details: `Evidence chain entry created for ${body.imageData.fileName}`
        }
      ],
      legalCompliance: {
        evidenceGrade,
        tamperResistance: true,
        chainOfCustody: true,
        regulatoryStandard: 'ASTM E1527-21'
      },
      linkedReports: body.reportId ? [body.reportId] : []
    }

    // Optional: Generate blockchain hash for tamper-resistance
    let blockchainHash: BlockchainHash | null = null
    if (process.env.ENABLE_BLOCKCHAIN === 'true') {
      blockchainHash = await generateBlockchainHash(evidenceEntry)
    }

    // Store evidence chain entry (in production, save to database)
    const chainFile = generateChainFile(evidenceEntry, blockchainHash)

    // Generate evidence receipt
    const receipt = {
      evidenceId: evidenceEntry.id,
      uploadTimestamp: evidenceEntry.timestamp,
      analystId: body.analystId,
      projectId: body.projectId,
      sha256Hash,
      digitalSignature,
      evidenceGrade,
      blockchainHash,
      verificationUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/api/evidence-chain/verify/${evidenceEntry.id}`
    }

    return NextResponse.json({
      success: true,
      evidence: evidenceEntry,
      receipt,
      chainFile,
      message: `Evidence chain created for ${body.imageData.fileName}`
    })

  } catch (error) {
    console.error('Evidence chain creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create evidence chain', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')
  const analystId = searchParams.get('analystId')

  if (!projectId) {
    return NextResponse.json(
      { error: 'Project ID is required' },
      { status: 400 }
    )
  }

  try {
    // Mock evidence chain data (in production, fetch from database)
    const mockEvidenceChain = [
      {
        id: 'evidence_1234567890_abc123',
        imageFileName: 'site_inspection_001.jpg',
        sha256Hash: '6c8ff2c4e1b8a2d3f5e9b1c7a4f6d8e2b5c9f1a3d6e8b2c5f9e1a4d7b3c6f0e9',
        analystId: analystId || 'jane.doe@a3e',
        projectId,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        digitalSignature: 'a1b2c3d4e5f6789012345678901234567890abcdef',
        aiInference: {
          objects: [
            { label: 'oil_drum', confidence: 0.89, category: 'hazard' },
            { label: 'surface_staining', confidence: 0.76, category: 'contamination' }
          ],
          riskLevel: 'high' as const,
          recommendations: [
            'Phase II Environmental Site Assessment recommended',
            'Immediate containment measures required'
          ]
        },
        metadata: {
          gpsCoordinates: { lat: 41.8781, lng: -87.6298 },
          cameraInfo: 'iPhone 14 Pro',
          captureTime: new Date(Date.now() - 86400000).toISOString()
        },
        legalCompliance: {
          evidenceGrade: 'A' as const,
          tamperResistance: true,
          chainOfCustody: true,
          regulatoryStandard: 'ASTM E1527-21'
        },
        linkedReports: ['report_123']
      }
    ]

    return NextResponse.json({
      success: true,
      evidenceChain: mockEvidenceChain,
      totalEntries: mockEvidenceChain.length,
      summary: {
        highRiskImages: mockEvidenceChain.filter(e => e.aiInference.riskLevel === 'high').length,
        evidenceGradeA: mockEvidenceChain.filter(e => e.legalCompliance.evidenceGrade === 'A').length,
        tamperResistant: mockEvidenceChain.filter(e => e.legalCompliance.tamperResistance).length
      }
    })

  } catch (error) {
    console.error('Evidence chain retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve evidence chain' },
      { status: 500 }
    )
  }
}

// Helper functions
async function generateAIInference(fileName: string, imageBuffer: Buffer) {
  // Simulate AI analysis (replace with actual AI service calls)
  const mockObjects = [
    { label: 'oil_drum', confidence: 0.89, category: 'hazard' },
    { label: 'concrete_surface', confidence: 0.95, category: 'structure' }
  ]

  const hasHazards = mockObjects.some(obj => obj.category === 'hazard' && obj.confidence > 0.8)
  const riskLevel = hasHazards ? 'high' : 'medium'

  return {
    objects: mockObjects,
    riskLevel: riskLevel as 'low' | 'medium' | 'high' | 'critical',
    recommendations: hasHazards
      ? ['Phase II Environmental Site Assessment recommended', 'Soil sampling required']
      : ['Continue monitoring', 'Document in Phase I report']
  }
}

function determineEvidenceGrade(metadata: any, aiInference: any): 'A' | 'B' | 'C' {
  let score = 0

  // GPS data present
  if (metadata?.GPS?.GPSLatitude && metadata?.GPS?.GPSLongitude) score += 30

  // Timestamp verification
  if (metadata?.DateTime || metadata?.DateTimeOriginal) score += 20

  // Camera/device info
  if (metadata?.Make && metadata?.Model) score += 15

  // AI confidence
  if (aiInference.objects.some((obj: any) => obj.confidence > 0.8)) score += 25

  // Image quality indicators
  if (metadata?.ImageWidth && metadata?.ImageHeight) score += 10

  if (score >= 80) return 'A'
  if (score >= 60) return 'B'
  return 'C'
}

function extractGPSCoordinates(metadata: any): { lat: number; lng: number } | undefined {
  if (metadata?.GPS?.GPSLatitude && metadata?.GPS?.GPSLongitude) {
    return {
      lat: parseFloat(metadata.GPS.GPSLatitude),
      lng: parseFloat(metadata.GPS.GPSLongitude)
    }
  }
  return undefined
}

function extractCameraInfo(metadata: any): string | undefined {
  if (metadata?.Make && metadata?.Model) {
    return `${metadata.Make} ${metadata.Model}`
  }
  return undefined
}

function extractCaptureTime(metadata: any): string | undefined {
  return metadata?.DateTime || metadata?.DateTimeOriginal || undefined
}

function generateChainFile(evidence: EvidenceChainEntry, blockchainHash: BlockchainHash | null) {
  const chainFile = {
    version: "1.0",
    standard: "A3E-EvidenceChain-v1",
    evidence: {
      id: evidence.id,
      imageFileName: evidence.imageFileName,
      sha256Hash: evidence.sha256Hash,
      digitalSignature: evidence.digitalSignature,
      timestamp: evidence.timestamp,
      analystId: evidence.analystId,
      projectId: evidence.projectId
    },
    aiInference: evidence.aiInference,
    legalCompliance: evidence.legalCompliance,
    blockchain: blockchainHash,
    verification: {
      steps: [
        "1. Verify SHA256 hash matches image data",
        "2. Validate digital signature using A3E public key",
        "3. Check timestamp chronology",
        "4. Confirm analyst credentials",
        "5. Validate AI inference data"
      ],
      instructions: "Use A3E Evidence Verification Tool or API endpoint for validation"
    }
  }

  return chainFile
}

async function generateBlockchainHash(evidence: EvidenceChainEntry): Promise<BlockchainHash> {
  // Simulate blockchain transaction (in production, use actual blockchain service)
  const mockTransaction = {
    transactionId: `tx_${crypto.randomBytes(16).toString('hex')}`,
    blockHash: `block_${crypto.randomBytes(32).toString('hex')}`,
    timestamp: new Date().toISOString(),
    networkId: 'A3E-Evidence-Network'
  }

  return mockTransaction
}