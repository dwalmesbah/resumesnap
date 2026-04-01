import Link from 'next/link'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconClipboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

function IconChart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function IconSparkle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

function IconKey() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  )
}

function IconPencil() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <span className="text-xl font-bold text-white tracking-tight">
          ResumeSnap
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="bg-zinc-900 pt-24 pb-28 text-center">
      <div className="mx-auto max-w-3xl px-6">
        <span className="inline-block rounded-full border border-zinc-700 bg-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-300 mb-6 tracking-wide">
          AI-Powered Resume Analysis
        </span>
        <h1 className="text-5xl font-bold text-white leading-tight tracking-tight sm:text-6xl">
          Get Your Resume Score<br />in 30 Seconds
        </h1>
        <p className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto">
          AI-powered analysis that scores your resume, finds missing keywords, and tells you exactly what to fix.
        </p>
        <div className="mt-10">
          <Link
            href="/signup"
            className="inline-block rounded-xl bg-white px-8 py-4 text-base font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors shadow-lg"
          >
            Analyze My Resume Free
          </Link>
        </div>
        <p className="mt-4 text-xs text-zinc-500">No credit card required. Free plan included.</p>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: <IconClipboard />,
      title: 'Paste Your Resume',
      description: 'Copy and paste your resume text alongside the job description you are targeting.',
    },
    {
      number: '02',
      icon: <IconChart />,
      title: 'Get Your Score',
      description: 'Receive a detailed breakdown across five dimensions including clarity, impact, and keyword match.',
    },
    {
      number: '03',
      icon: <IconSparkle />,
      title: 'Fix and Improve',
      description: 'Follow specific AI tips to strengthen weak sections and land more interviews.',
    },
  ]

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">How It Works</h2>
          <p className="mt-3 text-zinc-500">Three steps to a stronger resume.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center px-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                {step.icon}
              </div>
              <span className="mb-1 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                Step {step.number}
              </span>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: <IconChart />,
      title: 'Structured Scoring',
      description:
        'Get scores for Clarity, Relevance, Impact, Readability, and Keyword Match — so you know exactly where you stand.',
    },
    {
      icon: <IconKey />,
      title: 'Keyword Analysis',
      description:
        'See exactly which keywords are missing from your resume for the job you want, with clear found and missing lists.',
    },
    {
      icon: <IconPencil />,
      title: 'AI Rewrite',
      badge: 'Pro',
      description:
        'Let AI rewrite your weakest section instantly. One click to a stronger professional summary or skills section.',
    },
  ]

  return (
    <section className="bg-zinc-50 py-24 border-t border-zinc-100">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Everything You Need</h2>
          <p className="mt-3 text-zinc-500">Tools that give you a real edge in the job market.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white">
                  {f.icon}
                </div>
                {f.badge && (
                  <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                    {f.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const freePlan = [
    '2 analyses per month',
    'All 5 score dimensions',
    'Keyword match report',
    'AI improvement tips',
  ]

  const proPlan = [
    'Unlimited analyses',
    'All 5 score dimensions',
    'Keyword match report',
    'AI improvement tips',
    'AI section rewrite',
    'Priority support',
  ]

  return (
    <section className="bg-white py-24 border-t border-zinc-100">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Simple Pricing</h2>
          <p className="mt-3 text-zinc-500">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">

          {/* Free */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-1">Free</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-zinc-900">$0</span>
                <span className="text-zinc-400 mb-1">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {freePlan.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-600">
                  <span className="text-green-500"><IconCheck /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block rounded-xl border border-zinc-300 bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-zinc-900 bg-zinc-900 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-zinc-900">
                Popular
              </span>
            </div>
            <div className="mb-6">
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-1">Pro</p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-white">$9</span>
                <span className="text-zinc-400 mb-1">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {proPlan.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <span className="text-green-400"><IconCheck /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-8">
      <div className="mx-auto max-w-6xl px-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="text-sm text-zinc-500">ResumeSnap &copy; 2026</span>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            Login
          </Link>
          <Link href="/signup" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <Footer />
    </>
  )
}
