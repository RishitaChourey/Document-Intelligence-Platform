"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Shield,
  FileCheck,
  AlertTriangle,
  Download,
  Search,
  Eye,
  Lock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Building,
} from "lucide-react"

const auditTrail = [
  {
    id: "audit1",
    timestamp: "2024-01-26 14:30:25",
    user: "john.doe@kmrl.com",
    action: "Document Approved",
    document: "Annual Budget Report 2024.pdf",
    ipAddress: "192.168.1.45",
    details: "Document approved after compliance review",
    riskLevel: "low",
  },
  {
    id: "audit2",
    timestamp: "2024-01-26 13:45:12",
    user: "jane.smith@kmrl.com",
    action: "Review Completed",
    document: "Safety Audit Report - Line 1.docx",
    ipAddress: "192.168.1.52",
    details: "Safety review completed with recommendations",
    riskLevel: "medium",
  },
  {
    id: "audit3",
    timestamp: "2024-01-26 12:20:08",
    user: "system",
    action: "Auto-Classification",
    document: "Vendor Contract - ABC Systems.pdf",
    ipAddress: "System",
    details: "AI classified as high-risk contract requiring manual review",
    riskLevel: "high",
  },
  {
    id: "audit4",
    timestamp: "2024-01-26 11:15:33",
    user: "mike.johnson@kmrl.com",
    action: "Document Upload",
    document: "Technical Specifications - Station Design.docx",
    ipAddress: "192.168.1.33",
    details: "Document uploaded and queued for processing",
    riskLevel: "low",
  },
]

const compliancePolicies = [
  {
    id: "policy1",
    name: "Financial Compliance Policy",
    version: "v2.1",
    status: "Active",
    lastUpdated: "2024-01-15",
    documentsAffected: 45,
    complianceRate: 98.5,
  },
  {
    id: "policy2",
    name: "Safety Standards Manual",
    version: "v3.2",
    status: "Active",
    lastUpdated: "2024-01-10",
    documentsAffected: 32,
    complianceRate: 96.8,
  },
  {
    id: "policy3",
    name: "Procurement Guidelines",
    version: "v1.8",
    status: "Under Review",
    lastUpdated: "2024-01-20",
    documentsAffected: 28,
    complianceRate: 94.2,
  },
  {
    id: "policy4",
    name: "Data Protection Policy",
    version: "v4.0",
    status: "Active",
    lastUpdated: "2024-01-05",
    documentsAffected: 156,
    complianceRate: 99.1,
  },
]

const immutableSnapshots = [
  {
    id: "snap1",
    documentName: "Annual Budget Report 2024.pdf",
    hash: "a1b2c3d4e5f6",
    timestamp: "2024-01-26 14:30:25",
    approver: "Jane Smith",
    size: "2.4 MB",
    status: "Verified",
  },
  {
    id: "snap2",
    documentName: "Employee Training Manual v2.1.pdf",
    hash: "f6e5d4c3b2a1",
    timestamp: "2024-01-25 16:45:12",
    approver: "David Chen",
    size: "3.2 MB",
    status: "Verified",
  },
  {
    id: "snap3",
    documentName: "Safety Protocol Update.docx",
    hash: "9z8y7x6w5v4u",
    timestamp: "2024-01-24 09:20:33",
    approver: "Sarah Wilson",
    size: "1.8 MB",
    status: "Verified",
  },
]

export function GovernanceCenter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")

  const filteredAuditTrail = auditTrail.filter(
    (entry) =>
      entry.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-success"
      case "medium":
        return "text-warning"
      case "high":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "secondary"
      case "medium":
        return "default"
      case "high":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Governance Center</h1>
          <p className="text-muted-foreground mt-2">
            Compliance tracking, audit trails, and immutable document history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export Audit Log
          </Button>
          <Button className="gradient-primary">
            <FileCheck className="w-4 h-4 mr-2" />
            Compliance Report
          </Button>
        </div>
      </div>

      {/* Governance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Audit Entries</CardTitle>
            <FileCheck className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground mt-1">All documents tracked</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Score</CardTitle>
            <Shield className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-success mt-1">+1.2% this month</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Policy Violations</CardTitle>
            <AlertTriangle className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-success mt-1">-2 vs last month</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Security Incidents</CardTitle>
            <Lock className="w-4 h-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Clean record</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="snapshots">Immutable Records</TabsTrigger>
          <TabsTrigger value="lifecycle">Document Lifecycle</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Audit Trail Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by document, user, or action..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button variant="outline" className="bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last 24h
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAuditTrail.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-balance">{entry.action}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRiskBadge(entry.riskLevel)} className="text-xs">
                            {entry.riskLevel} risk
                          </Badge>
                          <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2 text-pretty">{entry.document}</p>
                      <p className="text-sm mb-3">{entry.details}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{entry.user}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span>{entry.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Compliance Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compliancePolicies.map((policy) => (
                  <div key={policy.id} className="p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-balance">{policy.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Version {policy.version} • Last updated {policy.lastUpdated}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={policy.status === "Active" ? "default" : "secondary"}>{policy.status}</Badge>
                        {policy.complianceRate > 95 ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-warning" />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Documents Affected:</span>
                        <p className="font-medium">{policy.documentsAffected}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Compliance Rate:</span>
                        <p className="font-medium">{policy.complianceRate}%</p>
                      </div>
                    </div>

                    <Progress value={policy.complianceRate} className="mb-3" />

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="snapshots" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Immutable Document Snapshots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {immutableSnapshots.map((snapshot) => (
                  <div key={snapshot.id} className="p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-balance">{snapshot.documentName}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Hash: {snapshot.hash} • {snapshot.size}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {snapshot.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Approved by:</span>
                        <p className="font-medium">{snapshot.approver}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timestamp:</span>
                        <p className="font-medium">{snapshot.timestamp}</p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-1" />
                        Download Snapshot
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Hot Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">156</div>
                <p className="text-sm text-muted-foreground mb-3">Active documents (Last 30 days)</p>
                <Progress value={30} className="mb-2" />
                <p className="text-xs text-muted-foreground">Instant access</p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Cold Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">2,691</div>
                <p className="text-sm text-muted-foreground mb-3">Archived documents</p>
                <Progress value={70} className="mb-2" />
                <p className="text-xs text-muted-foreground">5-minute retrieval</p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Scheduled Deletion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">23</div>
                <p className="text-sm text-muted-foreground mb-3">Retention expired</p>
                <Progress value={10} className="mb-2" />
                <p className="text-xs text-muted-foreground">7-day grace period</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
