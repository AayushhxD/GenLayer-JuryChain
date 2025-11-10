// Firebase Firestore storage for cases

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy
} from "firebase/firestore"
import { db } from "./firebase"

export interface Case {
  caseId: string
  claimant: string
  respondent: string
  description: string
  evidenceUrl?: string
  jurors: Array<{
    name: string
    verdict: string
    reason: string
  }>
  finalVerdict: string
  reasoning: string
  createdAt: string
  transactionHash?: string
  storedOnchain?: boolean
}

const CASES_COLLECTION = "cases"

export async function storeCase(caseData: Case): Promise<void> {
  try {
    const caseRef = doc(db, CASES_COLLECTION, caseData.caseId)
    await setDoc(caseRef, caseData)
  } catch (error) {
    console.error("Error storing case:", error)
    throw new Error("Failed to store case")
  }
}

export async function getCase(caseId: string): Promise<Case | null> {
  try {
    const caseRef = doc(db, CASES_COLLECTION, caseId)
    const caseSnap = await getDoc(caseRef)
    
    if (caseSnap.exists()) {
      return caseSnap.data() as Case
    }
    return null
  } catch (error) {
    console.error("Error getting case:", error)
    throw new Error("Failed to get case")
  }
}

export async function getAllCases(): Promise<Case[]> {
  try {
    const casesRef = collection(db, CASES_COLLECTION)
    const q = query(casesRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map((doc) => doc.data() as Case)
  } catch (error) {
    console.error("Error getting all cases:", error)
    throw new Error("Failed to get cases")
  }
}

export async function getCasesSummary(): Promise<Array<{
  caseId: string
  claimant: string
  respondent: string
  verdict: string
  createdAt: string
  storedOnchain?: boolean
  transactionHash?: string
}>> {
  try {
    const cases = await getAllCases()
    return cases.map((caseData) => ({
      caseId: caseData.caseId,
      claimant: caseData.claimant,
      respondent: caseData.respondent,
      verdict: caseData.finalVerdict,
      createdAt: caseData.createdAt,
      storedOnchain: caseData.storedOnchain,
      transactionHash: caseData.transactionHash,
    }))
  } catch (error) {
    console.error("Error getting cases summary:", error)
    throw new Error("Failed to get cases summary")
  }
}

