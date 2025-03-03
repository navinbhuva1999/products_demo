import { NextResponse } from 'next/server';

export function middleware(request) {
  const currentUser = request.cookies.get('user');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

//   if (isAuthPage) {
//     if (currentUser) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//     return NextResponse.next();
//   }

//   if (!currentUser && request.nextUrl.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}; 