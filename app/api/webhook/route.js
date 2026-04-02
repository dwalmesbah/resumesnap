import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const UPGRADE_EVENTS = new Set(['order_created', 'subscription_created'])

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    // Always return 200 so Lemon Squeezy does not retry on parse failure
    return NextResponse.json({ received: true })
  }

  const eventName = body?.meta?.event_name
  const email = body?.data?.attributes?.user_email

  if (UPGRADE_EVENTS.has(eventName) && email) {
    // Look up the auth user by email using the service-role admin API,
    // then update profiles by id — avoids requiring an email column on profiles.
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('Webhook: admin.listUsers error:', listError.message)
    } else {
      const user = users.find((u) => u.email === email)

      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ plan: 'pro' })
          .eq('id', user.id)

        if (updateError) {
          console.error('Webhook: failed to upgrade plan for', email, updateError.message)
        }
      } else {
        console.warn('Webhook: no auth user found for email:', email)
      }
    }
  }

  // Always return 200 so Lemon Squeezy does not retry
  return NextResponse.json({ received: true })
}
