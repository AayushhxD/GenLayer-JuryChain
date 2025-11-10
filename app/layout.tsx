import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/contexts/wallet-context"
import { Navigation } from "@/components/navigation"
import { TestnetHelper } from "@/components/testnet-helper"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JuryChain - AI-Powered Onchain Justice",
  description: "Decentralized AI court where users submit disputes and get verdicts from multiple LLM jurors",
}

export const viewport = {
  themeColor: "#0f172a",
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} bg-slate-950 text-slate-50`}>
        <WalletProvider>
          <Navigation />
          <main className="min-h-screen bg-slate-950">{children}</main>
          <TestnetHelper />
          <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm mt-20">
            <div className="mx-auto max-w-7xl px-6 py-8">
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      J
                    </div>
                    <h2 className="text-lg font-bold text-slate-50">JuryChain</h2>
                  </div>
                  <p className="text-sm text-slate-400">
                    AI-powered decentralized justice system built on blockchain technology.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-50 mb-3">Quick Links</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="/" className="hover:text-slate-50 transition-colors">Home</a></li>
                    <li><a href="/cases" className="hover:text-slate-50 transition-colors">Cases</a></li>
                    <li><a href="/submit" className="hover:text-slate-50 transition-colors">Submit Dispute</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-50 mb-3">Technology</h3>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>GenLayer AI Consensus</li>
                    <li>Base Blockchain</li>
                    <li>Multi-LLM Jury System</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
                <p>© 2025 JuryChain. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </WalletProvider>
      </body>
    </html>
  )
}
