"use client"

import { v4 as uuidv4 } from 'uuid'
import type { Agent, AgentResult } from "./iris-agents"

// Layer 6: AI Scene Recognition + Risk Classification
export interface AISceneAnalysis {
  id: string
  imageId: string
  fileName: string
  analysis: {
    objects: DetectedObject[]
    sceneClassification: SceneClassification
    riskAssessment: RiskAssessment
    environmentalFindings: EnvironmentalFinding[]
    recommendations: string[]
  }
  metadata: {
    modelVersion: string
    confidence: number
    processingTime: number
    timestamp: string
    analyst?: string
  }
  auditTrail: AuditEntry[]
}

export interface DetectedObject {
  id: string
  label: string
  confidence: number
  boundingBox: BoundingBox
  category: 'hazard' | 'equipment' | 'vegetation' | 'structure' | 'signage' | 'contamination'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface SceneClassification {
  primaryType: string
  secondaryTypes: string[]
  confidence: number
  environmentalContext: EnvironmentalContext
}

export interface EnvironmentalContext {
  siteType: 'industrial' | 'commercial' | 'residential' | 'undeveloped' | 'mixed'
  contamination: 'suspected' | 'visible' | 'none' | 'unknown'
  vegetation: 'healthy' | 'stressed' | 'dead' | 'overgrown'
  waterFeatures: 'present' | 'absent' | 'impacted'
  infrastructure: 'active' | 'abandoned' | 'deteriorating' | 'new'
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  riskFactors: RiskFactor[]
  phaseIIRecommended: boolean
  urgencyLevel: number // 0-1 scale
  regulatoryFlags: string[]
}

export interface RiskFactor {
  factor: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  regulatoryRelevance: string[]
}

export interface EnvironmentalFinding {
  id: string
  type: 'contamination' | 'hazard' | 'compliance' | 'structural' | 'vegetation'
  finding: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  evidence: string[]
  recommendations: string[]
}

export interface AuditEntry {
  id: string
  action: string
  user: string
  timestamp: string
  details: Record<string, any>
  hash: string
}

// Layer 8: Evidence Chain Management
export interface EvidenceChain {
  image: string
  hash: string
  analyst: string
  ai_inference: {
    objects: string[]
    risk: string
    confidence: number
  }
  chain_linked_report?: string
  signature: string
  timestamp: string
  provenance: ProvenanceRecord[]
}

export interface ProvenanceRecord {
  action: string
  actor: string
  timestamp: string
  hash_before: string
  hash_after: string
}

// AI Scene Recognition Agent
export class AISceneRecognitionAgent implements Agent {
  name = "AISceneRecognitionAgent"
  purpose = "Advanced computer vision for environmental hazard detection, scene classification, and risk assessment"

  private modelConfigs = {
    yolov8n: {
      modelPath: '/models/yolov8n-environmental.onnx',
      threshold: 0.65,
      classes: [
        'oil_drum', 'chemical_tank', 'asbestos_tile', 'runoff_path', 'powerline',
        'construction_debris', 'vegetation_stress', 'surface_staining',
        'monitoring_well', 'containment_barrier', 'warning_sign'
      ]
    },
    mobilesam: {
      modelPath: '/models/mobilesam-environmental.onnx',
      threshold: 0.7
    }
  }

  async execute(params: {
    images: File[]
    analysisOptions?: {
      threshold?: number
      includeRisk?: boolean
      generateRecommendations?: boolean
      analystId?: string
    }
  }): Promise<AgentResult> {
    try {
      const { images, analysisOptions = {} } = params
      const {
        threshold = 0.65,
        includeRisk = true,
        generateRecommendations = true,
        analystId = 'system'
      } = analysisOptions

      const analyses: AISceneAnalysis[] = []

      for (const image of images) {
        const analysis = await this.analyzeImage(
          image,
          threshold,
          { includeRisk, generateRecommendations, analystId }
        )
        analyses.push(analysis)
      }

      const summary = this.generateAnalysisSummary(analyses)

      return {
        success: true,
        summary: `Processed ${analyses.length} images with AI scene recognition`,
        data: {
          analyses,
          summary,
          modelVersion: 'YOLOv8n-Environmental-v1.2',
          totalProcessingTime: analyses.reduce((sum, a) => sum + a.metadata.processingTime, 0)
        }
      }
    } catch (error) {
      return {
        success: false,
        summary: `AI scene recognition failed: ${error}`,
        data: { error: String(error) }
      }
    }
  }

