"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Zap, Target, BarChart3, Lightbulb, Loader2 } from "lucide-react"

interface AIInsight {
  type: "trend" | "risk" | "opportunity" | "recommendation"
  title: string
  description: string
  confidence: number
  impact: "low" | "medium" | "high"
  actionable: boolean
}

const mockInsights: AIInsight[] = [
  {
    type: "trend",
    title: "Increasing Safety Document Volume",
    description: "Safety-related documents have increased 35% this month, indicating heightened focus on compliance.",
    confidence: 0.92,
    impact: "medium",
    actionable: true,
  },
  {
    type: "risk",
    title: "Contract Review Bottleneck",
    description: "Average contract review time has increased to 4.2 days, potentially delaying procurement processes.",
    confidence: 0.87,
    impact: "high",
    actionable: true,
  },
  {
    type: "opportunity",
    title: "AI Classification Accuracy Improvement",
    description: "Recent model updates show 96.4% accuracy. Consider expanding automated workflows.",
    confidence: 0.94,
    impact: "high",
    actionable: true,
  },
  {
    type: "recommendation",
    title: "Optimize Document Routing",
    description: "Finance documents could be auto-routed to reduce manual assignment by 60%.",
    confidence: 0.89,
    impact: "medium",
    actionable: true,
  },
]

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null)

  useEffect(() => {
    // Simulate AI insights loading
    const timer = setTimeout(() => {
      setInsights(mockInsights)
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getInsightIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="w-4 h-4 text-info" />
      case "risk":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      case "opportunity":
        return <Target className="w-4 h-4 text-success" />
      case "recommendation":
        return <Lightbulb className="w-4 h-4 text-warning" />
    }
  }

  const getImpactColor = (impact: AIInsight["impact"]) => {
    switch (impact) {
      case "low":
        return "secondary"
      case "medium":
        return "default"
      case "high":
        return "destructive"
    }
  }

  if (isLoading) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing patterns and generating insights...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Insights & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                onClick={() => setSelectedInsight(insight)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="font-semibold text-balance">{insight.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getImpactColor(insight.impact)} className="text-xs">
                      {insight.impact} impact
                    </Badge>
                    {insight.actionable && (
                      <Badge variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Actionable
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 text-pretty">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <Progress value={insight.confidence * 100} className="w-20 h-2" />
                    <span className="text-xs font-medium">{(insight.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-background/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Document Volume Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Safety Documents</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span className="text-sm font-medium">+35%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Financial Reports</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span className="text-sm font-medium">+12%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Contracts</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">-5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing Speed</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span className="text-sm font-medium">18% faster</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Accuracy</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-success" />
                        <span className="text-sm font-medium">96.4%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Satisfaction</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-success" />
                        <span className="text-sm font-medium">4.7/5.0</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="space-y-3">
              {insights
                .filter((insight) => insight.actionable)
                .map((insight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex items-center gap-3">
                      {getInsightIcon(insight.type)}
                      <div>
                        <p className="font-medium text-sm text-balance">{insight.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {insight.impact} impact • {(insight.confidence * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="gradient-primary">
                      <Zap className="w-3 h-3 mr-1" />
                      Take Action
                    </Button>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
