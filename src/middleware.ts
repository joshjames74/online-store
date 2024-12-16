import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Regular expression for UUID validation
const UUID_REGEX = /^[a-zA-Z0-9-]+/;

export async function middleware(req: NextRequest) {
  
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', req.url));
  };

  // Extract ID from the URL
  const segments = pathname.split('/');
  const id = segments[3]; // /api/user/:id/... -> id is the third segment

  // Validate UUID format
  if (!UUID_REGEX.test(id)) {
    console.error('Invalid UUID format:', id);
    return new NextResponse('Invalid UUID format', { status: 400 });
  };

  // Compare token ID with URL ID
  if (token.id !== id) {
    console.log('Token ID: ', token.id);
    console.log('URL ID: ', id);
    console.error('Unauthorized: Token ID does not match URL ID: ', pathname);
    return new NextResponse('Unauthorized', { status: 403 });
  }

  console.log('Authorization successful: ', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/user/:path*'], // Protect all /api/user/[id]/... routes
};
