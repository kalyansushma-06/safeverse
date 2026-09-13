// middleware.ts (must live at the project root, next to package.json — NOT inside app/)
//
// Gatekeeper for the two protected areas of the site:
//   /modules, /mission/*        -> any logged-in worker or admin
//   /dashboard/*                -> only ADMIN or SUPERVISOR role
// Anything not listed in `matcher` below (landing page, /language,
// /login, /admin/login, /verify/*, /certificate/*) stays public — the
// public certificate verification page in particular must never require a
// login, since judges/auditors scanning a QR code have no account.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE, isAdminRole } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const isAdminPath = pathname.startsWith("/dashboard");
  const isWorkerPath = pathname.startsWith("/modules") || pathname.startsWith("/mission");

  if (isAdminPath && (!session || !isAdminRole(session.role))) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isWorkerPath && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/modules/:path*", "/mission/:path*", "/dashboard/:path*"]
};
