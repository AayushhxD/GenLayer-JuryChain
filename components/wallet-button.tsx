"use client"

import { useWallet } from "@/contexts/wallet-context"
import { Wallet, LogOut, CheckCircle2, AlertCircle, RefreshCw, Send } from "lucide-react"
import { useState, useEffect } from "react"
import { PaymentModal } from "./payment-modal"

export function WalletButton() {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    connect, 
    disconnect, 
    targetAddress,
    balance,
    network,
    isCorrectNetwork,
    refreshBalance
  } = useWallet()
  const [isMounted, setIsMounted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-800"></div>
    )
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshBalance()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const getNetworkName = (chainId: string | null) => {
    if (!chainId) return "Unknown"
    const id = parseInt(chainId, 16)
    const networks: { [key: number]: string } = {
      1: "Ethereum",
      8453: "Base",
      84532: "Base Sepolia",
      137: "Polygon",
      80001: "Mumbai",
    }
    return networks[id] || `Chain ${id}`
  }

  const isCorrectAddress = address?.toLowerCase() === targetAddress.toLowerCase()

  if (isConnected && address) {
    return (
      <>
        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)}
          defaultRecipient={targetAddress}
        />
        <div className="flex items-center gap-2">
          {/* Balance and Address Display */}
        <div className={`flex flex-col gap-1 rounded-lg border px-3 py-2 ${
          isCorrectAddress 
            ? "border-green-500/50 bg-green-500/10" 
            : "border-yellow-500/50 bg-yellow-500/10"
        }`}>
          <div className="flex items-center gap-2">
            {isCorrectAddress ? (
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-400" />
            )}
            <span className={`text-sm font-medium ${
              isCorrectAddress ? "text-green-400" : "text-yellow-400"
            }`}>
              {formatAddress(address)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={isCorrectAddress ? "text-green-300" : "text-yellow-300"}>
              {balance ? `${balance} ETH` : "Loading..."}
            </span>
            <span className={`px-1.5 py-0.5 rounded ${
              isCorrectNetwork 
                ? "bg-green-500/20 text-green-300" 
                : "bg-red-500/20 text-red-300"
            }`}>
              {getNetworkName(network)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-50 disabled:opacity-50"
          title="Refresh Balance"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="flex items-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
          title="Send Payment"
        >
          <Send className="h-4 w-4" />
        </button>

        <button
          onClick={disconnect}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-50"
          title="Disconnect Wallet"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
      </>
    )
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  )
}

