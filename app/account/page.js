import { redirect } from 'next/navigation'

import { createClient } from '../utils/supabase/server'
import NavBar from '../components/NavBar'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const isPro = (profile?.plan ?? 'free') === 'pro'

  const checkoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL
    ? process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL +
      '?checkout[email]=' +
      encodeURIComponent(user.email)
    : null

  return (
    <div className="min-h-screen bg-zinc-50">
      <NavBar />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Account</h1>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 max-w-md">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Current Plan
          </h2>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl font-bold text-zinc-900">
              {isPro ? 'Pro Plan' : 'Free Plan'}
            </span>
            {isPro && (
              <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-white">
                Pro
              </span>
            )}
          </div>

          <p className="text-sm text-zinc-500 mb-6">
            {isPro
              ? 'Unlimited analyses, AI rewrite, priority support'
              : '2 analyses per month, all score dimensions, keyword match'}
          </p>

          <div className="flex flex-col gap-3">
            {!isPro && checkoutUrl && (
              <a
                id="upgrade-btn"
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-zinc-900 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                Upgrade to Pro — $9/month
              </a>
            )}
            <a
              href="mailto:support@careerready.com?subject=Manage%20My%20Billing"
              className="block w-full rounded-lg border border-zinc-200 px-5 py-2.5 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Manage Billing
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
