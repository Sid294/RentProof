import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow these paths
  const allowedPaths = [
    '/tenant/portal',
    '/tenant/maintenance',
    '/tenant/move-in-walkthrough',
    '/tenant/pay-rent',
    '/login',
    '/signup',
    '/',
    '/api',
  ]

  // Check if the path is allowed
  const isAllowed = allowedPaths.some(path => {
    if (path === '/') return pathname === '/'
    if (path === '/api') return pathname.startsWith('/api')
    return pathname.startsWith(path)
  })

  // If not allowed and not authenticated, redirect to login
  // Otherwise, redirect to tenant portal
  if (!isAllowed) {
    return NextResponse.redirect(new URL('/tenant/portal', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