  private async analyzeImage(
    image: File,
    threshold: number,
    options: any
  ): Promise<AISceneAnalysis> {
    const startTime = Date.now()
    const analysisId = uuidv4()

    // Simulate AI processing (in production, integrate with actual ML models)
    const objects = await this.detectObjects(image, threshold)
    const scene = await this.classifyScene(image, objects)
    const risk = options.includeRisk ? await this.assessRisk(objects, scene) : null
    const findings = await this.generateEnvironmentalFindings(objects, scene)
    const recommendations = options.generateRecommendations ?
      await this.generateRecommendations(risk!, findings) : []

    const processingTime = Date.now() - startTime
    const confidence = this.calculateOverallConfidence(objects, scene)

    return {
      id: analysisId,
      imageId: uuidv4(),
      fileName: image.name,
      analysis: {
        objects,
        sceneClassification: scene,
        riskAssessment: risk!,
        environmentalFindings: findings,
        recommendations
      },
      metadata: {
        modelVersion: 'YOLOv8n-Environmental-v1.2',
        confidence,
        processingTime,
        timestamp: new Date().toISOString(),
        analyst: options.analystId
      },
      auditTrail: [{
        id: uuidv4(),
        action: 'ai_analysis_completed',
        user: options.analystId || 'system',
        timestamp: new Date().toISOString(),
        details: { confidence, processingTime, objectCount: objects.length },
        hash: await this.generateHash(`${analysisId}_${Date.now()}`)
      }]
    }
  }

  private async detectObjects(image: File, threshold: number): Promise<DetectedObject[]> {
    // Simulate YOLOv8n object detection
    const mockDetections = [
      {
        label: 'oil_drum',
        confidence: 0.89,
        boundingBox: { x: 150, y: 100, width: 80, height: 120 },
        category: 'hazard' as const,
        riskLevel: 'high' as const,
        description: 'Rusty oil drum with potential leak indicators'
      },
      {
        label: 'surface_staining',
        confidence: 0.76,
        boundingBox: { x: 200, y: 250, width: 120, height: 60 },
        category: 'contamination' as const,
        riskLevel: 'medium' as const,
        description: 'Dark surface staining suggesting possible chemical spillage'
      },
      {
        label: 'monitoring_well',
        confidence: 0.94,
        boundingBox: { x: 50, y: 300, width: 40, height: 40 },
        category: 'equipment' as const,
        riskLevel: 'low' as const,
        description: 'Environmental monitoring well with protective casing'
      }
    ].filter(obj => obj.confidence >= threshold)

    return mockDetections.map(obj => ({
      id: uuidv4(),
      ...obj
    }))
  }

  private async classifyScene(image: File, objects: DetectedObject[]): Promise<SceneClassification> {
    // Simulate scene classification based on detected objects
    const hasHazards = objects.some(obj => obj.category === 'hazard')
    const hasContamination = objects.some(obj => obj.category === 'contamination')
    const hasEquipment = objects.some(obj => obj.category === 'equipment')

    let primaryType = 'undeveloped_site'
    const secondaryTypes: string[] = []

    if (hasHazards || hasContamination) {
      primaryType = 'industrial_storage_area'
      secondaryTypes.push('potential_contamination_source')
    }

    if (hasEquipment) {
      secondaryTypes.push('monitored_environment')
    }

    return {
      primaryType,
      secondaryTypes,
      confidence: 0.85,
      environmentalContext: {
        siteType: hasHazards ? 'industrial' : 'undeveloped',
        contamination: hasContamination ? 'suspected' : 'unknown',
        vegetation: 'unknown',
        waterFeatures: 'absent',
        infrastructure: hasEquipment ? 'active' : 'abandoned'
      }
    }
  }

