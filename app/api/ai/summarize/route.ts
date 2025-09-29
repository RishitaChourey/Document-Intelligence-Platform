import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { content, documentType } = await request.json()

    const { text: summary } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Summarize this ${documentType} document for KMRL (Kochi Metro Rail Limited) management:

      Content: ${content}
      
      Provide:
      1. Executive summary (2-3 sentences)
      2. Key findings or points (bullet points)
      3. Action items or recommendations
      4. Compliance or risk considerations
      
      Format as structured text suitable for management review.`,
    })

    return NextResponse.json({
      success: true,
      summary,
      wordCount: content.split(" ").length,
      processingTime: Date.now(),
    })
  } catch (error) {
    console.error("AI Summarization error:", error)
    return NextResponse.json({ success: false, error: "Failed to summarize document" }, { status: 500 })
  }
}
