import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Regular expression for UUID validation
const UUID_REGEX =
  /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Extract ID from the URL
  const match = pathname.match(UUID_REGEX);
  if (match) {
  } else {
    console.log("No UUID found.");
  }

  const id = match ? match[0] : "";

  // Validate UUID format
  if (!id) {
    console.error("Invalid UUID format:", id);
    return new NextResponse("Invalid UUID format", { status: 400 });
  }

  // Handle the /api/user/by-auth/[id] route separately
  if (pathname.startsWith("/api/user/by-auth")) {
    if (token.authId !== id) {
      console.error(
        "Unauthorized: Token authId does not match URL ID: ",
        pathname,
      );
      return new NextResponse("Unauthorized", { status: 403 });
    }
    return NextResponse.next();
  }

  // Handle other /api/user/[id] routes
  if (token.id !== id) {
    console.error("Unauthorized: Token ID does not match URL ID: ", pathname);
    return new NextResponse("Unauthorized", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/user/:path*"], // Protect all /api/user/... routes
};
