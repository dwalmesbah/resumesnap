import { NextResponse } from 'next/server'

const MOCK_REWRITES = {
  professional_summary: `Results-driven software engineer with 5+ years of experience building scalable web applications using React, Node.js, and cloud-native technologies. Proven track record of reducing load times by 40% and shipping features that directly increased user retention. Adept at collaborating across cross-functional teams in Agile environments to deliver high-quality products on tight timelines. Passionate about clean code, performance optimization, and mentoring junior engineers.`,

  bullet_points: `• Architected and delivered a real-time dashboard serving 10,000+ daily active users, reducing average page load time by 42% through lazy loading and API response caching.
• Led migration of monolithic backend to microservices using Node.js and Docker, improving deployment frequency from monthly to daily releases with zero downtime.
• Collaborated with product and design teams in bi-weekly Agile sprints to scope, build, and ship 3 major features that drove a 28% increase in user engagement quarter-over-quarter.`,
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { weakest_section } = body

  if (!weakest_section) {
    return NextResponse.json({ error: 'weakest_section is required' }, { status: 400 })
  }

  const rewrite = MOCK_REWRITES[weakest_section] ?? MOCK_REWRITES.professional_summary

  return NextResponse.json({ rewrite })
}
