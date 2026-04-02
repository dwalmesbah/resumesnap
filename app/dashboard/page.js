import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '../lib/supabase-server'
import LogoutButton from '../components/LogoutButton'
import AnalysesList from './AnalysesList'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: analyses } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-bold text-zinc-900 tracking-tight">
            ResumeSnap
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
            <p className="mt-0.5 text-sm text-zinc-500">{user.email}</p>
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

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Past Analyses
          </h2>
          <AnalysesList analyses={analyses ?? []} />
        </section>
      </main>
    </div>
  )
}
