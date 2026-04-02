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

  const { resume_text, job_description, user_id } = body

  if (!resume_text?.trim() || !job_description?.trim()) {
    return NextResponse.json({ error: 'Both fields are required' }, { status: 400 })
  }

  let result
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert resume reviewer and career coach. Analyze the resume against the job description and return a JSON object with exactly these fields:\n{\n  score_overall: number 0-100,\n  score_clarity: number 0-100,\n  score_relevance: number 0-100,\n  score_impact: number 0-100,\n  score_readability: number 0-100,\n  score_keyword_match: number 0-100,\n  keyword_matches: { found: string[], missing: string[] },\n  tips: string[] (3-5 specific improvement tips),\n  weakest_section: \'professional_summary\' or \'bullet_points\'\n}\nReturn only valid JSON, no markdown, no explanation.',
        },
        {
          role: 'user',
          content: `RESUME:\n${resume_text}\n\nJOB DESCRIPTION:\n${job_description}`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    result = JSON.parse(completion.choices[0].message.content)
  } catch (err) {
    console.error('OpenAI error:', err.message)
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 })
  }

  const { data, error } = await supabase
    .from('analyses')
    .insert({
      resume_text,
      job_description,
      user_id,
      score_overall: result.score_overall,
      score_clarity: result.score_clarity,
      score_relevance: result.score_relevance,
      score_impact: result.score_impact,
      score_readability: result.score_readability,
      score_keyword_match: result.score_keyword_match,
      keyword_matches: result.keyword_matches,
      tips: result.tips,
      weakest_section: result.weakest_section,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase save error:', error.message)
  }

  return NextResponse.json({ ...result, id: data?.id ?? null })
}
