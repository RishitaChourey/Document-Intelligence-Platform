"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import {
  Workflow,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  ArrowRight,
  Play,
  Pause,
  Settings,
  Plus,
} from "lucide-react"

interface WorkflowDocument {
  id: string
  name: string
  category: string
  department: string
  assignee: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  daysInStage: number
  riskScore: number
}

interface WorkflowStage {
  id: string
  title: string
  documents: WorkflowDocument[]
  color: string
}

const initialWorkflowData: WorkflowStage[] = [
  {
    id: "uploaded",
    title: "Uploaded",
    color: "bg-blue-500",
    documents: [
      {
        id: "doc1",
        name: "Maintenance Contract Q1.pdf",
        category: "Contract",
        department: "Procurement",
        assignee: "System",
        priority: "Medium",
        daysInStage: 0,
        riskScore: 0.3,
      },
    ],
  },
  {
    id: "review",
    title: "Under Review",
    color: "bg-yellow-500",
    documents: [
      {
        id: "doc2",
        name: "Safety Audit Report - Line 1.docx",
        category: "Safety Audit",
        department: "Operations",
        assignee: "Mike Johnson",
        priority: "Urgent",
        daysInStage: 2,
        riskScore: 0.8,
      },
      {
        id: "doc3",
        name: "Budget Revision 2024.xlsx",
        category: "Financial Report",
        department: "Finance",
        assignee: "Sarah Wilson",
        priority: "High",
        daysInStage: 1,
        riskScore: 0.6,
      },
    ],
  },
  {
    id: "approval",
    title: "Pending Approval",
    color: "bg-orange-500",
    documents: [
      {
        id: "doc4",
        name: "Vendor Agreement - XYZ Corp.pdf",
        category: "Contract",
        department: "Procurement",
        assignee: "Lisa Brown",
        priority: "Medium",
        daysInStage: 3,
        riskScore: 0.4,
      },
    ],
  },
  {
    id: "approved",
    title: "Approved",
    color: "bg-green-500",
    documents: [
      {
        id: "doc5",
        name: "Employee Training Manual v2.1.pdf",
        category: "Training Manual",
        department: "HR",
        assignee: "Emma Wilson",
        priority: "Low",
        daysInStage: 0,
        riskScore: 0.1,
      },
    ],
  },
]

const automationRules = [
  {
    id: "rule1",
    name: "Auto-route Financial Documents",
    description: "Automatically assign financial documents to Finance department head",
    trigger: "Document Category = Financial Report",
    action: "Assign to Finance Head",
    status: "Active",
    documentsProcessed: 45,
  },
  {
    id: "rule2",
    name: "Urgent Priority Escalation",
    description: "Escalate urgent documents after 24 hours",
    trigger: "Priority = Urgent AND Time in stage > 24h",
    action: "Notify Department Manager",
    status: "Active",
    documentsProcessed: 12,
  },
  {
    id: "rule3",
    name: "High Risk Document Alert",
    description: "Send immediate alerts for high-risk documents",
    trigger: "Risk Score > 0.7",
    action: "Send Alert to Compliance Team",
    status: "Active",
    documentsProcessed: 8,
  },
]