  private async assessRisk(objects: DetectedObject[], scene: SceneClassification): Promise<RiskAssessment> {
    const riskFactors: RiskFactor[] = []
    let overallRiskScore = 0
    let phaseIIRecommended = false

    // Analyze risk based on detected objects
    objects.forEach(obj => {
      if (obj.category === 'hazard' && obj.riskLevel === 'high') {
        riskFactors.push({
          factor: `High-risk hazard detected: ${obj.label}`,
          severity: 'high',
          description: obj.description,
          regulatoryRelevance: ['EPA RCRA', 'DOT Hazmat']
        })
        overallRiskScore += 0.3
        phaseIIRecommended = true
      }

      if (obj.category === 'contamination') {
        riskFactors.push({
          factor: `Contamination indicators: ${obj.label}`,
          severity: obj.riskLevel,
          description: obj.description,
          regulatoryRelevance: ['EPA Clean Water Act', 'State Environmental']
        })
        overallRiskScore += 0.2
      }
    })

    // Determine overall risk level
    let overallRisk: 'low' | 'medium' | 'high' | 'critical'
    if (overallRiskScore >= 0.7) overallRisk = 'critical'
    else if (overallRiskScore >= 0.5) overallRisk = 'high'
    else if (overallRiskScore >= 0.3) overallRisk = 'medium'
    else overallRisk = 'low'

    const regulatoryFlags = riskFactors.flatMap(rf => rf.regulatoryRelevance)

    return {
      overallRisk,
      riskFactors,
      phaseIIRecommended,
      urgencyLevel: Math.min(overallRiskScore, 1.0),
      regulatoryFlags: [...new Set(regulatoryFlags)]
    }
  }

  private async generateEnvironmentalFindings(
    objects: DetectedObject[],
    scene: SceneClassification
  ): Promise<EnvironmentalFinding[]> {
    const findings: EnvironmentalFinding[] = []

    objects.forEach((obj, index) => {
      if (obj.category === 'hazard' || obj.category === 'contamination') {
        findings.push({
          id: uuidv4(),
          type: obj.category === 'hazard' ? 'hazard' : 'contamination',
          finding: `${obj.label} detected with ${(obj.confidence * 100).toFixed(0)}% confidence`,
          severity: obj.riskLevel,
          location: `Approximate coordinates: ${obj.boundingBox.x}, ${obj.boundingBox.y}`,
          evidence: [obj.description],
          recommendations: this.getObjectRecommendations(obj)
        })
      }
    })

    // Add scene-level findings
    if (scene.environmentalContext.contamination === 'suspected') {
      findings.push({
        id: uuidv4(),
        type: 'compliance',
        finding: 'Site classification indicates potential environmental concerns',
        severity: 'medium',
        location: 'Site-wide assessment',
        evidence: [`Scene type: ${scene.primaryType}`, ...scene.secondaryTypes],
        recommendations: [
          'Conduct comprehensive Phase II Environmental Site Assessment',
          'Implement immediate containment measures if necessary',
          'Document all findings with GPS coordinates'
        ]
      })
    }

    return findings
  }

  private async generateRecommendations(
    risk: RiskAssessment,
    findings: EnvironmentalFinding[]
  ): Promise<string[]> {
    const recommendations: string[] = []

    if (risk.phaseIIRecommended) {
      recommendations.push('Phase II Environmental Site Assessment recommended')
      recommendations.push('Soil and groundwater sampling required in identified areas')
    }

    if (risk.overallRisk === 'critical' || risk.overallRisk === 'high') {
      recommendations.push('Immediate site security and access control measures')
      recommendations.push('Notify relevant regulatory authorities within 24 hours')
      recommendations.push('Implement emergency response procedures')
    }

    if (risk.regulatoryFlags.length > 0) {
      recommendations.push(`Compliance review required for: ${risk.regulatoryFlags.join(', ')}`)
    }

    // Add findings-specific recommendations
    findings.forEach(finding => {
      if (finding.severity === 'high' || finding.severity === 'critical') {
        recommendations.push(...finding.recommendations)
      }
    })

    return [...new Set(recommendations)] // Remove duplicates
  }

  private getObjectRecommendations(obj: DetectedObject): string[] {
    const recommendations: Record<string, string[]> = {
      oil_drum: [
        'Inspect for leaks or structural damage',
        'Verify proper secondary containment',
        'Sample surrounding soil for hydrocarbon contamination'
      ],
      chemical_tank: [
        'Verify tank integrity and labeling',
        'Check spill prevention systems',
        'Review material safety data sheets'
      ],
      surface_staining: [
        'Collect representative soil samples',
        'Document stain characteristics and extent',
        'Investigate potential source of contamination'
      ],
      runoff_path: [
        'Trace runoff pathway and discharge points',
        'Sample sediments and receiving waters',
        'Implement erosion control measures'
      ]
    }

    return recommendations[obj.label] || [
      'Document location and characteristics',
      'Assess potential environmental impact',
      'Determine appropriate regulatory requirements'
    ]
  }

  private calculateOverallConfidence(objects: DetectedObject[], scene: SceneClassification): number {
    if (objects.length === 0) return 0.5

    const avgObjectConfidence = objects.reduce((sum, obj) => sum + obj.confidence, 0) / objects.length
    const sceneConfidence = scene.confidence

    return (avgObjectConfidence * 0.7) + (sceneConfidence * 0.3)
  }

