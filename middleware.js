import { NextResponse } from 'next/server';

export function middleware(request) {
  // For now, allow all requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*'
  ]
};