"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, AlertCircle } from "lucide-react"
import { sanitizeInput, validateCaseSubmission, checkRateLimit } from "@/lib/security"

export function SubmitForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [formData, setFormData] = useState({
    claimantName: "",
    respondentName: "",
    description: "",
    evidenceUrl: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    // Rate limiting check (max 3 submissions per 5 minutes)
    if (!checkRateLimit('case_submission', 3, 5 * 60 * 1000)) {
      setErrors(['Too many submissions. Please wait 5 minutes before submitting again.'])
      return
    }

    // Sanitize inputs
    const sanitizedData = {
      claimant: sanitizeInput(formData.claimantName),
      respondent: sanitizeInput(formData.respondentName),
      description: sanitizeInput(formData.description),
      evidenceUrl: formData.evidenceUrl.trim(),
    }

    // Validate submission
    const validation = validateCaseSubmission(sanitizedData)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/submitCase", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest" // CSRF protection
        },
        body: JSON.stringify({
          claimantName: sanitizedData.claimant,
          respondentName: sanitizedData.respondent,
          description: sanitizedData.description,
          evidenceUrl: sanitizedData.evidenceUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to submit case")
      }

      const data = await response.json()
      router.push(`/verdict/${data.caseId}`)
    } catch (error) {
      console.error("Error submitting case:", error)
      setErrors([error instanceof Error ? error.message : "Failed to submit dispute. Please try again."])
    } finally {
      setIsLoading(false)
    }
  }

  const characterCount = formData.description.length
  const maxCharacters = 1000

  return (
    <form onSubmit={handleSubmit} className="card space-y-6 animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">New Dispute Submission</h2>
        <p className="text-sm text-slate-400">Fill in all the details about your dispute</p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-400 mb-2">Please fix the following errors:</h3>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-300">• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="animate-fade-in-up animation-delay-100">
          <label className="block mb-2 text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">1</span>
            Claimant Name
          </label>
          <input
            type="text"
            name="claimantName"
            value={formData.claimantName}
            onChange={handleInputChange}
            placeholder="Your name"
            required
            className="input-field"
          />
        </div>

        <div className="animate-fade-in-up animation-delay-200">
          <label className="block mb-2 text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">2</span>
            Respondent Name
          </label>
          <input
            type="text"
            name="respondentName"
            value={formData.respondentName}
            onChange={handleInputChange}
            placeholder="Other party's name"
            required
            className="input-field"
          />
        </div>

        <div className="animate-fade-in-up animation-delay-300">
          <label className="block mb-2 text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">3</span>
            Dispute Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your dispute in detail..."
            required
            rows={6}
            maxLength={maxCharacters}
            className="input-field resize-none"
          />
          <div className="mt-1 text-xs text-slate-400 text-right">
            {characterCount}/{maxCharacters} characters
          </div>
        </div>

        <div className="animate-fade-in-up animation-delay-400">
          <label className="block mb-2 text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">4</span>
            Evidence URL
            <span className="text-xs font-normal text-slate-500">(Optional)</span>
          </label>
          <input
            type="url"
            name="evidenceUrl"
            value={formData.evidenceUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/evidence"
            className="input-field"
          />
        </div>
      </div>

      <div className="border-t border-slate-700 pt-6 animate-fade-in-up animation-delay-400">
        <button
          type="submit"
          disabled={isLoading}
          className="button-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              AI Jurors Deliberating...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              Submit Dispute
            </>
          )}
        </button>
        {!isLoading && (
          <p className="mt-3 text-xs text-center text-slate-400">
            Your case will be reviewed by multiple AI jurors
          </p>
        )}
      </div>
    </form>
  )
}
