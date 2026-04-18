import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

// Rate limiting - simple in-memory (use Redis in production)
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (record.count >= 5) return false;
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // Rate limit: 5 attempts per 15 minutes
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Check credentials against env vars (simple, secure)
    const adminEmail = process.env.ADMIN_EMAIL || "derrestwilliams@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "";

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured. Set ADMIN_PASSWORD in environment variables." },
        { status: 500 }
      );
    }

    const emailMatch = email.toLowerCase() === adminEmail.toLowerCase();

    // Support both plain password (from env) and bcrypt hash
    let passwordMatch = false;
    if (adminPassword.startsWith("$2")) {
      passwordMatch = await bcrypt.compare(password, adminPassword);
    } else {
      passwordMatch = password === adminPassword;
    }

    if (!emailMatch || !passwordMatch) {
      // Generic error - don't reveal which field is wrong
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createSession({
      id: "1",
      email: adminEmail,
      name: "Derrest Williams",
      role: "super_admin",
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,        // Not accessible via JS
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
