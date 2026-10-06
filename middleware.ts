import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/jwtSecret";

// ---------------------------------------------------------------------------
// Access rules
//
//  /admin/*                  → admin login required (except /admin/login)
//  /api/admin/login|logout   → open
//  /api/cron/*               → Vercel cron only (Authorization: Bearer CRON_SECRET)
//  POST /api/inquiries       → open (public contact form)
//  GET  on public content    → open (the public site reads these)
//  everything else in /api   → admin login required
// ---------------------------------------------------------------------------

const PUBLIC_GET_APIS = [
  "/api/experiences",
  "/api/live-experiences",
  "/api/trust-logos",
  "/api/page-content",
  "/api/testimonials",
  "/api/cities",
  "/api/seo",
  "/api/site-settings",
  "/api/media",
];

async function isAdmin(request: NextRequest): Promise<boolean> {
  const secret = getJwtSecret();
  const token = request.cookies.get("admin_session")?.value;
  if (!secret || !token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function matches(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(base + "/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // ---- Admin pages -------------------------------------------------------
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (await isAdmin(request)) return NextResponse.next();
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ---- API ---------------------------------------------------------------
  if (pathname.startsWith("/api")) {
    if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
      return NextResponse.next();
    }

    // Server-to-server calls (Vercel cron and internal jobs) authenticate with CRON_SECRET
    const cronSecret = process.env.CRON_SECRET;
    const hasCronSecret = !!cronSecret && request.headers.get("authorization") === `Bearer ${cronSecret}`;

    if (matches(pathname, "/api/cron")) {
      if (hasCronSecret || await isAdmin(request)) return NextResponse.next();
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (hasCronSecret && matches(pathname, "/api/prospects/scan")) return NextResponse.next();

    if (pathname === "/api/inquiries" && method === "POST") {
      return NextResponse.next();
    }

    if ((method === "GET" || method === "HEAD") && PUBLIC_GET_APIS.some(b => matches(pathname, b))) {
      return NextResponse.next();
    }

    if (await isAdmin(request)) return NextResponse.next();
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
