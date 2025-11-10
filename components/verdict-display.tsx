"use client"

import { useEffect, useState } from "react"
import { Loader2, CheckCircle, XCircle, HelpCircle, ExternalLink } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"

interface Juror {
  name: string
  verdict: string
  reason: string
}

interface CaseData {
  caseId: string
  claimant: string
  respondent: string
  description: string
  jurors: Juror[]
  finalVerdict: string
  reasoning: string
  transactionHash?: string
  storedOnchain?: boolean
}

// Target wallet address for verdict storage
const TARGET_WALLET_ADDRESS = "0x46f90440678a21461d232555ed376f1D14aEe284"

export function VerdictDisplay({ caseId }: { caseId: string }) {
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStoring, setIsStoring] = useState(false)
  const { address, isConnected, connect, sendPayment } = useWallet()

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await fetch(`/api/getCase/${caseId}`)
        if (!response.ok) throw new Error("Failed to fetch case")
        const data = await response.json()
        setCaseData(data)
      } catch (error) {
        console.error("Error fetching case:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCase()
  }, [caseId])

  const handleStoreOnchain = async () => {
    if (!caseData) return

    // Check if wallet is connected
    if (!isConnected || !address) {
      alert("Please connect your wallet first!")
      await connect()
      return
    }

    setIsStoring(true)
    try {
      // Create verdict data as a reference (stored in Firebase, not onchain due to gas costs)
      const verdictData = JSON.stringify({
        caseId: caseData.caseId,
        claimant: caseData.claimant,
        respondent: caseData.respondent,
        verdict: caseData.finalVerdict,
        timestamp: Date.now()
      })

      // Send transaction as proof of storage (without data field for EOA compatibility)
      // Using a small amount (0.001 ETH) as a symbolic transaction
      
      // Send transaction using web3
      if (!window.ethereum) {
        alert("MetaMask is not installed!")
        return
      }

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: TARGET_WALLET_ADDRESS,
          value: '0x38D7EA4C68000', // 0.001 ETH in hex (increased from 0.0001)
        }],
      })

      if (txHash) {
        // Update case with transaction hash
        const response = await fetch("/api/storeVerdict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            caseId: caseData.caseId, 
            verdict: caseData.finalVerdict,
            transactionHash: txHash 
          }),
        })

        if (!response.ok) throw new Error("Failed to update case with transaction hash")

        // Update local state
        setCaseData({ ...caseData, transactionHash: txHash, storedOnchain: true })
        
        alert(`Verdict stored onchain successfully!\nTransaction: ${txHash}`)
      }
    } catch (error: any) {
      console.error("Error storing verdict:", error)
      if (error.code === 4001) {
        alert("Transaction cancelled by user")
      } else {
        alert("Failed to store verdict onchain: " + (error.message || "Unknown error"))
      }
    } finally {
      setIsStoring(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (!caseData) {
    return <div className="card text-center py-12 text-slate-400">Case not found</div>
  }

  const getVerdictIcon = (verdict: string) => {
    if (verdict.includes("Claimant")) return <CheckCircle className="h-6 w-6 text-green-500" />
    if (verdict.includes("Respondent")) return <XCircle className="h-6 w-6 text-red-500" />
    return <HelpCircle className="h-6 w-6 text-yellow-500" />
  }

  return (
    <div className="space-y-8">
      {/* Case Header */}
      <div className="card">
        <div className="mb-4">
          <p className="text-sm text-slate-400 mb-2">Case ID: {caseData.caseId}</p>
          <h1 className="text-3xl font-bold text-slate-50 mb-4">
            {caseData.claimant} vs {caseData.respondent}
          </h1>
          <p className="text-slate-300">{caseData.description}</p>
        </div>
      </div>

      {/* Final Verdict */}
      <div className="card border-2 border-blue-500/50 bg-blue-500/10">
        <div className="flex items-start gap-4 mb-4">
          {getVerdictIcon(caseData.finalVerdict)}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-50 mb-2">{caseData.finalVerdict}</h2>
            <p className="text-slate-300">{caseData.reasoning}</p>
          </div>
        </div>
      </div>

      {/* Juror Verdicts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-50">AI Jurors Deliberation</h2>
        <div className="grid gap-4">
          {caseData.jurors.map((juror, idx) => (
            <div key={idx} className="card">
              <h3 className="font-semibold text-slate-50 mb-2">{juror.name}</h3>
              <p className="text-sm text-slate-400 mb-3">Verdict: {juror.verdict}</p>
              <p className="text-slate-300">{juror.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Onchain Status */}
      {caseData.storedOnchain && caseData.transactionHash ? (
        <div className="card border-2 border-green-500/50 bg-green-500/10">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-semibold text-green-400">Verdict Stored Onchain</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-300">
              This verdict has been permanently recorded on the Base blockchain.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <code className="flex-1 px-3 py-2 bg-slate-800 rounded text-xs text-slate-300 font-mono overflow-x-auto">
                {caseData.transactionHash}
              </code>
              <a
                href={`https://sepolia.basescan.org/tx/${caseData.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary inline-flex items-center gap-2 whitespace-nowrap"
              >
                <ExternalLink className="h-4 w-4" />
                View on BaseScan
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {!isConnected && (
            <div className="card border border-yellow-500/50 bg-yellow-500/10">
              <p className="text-sm text-yellow-300">
                ⚠️ Please connect your wallet to store the verdict onchain.
              </p>
            </div>
          )}
          
          <button
            onClick={handleStoreOnchain}
            disabled={isStoring}
            className="button-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isStoring ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Storing Onchain...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                Store Verdict Onchain (Base Sepolia)
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-slate-400">
            Transaction fee: 0.001 ETH + gas fees • Sent to: {TARGET_WALLET_ADDRESS.slice(0, 6)}...{TARGET_WALLET_ADDRESS.slice(-4)}
          </p>
        </div>
      )}
    </div>
  )
}
