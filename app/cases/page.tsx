import { CasesList } from "@/components/cases-list"

export const metadata = {
  title: "Past Cases - JuryChain",
  description: "View all resolved cases and verdicts",
}

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold gradient-text">Past Cases</h1>
          <p className="text-slate-400">Browse all resolved disputes and their verdicts</p>
        </div>

        <CasesList />
      </div>
    </div>
  )
}
