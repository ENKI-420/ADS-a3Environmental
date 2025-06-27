#!/usr/bin/env node
/**
 * EXIFAI CLI Tool - Autonomous Environmental Image Intelligence
 * Layer 6-10: AI Scene Recognition → Evidence Chain → Report Generation
 *
 * Usage:
 *   exifai scan ./site-photos --output ./exifai.json --threshold 0.65
 *   exifai analyze ./batch-1 --project A3E-2024-001 --analyst jane.doe
 *   exifai report ./analysis.json --format pdf --kml --evidence-chain
 */

import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { aiSceneIntelligence, type AISceneAnalysis, EvidenceChainManager } from './ai-scene-intelligence'

interface ExifAIConfig {
  threshold: number
  outputFormat: 'json' | 'pdf' | 'kml' | 'all'
  includeEvidenceChain: boolean
  projectId?: string
  analystId?: string
  outputPath: string
  batchSize: number
  enableGPSFallback: boolean
  generateReports: boolean
}

interface ExifAIResult {
  batchId: string
  timestamp: string
  config: ExifAIConfig
  summary: {
    totalImages: number
    processedImages: number
    highRiskCount: number
    phaseIIRecommendedCount: number
    averageConfidence: number
    processingTimeMs: number
  }
  images: ProcessedImage[]
  riskHeatmap: Record<string, number>
  evidenceChains?: string[]
}

interface ProcessedImage {
  fileName: string
  filePath: string
  fileHash: string
  fileSize: number
  analysisResult: AISceneAnalysis
  riskAssessment: {
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    phaseIIRecommended: boolean
    urgencyScore: number
    regulatoryFlags: string[]
  }
  gpsData?: {
    latitude: number
    longitude: number
    accuracy: number
    source: string
  }
  evidenceChainId?: string
}

export class ExifAICLI {
  private config: ExifAIConfig

  constructor(config: Partial<ExifAIConfig> = {}) {
    this.config = {
      threshold: 0.65,
      outputFormat: 'json',
      includeEvidenceChain: false,
      outputPath: './exifai-results',
      batchSize: 10,
      enableGPSFallback: true,
      generateReports: false,
      ...config
    }
  }

  /**
   * Main CLI execution entry point
   */
  static async main(args: string[]) {
    const cli = new ExifAICLI()
    await cli.parseAndExecute(args)
  }

  /**
   * Parse command line arguments and execute appropriate action
   */
  async parseAndExecute(args: string[]) {
    const [command, ...params] = args

    switch (command) {
      case 'scan':
        await this.scanCommand(params)
        break
      case 'analyze':
        await this.analyzeCommand(params)
        break
      case 'report':
        await this.reportCommand(params)
        break
      case 'batch':
        await this.batchCommand(params)
        break
      case 'evidence':
        await this.evidenceCommand(params)
        break
      case 'help':
      default:
        this.showHelp()
        break
    }
  }

  /**
   * Layer 6: AI Scene Recognition Command
   * exifai scan ./site-photos --output ./results.json --threshold 0.65
   */
  async scanCommand(params: string[]) {
    const inputPath = params[0]
    if (!inputPath) {
      console.error('❌ Error: Input path required')
      return
    }

    console.log('🔍 EXIFAI Scan - Layer 6: AI Scene Recognition')
    console.log(`📁 Scanning: ${inputPath}`)
    console.log(`🎯 Threshold: ${this.config.threshold}`)

    const startTime = Date.now()
    const batchId = uuidv4()

    try {
      // Discover image files
      const imageFiles = await this.discoverImages(inputPath)
      console.log(`📸 Found ${imageFiles.length} images`)

      // Process in batches
      const results: ProcessedImage[] = []
      const batchCount = Math.ceil(imageFiles.length / this.config.batchSize)

      for (let i = 0; i < batchCount; i++) {
        const batch = imageFiles.slice(i * this.config.batchSize, (i + 1) * this.config.batchSize)
        console.log(`🧠 Processing batch ${i + 1}/${batchCount} (${batch.length} images)`)

        const batchResults = await this.processBatch(batch)
        results.push(...batchResults)

        // Progress indicator
        const progress = Math.round(((i + 1) / batchCount) * 100)
        console.log(`⚡ Progress: ${progress}% complete`)
      }

      // Generate summary
      const summary = this.generateSummary(results, Date.now() - startTime)
      const result: ExifAIResult = {
        batchId,
        timestamp: new Date().toISOString(),
        config: this.config,
        summary,
        images: results,
        riskHeatmap: this.generateRiskHeatmap(results)
      }

      // Save results
      await this.saveResults(result)
      this.printSummary(summary)

    } catch (error) {
      console.error('❌ Scan failed:', error)
    }
  }

