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

  const { resume_text, job_description, tone, user_id } = body

  if (!resume_text?.trim() || !job_description?.trim()) {
    return NextResponse.json({ error: 'Both fields are required' }, { status: 400 })
  }

  if (!['Formal', 'Friendly', 'Confident'].includes(tone)) {
    return NextResponse.json({ error: 'Invalid tone' }, { status: 400 })
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

  let generated_letter
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            `You are an expert career coach and professional writer. Write a tailored cover letter based on the resume and job description.\nTone: ${tone} (formal=traditional and polished, friendly=warm and personable, confident=direct and achievement-focused)\nRules:\n- 3-4 paragraphs, under 400 words\n- Open with a strong hook, not 'I am applying for...'\n- Mirror keywords from the job description naturally\n- Highlight 2-3 specific achievements from the resume\n- End with a clear call to action\n- Output only the cover letter text, no subject line or date`,
        },
        {
          role: 'user',
          content: `RESUME:\n${resume_text}\n\nJOB DESCRIPTION:\n${job_description}`,
        },
      ],
    })

    generated_letter = completion.choices[0].message.content.trim()
  } catch (err) {
    console.error('OpenAI error:', err.message)
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 })
  }

  // Save to cover_letters table
  const { error: insertError } = await supabase
    .from('cover_letters')
    .insert({ user_id, resume_text, job_description, tone, generated_letter })

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

  return NextResponse.json({ generated_letter })
}
