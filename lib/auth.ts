import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getJwtSecret } from "@/lib/jwtSecret";

function requireSecret(): Uint8Array {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error("ADMIN_JWT_SECRET is not set (needs 16+ characters). Add it in Vercel → Settings → Environment Variables.");
  }
  return secret;
}

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "editor";
};

export async function createSession(user: AdminUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(requireSecret());
  return token;
}

export async function verifySession(token: string): Promise<AdminUser | null> {
  const secret = getJwtSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;
  return verifySession(token);
}
