import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const UPGRADE_EVENTS = new Set(['order_created', 'subscription_created'])

export async function POST(request) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const eventName = payload?.meta?.event_name
  const email = payload?.data?.attributes?.user_email

  if (UPGRADE_EVENTS.has(eventName) && email) {
    const { error } = await supabase
      .from('profiles')
      .update({ plan: 'pro' })
      .eq('email', email)

    if (error) {
      console.error('Webhook: failed to update plan for', email, error.message)
    }
  }

  return NextResponse.json({ received: true })
}
