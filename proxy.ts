import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require a logged-in user
const PROTECTED_USER_ROUTES = ["/account", "/account/orders"];

// Routes that require admin role — checked server-side in the page itself,
// but we still want to redirect unauthenticated users immediately
const PROTECTED_ADMIN_ROUTES = [
  "/admin/dashboard",
  "/admin/products",
  "/admin/orders",
  "/admin/customers",
  "/admin/categories",
  "/admin/consultations",
];

// Routes that should redirect to home when already logged in
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the session cookie (BetterAuth sets "better-auth.session_token")
  const sessionCookie = getSessionCookie(request);
  const isLoggedIn = Boolean(sessionCookie);

  // ── Redirect logged-in users away from auth pages ──────────────────────────
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && isLoggedIn) {
    const redirectTo = request.nextUrl.searchParams.get("redirect") ?? "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // ── Protect user-only routes ────────────────────────────────────────────────
  if (
    PROTECTED_USER_ROUTES.some((r) => pathname.startsWith(r)) &&
    !isLoggedIn
  ) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // ── Protect admin routes ────────────────────────────────────────────────────
  if (
    PROTECTED_ADMIN_ROUTES.some((r) => pathname.startsWith(r)) &&
    !isLoggedIn
  ) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public folder files
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