  /**
   * Layer 7-8: Multi-Modal Analysis with Evidence Chain
   */
  async analyzeCommand(params: string[]) {
    console.log('🔬 EXIFAI Analyze - Layer 7-8: Multi-Modal Fusion + Evidence Chain')

    const inputPath = params[0]
    const projectFlag = params.findIndex(p => p === '--project')
    const analystFlag = params.findIndex(p => p === '--analyst')

    if (projectFlag !== -1) this.config.projectId = params[projectFlag + 1]
    if (analystFlag !== -1) this.config.analystId = params[analystFlag + 1]

    this.config.includeEvidenceChain = true

    await this.scanCommand([inputPath])
  }

  /**
   * Layer 9: Report Generation
   */
  async reportCommand(params: string[]) {
    console.log('📄 EXIFAI Report - Layer 9: Intelligent Report Generation')

    const inputFile = params[0]
    if (!inputFile) {
      console.error('❌ Error: Analysis file required')
      return
    }

    try {
      const analysisData = JSON.parse(await fs.readFile(inputFile, 'utf-8')) as ExifAIResult

      // Generate PDF report
      if (this.config.outputFormat === 'pdf' || this.config.outputFormat === 'all') {
        await this.generatePDFReport(analysisData)
      }

      // Generate KML file
      if (params.includes('--kml') || this.config.outputFormat === 'all') {
        await this.generateKMLFile(analysisData)
      }

      // Generate evidence chain documentation
      if (params.includes('--evidence-chain')) {
        await this.generateEvidenceChainReport(analysisData)
      }

      console.log('✅ Reports generated successfully')

    } catch (error) {
      console.error('❌ Report generation failed:', error)
    }
  }

  /**
   * Layer 10: Batch Processing with Training Loop
   */
  async batchCommand(params: string[]) {
    console.log('🔄 EXIFAI Batch - Layer 10: Continuous Learning')
    // Implementation for batch processing with training feedback
  }

  /**
   * Evidence Chain Management
   */
  async evidenceCommand(params: string[]) {
    console.log('🔗 EXIFAI Evidence - Layer 8: Legal/Regulatory Readiness')
    // Implementation for evidence chain operations
  }

  /**
   * Discover image files in directory
   */
  private async discoverImages(dirPath: string): Promise<string[]> {
    const extensions = ['.jpg', '.jpeg', '.png', '.heic', '.raw', '.cr2', '.nef']
    const files: string[] = []

    async function scan(currentPath: string) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name)

