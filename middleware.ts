import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
 
export async function middleware(req: NextRequest) {
  
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
 
  if (!session) {
    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = `/login`;
    url.search = `p=${requestedPage}`;
    return NextResponse.redirect(url);
  }
 
  return NextResponse.next();
}


// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Exclude common static files and resources
    '/((?!api|login|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js)$).*)',
  ]
};