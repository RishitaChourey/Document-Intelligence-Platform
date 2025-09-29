"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { useDropzone } from "react-dropzone"
import {
  Upload,
  FileText,
  ImageIcon,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Brain,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface UploadedFile {
  id: string
  file: File
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  category?: string
  department?: string
  summary?: string
  tags?: string[]
  riskScore?: number
}

const departments = ["Finance", "Operations", "Procurement", "HR", "Engineering", "Safety", "Legal"]

const categories = [
  "Financial Report",
  "Safety Audit",
  "Contract",
  "Policy Document",
  "Technical Manual",
  "Compliance Report",
  "Other",
]

export function UploadHub() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "uploading",
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Simulate upload and processing
    newFiles.forEach((uploadedFile) => {
      simulateFileProcessing(uploadedFile.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true,
  })

  const simulateFileProcessing = async (fileId: string) => {
    // Upload phase
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: i } : f)))
    }

    // Processing phase
    setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing", progress: 0 } : f)))

    for (let i = 0; i <= 100; i += 5) {
      await new Promise((resolve) => setTimeout(resolve, 150))
      setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: i } : f)))
    }

    // Complete with AI analysis
    const mockAnalysis = {
      category: categories[Math.floor(Math.random() * categories.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      summary: "AI-generated summary of document content with key insights and recommendations for workflow routing.",
      tags: ["compliance", "review-required", "high-priority"],
      riskScore: Math.random(),
    }

    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              status: "completed",
              progress: 100,
              ...mockAnalysis,
            }
          : f,
      ),
    )
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const startWorkflow = (fileId: string) => {
    const file = uploadedFiles.find((f) => f.id === fileId)
    if (file) {
      alert(
        `Workflow initiated for "${file.file.name}"!\n\nNext steps:\n1. Department review (${file.department})\n2. Compliance check\n3. Final approval`,
      )
      // Navigate to workflows page
      router.push("/workflows")
    }
  }

  const processBulk = () => {
    const completedFiles = uploadedFiles.filter((f) => f.status === "completed")
    if (completedFiles.length > 0) {
      alert(
        `Processing ${completedFiles.length} documents...\n\nAll documents will be:\n- Added to document repository\n- Assigned to appropriate departments\n- Queued for review workflows`,
      )
      // Navigate to documents page
      router.push("/documents")
    }
  }

  const clearCompleted = () => {
    setUploadedFiles((prev) => prev.filter((f) => f.status !== "completed"))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />
    if (file.type.includes("pdf")) return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />
    }
  }

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading..."
      case "processing":
        return "AI Processing..."
      case "completed":
        return "Complete"
      case "error":
        return "Error"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Upload Hub</h1>
        <p className="text-muted-foreground mt-2">
          Upload documents for AI-powered processing, categorization, and workflow routing
        </p>
      </div>

      {/* Upload Area */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Document Upload
          </CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supports PDF, DOC, DOCX, TXT, images, and spreadsheets up to 100MB
            each.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-primary/5"
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              {isDragActive ? (
                <div>
                  <p className="text-lg font-medium">Drop files here</p>
                  <p className="text-sm text-muted-foreground">Release to upload</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium">Drag & drop files here</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Queue */}
      {uploadedFiles.length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Processing Queue
            </CardTitle>
            <CardDescription>
              Files are being processed with AI for automatic categorization and content analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className="p-4 rounded-lg border border-border bg-background/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getFileIcon(uploadedFile.file)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate text-balance">{uploadedFile.file.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(uploadedFile.status)}
                        <span className="text-sm text-muted-foreground">{getStatusText(uploadedFile.status)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadedFile.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB</span>
                      <span>•</span>
                      <span>{uploadedFile.file.type}</span>
                    </div>

                    <Progress value={uploadedFile.progress} className="h-2 mb-3" />

                    {uploadedFile.status === "completed" && (
                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Category</Label>
                            <Badge variant="secondary" className="mt-1">
                              {uploadedFile.category}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Department</Label>
                            <Badge variant="outline" className="mt-1">
                              {uploadedFile.department}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground">AI Summary</Label>
                          <p className="text-sm mt-1 text-pretty">{uploadedFile.summary}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {uploadedFile.tags?.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Badge
                            variant={
                              uploadedFile.riskScore! > 0.7
                                ? "destructive"
                                : uploadedFile.riskScore! > 0.4
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            Risk: {(uploadedFile.riskScore! * 100).toFixed(0)}%
                          </Badge>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => alert(`Editing details for "${uploadedFile.file.name}"`)}
                          >
                            Edit Details
                          </Button>
                          <Button size="sm" className="gradient-primary" onClick={() => startWorkflow(uploadedFile.id)}>
                            <Zap className="w-3 h-3 mr-1" />
                            Start Workflow
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {uploadedFiles.filter((f) => f.status === "completed").length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Bulk Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button className="gradient-primary" onClick={processBulk}>
                Process All ({uploadedFiles.filter((f) => f.status === "completed").length})
              </Button>
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => alert("Metadata exported successfully!")}
              >
                Export Metadata
              </Button>
              <Button variant="outline" className="bg-transparent" onClick={clearCompleted}>
                Clear Completed
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
