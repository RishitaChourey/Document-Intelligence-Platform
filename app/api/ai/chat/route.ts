import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { message, documentContext, conversationHistory } = await request.json()

    const { text: response } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an AI assistant for KMRL Document Intelligence Platform. Help users with document-related queries.

      Document Context: ${JSON.stringify(documentContext)}
      Conversation History: ${JSON.stringify(conversationHistory)}
      
      User Question: ${message}
      
      Provide a helpful, accurate response based on the document context. If you need more information, ask clarifying questions.`,
    })

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json({ success: false, error: "Failed to process chat message" }, { status: 500 })
  }
}
