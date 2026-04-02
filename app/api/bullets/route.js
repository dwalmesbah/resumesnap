import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const MOCK_REWRITTEN_BULLETS = `• Led cross-functional team of 8 engineers to deliver a payment integration 3 weeks ahead of schedule, reducing checkout drop-off by 22%
• Resolved 95% of tier-1 support tickets within SLA by building an internal knowledge base used by 12 support agents
• Grew monthly recurring revenue by 18% over two quarters by identifying and closing a pricing gap in the mid-market segment
• Automated weekly reporting pipeline using Python, saving the data team 6 hours per week and eliminating manual errors
• Spearheaded migration of legacy monolith to microservices architecture, improving deployment frequency from monthly to daily`

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { bullet_points, job_description, user_id } = body

  if (!bullet_points?.trim()) {
    return NextResponse.json({ error: 'Bullet points are required' }, { status: 400 })
  }

  // Check usage limit for free plan users
  if (user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('letters_used, plan')
      .eq('id', user_id)
      .single()

    if (profile && profile.plan === 'free' && (profile.letters_used ?? 0) >= 2) {
      return NextResponse.json({ error: 'Monthly limit reached' }, { status: 403 })
    }
  }

  const rewritten_bullets = MOCK_REWRITTEN_BULLETS

  // Save to bullet_rewrites table
  const { error: insertError } = await supabase
    .from('bullet_rewrites')
    .insert({ user_id, original_bullets: bullet_points, job_description, rewritten_bullets })

  if (insertError) {
    console.error('Supabase insert error:', insertError.message)
  }

  // Increment letters_used
  if (user_id) {
    const { error: rpcError } = await supabase.rpc('increment_letters_used', { uid: user_id })
    if (rpcError) {
      console.error('Supabase increment error:', rpcError.message)
    }
  }

  return NextResponse.json({ rewritten_bullets })
}
