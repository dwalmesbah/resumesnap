import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const PROTECTED_PREFIXES = ['/dashboard', '/analyze', '/results', '/account']

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value, options)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not add any logic between createServerClient and supabase.auth.getUser().
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: return supabaseResponse as-is so the browser receives
  // any refreshed session cookies that were written during getUser().
  return supabaseResponse
}
