'use client'

import { useState } from 'react'
import { createClient } from '../utils/supabase/client'
import NavBar from '../components/NavBar'
import Link from 'next/link'

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

export default function BulletsPage() {
  const [bulletPoints, setBulletPoints] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [limitReached, setLimitReached] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const rewrite = async () => {
    setError('')
    setLimitReached(false)

    if (!bulletPoints.trim()) {
      setError('Please paste your bullet points before rewriting.')
      return
    }

    setLoading(true)

    try {
      const { data: { user } } = await createClient().auth.getUser()

      const res = await fetch('/api/bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet_points: bulletPoints,
          job_description: jobDescription,
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

      const { rewritten_bullets } = await res.json()
      setResult(rewritten_bullets)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    rewrite()
  }

  const handleRewriteAgain = () => {
    setResult(null)
    rewrite()
  }

  const handleReset = () => {
    setResult(null)
    setBulletPoints('')
    setJobDescription('')
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
          <h1 className="text-3xl font-semibold text-zinc-900">CV Bullet Rewriter</h1>
          <p className="mt-2 text-zinc-500">
            Paste your weak bullet points and get stronger, metrics-driven versions instantly.
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
              You&apos;ve used your 2 free rewrites this month. Upgrade to rewrite more.
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
                <label htmlFor="bullets" className="mb-2 text-sm font-medium text-zinc-700">
                  Paste Your Weak Bullet Points
                </label>
                <textarea
                  id="bullets"
                  value={bulletPoints}
                  onChange={(e) => setBulletPoints(e.target.value)}
                  rows={18}
                  className="flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  placeholder={"• Responsible for managing team projects\n• Helped with customer support\n• Worked on improving sales"}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="job" className="mb-2 text-sm font-medium text-zinc-700">
                  Job Description{' '}
                  <span className="font-normal text-zinc-400">(optional)</span>
                </label>
                <textarea
                  id="job"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={18}
                  className="flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  placeholder="Paste the job description to tailor the bullets to this specific role..."
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
                    <Spinner />
                    Rewriting...
                  </>
                ) : (
                  'Rewrite Bullet Points'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700">Rewritten bullet points</span>
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
                rows={14}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleReset}
                className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                Start over
              </button>
              <button
                onClick={handleRewriteAgain}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Rewriting...
                  </>
                ) : (
                  'Rewrite again'
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
