'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const SCORE_DIMENSIONS = [
  { key: 'score_clarity', label: 'Clarity' },
  { key: 'score_relevance', label: 'Relevance' },
  { key: 'score_impact', label: 'Impact' },
  { key: 'score_readability', label: 'Readability' },
  { key: 'score_keyword_match', label: 'Keyword Match' },
]

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

export default function ResultsPage() {
  const [result, setResult] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('analysis_result')
    if (stored) {
      setResult(JSON.parse(stored))
    }
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
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-zinc-900 hover:text-zinc-600">
            ResumeSnap
          </Link>
        </div>
      </header>

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

        {/* Actions */}
        <section className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            disabled
            className="rounded-xl border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-zinc-400 cursor-not-allowed"
            title="Coming soon"
          >
            Rewrite My Summary
          </button>
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
