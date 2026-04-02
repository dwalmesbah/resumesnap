'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../utils/supabase/client'
import NavBar from '../components/NavBar'

const SCORE_DIMENSIONS = [
  { key: 'score_clarity', label: 'Clarity' },
  { key: 'score_relevance', label: 'Relevance' },
  { key: 'score_impact', label: 'Impact' },
  { key: 'score_readability', label: 'Readability' },
  { key: 'score_keyword_match', label: 'Keyword Match' },
]

const SECTION_LABELS = {
  professional_summary: 'Professional Summary',
  bullet_points: 'Bullet Points',
}

function scoreColor(score) {
  if (score >= 75) return 'text-green-600'
  if (score >= 50) return 'text-amber-500'
  return 'text-red-500'
}

function scoreRingColor(score) {
  if (score >= 75) return 'border-green-300 bg-green-50'
  if (score >= 50) return 'border-amber-300 bg-amber-50'
  return 'border-red-300 bg-red-50'
}

function overallRingColor(score) {
  if (score >= 75) return 'border-green-400'
  if (score >= 50) return 'border-amber-400'
  return 'border-red-400'
}

function RewriteCard({ result, plan }) {
  const [rewriteLoading, setRewriteLoading] = useState(false)
  const [rewriteText, setRewriteText] = useState('')
  const [rewriteError, setRewriteError] = useState('')
  const [copied, setCopied] = useState(false)

  const sectionLabel =
    SECTION_LABELS[result.weakest_section] ?? result.weakest_section ?? 'weakest section'

  async function handleRewrite() {
    setRewriteLoading(true)
    setRewriteError('')
    setRewriteText('')

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis_id: result.id,
          weakest_section: result.weakest_section,
        }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Rewrite failed')
      }

      const { rewrite } = await res.json()
      setRewriteText(rewrite)
    } catch (err) {
      setRewriteError(err.message)
    } finally {
      setRewriteLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(rewriteText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4 mb-1">
          <h2 className="text-lg font-semibold text-zinc-900">AI Rewrite</h2>
          <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-white shrink-0">
            Pro
          </span>
        </div>

        <p className="text-sm text-zinc-500 mb-5">
          Your <span className="font-medium text-zinc-700">{sectionLabel}</span> is your weakest
          section. Want AI to rewrite it?
        </p>

        {plan === 'pro' ? (
          <>
            {!rewriteText && (
              <button
                onClick={handleRewrite}
                disabled={rewriteLoading}
                className="flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {rewriteLoading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Rewriting...
                  </>
                ) : (
                  'Rewrite This Section'
                )}
              </button>
            )}

            {rewriteError && (
              <p className="mt-3 text-sm text-red-600">{rewriteError}</p>
            )}

            {rewriteText && (
              <div className="mt-4 space-y-3">
                <textarea
                  readOnly
                  value={rewriteText}
                  rows={6}
                  className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 focus:outline-none"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                  <button
                    onClick={() => { setRewriteText(''); setRewriteError('') }}
                    className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    Rewrite again
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              This is a Pro feature. Upgrade to unlock AI rewrites.
            </p>
            <Link
              href="/account"
              className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default function ResultsPage() {
  const [result, setResult] = useState(null)
  const [plan, setPlan] = useState('free')

  useEffect(() => {
    const stored = sessionStorage.getItem('analysis_result')
    if (stored) {
      setResult(JSON.parse(stored))
    }

    async function fetchPlan() {
      const { data: { user } } = await createClient().auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      if (data?.plan) {
        setPlan(data.plan)
      }
    }

    fetchPlan()
  }, [])

  if (!result) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">No analysis found.</p>
          <Link
            href="/analyze"
            className="rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Analyze a Resume
          </Link>
        </div>
      </div>
    )
  }

  const { score_overall, keyword_matches, tips } = result

  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar />

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">

        {/* Overall Score */}
        <section className="flex flex-col items-center text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-zinc-400 mb-4">
            Overall Score
          </p>
          <div
            className={`flex h-40 w-40 flex-col items-center justify-center rounded-full border-8 ${overallRingColor(score_overall)}`}
          >
            <span className={`text-5xl font-bold ${scoreColor(score_overall)}`}>
              {score_overall}
            </span>
            <span className="text-sm text-zinc-400 font-medium">/100</span>
          </div>
        </section>

        {/* Score Cards */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Score Breakdown</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {SCORE_DIMENSIONS.map(({ key, label }) => {
              const score = result[key]
              return (
                <div
                  key={key}
                  className={`flex flex-col items-center rounded-xl border px-4 py-5 ${scoreRingColor(score)}`}
                >
                  <span className={`text-3xl font-bold ${scoreColor(score)}`}>{score}</span>
                  <span className="mt-1 text-xs text-zinc-500 font-medium text-center">{label}</span>
                  <span className="text-xs text-zinc-400">/100</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Keywords */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Keyword Match</h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-500">Found in your resume</p>
              <div className="flex flex-wrap gap-2">
                {keyword_matches.found.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-green-100 border border-green-200 px-3 py-1 text-xs font-medium text-green-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-zinc-100 pt-4">
              <p className="mb-2 text-sm font-medium text-zinc-500">Missing from your resume</p>
              <div className="flex flex-wrap gap-2">
                {keyword_matches.missing.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-medium text-red-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">AI Improvement Tips</h2>
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-4"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-zinc-700">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* AI Rewrite */}
        <RewriteCard result={result} plan={plan} />

        {/* Actions */}
        <section className="flex justify-end">
          <Link
            href="/analyze"
            className="rounded-xl bg-zinc-900 px-6 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Analyze Another Resume
          </Link>
        </section>

      </main>
    </div>
  )
}
