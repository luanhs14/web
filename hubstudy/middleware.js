import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_SECRET = (() => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is required to run protected routes');
  }
  return secret;
})();
const TOKEN_NAME = 'hubstudy_token';

async function verifyToken(token) {
  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(AUTH_SECRET));
    return payload;
  } catch {
    return null;
  }
}

const protectedRoutes = ['/dashboard'];
const adminRoutes = ['/admin'];
const authPages = ['/login', '/signup'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_NAME)?.value;
  const payload = token ? await verifyToken(token) : null;
  const isAuthenticated = !!payload;

  // Proteger rotas de admin
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    // Verificar role do token JWT
    if (!payload.role || payload.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Proteger rotas autenticadas
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirecionar autenticados de páginas de auth
  if (isAuthenticated && authPages.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/admin/:path*', '/login', '/signup'],
};
