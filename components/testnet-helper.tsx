"use client"

import { useWallet } from "@/contexts/wallet-context"
import { Droplets, ExternalLink, Info, Zap } from "lucide-react"

export function TestnetHelper() {
  const { isConnected, isTestnet, switchToTestnet, address, balance } = useWallet()

  if (!isConnected) return null

  const needsTestnetETH = balance && parseFloat(balance) < 0.01

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      {/* Network Warning */}
      {isConnected && !isTestnet && (
        <div className="card border-2 border-yellow-500/50 bg-yellow-500/10 animate-fade-in">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-400 mb-1">
                Wrong Network
              </h3>
              <p className="text-xs text-yellow-300 mb-3">
                Please switch to Base Sepolia testnet to use this app
              </p>
              <button
                onClick={switchToTestnet}
                className="w-full px-3 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-sm font-medium hover:bg-yellow-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Switch to Base Sepolia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Low Balance / Faucet Info */}
      {isConnected && isTestnet && needsTestnetETH && (
        <div className="card border-2 border-cyan-500/50 bg-cyan-500/10 animate-fade-in mt-4">
          <div className="flex items-start gap-3">
            <Droplets className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-cyan-400 mb-1">
                Need Testnet ETH?
              </h3>
              <p className="text-xs text-cyan-300 mb-3">
                Get free test ETH from these faucets
              </p>
              <div className="space-y-2">
                <a
                  href="https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Coinbase Faucet</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
                <a
                  href="https://www.alchemy.com/faucets/base-sepolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>Alchemy Faucet</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </a>
                {address && (
                  <div className="mt-2 pt-2 border-t border-cyan-500/30">
                    <p className="text-xs text-cyan-300/70 break-all">
                      Your address: {address.slice(0, 10)}...{address.slice(-8)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
