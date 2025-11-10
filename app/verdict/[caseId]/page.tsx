import { VerdictDisplay } from "@/components/verdict-display"

export const metadata = {
  title: "Case Verdict - JuryChain",
  description: "View AI jury verdict for this case",
}

export default async function VerdictPage({
  params,
}: {
  params: Promise<{ caseId: string }>
}) {
  const { caseId } = await params

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <VerdictDisplay caseId={caseId} />
      </div>
    </div>
  )
}
