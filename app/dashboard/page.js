'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import LogoutButton from '../components/LogoutButton'

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

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // INITIAL_SESSION fires once on mount with the session from cookies.
        // Waiting for it avoids redirecting before the client has hydrated.
        if (event !== 'INITIAL_SESSION') return

        if (!session) {
          router.push('/login')
          return
        }

        setUser(session.user)

        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (!error && data) {
          setAnalyses(data)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  function handleViewResults(analysis) {
    sessionStorage.setItem('analysis_result', JSON.stringify(analysis))
    router.push('/results')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-zinc-900 tracking-tight">
            ResumeSnap
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        {/* Welcome row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
            <p className="mt-0.5 text-sm text-zinc-500">{user?.email}</p>
          </div>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Analyze New Resume
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Past analyses */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Past Analyses
          </h2>

          {analyses.length === 0 ? (
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
          ) : (
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
          )}
        </section>
      </main>
    </div>
  )
}
