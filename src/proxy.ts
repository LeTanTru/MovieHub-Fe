import { storageKeys } from '@/constants';
import { route } from '@/routes';
import { NextRequest, NextResponse } from 'next/server';

const authPaths = [
  '/forgot-password',
  '/intro',
  '/login',
  '/register',
  '/verify-otp'
];

const privatePaths = ['/account', '/survey', '/user'];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get(storageKeys.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(storageKeys.REFRESH_TOKEN)?.value;
  const isAuthPath = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );
  const isPrivatePath = privatePaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(storageKeys.X_URL, request.url);

  // If the user is authenticated and tries to access an auth path, redirect to home
  if (accessToken && isAuthPath) {
    return NextResponse.redirect(new URL(route.home.path, request.nextUrl));
  }
  // If the user is not authenticated and tries to access a private path, redirect to login
  else if (!refreshToken) {
    // Allow access to auth paths without tokens
    if (isPrivatePath) {
      const loginUrl = new URL(route.login.path, request.nextUrl);
      loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/forgot-password',
    '/intro',
    '/login',
    '/register',
    '/verify-otp',

    '/user',
    '/user/:path*',
    '/account',
    '/account/:path*',
    '/survey',
    '/survey/:path*'
  ]
};
