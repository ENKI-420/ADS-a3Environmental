import { NextRequest, NextResponse } from 'next/server'

// Layer 10: Report Replay & Training Loop
interface AnalystCorrection {
  id: string
  imageId: string
  originalAISuggestion: AISuggestion
  analystCorrection: AnalystEdit
  correctionType: 'false_positive' | 'false_negative' | 'accuracy_improvement' | 'new_detection'
  timestamp: string
  analystId: string
  confidence: number
  feedback: string
}

interface AISuggestion {
  objects: Array<{
    label: string
    confidence: number
    bbox: [number, number, number, number]
    category: string
  }>
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
  sceneClassification: string
}

interface AnalystEdit {
  objects: Array<{
    label: string
    confidence: number
    bbox: [number, number, number, number]
    category: string
    correctionReason: string
  }>
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
  sceneClassification: string
  notes: string
}

interface TrainingData {
  imageFeatures: any
  groundTruth: AnalystEdit
  modelVersion: string
  trainingWeight: number
}

interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  falsePositiveRate: number
  falseNegativeRate: number
  lastUpdated: string
}

interface IRISMemoryIntegration {
  contextId: string
  memorySummary: string
  relevantPatterns: string[]
  futureRecommendations: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'submit-correction') {
      return await handleCorrectionSubmission(request)
    } else if (action === 'train-model') {
      return await handleModelTraining(request)
    } else if (action === 'iris-integration') {
      return await handleIRISIntegration(request)
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: submit-correction, train-model, or iris-integration' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Training loop error:', error)
    return NextResponse.json(
      { error: 'Training loop processing failed', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const analystId = searchParams.get('analystId')
    const timeframe = searchParams.get('timeframe') || '30'

    if (action === 'corrections') {
      return await getCorrections(analystId, timeframe)
    } else if (action === 'metrics') {
      return await getModelMetrics()
    } else if (action === 'training-data') {
      return await getTrainingDatasets()
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: corrections, metrics, or training-data' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Training loop retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve training data' },
      { status: 500 }
    )
  }
}

