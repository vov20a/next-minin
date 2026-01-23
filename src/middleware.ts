import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken, GetTokenParams } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let params: GetTokenParams = {
    req: request,
    secret: process.env.AUTH_SECRET ?? 'secret',
  };

  if (process.env.NODE_ENV === 'production') {
    params = {
      ...params,
      cookieName: '__Secure-authjs.session-token',
    };
  }

  const token = await getToken(params);

  const privateRoutes = ['/create', '/orders', '/search/:path*'];
  const protectedRoutes = ['/create', '/search/:path*'];

  if (privateRoutes.some((route) => pathname.startsWith(route.replace(':path*', ''))) && !token) {
    const url = new URL('/error', request.url);
    url.searchParams.set('message', 'Недостаточно прав');
    return NextResponse.redirect(url);
  }
  if (
    protectedRoutes.some((route) => pathname.startsWith(route.replace(':path*', ''))) &&
    token?.role !== 'ADMIN'
  ) {
    const url = new URL('/error', request.url);
    url.searchParams.set('message', 'Недостаточно прав');
    return NextResponse.redirect(url);
  }
  if (
    privateRoutes.some((route) => pathname.startsWith(route.replace(':path*', ''))) &&
    token?.role !== 'USER' &&
    privateRoutes.some((route) => pathname.startsWith(route.replace(':path*', ''))) &&
    token?.role !== 'ADMIN'
  ) {
    const url = new URL('/error', request.url);
    url.searchParams.set('message', 'Недостаточно прав ');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create', '/orders', '/search/:path*'],
};
