"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface AIChatProps {
  documentContext?: {
    id: string
    name: string
    category: string
    summary: string
  }
}

const getDummyResponse = (userMessage: string, documentContext?: any): string => {
  const message = userMessage.toLowerCase()

  if (message.includes("summary") || message.includes("summarize")) {
    return documentContext
      ? `Here's a summary of "${documentContext.name}": ${documentContext.summary}. The document contains key information relevant to ${documentContext.category} operations and requires attention from the ${documentContext.department || "relevant"} department.`
      : "I can help you summarize documents once they're uploaded. The AI system analyzes content structure, extracts key points, and provides comprehensive summaries for quick review."
  }

  if (message.includes("risk") || message.includes("compliance")) {
    return "Based on my analysis, this document shows moderate compliance risk factors. Key areas to review include regulatory alignment, approval workflows, and stakeholder sign-offs. I recommend prioritizing review by the compliance team."
  }

  if (message.includes("workflow") || message.includes("process")) {
    return "For this document type, I recommend the following workflow: 1) Initial review by department head, 2) Compliance check if required, 3) Final approval by authorized personnel, 4) Archive with proper categorization. Would you like me to initiate this workflow?"
  }

  if (message.includes("category") || message.includes("classify")) {
    return documentContext
      ? `This document has been classified as "${documentContext.category}" based on content analysis. The classification considers document structure, key terms, and regulatory indicators.`
      : "I can automatically categorize documents into types like Financial Reports, Safety Audits, Contracts, Policy Documents, Technical Manuals, and Compliance Reports based on content analysis."
  }

  if (message.includes("hello") || message.includes("hi") || message.includes("help")) {
    return "Hello! I'm your AI document intelligence assistant. I can help you with document analysis, summarization, risk assessment, workflow recommendations, and compliance checking. What would you like to know?"
  }

  if (message.includes("data") || message.includes("extract")) {
    return "I can extract structured data from documents including tables, charts, key figures, dates, and important metrics. For this document, I've identified relevant data points that can be exported for further analysis."
  }

  // Default response
  return "I understand your question about the document. Based on my analysis, I can provide insights on content structure, compliance requirements, risk factors, and recommended workflows. Could you be more specific about what aspect you'd like me to focus on?"
}

export function AIChat({ documentContext }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: documentContext
        ? `Hello! I'm here to help you with questions about "${documentContext.name}". What would you like to know?`
        : "Hello! I'm your AI assistant for document intelligence. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    // Simulate AI processing delay
    setTimeout(
      () => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: getDummyResponse(currentInput, documentContext),
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      },
      1000 + Math.random() * 2000,
    ) // Random delay between 1-3 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="glass h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Assistant
          {documentContext && (
            <Badge variant="outline" className="ml-2">
              {documentContext.category}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                    {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm text-pretty">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about the document..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="sm">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
