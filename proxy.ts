import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const ADMIN_PATHS = ["/admin"];
const AUTH_PATHS = ["/login", "/register"];
const PROTECTED = ["/checkout", "/order-success"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "an-nazeer",
  });

  const isAuthenticated = !!sessionCookie;

  // Redirect logged-in users away from auth pages
  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect admin routes
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    // Role check is done server-side in admin layout via requireAdmin()
  }

  // Protect checkout for guests: allow through (guest checkout supported)
  // Full session validation happens in the page/server action

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|images).*)"],
};