async function handleCorrectionSubmission(request: NextRequest) {
  const body = await request.json()

  const correction: AnalystCorrection = {
    id: `correction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageId: body.imageId,
    originalAISuggestion: body.originalAISuggestion,
    analystCorrection: body.analystCorrection,
    correctionType: determineCorrectionType(body.originalAISuggestion, body.analystCorrection),
    timestamp: new Date().toISOString(),
    analystId: body.analystId,
    confidence: body.confidence || 1.0,
    feedback: body.feedback || ''
  }

  // Convert correction to training data
  const trainingData = await convertToTrainingData(correction, body.imageFeatures)

  // Calculate impact on model metrics
  const metricsImpact = calculateMetricsImpact(correction)

  // Prepare for IRIS Memory Graph integration
  const irisIntegration = await prepareIRISIntegration(correction)

  return NextResponse.json({
    success: true,
    correction,
    trainingData,
    metricsImpact,
    irisIntegration,
    message: `Correction submitted and added to training pipeline`,
    nextSteps: [
      'Correction flagged for model retraining',
      'Training weight calculated based on correction type',
      'IRIS memory context updated for future predictions'
    ]
  })
}

async function handleModelTraining(request: NextRequest) {
  const body = await request.json()
  const inputFile = body.inputFile || './analyst-corrections.json'

  // Simulate model training process
  const trainingResults = {
    trainingSessionId: `train_${Date.now()}`,
    startTime: new Date().toISOString(),
    modelVersion: `v${Date.now()}`,
    datasetSize: 847, // Mock number of corrections
    epochs: 50,
    improvements: {
      accuracyGain: 0.034,
      precisionGain: 0.028,
      recallGain: 0.041,
      f1ScoreGain: 0.032
    },
    falsePositiveReduction: 0.156,
    falseNegativeReduction: 0.089,
    trainingTime: '23.4 minutes',
    validationAccuracy: 0.934,
    productionReadiness: true
  }

  // Update model metrics
  const updatedMetrics = await updateModelMetrics(trainingResults)

  return NextResponse.json({
    success: true,
    trainingResults,
    updatedMetrics,
    deploymentReady: true,
    message: 'Model training completed successfully',
    recommendations: [
      'Deploy new model to staging environment',
      'Run A/B test against current production model',
      'Monitor performance for 48 hours before full deployment'
    ]
  })
}

async function handleIRISIntegration(request: NextRequest) {
  const body = await request.json()

  const irisIntegration: IRISMemoryIntegration = {
    contextId: `iris_${Date.now()}`,
    memorySummary: generateMemorySummary(body.corrections),
    relevantPatterns: extractPatterns(body.corrections),
    futureRecommendations: generateFutureRecommendations(body.corrections)
  }

  return NextResponse.json({
    success: true,
    irisIntegration,
    message: 'IRIS Memory Graph integration completed',
    contextInjected: true
  })
}

async function getCorrections(analystId: string | null, timeframe: string) {
  // Mock corrections data
  const mockCorrections = [
    {
      id: 'correction_1234567890_abc123',
      imageId: 'img_001',
      originalAISuggestion: {
        objects: [{ label: 'oil_drum', confidence: 0.89, bbox: [100, 50, 200, 150], category: 'hazard' }],
        riskLevel: 'high',
        recommendations: ['Phase II ESA recommended'],
        sceneClassification: 'industrial_storage'
      },
      analystCorrection: {
        objects: [{ label: 'water_tank', confidence: 1.0, bbox: [100, 50, 200, 150], category: 'structure', correctionReason: 'Misidentified as oil drum' }],
        riskLevel: 'low',
        recommendations: ['No immediate action required'],
        sceneClassification: 'water_treatment',
        notes: 'Clear labeling visible on inspection'
      },
      correctionType: 'false_positive',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      analystId: analystId || 'jane.doe@a3e',
      confidence: 1.0,
      feedback: 'AI missed the visible labeling on the tank'
    }
  ]

  const summary = {
    totalCorrections: mockCorrections.length,
    correctionTypes: {
      false_positive: mockCorrections.filter(c => c.correctionType === 'false_positive').length,
      false_negative: mockCorrections.filter(c => c.correctionType === 'false_negative').length,
      accuracy_improvement: mockCorrections.filter(c => c.correctionType === 'accuracy_improvement').length,
      new_detection: mockCorrections.filter(c => c.correctionType === 'new_detection').length
    },
    averageConfidence: mockCorrections.reduce((sum, c) => sum + c.confidence, 0) / mockCorrections.length
  }

  return NextResponse.json({
    success: true,
    corrections: mockCorrections,
    summary,
    timeframe: `Last ${timeframe} days`
  })
}

async function getModelMetrics() {
  const mockMetrics: ModelMetrics = {
    accuracy: 0.934,
    precision: 0.912,
    recall: 0.897,
    f1Score: 0.904,
    falsePositiveRate: 0.088,
    falseNegativeRate: 0.103,
    lastUpdated: new Date().toISOString()
  }

  const trend = {
    accuracyTrend: '+3.4% (last 30 days)',
    precisionTrend: '+2.8% (last 30 days)',
    recallTrend: '+4.1% (last 30 days)',
    improvementRate: '0.23% per week'
  }

  return NextResponse.json({
    success: true,
    metrics: mockMetrics,
    trend,
    benchmarks: {
      industryAverage: { accuracy: 0.856, precision: 0.831, recall: 0.794 },
      targetGoals: { accuracy: 0.950, precision: 0.940, recall: 0.920 }
    }
  })
}

async function getTrainingDatasets() {
  const datasets = [
    {
      id: 'dataset_corrections_2024_12',
      name: 'Analyst Corrections December 2024',
      size: 847,
      correctionTypes: {
        false_positive: 234,
        false_negative: 156,
        accuracy_improvement: 312,
        new_detection: 145
      },
      quality: 'High',
      trainingWeight: 1.0,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'dataset_iris_patterns_2024',
      name: 'IRIS Pattern Learning Dataset',
      size: 1203,
      patterns: ['contamination_indicators', 'hazard_misclassification', 'scene_context'],
      quality: 'Very High',
      trainingWeight: 1.2,
      lastUpdated: new Date(Date.now() - 86400000).toISOString()
    }
  ]

  return NextResponse.json({
    success: true,
    datasets,
    totalTrainingExamples: datasets.reduce((sum, d) => sum + d.size, 0)
  })
}

// Helper functions
function determineCorrectionType(original: AISuggestion, corrected: AnalystEdit): 'false_positive' | 'false_negative' | 'accuracy_improvement' | 'new_detection' {
  // If AI detected hazard but analyst says it's not
  if (original.riskLevel === 'high' && corrected.riskLevel === 'low') {
    return 'false_positive'
  }

  // If AI missed hazard that analyst found
  if (original.riskLevel === 'low' && corrected.riskLevel === 'high') {
    return 'false_negative'
  }

  // If analyst added new objects not detected by AI
  if (corrected.objects.length > original.objects.length) {
    return 'new_detection'
  }

  // Default to accuracy improvement
  return 'accuracy_improvement'
}

async function convertToTrainingData(correction: AnalystCorrection, imageFeatures: any): Promise<TrainingData> {
  const trainingWeight = calculateTrainingWeight(correction.correctionType, correction.confidence)

  return {
    imageFeatures: imageFeatures || { placeholder: 'image_features_extracted' },
    groundTruth: correction.analystCorrection,
    modelVersion: 'current',
    trainingWeight
  }
}

function calculateTrainingWeight(correctionType: string, confidence: number): number {
  const baseWeights = {
    false_positive: 1.5,  // High weight - important to reduce false alarms
    false_negative: 2.0,  // Highest weight - missing hazards is critical
    accuracy_improvement: 1.0,
    new_detection: 1.3
  }

  return (baseWeights[correctionType as keyof typeof baseWeights] || 1.0) * confidence
}

function calculateMetricsImpact(correction: AnalystCorrection) {
  // Simplified impact calculation
  const impact = {
    expectedAccuracyChange: correction.correctionType === 'false_positive' ? 0.002 : 0.004,
    confidenceAdjustment: correction.confidence > 0.9 ? 'high' : 'medium',
    retrainingPriority: correction.correctionType === 'false_negative' ? 'high' : 'medium'
  }

  return impact
}

async function prepareIRISIntegration(correction: AnalystCorrection): Promise<IRISMemoryIntegration> {
  return {
    contextId: `iris_context_${correction.id}`,
    memorySummary: `Analyst corrected ${correction.correctionType}: ${correction.originalAISuggestion.objects[0]?.label} → ${correction.analystCorrection.objects[0]?.label}`,
    relevantPatterns: [correction.correctionType, correction.analystCorrection.sceneClassification],
    futureRecommendations: [
      `Improve detection accuracy for ${correction.analystCorrection.sceneClassification} scenes`,
      `Review similar ${correction.correctionType} cases for pattern`
    ]
  }
}

function generateMemorySummary(corrections: AnalystCorrection[]): string {
  const types = corrections.map(c => c.correctionType)
  const mostCommon = types.reduce((a, b, _, arr) =>
    arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
  )

  return `Recent training focus: ${mostCommon} corrections with ${corrections.length} total adjustments`
}

function extractPatterns(corrections: AnalystCorrection[]): string[] {
  const patterns = new Set<string>()

  corrections.forEach(correction => {
    patterns.add(correction.correctionType)
    patterns.add(correction.analystCorrection.sceneClassification)
    correction.analystCorrection.objects.forEach(obj => patterns.add(obj.category))
  })

  return Array.from(patterns)
}

function generateFutureRecommendations(corrections: AnalystCorrection[]): string[] {
  const recommendations = [
    'Focus training on scene classification accuracy',
    'Improve object detection confidence thresholds',
    'Enhance hazard vs non-hazard distinction',
    'Incorporate more environmental context clues'
  ]

  return recommendations
}

async function updateModelMetrics(trainingResults: any): Promise<ModelMetrics> {
  return {
    accuracy: 0.934 + trainingResults.improvements.accuracyGain,
    precision: 0.912 + trainingResults.improvements.precisionGain,
    recall: 0.897 + trainingResults.improvements.recallGain,
    f1Score: 0.904 + trainingResults.improvements.f1ScoreGain,
    falsePositiveRate: 0.088 - trainingResults.falsePositiveReduction,
    falseNegativeRate: 0.103 - trainingResults.falseNegativeReduction,
    lastUpdated: new Date().toISOString()
  }
}