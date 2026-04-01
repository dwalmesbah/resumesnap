import LogoutButton from '../components/LogoutButton'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold text-zinc-900">Dashboard</span>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Welcome back</h2>
        <p className="text-zinc-500">You are signed in.</p>
      </main>
    </div>
  )
}
