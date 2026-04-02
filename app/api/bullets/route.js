import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

  let rewritten_bullets
  try {
    const userContent = job_description?.trim()
      ? `BULLET POINTS:\n${bullet_points}\n\nJOB DESCRIPTION:\n${job_description}`
      : `BULLET POINTS:\n${bullet_points}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert resume writer. Rewrite the following bullet points to be stronger, more impactful, and achievement-focused.\nRules:\n- Start each bullet with a strong action verb\n- Add metrics where possible (%, numbers, time saved)\n- Keep each bullet to one line\n- Match keywords from the job description if provided\n- Return only the rewritten bullet points, one per line, starting with •',
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
    })

    rewritten_bullets = completion.choices[0].message.content.trim()
  } catch (err) {
    console.error('OpenAI error:', err.message)
    return NextResponse.json({ error: 'Failed to rewrite bullet points' }, { status: 500 })
  }

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
