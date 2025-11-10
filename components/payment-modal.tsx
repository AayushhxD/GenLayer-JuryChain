"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { X, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { isValidEthAddress, isValidPaymentAmount, checkRateLimit } from "@/lib/security"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  defaultRecipient?: string
}

export function PaymentModal({ isOpen, onClose, defaultRecipient }: PaymentModalProps) {
  const { sendPayment, balance } = useWallet()
  const [recipient, setRecipient] = useState(defaultRecipient || "")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string>("")

  // Update recipient when defaultRecipient changes
  useEffect(() => {
    if (defaultRecipient && !recipient) {
      setRecipient(defaultRecipient)
    }
  }, [defaultRecipient, recipient])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setTxHash(null)

    // Rate limiting (max 5 payments per minute)
    if (!checkRateLimit('payment', 5, 60 * 1000)) {
      setError('Too many payment attempts. Please wait a minute.')
      return
    }

    // Validate recipient address
    if (!isValidEthAddress(recipient)) {
      setError('Invalid Ethereum address format')
      return
    }

    // Validate amount
    if (!balance || !isValidPaymentAmount(amount, balance)) {
      setError('Invalid payment amount or insufficient balance')
      return
    }

    setIsLoading(true)

    try {
      const hash = await sendPayment(recipient, amount)
      if (hash) {
        setTxHash(hash)
        setTimeout(() => {
          handleClose()
        }, 3000)
      } else {
        setError('Transaction failed. Please try again.')
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setRecipient("")
    setAmount("")
    setTxHash(null)
    setError("")
    setIsLoading(false)
    onClose()
  }

  const setMaxAmount = () => {
    if (balance) {
      // Leave some ETH for gas fees
      const maxAmount = Math.max(0, parseFloat(balance) - 0.001)
      setAmount(maxAmount.toFixed(4))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 pt-24">
      <div className="relative w-full max-w-md mx-auto rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold gradient-text">Send Payment</h2>
          <p className="mt-1 text-sm text-slate-400">
            Available: {balance ? `${balance} ETH` : "Loading..."}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        {txHash ? (
          /* Success State */
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-50">Payment Sent!</h3>
            <p className="text-sm text-slate-400 break-all px-4">
              Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </p>
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300"
            >
              View on Explorer →
            </a>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient Address */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-200">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                required
                pattern="^0x[a-fA-F0-9]{40}$"
                className="input-field"
                disabled={isLoading}
              />
              {defaultRecipient && recipient === defaultRecipient && (
                <p className="mt-1 text-xs text-cyan-400">
                  💡 JuryChain treasury wallet pre-filled
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-200">
                Amount (ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  required
                  className="input-field pr-16"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={setMaxAmount}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-600"
                  disabled={isLoading}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Estimated Fee */}
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Estimated Fee:</span>
                <span className="text-slate-200">~0.001 ETH</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !recipient || !amount}
              className="button-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Payment
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
