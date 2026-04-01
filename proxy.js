import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  // Start with a plain next response. The cookie handlers below may replace
  // this with a new response that carries refreshed session cookies.
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
          // Write incoming cookies onto the request so server components see them.
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value, options)
          )
          // Rebuild the response so the refreshed cookies are sent to the browser.
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() validates the JWT with Supabase and refreshes the session when
  // needed. Do not add any logic between createServerClient and this call.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Return supabaseResponse as-is so refreshed session cookies reach the browser.
  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/analyze/:path*', '/results/:path*', '/account/:path*'],
}