export function WorkflowManager() {
  const [workflowData, setWorkflowData] = useState<WorkflowStage[]>(initialWorkflowData)
  const [selectedView, setSelectedView] = useState("kanban")

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const stage = workflowData.find((stage) => stage.id === source.droppableId)
      if (!stage) return

      const newDocuments = Array.from(stage.documents)
      const [reorderedItem] = newDocuments.splice(source.index, 1)
      newDocuments.splice(destination.index, 0, reorderedItem)

      setWorkflowData((prev) =>
        prev.map((stage) => (stage.id === source.droppableId ? { ...stage, documents: newDocuments } : stage)),
      )
    } else {
      // Moving between columns
      const sourceStage = workflowData.find((stage) => stage.id === source.droppableId)
      const destStage = workflowData.find((stage) => stage.id === destination.droppableId)

      if (!sourceStage || !destStage) return

      const sourceDocuments = Array.from(sourceStage.documents)
      const destDocuments = Array.from(destStage.documents)
      const [movedDocument] = sourceDocuments.splice(source.index, 1)

      // Reset days in stage when moving
      movedDocument.daysInStage = 0
      destDocuments.splice(destination.index, 0, movedDocument)

      setWorkflowData((prev) =>
        prev.map((stage) => {
          if (stage.id === source.droppableId) {
            return { ...stage, documents: sourceDocuments }
          }
          if (stage.id === destination.droppableId) {
            return { ...stage, documents: destDocuments }
          }
          return stage
        }),
      )
    }
  }

  const getPriorityColor = (priority: WorkflowDocument["priority"]) => {
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
          <h1 className="text-3xl font-bold text-balance">Workflow Management</h1>
          <p className="text-muted-foreground mt-2">Automated document routing, approvals, and task management</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kanban">Kanban</SelectItem>
              <SelectItem value="list">List View</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      <Tabs defaultValue="board" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="board">Workflow Board</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-6">
          {/* Workflow Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {workflowData.map((stage) => (
              <Card key={stage.id} className="glass">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    {stage.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stage.documents.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stage.documents.filter((doc) => doc.priority === "Urgent").length} urgent
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Kanban Board */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5" />
                Document Workflow Board
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {workflowData.map((stage) => (
                    <div key={stage.id} className="space-y-3">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/20">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                        <h3 className="font-semibold">{stage.title}</h3>
                        <Badge variant="outline" className="ml-auto">
                          {stage.documents.length}
                        </Badge>
                      </div>

                      <Droppable droppableId={stage.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[400px] space-y-2 p-2 rounded-lg transition-colors ${
                              snapshot.isDraggingOver ? "bg-primary/5" : "bg-transparent"
                            }`}
                          >
                            {stage.documents.map((doc, index) => (
                              <Draggable key={doc.id} draggableId={doc.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-3 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors ${
                                      snapshot.isDragging ? "shadow-lg rotate-2" : ""
                                    }`}
                                  >
                                    <h4 className="font-medium text-sm mb-2 text-balance">{doc.name}</h4>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <User className="w-3 h-3" />
                                        <span>{doc.assignee}</span>
                                      </div>

                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span>{doc.daysInStage} days in stage</span>
                                      </div>

                                      <div className="flex items-center justify-between">
                                        <Badge variant={getPriorityColor(doc.priority)} className="text-xs">
                                          {doc.priority}
                                        </Badge>
                                        <span className={`text-xs font-medium ${getRiskColor(doc.riskScore)}`}>
                                          Risk: {(doc.riskScore * 100).toFixed(0)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Automation Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {automationRules.map((rule) => (
                <div key={rule.id} className="p-4 rounded-lg border border-border bg-background/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-balance">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1 text-pretty">{rule.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.status === "Active" ? "default" : "secondary"}>{rule.status}</Badge>
                      <Button variant="ghost" size="sm">
                        {rule.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Trigger:</span>
                      <p className="mt-1">{rule.trigger}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Action:</span>
                      <p className="mt-1">{rule.action}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">Processed {rule.documentsProcessed} documents</span>
                    <Button variant="outline" size="sm">
                      Edit Rule
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Average Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">3.2 days</div>
                <div className="flex items-center text-sm text-success">
                  <ArrowRight className="w-4 h-4 mr-1 rotate-[-45deg]" />
                  18% improvement
                </div>
                <Progress value={75} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Automation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">67%</div>
                <div className="flex items-center text-sm text-info">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Documents auto-processed
                </div>
                <Progress value={67} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">SLA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">94%</div>
                <div className="flex items-center text-sm text-success">
                  <Calendar className="w-4 h-4 mr-1" />
                  Within target timeframes
                </div>
                <Progress value={94} className="mt-3" />
              </CardContent>
            </Card>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Workflow Bottlenecks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <div>
                      <p className="font-medium">Contract Review Stage</p>
                      <p className="text-sm text-muted-foreground">Average 4.2 days (Target: 2 days)</p>
                    </div>
                  </div>
                  <Badge variant="outline">High Impact</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-info" />
                    <div>
                      <p className="font-medium">Final Approval</p>
                      <p className="text-sm text-muted-foreground">Average 2.8 days (Target: 1 day)</p>
                    </div>
                  </div>
                  <Badge variant="outline">Medium Impact</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
