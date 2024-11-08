import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  if (pathname.startsWith('/_next') || pathname.includes('/api/') || pathname.includes('favicon.ico')) {
    return NextResponse.next()
  }
  const token = req.cookies.get('authTokenVerify')
  const hasValidToken = Boolean(token?.value && token.value !== 'undefined' && token.value.length > 0)
  if (pathname.startsWith('/login') && hasValidToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  if (pathname === '/dashboard' && searchParams.get('loggedIn') === 'true') {
    const url = new URL(req.url)
    url.searchParams.delete('loggedIn')
    return NextResponse.redirect(url)
  }
  if (hasValidToken && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  if (!hasValidToken && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/dashboard/:path*', '/sign-in', '/sign-up']
}
