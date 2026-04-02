import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const MOCK_LETTERS = {
  Formal: `Dear Hiring Manager,

I am writing to express my strong interest in the position at your organisation. Having reviewed the job description carefully, I am confident that my professional background and technical expertise align closely with the requirements outlined.

Throughout my career, I have developed a proven track record in delivering high-quality work within deadline-driven environments. My experience spans multiple disciplines relevant to this role, and I have consistently demonstrated the ability to collaborate effectively with cross-functional teams while maintaining a focus on strategic objectives.

I am particularly drawn to this opportunity because of the organisation's reputation for excellence and its commitment to innovation. I believe my experience would allow me to contribute meaningfully from day one while continuing to grow within the role.

I would welcome the opportunity to discuss how my background can benefit your team. Thank you for considering my application.

Yours sincerely,
[Your Name]`,

  Friendly: `Hi there,

I came across this role and immediately felt it was a great fit — both for what you're looking for and for where I want to take my career next.

I've spent the past few years building up experience that maps really well to what you've described in the job posting. I enjoy working in collaborative environments, and I genuinely care about the quality of the work I produce. My colleagues would describe me as someone who takes ownership, communicates openly, and brings a positive energy to the team.

What excites me most about this opportunity is the chance to work on meaningful problems with a team that clearly values its people. I'd love to bring my skills to the table and grow alongside everyone there.

I'd be thrilled to chat more — feel free to reach out any time.

Thanks so much for your time,
[Your Name]`,

  Confident: `Dear Hiring Manager,

I deliver results. That's why I'm applying for this role.

My background is a direct match for what you need: I have hands-on experience with the core skills this position demands, a strong record of high-impact contributions, and a track record of hitting objectives ahead of schedule.

In my previous roles I have driven measurable improvements, taken ownership of complex projects end-to-end, and consistently exceeded expectations. I don't just complete work — I raise the bar for the work itself.

I am ready to bring that same drive to your team immediately. I'm not looking for a stepping stone; I'm looking for the right challenge, and this role is it.

Let's talk. I'm confident this will be a valuable conversation for both of us.

[Your Name]`,
}

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

  const generated_letter = MOCK_LETTERS[tone]

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
