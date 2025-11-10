import { type NextRequest, NextResponse } from "next/server"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { isValidTxHash, sanitizeInput } from "@/lib/security"

interface StoreVerdictBody {
  caseId: string
  verdict: string
  transactionHash?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: StoreVerdictBody = await request.json()

    // Validate inputs
    if (!body.caseId || !body.verdict) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Sanitize caseId
    const sanitizedCaseId = sanitizeInput(body.caseId)
    
    // Validate case ID format
    if (!sanitizedCaseId.startsWith('CASE-')) {
      return NextResponse.json({ error: "Invalid case ID format" }, { status: 400 })
    }

    // Validate transaction hash if provided
    if (body.transactionHash && !isValidTxHash(body.transactionHash)) {
      return NextResponse.json({ error: "Invalid transaction hash format" }, { status: 400 })
    }

    // Update the case in Firebase with transaction hash
    if (body.transactionHash) {
      const caseRef = doc(db, "cases", sanitizedCaseId)
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
      caseId: sanitizedCaseId,
      verdict: sanitizeInput(body.verdict),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in storeVerdict:", error)
    return NextResponse.json({ error: "Failed to store verdict" }, { status: 500 })
  }
}
