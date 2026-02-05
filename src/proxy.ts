import { storageKeys } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/login', '/register', '/forgot-password'];
const privatePaths = ['/user'];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get(storageKeys.ACCESS_TOKEN)?.value;
  if (accessToken && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  if (privatePaths.some((p) => pathname.startsWith(p))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/user/:path*',
    '/',
    '/user',
    '/login',
    '/register',
    '/forgot-password'
  ]
};
