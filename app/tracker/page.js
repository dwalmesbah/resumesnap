'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '../utils/supabase/client'
import NavBar from '../components/NavBar'

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected']

const STATUS_STYLES = {
  Applied:   'bg-blue-50 text-blue-700 border-blue-200',
  Interview: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Offer:     'bg-green-50 text-green-700 border-green-200',
  Rejected:  'bg-red-50 text-red-600 border-red-200',
}

function today() {
  return new Date().toISOString().split('T')[0]
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
      {status}
    </span>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

const EMPTY_FORM = {
  company_name: '',
  job_title: '',
  status: 'Applied',
  date_applied: today(),
  notes: '',
}

export default function TrackerPage() {
  const [applications, setApplications] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [loadingList, setLoadingList] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  const fetchApplications = useCallback(async () => {
    try {
      const { data: { user } } = await createClient().auth.getUser()
      const res = await fetch(`/api/tracker?user_id=${user?.id ?? ''}`)
      if (!res.ok) throw new Error('Failed to load applications')
      const { applications: data } = await res.json()
      setApplications(data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingList(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.company_name.trim() || !form.job_title.trim()) {
      setError('Company name and job title are required.')
      return
    }

    setSubmitting(true)
    try {
      const { data: { user } } = await createClient().auth.getUser()

      const res = await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_id: user?.id ?? null }),
      })

      if (!res.ok) {
        const { error: apiError } = await res.json()
        throw new Error(apiError ?? 'Failed to add application')
      }

      const { application } = await res.json()
      setApplications((prev) => [application, ...prev])
      setForm({ ...EMPTY_FORM, date_applied: today() })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      const res = await fetch('/api/tracker', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const { error: apiError } = await res.json()
        throw new Error(apiError ?? 'Failed to delete application')
      }

      setApplications((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar />

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Job Tracker</h1>
          <p className="mt-2 text-zinc-500">Keep track of every application in one place.</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Add application form */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Add Application
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="company_name" className="text-sm font-medium text-zinc-700">
                  Company Name
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="job_title" className="text-sm font-medium text-zinc-700">
                  Job Title
                </label>
                <input
                  id="job_title"
                  name="job_title"
                  type="text"
                  value={form.job_title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Engineer"
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="status" className="text-sm font-medium text-zinc-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="date_applied" className="text-sm font-medium text-zinc-700">
                  Date Applied
                </label>
                <input
                  id="date_applied"
                  name="date_applied"
                  type="date"
                  value={form.date_applied}
                  onChange={handleChange}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-sm font-medium text-zinc-700">
                Notes <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Recruiter name, next steps, salary range..."
                className="resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <Spinner />
                    Adding...
                  </>
                ) : (
                  'Add Application'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Applications list */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Applications
          </h2>

          {loadingList ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
              <p className="text-sm text-zinc-400">No applications yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-zinc-200 bg-white px-5 py-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900">{app.company_name}</span>
                      <span className="text-sm text-zinc-400">&mdash;</span>
                      <span className="text-sm text-zinc-600">{app.job_title}</span>
                      <StatusBadge status={app.status} />
                    </div>
                    <span className="text-xs text-zinc-400">
                      Applied {new Date(app.date_applied + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {app.notes && (
                      <p className="text-xs text-zinc-500 leading-relaxed">{app.notes}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(app.id)}
                    disabled={deletingId === app.id}
                    className="shrink-0 self-start rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {deletingId === app.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
