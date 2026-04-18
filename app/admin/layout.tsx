"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)";
const BLUE = "#2196F3";

const NAV_GROUPS = [
  { label: "Leads", items: [
    { href: "/admin", label: "Dashboard", icon: "⊞", exact: true },
    { href: "/admin/forms", label: "Form Entries", icon: "◈" },
    { href: "/admin/inquiries", label: "CRM Pipeline", icon: "◎" },
  ]},
  { label: "Content", items: [
    { href: "/admin/experiences", label: "Activations", icon: "▤" },
    { href: "/admin/live", label: "Live Experiences", icon: "●" },
    { href: "/admin/trust-logos", label: "Trust Logos", icon: "◉" },
    { href: "/admin/testimonials", label: "Testimonials", icon: "❝" },
    { href: "/admin/cities", label: "Cities", icon: "◷" },
  ]},
  { label: "Site", items: [
    { href: "/admin/pages", label: "Page Editor", icon: "✎" },
    { href: "/admin/seo", label: "SEO", icon: "⬡" },
    { href: "/admin/media", label: "Media Library", icon: "⊟" },
    { href: "/admin/settings", label: "Settings", icon: "⚙" },
  ]},
  { label: "Admin", items: [
    { href: "/admin/users", label: "Admin Users", icon: "👤" },
  ]},
];

function SidebarLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={28} height={28} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="sl_orb" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2196F3"/><stop offset="55%" stopColor="#8B3CF7"/><stop offset="100%" stopColor="#FF6B2B"/>
          </linearGradient>
          <linearGradient id="sl_w1" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#64B5F6" stopOpacity="0.9"/><stop offset="100%" stopColor="#2196F3" stopOpacity="0.6"/>
          </linearGradient>
          <linearGradient id="sl_w2" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2196F3"/><stop offset="100%" stopColor="#8B3CF7"/>
          </linearGradient>
          <linearGradient id="sl_w3" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6B2B"/><stop offset="100%" stopColor="#FFB347" stopOpacity="0.8"/>
          </linearGradient>
          <clipPath id="sl_clip"><circle cx="50" cy="50" r="46"/></clipPath>
        </defs>
        <circle cx="50" cy="50" r="46" stroke="url(#sl_orb)" strokeWidth="4" fill="none" opacity="0.85"/>
        <g clipPath="url(#sl_clip)">
          <path d="M4 35C20 25,30 45,50 35C70 25,80 45,96 35L96 22C80 32,70 12,50 22C30 32,20 12,4 22Z" fill="url(#sl_w1)"/>
          <path d="M4 50C20 40,30 60,50 50C70 40,80 60,96 50L96 37C80 47,70 27,50 37C30 47,20 27,4 37Z" fill="url(#sl_w2)"/>
          <path d="M4 65C20 55,30 75,50 65C70 55,80 75,96 65L96 52C80 62,70 42,50 52C30 62,20 42,4 52Z" fill="url(#sl_w3)"/>
        </g>
      </svg>
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", lineHeight: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 900, fontStyle: "italic", letterSpacing: 1, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FLOWSTATE</div>
        <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.2em", color: "rgba(248,246,242,0.3)" }}>ADMIN</div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  // Don't wrap login page in admin layout
  if (path === "/admin/login") return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Barlow',sans-serif", background: "#F0EDE8", color: "#04080F" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=Barlow:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        input,textarea,select,button{font-family:'Barlow',sans-serif}
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: 220, background: "#04080F", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100, flexShrink: 0 }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
          <Link href="/"><SidebarLogo /></Link>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0" }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: "0.25rem" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(248,246,242,0.2)", padding: "8px 1.5rem 3px" }}>
                {group.label}
              </div>
              {group.items.map(item => {
                const active = (item as any).exact ? path === item.href : path.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 1.5rem", fontSize: 13, fontWeight: active ? 700 : 400, color: active ? "#F8F6F2" : "rgba(248,246,242,0.45)", background: active ? "rgba(33,150,243,0.12)" : "transparent", borderRight: active ? `2px solid ${BLUE}` : "2px solid transparent", transition: "all 0.15s" }}>
                    <span style={{ fontSize: 12, width: 16, textAlign: "center", opacity: active ? 1 : 0.5, flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                    {item.href === "/admin/forms" && !active && (
                      <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 100, background: "rgba(33,150,243,0.2)", color: "#64B5F6" }}>NEW</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: "1rem 1.25rem", borderTop: "0.5px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 8 }}>
          <Link href="/" target="_blank" style={{ fontSize: 12, color: "rgba(248,246,242,0.3)", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            ← View live site
          </Link>
          <button onClick={handleLogout} disabled={loggingOut} style={{ fontSize: 12, color: "rgba(231,76,60,0.7)", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6, fontWeight: 500, padding: 0, fontFamily: "inherit" }}>
            {loggingOut ? "Signing out..." : "⏻ Sign out"}
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh" }}>{children}</main>
    </div>
  );
}
