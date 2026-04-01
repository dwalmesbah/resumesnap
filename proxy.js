import { NextResponse } from 'next/server'

export function proxy(request) {
  const token = request.cookies.get('sb-access-token')

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