  private generateAnalysisSummary(analyses: AISceneAnalysis[]) {
    const totalObjects = analyses.reduce((sum, a) => sum + a.analysis.objects.length, 0)
    const highRiskAnalyses = analyses.filter(a =>
      a.analysis.riskAssessment.overallRisk === 'high' ||
      a.analysis.riskAssessment.overallRisk === 'critical'
    )
    const phaseIIRecommended = analyses.filter(a => a.analysis.riskAssessment.phaseIIRecommended)

    return {
      totalImages: analyses.length,
      totalObjects,
      averageConfidence: analyses.reduce((sum, a) => sum + a.metadata.confidence, 0) / analyses.length,
      highRiskCount: highRiskAnalyses.length,
      phaseIIRecommendedCount: phaseIIRecommended.length,
      commonFindings: this.getCommonFindings(analyses)
    }
  }

  private getCommonFindings(analyses: AISceneAnalysis[]): string[] {
    const findingCounts = new Map<string, number>()

    analyses.forEach(analysis => {
      analysis.analysis.objects.forEach(obj => {
        findingCounts.set(obj.label, (findingCounts.get(obj.label) || 0) + 1)
      })
    })

    return Array.from(findingCounts.entries())
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([finding]) => finding)
  }

  private async generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}

// Layer 8: Evidence Chain Manager
export class EvidenceChainManager {
  static async createEvidenceChain(
    analysis: AISceneAnalysis,
    imageFile: File,
    analyst: string
  ): Promise<EvidenceChain> {
    const imageHash = await this.calculateHash(imageFile)
    const timestamp = new Date().toISOString()
    const signature = await this.generateSignature(imageHash, analyst, timestamp)

    return {
      image: imageFile.name,
      hash: imageHash,
      analyst,
      ai_inference: {
        objects: analysis.analysis.objects.map(obj => obj.label),
        risk: analysis.analysis.riskAssessment.overallRisk,
        confidence: analysis.metadata.confidence
      },
      signature,
      timestamp,
      provenance: [{
        action: 'initial_analysis',
        actor: analyst,
        timestamp,
        hash_before: '',
        hash_after: imageHash
      }]
    }
  }

  private static async calculateHash(file: File | Blob): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  private static async generateSignature(hash: string, analyst: string, timestamp: string): Promise<string> {
    // Simple signature generation (in production, use proper digital signatures)
    const signatureData = `${hash}_${analyst}_${timestamp}`
    return await this.calculateHash(new Blob([signatureData]))
  }

  static async updateEvidenceChain(
    chain: EvidenceChain,
    action: string,
    actor: string,
    newData?: any
  ): Promise<EvidenceChain> {
    const timestamp = new Date().toISOString()
    const hashBefore = chain.hash

    // Update chain data if provided
    if (newData) {
      Object.assign(chain, newData)
    }

    // Recalculate hash
    const newHash = await this.calculateHash(new Blob([JSON.stringify(chain)]))

    // Add provenance record
    chain.provenance.push({
      action,
      actor,
      timestamp,
      hash_before: hashBefore,
      hash_after: newHash
    })

    chain.hash = newHash
    chain.signature = await this.generateSignature(newHash, actor, timestamp)

    return chain
  }

  static async generateChain(params: {
    imageHash: string
    fileName: string
    analystId: string
    aiAnalysis: AISceneAnalysis
    projectId?: string
  }): Promise<EvidenceChain> {
    const { imageHash, fileName, analystId, aiAnalysis, projectId } = params
    const timestamp = new Date().toISOString()
    const signature = await this.generateSignature(imageHash, analystId, timestamp)

    return {
      image: fileName,
      hash: imageHash,
      analyst: analystId,
      ai_inference: {
        objects: aiAnalysis.analysis.objects.map(obj => obj.label),
        risk: aiAnalysis.analysis.riskAssessment.overallRisk,
        confidence: aiAnalysis.metadata.confidence
      },
      chain_linked_report: projectId ? `${projectId}-Phase1.pdf` : undefined,
      signature,
      timestamp,
      provenance: [{
        action: 'evidence_chain_created',
        actor: analystId,
        timestamp,
        hash_before: '',
        hash_after: imageHash
      }]
    }
  }
}

// Export AI Scene Intelligence orchestrator
export const aiSceneIntelligence = {
  AISceneRecognitionAgent: new AISceneRecognitionAgent(),
  EvidenceChainManager
}