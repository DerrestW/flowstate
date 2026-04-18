// Admin users are stored here server-side only
// Never exposed to the client
// Add new admins by adding to this array
// Passwords should be bcrypt hashed - use /admin/settings to manage

export type AdminUserRecord = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "editor";
  passwordHash: string; // bcrypt hash
  active: boolean;
};

// Default admin - password is set via ADMIN_PASSWORD env var
// Additional admins can be added here or managed via Supabase admin_users table
export function getAdminUsers(): AdminUserRecord[] {
  return [
    {
      id: "1",
      email: "derrestwilliams@gmail.com",
      name: "Derrest Williams",
      role: "super_admin",
      // This hash is generated from the ADMIN_PASSWORD env var at runtime
      // Set ADMIN_PASSWORD=Alphatauomega37! in your .env.local and Vercel
      passwordHash: process.env.ADMIN_PASSWORD_HASH || "",
      active: true,
    },
  ];
}
