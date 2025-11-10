import { SubmitForm } from "@/components/submit-form"

export const metadata = {
  title: "Submit Dispute - JuryChain",
  description: "Submit a new dispute for AI jury evaluation",
}

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold gradient-text">Submit Your Dispute</h1>
          <p className="text-slate-400">Provide details of your dispute and let our AI jurors deliberate</p>
        </div>

        <SubmitForm />
      </div>
    </div>
  )
}
