import { type NextRequest, NextResponse } from "next/server"
import { getCase } from "@/lib/case-storage"

export async function GET(request: NextRequest, { params }: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await params

    // Get case from Firebase
    const caseData = await getCase(caseId)

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 })
    }

    // Return case data in the format expected by VerdictDisplay
    return NextResponse.json({
      caseId: caseData.caseId,
      claimant: caseData.claimant,
      respondent: caseData.respondent,
      description: caseData.description,
      jurors: caseData.jurors,
      finalVerdict: caseData.finalVerdict,
      reasoning: caseData.reasoning,
    })
  } catch (error) {
    console.error("Error in getCase:", error)
    return NextResponse.json({ error: "Failed to fetch case" }, { status: 500 })
  }
}
