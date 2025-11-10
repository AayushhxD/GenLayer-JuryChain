import { type NextRequest, NextResponse } from "next/server"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface StoreVerdictBody {
  caseId: string
  verdict: string
  transactionHash?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: StoreVerdictBody = await request.json()

    // Update the case in Firebase with transaction hash
    if (body.transactionHash) {
      const caseRef = doc(db, "cases", body.caseId)
      await updateDoc(caseRef, {
        transactionHash: body.transactionHash,
        storedOnchain: true,
        onchainTimestamp: new Date().toISOString()
      })
    }

    const response = {
      success: true,
      message: "Verdict stored on Base Sepolia testnet",
      transactionHash: body.transactionHash,
      caseId: body.caseId,
      verdict: body.verdict,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in storeVerdict:", error)
    return NextResponse.json({ error: "Failed to store verdict" }, { status: 500 })
  }
}
