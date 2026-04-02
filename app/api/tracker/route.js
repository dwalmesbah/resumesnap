import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const user_id = searchParams.get('user_id')

  if (!user_id) {
    return NextResponse.json({ applications: [] })
  }

  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase fetch error:', error.message)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }

  return NextResponse.json({ applications: data })
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { company_name, job_title, status, date_applied, notes, user_id } = body

  if (!company_name?.trim() || !job_title?.trim()) {
    return NextResponse.json({ error: 'Company name and job title are required' }, { status: 400 })
  }

  if (!['Applied', 'Interview', 'Offer', 'Rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('job_applications')
    .insert({ user_id, company_name, job_title, status, date_applied, notes: notes || null })
    .select()
    .single()

  if (error) {
    console.error('Supabase insert error:', error.message)
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
  }

  return NextResponse.json({ application: data })
}

export async function DELETE(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'Application id is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Supabase delete error:', error.message)
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
