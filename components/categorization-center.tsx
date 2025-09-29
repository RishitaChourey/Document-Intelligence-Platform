"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { FileText, Tag, Brain, Settings, BarChart3, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react"

const categories = [
  { name: "Financial Reports", count: 45, accuracy: 98, color: "bg-blue-500" },
  { name: "Safety Audits", count: 23, accuracy: 95, color: "bg-red-500" },
  { name: "Contracts", count: 67, accuracy: 97, color: "bg-green-500" },
  { name: "Policy Documents", count: 34, accuracy: 99, color: "bg-purple-500" },
  { name: "Technical Manuals", count: 56, accuracy: 94, color: "bg-orange-500" },
  { name: "Compliance Reports", count: 29, accuracy: 96, color: "bg-teal-500" },
  { name: "HR Documents", count: 41, accuracy: 98, color: "bg-pink-500" },
  { name: "Other", count: 12, accuracy: 85, color: "bg-gray-500" },
]

const recentClassifications = [
  {
    id: "1",
    document: "Q4 Financial Summary.pdf",
    predicted: "Financial Reports",
    confidence: 0.98,
    status: "confirmed",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    document: "Safety Protocol Update.docx",
    predicted: "Safety Audits",
    confidence: 0.94,
    status: "pending",
    timestamp: "5 minutes ago",
  },
  {
    id: "3",
    document: "Vendor Agreement - XYZ Corp.pdf",
    predicted: "Contracts",
    confidence: 0.97,
    status: "confirmed",
    timestamp: "8 minutes ago",
  },
  {
    id: "4",
    document: "Employee Handbook v3.2.pdf",
    predicted: "HR Documents",
    confidence: 0.89,
    status: "review",
    timestamp: "12 minutes ago",
  },
]

export function CategorizationCenter() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [autoClassify, setAutoClassify] = useState(true)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-success" />
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />
      case "review":
        return <AlertCircle className="w-4 h-4 text-info" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Document Categorization</h1>
          <p className="text-muted-foreground mt-2">AI-powered document classification and category management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-transparent">
            <Settings className="w-4 h-4 mr-2" />
            Configure Rules
          </Button>
          <Button className="gradient-primary">
            <Brain className="w-4 h-4 mr-2" />
            Retrain Model
          </Button>
        </div>
      </div>

      {/* Classification Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">307</div>
            <p className="text-xs text-muted-foreground mt-1">+23 this week</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Auto-Classified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">289</div>
            <p className="text-xs text-muted-foreground mt-1">94% accuracy</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Active categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Category Distribution
              </CardTitle>
              <CardDescription>Document count and classification accuracy by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{category.count} docs</span>
                      <span>{category.accuracy}% accuracy</span>
                    </div>
                  </div>
                  <Progress value={(category.count / 307) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Classification Settings */}
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Classification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="confidence">Confidence Threshold</Label>
                <Select defaultValue="90">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="80">80%</SelectItem>
                    <SelectItem value="85">85%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                    <SelectItem value="95">95%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="auto-classify">Auto-Classification</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant={autoClassify ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoClassify(true)}
                  >
                    Enabled
                  </Button>
                  <Button
                    variant={!autoClassify ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoClassify(false)}
                  >
                    Disabled
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="new-category">Add New Category</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Category name" />
                  <Button size="sm">Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-transparent" variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Bulk Categorize
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export Categories
              </Button>
              <Button className="w-full gradient-primary">
                <Brain className="w-4 h-4 mr-2" />
                Train Custom Model
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Classifications */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Classifications
          </CardTitle>
          <CardDescription>Latest AI-powered document categorizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentClassifications.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-balance">{item.document}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{item.predicted}</Badge>
                      <Badge variant="outline">{(item.confidence * 100).toFixed(0)}% confidence</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{item.timestamp}</span>
                  {getStatusIcon(item.status)}
                  <div className="flex gap-2">
                    {item.status === "pending" && (
                      <>
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm" className="gradient-primary">
                          Confirm
                        </Button>
                      </>
                    )}
                    {item.status === "review" && (
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
