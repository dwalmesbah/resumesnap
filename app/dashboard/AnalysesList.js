'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

function scoreBadge(score) {
  if (score >= 75) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border border-green-200 px-2.5 py-0.5 text-xs font-medium text-green-700">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Good
      </span>
    )
  }
  if (score >= 50) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Fair
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 border border-red-200 px-2.5 py-0.5 text-xs font-medium text-red-700">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
      Needs Work
    </span>
  )
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AnalysesList({ analyses }) {
  const router = useRouter()

  function handleViewResults(analysis) {
    sessionStorage.setItem('analysis_result', JSON.stringify(analysis))
    router.push('/results')
  }

  if (analyses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-8 py-16 text-center">
        <p className="text-zinc-500 text-sm mb-4">
          No analyses yet. Analyze your first resume to get started.
        </p>
        <Link
          href="/analyze"
          className="inline-block rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
        >
          Analyze My Resume
        </Link>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {analyses.map((analysis) => (
        <li
          key={analysis.id}
          className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-zinc-500 tabular-nums">
              {formatDate(analysis.created_at)}
            </span>
            <span className="text-sm font-semibold text-zinc-900">
              {analysis.score_overall}
              <span className="font-normal text-zinc-400">/100</span>
            </span>
            {scoreBadge(analysis.score_overall)}
          </div>
          <button
            onClick={() => handleViewResults(analysis)}
            className="self-start rounded-lg border border-zinc-200 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors sm:self-auto"
          >
            View Results
          </button>
        </li>
      ))}
    </ul>
  )
}
