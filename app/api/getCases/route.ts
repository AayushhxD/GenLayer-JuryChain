import { type NextRequest, NextResponse } from "next/server"
import { getCasesSummary } from "@/lib/case-storage"

export async function GET(request: NextRequest) {
  try {
    // Get all cases from Firebase
    const cases = await getCasesSummary()

    return NextResponse.json({ cases })
  } catch (error) {
    console.error("Error in getCases:", error)
    return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 })
  }
}
