import Link from 'next/link'
import { createClient } from '../utils/supabase/server'
import NavBar from '../components/NavBar'
import AnalysesList from './AnalysesList'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconChart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function IconPencil() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function IconSparkle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

// ─── Tool Cards ───────────────────────────────────────────────────────────────

const TOOLS = [
  {
    icon: <IconChart />,
    name: 'Resume Analyzer',
    description: 'Score your resume and find missing keywords',
    href: '/analyze',
  },
  {
    icon: <IconPencil />,
    name: 'Cover Letter Generator',
    description: 'Generate a tailored cover letter in seconds',
    href: '/coverletter',
  },
  {
    icon: <IconSparkle />,
    name: 'CV Bullet Rewriter',
    description: 'Rewrite weak bullet points with AI',
    href: '/bullets',
  },
  {
    icon: <IconClipboard />,
    name: 'Job Tracker',
    description: 'Track your job applications in one place',
    href: '/tracker',
    comingSoon: true,
  },
]

function ToolCard({ icon, name, description, href, comingSoon }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white">
          {icon}
        </div>
        {comingSoon && (
          <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold text-zinc-500">
            Coming Soon
          </span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-zinc-900">{name}</h3>
        <p className="mt-1 text-sm text-zinc-500 leading-relaxed">{description}</p>
      </div>
      {comingSoon ? (
        <button
          disabled
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-400 cursor-not-allowed"
        >
          Launch
        </button>
      ) : (
        <Link
          href={href}
          className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          Launch
        </Link>
      )}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: analyses } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar />

      <main className="mx-auto max-w-4xl px-6 py-10 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
          <p className="mt-0.5 text-sm text-zinc-500">{user.email}</p>
        </div>

        {/* Tools */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Tools
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.name} {...tool} />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Recent Resume Analyses
          </h2>
          <AnalysesList analyses={analyses ?? []} />
        </section>

      </main>
    </div>
  )
}
