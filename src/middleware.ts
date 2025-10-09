import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔍 [Middleware] Processing:', pathname);

  // Get user ID from cookie (set by Firebase client)
  const userIdCookie = request.cookies.get('userId');
  const authToken = request.cookies.get('authToken');
  const isAuthenticated = !!(userIdCookie?.value || authToken?.value);

  console.log('🔑 [Middleware] Auth status:', {
    isAuthenticated,
    userId: userIdCookie?.value?.slice(0, 8) || 'none',
    hasToken: !!authToken?.value,
    pathname,
    timestamp: new Date().toISOString(),
  });

  // 1. Root path "/" - Portfolio home (public, no auth required)
  if (pathname === '/') {
    console.log('🏠 [Middleware] Portfolio home - Allow access (public)');
    return NextResponse.next();
  }

  // 2. Login/Register - If authenticated, redirect to DASHBOARD
  if (pathname === '/login' || pathname === '/register') {
    if (isAuthenticated) {
      console.log('🔄 [Middleware] Already authenticated, redirecting to /dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    console.log('✅ [Middleware] Auth page - Allow access');
    return NextResponse.next();
  }

  // 3. Public portfolio routes - ALWAYS ALLOW (no auth required)
  const publicPortfolioPaths = ['/blog', '/projects', '/skills', '/experience'];
  const isPublicPortfolio = publicPortfolioPaths.some(path => pathname.startsWith(path));
  
  if (isPublicPortfolio) {
    console.log('🌐 [Middleware] Public portfolio route - Allow access (no auth required)');
    return NextResponse.next();
  }

  // 4. Dashboard routes - Protect, redirect to /login if not authenticated
  const protectedPaths = ['/dashboard', '/settings'];
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      console.log('🔒 [Middleware] Protected route, redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('✅ [Middleware] Protected route - User authenticated');
    return NextResponse.next();
  }

  // All other routes - Allow access
  console.log('✅ [Middleware] Other route - Allow access');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/projects/:path*',
    '/blog/:path*',
    '/skills/:path*',
    '/experience/:path*',
    '/settings/:path*',
  ]
};
