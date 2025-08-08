import { storageKeys } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/home'];
const privatePaths = ['/user'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get(storageKeys.ACCESS_TOKEN)?.value;
  if (privatePaths.some((p) => pathname.startsWith(p))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/home', request.nextUrl));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/user/:path*',
    '/home',
    '/user'
  ]
};
