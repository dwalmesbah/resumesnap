import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const eventName = body?.meta?.event_name
  const email = body?.data?.attributes?.user_email
    ?? body?.data?.attributes?.email

  if (
    email &&
    (eventName === 'order_created' || eventName === 'subscription_created')
  ) {
    await supabase
      .from('profiles')
      .update({ plan: 'pro' })
      .eq('email', email)
  }

  if (eventName === 'subscription_cancelled') {
    await supabase
      .from('profiles')
      .update({ plan: 'free' })
      .eq('email', email)
  }

  return NextResponse.json({ received: true })
}
