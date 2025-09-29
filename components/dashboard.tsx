"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, Clock, AlertTriangle, TrendingUp, Shield } from "lucide-react"
import { AIInsights } from "@/components/ai-insights"
import Link from "next/link"
import { useRouter } from "next/navigation"

const stats = [
  {
    title: "Today's Uploads",
    value: "24",
    change: "+12 vs yesterday",
    icon: Upload,
    color: "text-info",
  },
  {
    title: "This Week",
    value: "156",
    change: "+23 vs last week",
    icon: TrendingUp,
    color: "text-success",
  },
  {
    title: "Total Processed",
    value: "2,847",
    change: "All time",
    icon: FileText,
    color: "text-primary",
  },
  {
    title: "Pending Reviews",
    value: "3",
    change: "-2 vs yesterday",
    icon: Clock,
    color: "text-warning",
  },
]

const recentDocuments = [
  {
    id: "DOC001",
    name: "Annual Budget Report 2024.pdf",
    category: "Financial Report",
    department: "Finance",
    status: "Under Review",
    priority: "High",
    riskScore: 0.8,
    assignee: "John Doe",
    uploadDate: "2 hours ago",
  },
  {
    id: "DOC002",
    name: "Safety Audit Report - Line 1.docx",
    category: "Safety Audit",
    department: "Operations",
    status: "Pending Approval",
    priority: "Urgent",
    riskScore: 0.9,
    assignee: "Jane Smith",
    uploadDate: "4 hours ago",
  },
  {
    id: "DOC003",
    name: "Vendor Contract - ABC Systems.pdf",
    category: "Contract",
    department: "Procurement",
    status: "Approved",
    priority: "Medium",
    riskScore: 0.3,
    assignee: "Mike Johnson",
    uploadDate: "1 day ago",
  },
]

export function Dashboard() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decision Cards */}
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Documents Requiring Action
              </CardTitle>
              <CardDescription>High-priority documents that need immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentDocuments
                .filter((doc) => doc.status !== "Approved")
                .map((doc) => (
                  <div key={doc.id} className="p-4 rounded-lg border border-border bg-background/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-balance">{doc.name}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{doc.department}</span>
                          <span>•</span>
                          <span>{doc.assignee}</span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant={doc.priority === "Urgent" ? "destructive" : "secondary"}>
                            {doc.priority}
                          </Badge>
                          <Badge variant="outline">Risk: {(doc.riskScore * 100).toFixed(0)}%</Badge>
                          <Badge variant={doc.status === "Under Review" ? "default" : "secondary"}>{doc.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => router.push("/documents")}>
                          Review
                        </Button>
                        <Button
                          size="sm"
                          className="gradient-primary"
                          onClick={() => {
                            // Simulate approval action
                            alert(`Document "${doc.name}" has been approved!`)
                          }}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/upload">
                <Button className="w-full gradient-primary" size="lg">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
              </Link>
              <Link href="/documents">
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  View All Documents
                </Button>
              </Link>
              <Link href="/governance">
                <Button variant="outline" className="w-full bg-transparent">
                  <Shield className="w-4 h-4 mr-2" />
                  Compliance Report
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>AI Processing</span>
                  <span className="text-success">Operational</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Storage Usage</span>
                  <span>68% of 1TB</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Active Users</span>
                  <span className="text-info">24 online</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights section */}
      <AIInsights />
    </div>
  )
}
