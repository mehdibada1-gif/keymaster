import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const { pathname, search } = request.nextUrl;

  const isSessionValid = () => {
    if (!sessionCookie) return false;
    try {
      const session = JSON.parse(sessionCookie.value);
      return session.expires > Date.now();
    } catch {
      return false;
    }
  };

  const loggedIn = isSessionValid();

  // If the user is logged in and tries to access the login page, redirect them to the dashboard
  if (loggedIn && pathname === '/host/login') {
    return NextResponse.redirect(new URL('/host/dashboard', request.url));
  }

  // If the user is not logged in and tries to access a protected host route, redirect to login
  if (!loggedIn && pathname.startsWith('/host') && pathname !== '/host/login') {
    const originalUrl = `${pathname}${search}`;
    const loginUrl = new URL('/host/login', request.url);
    loginUrl.searchParams.set('redirect_url', originalUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
