import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);

const protectedPaths = ['/', '/dashboard', '/admin', '/profile']; // add your protected routes
const publicPaths = ['/login', '/favicon.ico', '/api/public'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths without auth
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('authToken')?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', 'Please login first');
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const rolesClaim = payload.roles;
    const roles = Array.isArray(rolesClaim) ? rolesClaim : [rolesClaim];
    const isAdmin = roles.some(role => role.toLowerCase() === 'admin');
    
 if (!isAdmin) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('error', 'You are not authorized');

  const response = NextResponse.redirect(url);
  response.cookies.delete('authToken'); // Correct usage - just the cookie name
  return response;
}


    // User is admin and authorized, allow request
    return NextResponse.next();

  } catch {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', 'Invalid or expired token');
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/', '/dashboard', '/admin', '/profile', '/((?!api|_next/static|_next/image|favicon.ico).*)']
};
