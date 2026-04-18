import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "flowstate-secret-change-in-production-please"
);

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
    .sign(SECRET);
  return token;
}

export async function verifySession(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
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
