"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Brain, FileImage, Download } from "lucide-react"

export function EnhancedImageProcessor() {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
    setSelectedImages(prev => [...prev, ...imageFiles])
  }

  const processImages = async () => {
    setIsProcessing(true)
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">IRIS Enhanced Image Processor</h1>
            <p className="text-gray-600">Advanced EXIF extraction and KML generation</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-purple-600 text-white">IRIS MCP SDK v2.0</Badge>
          <Badge variant="outline">Multi-Modal AI</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileImage className="h-5 w-5" />
            <span>Image Processing Pipeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Images for IRIS Analysis</h3>
            <p className="text-gray-600 mb-4">Drag and drop images or click to select</p>
            <Button onClick={() => document.getElementById('file-input')?.click()}>
              Select Images
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {selectedImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Selected Images ({selectedImages.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedImages.map((file, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center space-x-2">
                      <FileImage className="h-6 w-6 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={processImages}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600"
                >
                  {isProcessing ? 'Processing...' : 'Start IRIS Processing'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}