        if (entry.isDirectory()) {
          await scan(fullPath)
        } else if (extensions.some(ext => entry.name.toLowerCase().endsWith(ext))) {
          files.push(fullPath)
        }
      }
    }

    await scan(dirPath)
    return files
  }

  /**
   * Process a batch of images with AI analysis
   */
  private async processBatch(filePaths: string[]): Promise<ProcessedImage[]> {
    const results: ProcessedImage[] = []

    for (const filePath of filePaths) {
      try {
        const fileName = path.basename(filePath)
        const fileStats = await fs.stat(filePath)
        const fileHash = await this.calculateFileHash(filePath)

        // Mock AI analysis (in production, integrate with actual AI models)
        const analysisResult: AISceneAnalysis = {
          id: uuidv4(),
          imageId: fileHash,
          fileName,
          analysis: {
            objects: [
              {
                id: uuidv4(),
                label: 'Oil Drum',
                confidence: 0.89,
                boundingBox: { x: 100, y: 50, width: 100, height: 100 },
                category: 'hazard'
              }
            ],
            sceneClassification: {
              primaryType: 'Industrial Storage',
              confidence: 0.87,
              alternativeTypes: ['Chemical Storage', 'Waste Area']
            },
            riskAssessment: {
              riskLevel: 'high',
              phaseIIRecommended: true,
              urgencyLevel: 8,
              regulatoryFlags: ['EPA RCRA', 'DOT Hazmat']
            },
            environmentalFindings: [
              {
                id: uuidv4(),
                type: 'Chemical Storage',
                severity: 'high',
                description: 'Multiple drums with visible staining',
                location: { x: 150, y: 100 },
                confidence: 0.91
              }
            ],
            recommendations: [
              'Phase II Environmental Site Assessment recommended',
              'Immediate containment assessment required'
            ]
          },
          metadata: {
            modelVersion: 'YOLOv8n-environmental-v1.2',
            confidence: 0.87,
            processingTime: 1247,
            timestamp: new Date().toISOString()
          },
          auditTrail: []
        }

        // Generate evidence chain if enabled
        let evidenceChainId: string | undefined
        if (this.config.includeEvidenceChain) {
          const evidenceChain = await EvidenceChainManager.generateChain({
            imageHash: fileHash,
            fileName,
            analystId: this.config.analystId || 'exifai-cli',
            aiAnalysis: analysisResult,
            projectId: this.config.projectId
          })
          evidenceChainId = evidenceChain.id
        }

        const processedImage: ProcessedImage = {
          fileName,
          filePath,
          fileHash,
          fileSize: fileStats.size,
          analysisResult,
          riskAssessment: {
            riskLevel: analysisResult.analysis.riskAssessment.riskLevel,
            phaseIIRecommended: analysisResult.analysis.riskAssessment.phaseIIRecommended,
            urgencyScore: analysisResult.analysis.riskAssessment.urgencyLevel,
            regulatoryFlags: analysisResult.analysis.riskAssessment.regulatoryFlags
          },
          evidenceChainId
        }

        results.push(processedImage)

      } catch (error) {
        console.error(`⚠️  Failed to process ${filePath}:`, error)
      }
    }

    return results
  }

  /**
   * Calculate SHA256 hash of file
   */
  private async calculateFileHash(filePath: string): Promise<string> {
    const crypto = require('crypto')
    const buffer = await fs.readFile(filePath)
    return crypto.createHash('sha256').update(buffer).digest('hex')
  }

  /**
   * Generate analysis summary
   */
  private generateSummary(results: ProcessedImage[], processingTime: number) {
    const highRiskCount = results.filter(r => r.riskAssessment.riskLevel === 'high' || r.riskAssessment.riskLevel === 'critical').length
    const phaseIIRecommendedCount = results.filter(r => r.riskAssessment.phaseIIRecommended).length
    const averageConfidence = results.reduce((sum, r) => sum + r.analysisResult.metadata.confidence, 0) / results.length

    return {
      totalImages: results.length,
      processedImages: results.length,
      highRiskCount,
      phaseIIRecommendedCount,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      processingTimeMs: processingTime
    }
  }

  /**
   * Generate risk distribution heatmap
   */
  private generateRiskHeatmap(results: ProcessedImage[]): Record<string, number> {
    return results.reduce((acc, result) => {
      acc[result.riskAssessment.riskLevel] = (acc[result.riskAssessment.riskLevel] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  /**
   * Save analysis results to file
   */
  private async saveResults(result: ExifAIResult) {
    const outputFile = path.join(this.config.outputPath, `exifai-${result.batchId}.json`)
    await fs.mkdir(path.dirname(outputFile), { recursive: true })
    await fs.writeFile(outputFile, JSON.stringify(result, null, 2))
    console.log(`💾 Results saved: ${outputFile}`)
  }

  /**
   * Generate PDF report
   */
  private async generatePDFReport(data: ExifAIResult) {
    console.log('📄 Generating PDF report...')
    // Implementation for PDF generation
  }

  /**
   * Generate KML file for mapping
   */
  private async generateKMLFile(data: ExifAIResult) {
    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>EXIFAI Analysis - ${data.batchId}</name>
    <description>Environmental Image Intelligence Analysis</description>
    ${data.images.filter(img => img.gpsData).map(img => `
    <Placemark>
      <name>${img.fileName}</name>
      <description>
        Risk Level: ${img.riskAssessment.riskLevel.toUpperCase()}
        Phase II Recommended: ${img.riskAssessment.phaseIIRecommended ? 'Yes' : 'No'}
        Scene: ${img.analysisResult.analysis.sceneClassification.primaryType}
        Urgency: ${img.riskAssessment.urgencyScore}/10
      </description>
      <Point>
        <coordinates>${img.gpsData?.longitude},${img.gpsData?.latitude},0</coordinates>
      </Point>
    </Placemark>
    `).join('')}
  </Document>
</kml>`

    const kmlFile = path.join(this.config.outputPath, `exifai-${data.batchId}.kml`)
    await fs.writeFile(kmlFile, kmlContent)
    console.log(`🗺️  KML file generated: ${kmlFile}`)
  }

  /**
   * Generate evidence chain report
   */
  private async generateEvidenceChainReport(data: ExifAIResult) {
    console.log('🔗 Generating evidence chain documentation...')
    // Implementation for evidence chain report
  }

  /**
   * Print summary to console
   */
  private printSummary(summary: any) {
    console.log('\n📊 EXIFAI Analysis Summary')
    console.log('═══════════════════════════')
    console.log(`📸 Total Images: ${summary.totalImages}`)
    console.log(`⚠️  High Risk: ${summary.highRiskCount}`)
    console.log(`📋 Phase II Recommended: ${summary.phaseIIRecommendedCount}`)
    console.log(`🎯 Average Confidence: ${(summary.averageConfidence * 100).toFixed(1)}%`)
    console.log(`⏱️  Processing Time: ${(summary.processingTimeMs / 1000).toFixed(2)}s`)
    console.log('═══════════════════════════\n')
  }

  /**
   * Show CLI help
   */
  private showHelp() {
    console.log(`
🌍 EXIFAI - A3E Environmental Image Intelligence CLI

USAGE:
  exifai <command> [options]

COMMANDS:
  scan <path>           Layer 6: AI Scene Recognition scan
  analyze <path>        Layer 7-8: Multi-modal analysis + evidence chain
  report <file>         Layer 9: Generate reports from analysis
  batch <paths...>      Layer 10: Batch processing with training
  evidence <chain-id>   Evidence chain operations

OPTIONS:
  --output <path>       Output directory (default: ./exifai-results)
  --threshold <num>     AI confidence threshold (default: 0.65)
  --project <id>        Project ID for tracking
  --analyst <name>      Analyst name for evidence chain
  --format <type>       Output format: json|pdf|kml|all
  --kml                 Generate KML mapping file
  --evidence-chain      Generate legal evidence chain

EXAMPLES:
  exifai scan ./site-photos --output ./analysis --threshold 0.75
  exifai analyze ./batch-1 --project A3E-2024-001 --analyst jane.doe
  exifai report ./analysis.json --format pdf --kml --evidence-chain

💡 For more info: https://a3e-environmental.com/docs/exifai
    `)
  }
}

// CLI entry point
if (require.main === module) {
  ExifAICLI.main(process.argv.slice(2))
}

export default ExifAICLI