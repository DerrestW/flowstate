"use client";
import { useState } from "react";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)";
const BLUE = "#2196F3";
const D: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900 };

type AdminUser = { id: string; email: string; name: string; role: string; active: boolean };

const INITIAL: AdminUser[] = [
  { id: "1", email: "derrestwilliams@gmail.com", name: "Derrest Williams", role: "super_admin", active: true },
];

const input: React.CSSProperties = { width: "100%", padding: "9px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid rgba(6,7,8,0.15)", background: "#F8F6F2", fontFamily: "inherit", outline: "none" };
const labelSt: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(6,7,8,0.4)", marginBottom: 6, display: "block" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "editor", password: "" });
  const [saved, setSaved] = useState("");

  function addUser() {
    if (!newUser.email || !newUser.name) return;
    setUsers(prev => [...prev, { id: Date.now().toString(), ...newUser, active: true }]);
    setNewUser({ email: "", name: "", role: "editor", password: "" });
    setShowAdd(false);
    setSaved("User added. Update ADMIN_EMAIL and ADMIN_PASSWORD in Vercel env vars to activate.");
    setTimeout(() => setSaved(""), 6000);
  }

  const roleColors: Record<string, { bg: string; text: string }> = {
    super_admin: { bg: "#E3F2FD", text: "#1565C0" },
    admin: { bg: "#E8F5E9", text: "#1B5E20" },
    editor: { bg: "#FFF8E1", text: "#F57F17" },
  };

  return (
    <div style={{ padding: "2.5rem", maxWidth: 800 }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BLUE, marginBottom: 4 }}>Access Control</div>
        <h1 style={{ ...D, fontSize: 36, letterSpacing: 1 }}>ADMIN USERS</h1>
      </div>

      {saved && (
        <div style={{ padding: "12px 16px", background: "#E3F2FD", border: "0.5px solid #90CAF9", borderRadius: 10, marginBottom: "1.5rem", fontSize: 13, color: "#1565C0", fontWeight: 500 }}>
          {saved}
        </div>
      )}

      {/* Info box */}
      <div style={{ padding: "1.25rem 1.5rem", background: "#FFF8E1", border: "0.5px solid #FFD54F", borderRadius: 12, marginBottom: "2rem" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#E65100", marginBottom: 6 }}>How admin access works</div>
        <div style={{ fontSize: 13, color: "#BF360C", lineHeight: 1.6 }}>
          Admin credentials are set via environment variables in Vercel for maximum security — not stored in the database where they could be exposed.
          To add a new admin, add them here then update these env vars in Vercel dashboard:
          <br/><br/>
          <code style={{ background: "rgba(0,0,0,0.06)", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>ADMIN_EMAIL</code> and <code style={{ background: "rgba(0,0,0,0.06)", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>ADMIN_PASSWORD</code>
          <br/><br/>
          For multiple admins, contact your developer to enable Supabase-based multi-user auth.
        </div>
      </div>

      {/* Users list */}
      <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid rgba(6,7,8,0.08)", overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "0.5px solid rgba(6,7,8,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Active Admins</div>
          <button onClick={() => setShowAdd(!showAdd)} style={{ fontSize: 12, fontWeight: 700, padding: "7px 18px", borderRadius: 100, background: "#04080F", color: "#F8F6F2", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            + Add Admin
          </button>
        </div>

        {users.map((user, i) => {
          const rc = roleColors[user.role] || roleColors.editor;
          return (
            <div key={user.id} style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", borderBottom: i < users.length - 1 ? "0.5px solid rgba(6,7,8,0.06)" : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: "rgba(6,7,8,0.5)" }}>{user.email}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: rc.bg, color: rc.text, textTransform: "capitalize" }}>
                {user.role.replace("_", " ")}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: user.active ? "#E8F5E9" : "rgba(6,7,8,0.06)", color: user.active ? "#1B5E20" : "rgba(6,7,8,0.4)" }}>
                {user.active ? "Active" : "Inactive"}
              </span>
              {user.id !== "1" && (
                <button onClick={() => setUsers(prev => prev.filter(u => u.id !== user.id))} style={{ fontSize: 11, padding: "5px 12px", borderRadius: 8, background: "#FFEBEE", color: "#B71C1C", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add user form */}
      {showAdd && (
        <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid rgba(6,7,8,0.08)", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: "1.25rem" }}>New Admin User</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div><label style={labelSt}>Full Name *</label><input style={input} value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" /></div>
            <div><label style={labelSt}>Email *</label><input type="email" style={input} value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} placeholder="john@company.com" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelSt}>Role</label>
              <select style={{ ...input, cursor: "pointer" }} value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}>
                <option value="editor">Editor (content only)</option>
                <option value="admin">Admin (full access)</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div><label style={labelSt}>Temporary Password</label><input type="password" style={input} value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} placeholder="Set in Vercel env vars" /></div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={addUser} style={{ fontSize: 13, fontWeight: 700, padding: "10px 24px", borderRadius: 100, background: "#04080F", color: "#F8F6F2", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Add User</button>
            <button onClick={() => setShowAdd(false)} style={{ fontSize: 13, padding: "10px 20px", borderRadius: 100, background: "transparent", color: "rgba(6,7,8,0.5)", border: "0.5px solid rgba(6,7,8,0.2)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Security notes */}
      <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid rgba(6,7,8,0.08)", padding: "1.5rem" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: "1rem" }}>Security Settings</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { icon: "🔐", title: "Sessions expire after 7 days", desc: "Users are automatically logged out after 7 days of inactivity." },
            { icon: "🛡", title: "Rate limiting enabled", desc: "Login is locked after 5 failed attempts per 15 minutes per IP." },
            { icon: "🍯", title: "Honeypot protection active", desc: "Contact forms have hidden fields that catch and block bots automatically." },
            { icon: "🔒", title: "HttpOnly cookies", desc: "Session tokens are stored in HttpOnly cookies — not accessible via JavaScript." },
            { icon: "🌐", title: "HTTPS only in production", desc: "Cookies are marked Secure and only sent over HTTPS when deployed." },
          ].map(s => (
            <div key={s.title} style={{ display: "flex", gap: 12, padding: "0.875rem", background: "rgba(6,7,8,0.03)", borderRadius: 8 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "rgba(6,7,8,0.5)" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
