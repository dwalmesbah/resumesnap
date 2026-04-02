import { updateSession } from './app/utils/supabase/middleware'

export async function proxy(request) {
  return updateSession(request)
}

export const config = {
  // Run on all routes except Next.js internals and static assets.
  // This is required so sessions are refreshed on every request,
  // not just on protected routes.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
