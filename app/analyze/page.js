'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function AnalyzePage() {
  const router = useRouter()
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please fill in both fields before analyzing.')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
          user_id: user?.id ?? null,
        }),
      })

      if (!res.ok) {
        const { error: apiError } = await res.json()
        throw new Error(apiError ?? 'Something went wrong')
      }

      const result = await res.json()
      sessionStorage.setItem('analysis_result', JSON.stringify(result))
      router.push('/results')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-zinc-900 hover:text-zinc-600">
            ResumeSnap
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900">Analyze Your Resume</h1>
          <p className="mt-2 text-zinc-500">
            Paste your resume and a job description to get an AI-powered analysis.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <label
                htmlFor="resume"
                className="mb-2 text-sm font-medium text-zinc-700"
              >
                Paste Your Resume
              </label>
              <textarea
                id="resume"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={18}
                className="flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                placeholder="Paste the full text of your resume here..."
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="job"
                className="mb-2 text-sm font-medium text-zinc-700"
              >
                Paste Job Description
              </label>
              <textarea
                id="job"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={18}
                className="flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                placeholder="Paste the job description here..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-8 py-3 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Analyze My Resume'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
