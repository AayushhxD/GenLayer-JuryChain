import Link from "next/link"
import { ArrowRight, FileText, Sparkles } from "lucide-react"
import { StatsDashboard } from "@/components/stats-dashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="mb-8 inline-block rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 animate-fade-in-up">
          <span className="text-sm text-cyan-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Powered by GenLayer AI Consensus
          </span>
        </div>

        <h1 className="mb-6 text-6xl font-bold leading-tight gradient-text animate-fade-in-up animation-delay-100">
          AI-Powered Onchain Justice
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-300 animate-fade-in-up animation-delay-200">
          Submit disputes and receive verdicts from multiple LLM jurors. Fast, fair, and transparent justice on the
          blockchain.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up animation-delay-300">
          <Link href="/submit" className="button-primary inline-flex items-center justify-center gap-2">
            Submit New Dispute
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/cases" className="button-secondary inline-flex items-center justify-center gap-2">
            <FileText className="h-5 w-5" />
            View Past Cases
          </Link>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <StatsDashboard />
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="card">
            <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
              ⚖️
            </div>
            <h3 className="mb-3 text-lg font-semibold text-slate-50">Decentralized Justice</h3>
            <p className="text-slate-400">Get verdicts from multiple AI jurors ensuring fair and balanced decisions.</p>
          </div>

          {/* Feature 2 */}
          <div className="card">
            <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
              🤖
            </div>
            <h3 className="mb-3 text-lg font-semibold text-slate-50">AI Consensus</h3>
            <p className="text-slate-400">Multiple LLM models analyze your case and reach a consensus verdict.</p>
          </div>

          {/* Feature 3 */}
          <div className="card">
            <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
              ⛓️
            </div>
            <h3 className="mb-3 text-lg font-semibold text-slate-50">Onchain Storage</h3>
            <p className="text-slate-400">
              All verdicts are permanently recorded on the Base blockchain for transparency.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-50">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-4">
          {[
            { step: 1, title: "Submit Dispute", desc: "Provide details of your dispute with evidence" },
            { step: 2, title: "AI Deliberation", desc: "Multiple LLMs analyze the case simultaneously" },
            { step: 3, title: "Consensus Vote", desc: "Jurors reach a majority verdict" },
            { step: 4, title: "Onchain Record", desc: "Final verdict stored on blockchain" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mb-4 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white mx-auto">
                {item.step}
              </div>
              <h3 className="mb-2 font-semibold text-slate-50">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
