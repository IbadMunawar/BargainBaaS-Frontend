import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware — Route Protection
 * ==========================================
 * Runs on the edge BEFORE any page renders. Checks for the
 * `__session_token` httpOnly cookie to determine authentication.
 *
 * Public routes (no auth required):
 *   /              (landing page)
 *   /pricing       (pricing page)
 *   /features      (features page)
 *   /auth/*        (login, signup)
 *   /api/*         (API routes — they handle their own auth)
 *   /_next/*       (Next.js internals)
 *   /favicon.ico   (browser asset)
 *
 * Everything else (especially /dashboard/*) requires a valid session cookie.
 */

const COOKIE_NAME = '__session_token';

/** Paths accessible without authentication. */
const PUBLIC_PATHS = [
  '/',
  '/pricing',
  '/features',
];

/** Path prefixes accessible without authentication. */
const PUBLIC_PREFIXES = [
  '/auth/',
  '/api/',
  '/_next/',
];

function isPublicPath(pathname: string): boolean {
  // Exact matches
  if (PUBLIC_PATHS.includes(pathname)) return true;

  // Prefix matches
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;

  // Static assets
  if (pathname === '/favicon.ico') return true;

  // Allow public static files (images, etc.)
  if (pathname.startsWith('/images/') || pathname.startsWith('/fonts/')) return true;

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

  // ── Public route: allow through ──
  if (isPublicPath(pathname)) {
    // Bonus: redirect already-authenticated users away from login/signup
    if (sessionToken && (pathname === '/auth/login' || pathname === '/auth/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // ── Protected route: require session cookie ──
  if (!sessionToken) {
    const loginUrl = new URL('/auth/login', request.url);
    // Preserve the original destination so login can redirect back after auth
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token present — allow through
  return NextResponse.next();
}

/**
 * Matcher config: only run middleware on page routes, skipping
 * static files and Next.js internals for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - favicon.ico  (browser icon)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon\\.ico|images/|fonts/).*)',
  ],
};
