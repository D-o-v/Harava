import { NextResponse, type NextRequest } from "next/server";

/**
 * Catch stray invitation / password-reset / email-verify links that landed on
 * a random product route (backend sometimes emits links to
 * `https://harava.netlify.app/finsight?token=...`) and redirect them to the
 * matching auth page while preserving the token.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.next();

  // Already on an auth page — leave it alone.
  if (url.pathname.startsWith("/auth/")) return NextResponse.next();

  const target = url.clone();
  // Choose destination by hint param, else default to invitation accept.
  const kind = url.searchParams.get("kind") || url.searchParams.get("type");
  if (kind === "reset") target.pathname = "/auth/reset-password";
  else if (kind === "verify") target.pathname = "/auth/verify";
  else target.pathname = "/auth/accept";
  return NextResponse.redirect(target);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
