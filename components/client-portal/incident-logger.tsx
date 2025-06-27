"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Camera,
  Upload,
  Trash2,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
  FileText
} from "lucide-react"
import { toast } from "sonner"

interface Incident {
  id: string
  title: string
  description: string
  severity: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "Investigating" | "Resolved" | "Closed"
  reportedBy: string
  assignedTo?: string
  location?: string
  images?: string[]
  createdAt: string
  updatedAt: string
}

export function IncidentLogger() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "Medium" as const,
    location: "",
    reportedBy: "Current User",
  })
  const [photos, setPhotos] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadIncidents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/incidents')
      const data = await response.json()

      if (data.success) {
        setIncidents(data.incidents)
      } else {
        throw new Error(data.error || 'Failed to load incidents')
      }
    } catch (error) {
      console.error('Failed to load incidents:', error)
      setError(error instanceof Error ? error.message : 'Failed to load incidents')
      toast.error('Failed to load incidents')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Please enter an incident title')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: photos.map(photo => URL.createObjectURL(photo)),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIncidents(prev => [data.incident, ...prev])
        setFormData({
          title: "",
          description: "",
          severity: "Medium",
          location: "",
          reportedBy: "Current User",
        })
        setPhotos([])
        toast.success('Incident reported successfully')
      } else {
        throw new Error(data.error || 'Failed to create incident')
      }
    } catch (error) {
      console.error('Failed to create incident:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create incident'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => file.type.startsWith('image/'))

    if (validFiles.length !== files.length) {
      toast.error('Only image files are allowed')
    }

    setPhotos(prev => [...prev, ...validFiles])
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "High":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "Medium":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "Low":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Incident Logger</h2>
          <p className="text-gray-600">Report and track environmental incidents</p>
        </div>
        <Button onClick={loadIncidents} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
          Load Incidents
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Report Form */}
        <Card>
          <CardHeader>
            <CardTitle>Report New Incident</CardTitle>
            <CardDescription>
              Provide details about the environmental incident
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the incident"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of what happened..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Location of incident"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Photos</label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photos
                  </Button>
                </div>

                {photos.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 w-6 h-6"
                          onClick={() => removePhoto(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Report Incident
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Incidents List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents ({incidents.length})</CardTitle>
            <CardDescription>
              Track status and progress of reported incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {incidents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No incidents reported yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(incident.severity)}
                          <h4 className="font-semibold">{incident.title}</h4>
                        </div>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </div>

                      {incident.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {incident.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>By: {incident.reportedBy}</span>
                        {incident.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {incident.location}
                          </span>
                        )}
                        <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
