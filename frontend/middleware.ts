import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-fallback-secret-use-env-in-prod",
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session-token")?.value;

  if (!token) {
    console.warn("No JWT token found in cookies. Redirecting to sign-in.");
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);

    // If token exists, let them pass
    return NextResponse.next();
  } catch (error) {
    // If verification fails (expired, tampered, etc.)
    console.error("JWT verification failed:", error);

    // Redirect to login and clear the invalid cookie
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete("session-token");
    return response;
  }
}

// This tells Next.js which routes to protect
export const config = {
  matcher: ["/chat/:path*", "/dashboard/:path*"],
};
