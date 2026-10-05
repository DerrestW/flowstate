// Shared signing secret for admin sessions.
// There is deliberately NO fallback: the repo is public, so a hard-coded
// default would let anyone forge an admin cookie. If ADMIN_JWT_SECRET is not
// set, admin sessions simply cannot be created or verified.
export function getJwtSecret(): Uint8Array | null {
  const raw = process.env.ADMIN_JWT_SECRET;
  if (!raw || raw.length < 16) return null;
  return new TextEncoder().encode(raw);
}
