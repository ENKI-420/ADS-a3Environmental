import { NextRequest, NextResponse } from "next/server"
import { environmentalIntelligence } from "@/lib/ai-environmental-intelligence"

export async function POST(request: NextRequest) {
  try {
    const { demoType, projectData } = await request.json()

    let result

    switch (demoType) {
      case 'predictive-analytics':
        // Demo predictive analytics
        result = await environmentalIntelligence.executeComprehensiveAnalysis({
          projectId: 'demo-' + Date.now(),
          siteData: {
            type: 'industrial',
            location: { lat: 40.7128, lng: -74.0060 },
            activities: ['excavation', 'demolition', 'storage'],
            clientId: 'demo-client',
            history: [],
            realtime: []
          },
          requirements: ['all']
        })
        break

      case 'compliance-check':
        // Demo automated compliance
        const complianceAgent = Array.from(environmentalIntelligence['agents'].values())
          .find(agent => agent.name === 'AutomatedComplianceAgent')

        if (complianceAgent) {
          result = await complianceAgent.execute({
            projectId: 'demo-' + Date.now(),
            projectType: projectData?.type || 'construction',
            location: projectData?.location || { lat: 40.7128, lng: -74.0060 },
            activities: projectData?.activities || ['excavation', 'demolition']
          })
        }
        break

      case 'computer-vision':
        // Demo computer vision (simulated)
        const visionAgent = Array.from(environmentalIntelligence['agents'].values())
          .find(agent => agent.name === 'ComputerVisionAnalysisAgent')

        if (visionAgent) {
          // Simulate image analysis
          result = await visionAgent.execute({
            images: [], // Would normally pass actual images
            videoStreams: [],
            droneFootage: [],
            satelliteImagery: ['demo-satellite-1', 'demo-satellite-2']
          })
        }
        break

      case 'data-integration':
        // Demo real-time data integration
        const dataAgent = Array.from(environmentalIntelligence['agents'].values())
          .find(agent => agent.name === 'DataIntegrationHub')

        if (dataAgent) {
          result = await dataAgent.execute({
            projectId: 'demo-' + Date.now(),
            location: projectData?.location || { lat: 40.7128, lng: -74.0060 },
            dataRequirements: ['all'],
            realTimeMonitoring: true
          })
        }
        break

      case 'client-portal':
        // Demo client self-service
        const portalAgent = Array.from(environmentalIntelligence['agents'].values())
          .find(agent => agent.name === 'ClientSelfServiceEngine')

        if (portalAgent) {
          result = await portalAgent.execute({
            clientId: 'demo-client',
            projectIds: ['demo-project-1', 'demo-project-2'],
            requestType: 'dashboard'
          })
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid demo type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      demoType,
      result,
      message: 'This is a demonstration of A3E\'s AI capabilities. In production, this would process real environmental data.'
    })

  } catch (error) {
    console.error('AI demo error:', error)
    return NextResponse.json(
      { error: 'Failed to run AI demo' },
      { status: 500 }
    )
  }
}

// GET endpoint to check available demos
export async function GET() {
  return NextResponse.json({
    availableDemos: [
      {
        id: 'predictive-analytics',
        name: 'Predictive Environmental Analytics',
        description: 'See how AI predicts contamination spread and compliance risks 3-6 months in advance'
      },
      {
        id: 'compliance-check',
        name: 'Automated Compliance Check',
        description: 'Watch AI instantly check compliance across EPA, NEPA, HUD, and DOT regulations'
      },
      {
        id: 'computer-vision',
        name: 'Computer Vision Site Analysis',
        description: 'Experience AI analyzing site images for contamination and safety hazards'
      },
      {
        id: 'data-integration',
        name: 'Real-Time Data Integration',
        description: 'See data from 15+ environmental databases integrated in real-time'
      },
      {
        id: 'client-portal',
        name: 'Client Self-Service Portal',
        description: 'Explore the 24/7 AI-powered client dashboard'
      }
    ]
  })
}