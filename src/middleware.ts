import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const hasToken = !!token;

  if (pathname.startsWith('/admin')) {
    if (!hasToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname === '/profile') {
    if (!hasToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname === '/login' || pathname === '/register') {
    if (hasToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile',
    '/login',
    '/register',
  ],
};
