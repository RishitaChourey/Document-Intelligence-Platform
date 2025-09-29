"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  Search,
  Download,
  Share2,
  Eye,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  Archive,
  Tag,
  Calendar,
  User,
  Building,
} from "lucide-react"

interface Document {
  id: string
  name: string
  category: string
  department: string
  status: "Under Review" | "Pending Approval" | "Approved" | "Archived"
  priority: "Low" | "Medium" | "High" | "Urgent"
  riskScore: number
  uploadDate: string
  assignee: string
  reviewer: string
  size: string
  summary: string
  tags: string[]
  chatCount: number
  extractedData: {
    tables: number
    charts: number
    images: number
  }
}

const mockDocuments: Document[] = [
  {
    id: "DOC001",
    name: "Annual Budget Report 2024.pdf",
    category: "Financial Report",
    department: "Finance",
    status: "Approved",
    priority: "Medium",
    riskScore: 0.2,
    uploadDate: "2024-01-15",
    assignee: "John Doe",
    reviewer: "Jane Smith",
    size: "2.4 MB",
    summary: "Annual financial overview with budget allocations for metro expansion projects.",
    tags: ["budget", "financial", "annual"],
    chatCount: 3,
    extractedData: { tables: 5, charts: 12, images: 8 },
  },
  {
    id: "DOC002",
    name: "Safety Audit Report - Line 1.docx",
    category: "Safety Audit",
    department: "Operations",
    status: "Under Review",
    priority: "Urgent",
    riskScore: 0.8,
    uploadDate: "2024-01-20",
    assignee: "Mike Johnson",
    reviewer: "Sarah Wilson",
    size: "1.8 MB",
    summary: "Critical safety findings requiring immediate attention on Line 1 operations.",
    tags: ["safety", "audit", "critical"],
    chatCount: 8,
    extractedData: { tables: 3, charts: 6, images: 15 },
  },
  {
    id: "DOC003",
    name: "Vendor Contract - ABC Systems.pdf",
    category: "Contract",
    department: "Procurement",
    status: "Pending Approval",
    priority: "Medium",
    riskScore: 0.4,
    uploadDate: "2024-01-22",
    assignee: "Lisa Brown",
    reviewer: "Tom Davis",
    size: "856 KB",
    summary: "Service contract for maintenance systems with standard terms and conditions.",
    tags: ["contract", "vendor", "maintenance"],
    chatCount: 2,
    extractedData: { tables: 2, charts: 1, images: 3 },
  },
  {
    id: "DOC004",
    name: "Employee Training Manual v2.1.pdf",
    category: "Training Manual",
    department: "HR",
    status: "Approved",
    priority: "Low",
    riskScore: 0.1,
    uploadDate: "2024-01-10",
    assignee: "Emma Wilson",
    reviewer: "David Chen",
    size: "3.2 MB",
    summary: "Updated training procedures for new employee onboarding and safety protocols.",
    tags: ["training", "hr", "manual"],
    chatCount: 1,
    extractedData: { tables: 8, charts: 4, images: 22 },
  },
  {
    id: "DOC005",
    name: "Technical Specifications - Station Design.docx",
    category: "Technical Document",
    department: "Engineering",
    status: "Under Review",
    priority: "High",
    riskScore: 0.6,
    uploadDate: "2024-01-25",
    assignee: "Robert Kim",
    reviewer: "Alice Johnson",
    size: "4.1 MB",
    summary: "Detailed technical specifications for new station construction and design standards.",
    tags: ["technical", "design", "construction"],
    chatCount: 5,
    extractedData: { tables: 12, charts: 8, images: 35 },
  },
]

export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || doc.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || doc.priority === selectedPriority

    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "Under Review":
        return <Clock className="w-4 h-4 text-warning" />
      case "Pending Approval":
        return <AlertTriangle className="w-4 h-4 text-info" />
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "Archived":
        return <Archive className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: Document["priority"]) => {
    switch (priority) {
      case "Low":
        return "secondary"
      case "Medium":
        return "outline"
      case "High":
        return "default"
      case "Urgent":
        return "destructive"
    }
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore > 0.7) return "text-destructive"
    if (riskScore > 0.4) return "text-warning"
    return "text-success"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Document Management</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive document repository with advanced search and content management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export List
          </Button>
          <Button className="gradient-primary">
            <FileText className="w-4 h-4 mr-2" />
            Upload New
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search Documents</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, category, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Procurement">Procurement</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredDocuments.length} of {documents.length} documents
        </p>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            List
          </Button>
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            Grid
          </Button>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="glass hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg text-balance">{doc.name}</h3>
                    {getStatusIcon(doc.status)}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 text-pretty">{doc.summary}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{doc.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{doc.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{doc.assignee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant={getPriorityColor(doc.priority)}>{doc.priority}</Badge>
                    <Badge variant="outline">{doc.status}</Badge>
                    <Badge variant="secondary" className={getRiskColor(doc.riskScore)}>
                      Risk: {(doc.riskScore * 100).toFixed(0)}%
                    </Badge>
                    <div className="flex gap-1">
                      {doc.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>Size: {doc.size}</span>
                    <span>Tables: {doc.extractedData.tables}</span>
                    <span>Charts: {doc.extractedData.charts}</span>
                    <span>Images: {doc.extractedData.images}</span>
                    <span>Discussions: {doc.chatCount}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-balance">{selectedDocument?.name}</DialogTitle>
                        <DialogDescription>Document details and metadata</DialogDescription>
                      </DialogHeader>
                      {selectedDocument && (
                        <Tabs defaultValue="details" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="history">History</TabsTrigger>
                          </TabsList>
                          <TabsContent value="details" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-semibold">Category</Label>
                                <p>{selectedDocument.category}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Department</Label>
                                <p>{selectedDocument.department}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Assignee</Label>
                                <p>{selectedDocument.assignee}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Reviewer</Label>
                                <p>{selectedDocument.reviewer}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">Upload Date</Label>
                                <p>{new Date(selectedDocument.uploadDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <Label className="font-semibold">File Size</Label>
                                <p>{selectedDocument.size}</p>
                              </div>
                            </div>
                            <div>
                              <Label className="font-semibold">Summary</Label>
                              <p className="text-pretty">{selectedDocument.summary}</p>
                            </div>
                            <div>
                              <Label className="font-semibold">Extracted Data</Label>
                              <div className="flex gap-4 mt-2">
                                <Badge variant="outline">Tables: {selectedDocument.extractedData.tables}</Badge>
                                <Badge variant="outline">Charts: {selectedDocument.extractedData.charts}</Badge>
                                <Badge variant="outline">Images: {selectedDocument.extractedData.images}</Badge>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="content">
                            <div className="p-4 bg-muted/20 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Document content preview would be displayed here with extracted text, tables, and
                                images.
                              </p>
                            </div>
                          </TabsContent>
                          <TabsContent value="history">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-success" />
                                <div>
                                  <p className="font-medium">Document Uploaded</p>
                                  <p className="text-sm text-muted-foreground">{selectedDocument.uploadDate}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                <Clock className="w-4 h-4 text-warning" />
                                <div>
                                  <p className="font-medium">AI Processing Complete</p>
                                  <p className="text-sm text-muted-foreground">Categorized and analyzed</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Chat ({doc.chatCount})
                  </Button>

                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>

                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or upload new documents.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
