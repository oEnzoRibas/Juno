import { NextResponse, type NextRequest } from 'next/server';

/** Forward the validated URL locale to the root document renderer. */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set('x-juno-document-language', request.nextUrl.searchParams.get('lang') === 'pt-BR' ? 'pt-BR' : 'en');
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/', '/sign-in', '/activate', '/session', '/account', '/platform', '/workspace/:path*'],
};
