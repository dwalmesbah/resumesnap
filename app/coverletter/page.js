'use client'

import { useState } from 'react'
import { createClient } from '../utils/supabase/client'
import NavBar from '../components/NavBar'
import Link from 'next/link'

const TONES = ['Formal', 'Friendly', 'Confident']

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

export default function CoverLetterPage() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [tone, setTone] = useState('Formal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setError('')
    setLimitReached(false)

    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please fill in both fields before generating.')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await createClient().auth.getUser()

      const res = await fetch('/api/coverletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
          tone,
          user_id: user?.id ?? null,
        }),
      })

      if (res.status === 403) {
        setLimitReached(true)
        setLoading(false)
        return
      }

      if (!res.ok) {
        const { error: apiError } = await res.json()
        throw new Error(apiError ?? 'Something went wrong')
      }

      const { generated_letter } = await res.json()
      setResult(generated_letter)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    generate()
  }

  const handleRegenerate = () => {
    setResult(null)
    generate()
  }

  const handleReset = () => {
    setResult(null)
    setResumeText('')
    setJobDescription('')
    setTone('Formal')
    setError('')
    setLimitReached(false)
    setCopied(false)
  }

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-zinc-900">Cover Letter Generator</h1>
          <p className="mt-2 text-zinc-500">
            Paste your resume and a job description to generate a tailored cover letter.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {limitReached && (
          <div className="mb-6 rounded-xl border border-zinc-200 bg-white px-6 py-5">
            <p className="text-sm font-semibold text-zinc-900">Monthly limit reached</p>
            <p className="mt-1 text-sm text-zinc-500">
              You&apos;ve used your 2 free cover letters this month. Upgrade to generate more.
            </p>
            <Link
              href="/account"
              className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Upgrade plan
            </Link>
          </div>
        )}

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="resume" className="mb-2 text-sm font-medium text-zinc-700">
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
                <label htmlFor="job" className="mb-2 text-sm font-medium text-zinc-700">
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

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-700">Tone</span>
              <div className="flex gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      tone === t
                        ? 'border-zinc-900 bg-zinc-900 text-white'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
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
                    <Spinner />
                    Generating...
                  </>
                ) : (
                  'Generate Cover Letter'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700">
                  Generated cover letter &mdash; <span className="text-zinc-400">{tone}</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </button>
              </div>
              <textarea
                readOnly
                value={result}
                rows={20}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleReset}
                className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Generate another
              </button>
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Regenerating...
                  </>
                ) : (
                  'Regenerate'
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
