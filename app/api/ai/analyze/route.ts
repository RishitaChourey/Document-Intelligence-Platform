import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, fileSize } = await request.json()

    const { text: analysis } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Analyze this document and provide:
      1. Category classification (Financial Report, Safety Audit, Contract, Policy Document, Technical Manual, Compliance Report, or Other)
      2. Department assignment (Finance, Operations, Procurement, HR, Engineering, Safety, or Legal)
      3. Risk score (0.0 to 1.0 based on content sensitivity and compliance requirements)
      4. Priority level (Low, Medium, High, or Urgent)
      5. Brief summary (2-3 sentences)
      6. Relevant tags (3-5 keywords)
      7. Recommended workflow actions

      Document: ${fileName} (${fileType}, ${fileSize})
      
      Respond in JSON format with keys: category, department, riskScore, priority, summary, tags, workflowActions`,
    })

    // Parse AI response
    let aiResult
    try {
      aiResult = JSON.parse(analysis)
    } catch {
      // Fallback if JSON parsing fails
      aiResult = {
        category: "Other",
        department: "Operations",
        riskScore: 0.5,
        priority: "Medium",
        summary: "Document analysis completed. Manual review recommended for detailed classification.",
        tags: ["document", "analysis", "review"],
        workflowActions: ["Manual review required", "Assign to department head"],
      }
    }

    return NextResponse.json({
      success: true,
      analysis: aiResult,
      processingTime: Math.random() * 3 + 1, // Simulated processing time
    })
  } catch (error) {
    console.error("AI Analysis error:", error)
    return NextResponse.json({ success: false, error: "Failed to analyze document" }, { status: 500 })
  }
}
