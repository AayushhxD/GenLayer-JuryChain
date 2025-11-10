"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Loader2, Link2 } from "lucide-react"

interface Case {
  caseId: string
  claimant: string
  respondent: string
  verdict: string
  createdAt: string
  storedOnchain?: boolean
  transactionHash?: string
}

export function CasesList() {
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch("/api/getCases")
        if (!response.ok) throw new Error("Failed to fetch cases")
        const data = await response.json()
        setCases(data.cases || [])
      } catch (error) {
        console.error("Error fetching cases:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCases()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (cases.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-400 mb-4">No cases yet. Be the first to submit!</p>
        <Link href="/submit" className="button-primary inline-block">
          Submit Dispute
        </Link>
      </div>
    )
  }

  const getVerdictColor = (verdict: string) => {
    const lowerVerdict = verdict.toLowerCase()
    // Check for claimant winning
    if (lowerVerdict.includes("claimant wins") || 
        lowerVerdict.includes("favor of claimant") || 
        lowerVerdict.includes("claimant victory")) {
      return "bg-green-500/10 text-green-400 border-green-500/50"
    } 
    // Check for respondent winning
    else if (lowerVerdict.includes("respondent wins") || 
             lowerVerdict.includes("favor of respondent") || 
             lowerVerdict.includes("respondent victory")) {
      return "bg-blue-500/10 text-blue-400 border-blue-500/50"
    } 
    // Check for dismissed or no fault
    else if (lowerVerdict.includes("dismissed") || 
             lowerVerdict.includes("no fault") || 
             lowerVerdict.includes("tie")) {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/50"
    }
    return "bg-slate-700 text-slate-200"
  }

  return (
    <div className="space-y-4">
      {cases.map((caseItem, index) => (
        <Link
          key={caseItem.caseId}
          href={`/verdict/${caseItem.caseId}`}
          className="block p-6 rounded-lg hover:bg-slate-800/30 cursor-pointer transition-all animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-medium text-slate-400">
                  {new Date(caseItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">
                {caseItem.claimant} vs {caseItem.respondent}
              </h3>
              <p className="text-sm text-slate-400 mb-3 font-mono">#{caseItem.caseId.slice(0, 8)}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getVerdictColor(caseItem.verdict)}`}>
                  {caseItem.verdict}
                </span>
                {caseItem.storedOnchain && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/50">
                    <Link2 className="h-3 w-3" />
                    Onchain
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-cyan-400 ml-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      ))}
    </div>
  )
}
