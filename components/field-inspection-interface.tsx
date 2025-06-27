"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Camera, Mic, MicOff, MapPin, AlertTriangle, FileText } from "lucide-react"
import { OrchestrationEngine } from "@/lib/iris-orchestrator"

interface Finding {
  id: string
  type: string
  location: string
  severity: "Low" | "Medium" | "High"
  description: string
  photoUrl?: string
  timestamp: string
}

export function FieldInspectionInterface() {
  const [isListening, setIsListening] = useState(false)
  const [currentSite, setCurrentSite] = useState("")
  const [findings, setFindings] = useState<Finding[]>([])
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false)
  const [lastCommand, setLastCommand] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Voice command processing
  const processVoiceCommand = useCallback(
    async (transcript: string) => {
      setLastCommand(transcript)
      const lowerTranscript = transcript.toLowerCase()

      // Site address command
      if (lowerTranscript.includes("site address") || lowerTranscript.includes("location")) {
        const addressMatch = transcript.match(/(?:site address|location)\s+(.+)/i)
        if (addressMatch) {
          setCurrentSite(addressMatch[1])
          await OrchestrationEngine.dispatch("SiteInspectionAgent", {
            siteAddress: addressMatch[1],
            inspectionType: "Phase I",
          })
        }
      }

      // Contaminant detection command
      if (
        lowerTranscript.includes("log") ||
        lowerTranscript.includes("found") ||
        lowerTranscript.includes("detected")
      ) {
        const contaminantTypes = ["asbestos", "lead", "petroleum", "chemicals", "mold"]
        const locations = ["ceiling", "floor", "wall", "basement", "attic", "soil", "groundwater"]
        const severities = ["low", "medium", "high"]

        const detectedType = contaminantTypes.find((type) => lowerTranscript.includes(type))
        const detectedLocation = locations.find((loc) => lowerTranscript.includes(loc))
        const detectedSeverity = severities.find((sev) => lowerTranscript.includes(sev))

        if (detectedType && detectedLocation) {
          const newFinding: Finding = {
            id: `F-${Date.now()}`,
            type: detectedType,
            location: detectedLocation,
            severity: (detectedSeverity as "Low" | "Medium" | "High") || "Medium",
            description: transcript,
            timestamp: new Date().toISOString(),
          }

          setFindings((prev) => [...prev, newFinding])

          await OrchestrationEngine.dispatch("ContaminantDetectionAgent", {
            contaminantType: detectedType,
            location: detectedLocation,
            severity: detectedSeverity || "Medium",
            description: transcript,
          })
        }
      }

      // Photo capture command
      if (lowerTranscript.includes("take photo") || lowerTranscript.includes("capture image")) {
        capturePhoto()
      }

      // Generate report command
      if (lowerTranscript.includes("generate report") || lowerTranscript.includes("create documentation")) {
        await OrchestrationEngine.dispatch("ComplianceDocumentationAgent", {
          inspectionId: `ESA-${Date.now()}`,
          regulatoryFramework: "EPA",
          findings: findings,
        })
      }
    },
    [findings],
  )

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCapturingPhoto(true)
      }
    } catch (error) {
      console.error("Camera access denied:", error)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        // Convert to blob and create URL
        canvas.toBlob((blob) => {
          if (blob) {
            const photoUrl = URL.createObjectURL(blob)
            // Update the most recent finding with the photo
            setFindings((prev) => {
              const updated = [...prev]
              if (updated.length > 0) {
                updated[updated.length - 1].photoUrl = photoUrl
              }
              return updated
            })
          }
        })

        // Stop camera
        const stream = video.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
        setIsCapturingPhoto(false)
      }
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            IRIS Field Inspection Interface
          </CardTitle>
          <CardDescription>Voice-activated environmental site assessment powered by IRIS AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Site address will appear here when spoken..."
              value={currentSite}
              onChange={(e) => setCurrentSite(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => setIsListening(!isListening)}
              className={`${
                isListening ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
              } transition-colors`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? "Stop" : "Listen"}
            </Button>
          </div>
          {lastCommand && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <strong>Last Command:</strong> {lastCommand}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Camera Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            Photo Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isCapturingPhoto ? (
            <Button onClick={startCamera} className="bg-emerald-600 hover:bg-emerald-700">
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <div className="space-y-4">
              <video ref={videoRef} autoPlay className="w-full max-w-md rounded-lg border" />
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="bg-emerald-600 hover:bg-emerald-700">
                  Capture Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const stream = videoRef.current?.srcObject as MediaStream
                    stream?.getTracks().forEach((track) => track.stop())
                    setIsCapturingPhoto(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>

      {/* Findings Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Environmental Findings ({findings.length})
          </CardTitle>
          <CardDescription>Logged contaminants and observations</CardDescription>
        </CardHeader>
        <CardContent>
          {findings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No findings logged yet. Use voice commands like "Log asbestos in ceiling tiles" to add findings.
            </p>
          ) : (
            <div className="space-y-4">
              {findings.map((finding) => (
                <div key={finding.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <h4 className="font-semibold capitalize">{finding.type}</h4>
                      <Badge className={getSeverityColor(finding.severity)}>{finding.severity}</Badge>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(finding.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Location:</strong> {finding.location}
                  </p>
                  <p className="text-sm text-gray-700 mb-3">{finding.description}</p>
                  {finding.photoUrl && (
                    <img
                      src={finding.photoUrl || "/placeholder.svg"}
                      alt="Finding documentation"
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Commands Help */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Site Setup:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>"Site address 123 Main Street"</li>
                <li>"Location downtown facility"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Logging Findings:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>"Log asbestos in ceiling tiles"</li>
                <li>"Found lead paint on walls"</li>
                <li>"Detected petroleum in soil"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Documentation:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>"Take photo"</li>
                <li>"Capture image"</li>
                <li>"Generate report"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Severity Levels:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>Include "low", "medium", or "high"</li>
                <li>Example: "High lead in basement"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
