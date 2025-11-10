import { type NextRequest, NextResponse } from "next/server"
import { storeCase } from "@/lib/case-storage"

interface JurorVerdict {
  name: string
  verdict: string
  reason: string
}

interface SubmitCaseBody {
  claimantName: string
  respondentName: string
  description: string
  evidenceUrl?: string
}

// Mock GenLayer AI Consensus simulation
async function getAIVerdicts(caseDescription: string): Promise<JurorVerdict[]> {
  // In production, this would call GenLayer Studio API
  // For now, we'll simulate the AI jurors' verdicts
  const jurors = [
    {
      name: "Juror 1 (GPT-4)",
      verdict: "Claimant",
      reason:
        "The evidence clearly demonstrates breach of contract. The timeline and documentation support the claimant's claims.",
    },
    {
      name: "Juror 2 (Claude 3)",
      verdict: "Claimant",
      reason:
        "After careful analysis, the preponderance of evidence favors the claimant. The contract terms were violated.",
    },
    {
      name: "Juror 3 (Gemini)",
      verdict: "Claimant",
      reason: "The documentation provided is compelling. The claimant has proven their case with substantial evidence.",
    },
  ]

  return jurors
}

function computeConsensus(jurors: JurorVerdict[]): { verdict: string; reasoning: string } {
  const verdictCounts: Record<string, number> = {}
  jurors.forEach((juror) => {
    verdictCounts[juror.verdict] = (verdictCounts[juror.verdict] || 0) + 1
  })

  const majority = Object.entries(verdictCounts).sort((a, b) => b[1] - a[1])[0]
  const verdict = `${majority[0]} Wins`
  const reasoning = `${majority[1]} out of ${jurors.length} jurors ruled in favor of ${majority[0]}.`

  return { verdict, reasoning }
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitCaseBody = await request.json()
    const caseId = `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Get AI verdicts
    const jurors = await getAIVerdicts(body.description)
    const { verdict, reasoning } = computeConsensus(jurors)

    // Store case data
    const caseData = {
      caseId,
      claimant: body.claimantName,
      respondent: body.respondentName,
      description: body.description,
      evidenceUrl: body.evidenceUrl,
      jurors,
      finalVerdict: verdict,
      reasoning,
      createdAt: new Date().toISOString(),
    }

    // Store in Firebase Firestore
    await storeCase(caseData)

    return NextResponse.json(caseData, { status: 201 })
  } catch (error) {
    console.error("Error in submitCase:", error)
    return NextResponse.json({ error: "Failed to submit case" }, { status: 500 })
  }
}
