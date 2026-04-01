import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const MOCK_RESULT = {
  score_overall: 71,
  score_clarity: 80,
  score_relevance: 65,
  score_impact: 60,
  score_readability: 78,
  score_keyword_match: 72,
  keyword_matches: {
    found: ['React', 'Node.js', 'Agile'],
    missing: ['TypeScript', 'CI/CD', 'REST APIs'],
  },
  tips: [
    'Add measurable results to your bullet points',
    'Include TypeScript in your skills section',
    'Your professional summary is vague',
  ],
  weakest_section: 'professional_summary',
}

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

  const { data, error } = await supabase
    .from('analyses')
    .insert({
      resume_text,
      job_description,
      user_id,
      score_overall: MOCK_RESULT.score_overall,
      score_clarity: MOCK_RESULT.score_clarity,
      score_relevance: MOCK_RESULT.score_relevance,
      score_impact: MOCK_RESULT.score_impact,
      score_readability: MOCK_RESULT.score_readability,
      score_keyword_match: MOCK_RESULT.score_keyword_match,
      keyword_matches: MOCK_RESULT.keyword_matches,
      tips: MOCK_RESULT.tips,
      weakest_section: MOCK_RESULT.weakest_section,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase save error:', error.message)
  }

  return NextResponse.json({ ...MOCK_RESULT, id: data?.id ?? null })
}
