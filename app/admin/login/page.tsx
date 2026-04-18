"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #8B3CF7 50%, #FF6B2B 100%)";
const NAVY = "#0F1623";
const NAVY_MID = "#161E2E";
const NAVY_CARD = "#1A2338";
const SAND = "#EEF0F5";
const MUTED = "rgba(238,240,245,0.6)";
const BORDER = "rgba(238,240,245,0.08)";
const BLUE = "#2196F3";

function LogoMark() {
  return (
    <svg width={48} height={48} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="login_orb" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2196F3"/><stop offset="55%" stopColor="#8B3CF7"/><stop offset="100%" stopColor="#FF6B2B"/>
        </linearGradient>
        <linearGradient id="login_w1" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#64B5F6" stopOpacity="0.9"/><stop offset="100%" stopColor="#2196F3" stopOpacity="0.6"/>
        </linearGradient>
        <linearGradient id="login_w2" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2196F3"/><stop offset="100%" stopColor="#8B3CF7"/>
        </linearGradient>
        <linearGradient id="login_w3" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF6B2B"/><stop offset="100%" stopColor="#FFB347" stopOpacity="0.8"/>
        </linearGradient>
        <clipPath id="login_clip"><circle cx="50" cy="50" r="46"/></clipPath>
      </defs>
      <circle cx="50" cy="50" r="46" stroke="url(#login_orb)" strokeWidth="4" fill="none" opacity="0.85"/>
      <g clipPath="url(#login_clip)">
        <path d="M4 35C20 25,30 45,50 35C70 25,80 45,96 35L96 22C80 32,70 12,50 22C30 32,20 12,4 22Z" fill="url(#login_w1)"/>
        <path d="M4 50C20 40,30 60,50 50C70 40,80 60,96 50L96 37C80 47,70 27,50 37C30 47,20 27,4 37Z" fill="url(#login_w2)"/>
        <path d="M4 65C20 55,30 75,50 65C70 55,80 75,96 65L96 52C80 62,70 42,50 52C30 62,20 42,4 52Z" fill="url(#login_w3)"/>
      </g>
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  const IS: React.CSSProperties = {
    width: "100%", padding: "12px 16px", fontSize: 15,
    borderRadius: 10, border: `0.5px solid ${BORDER}`,
    background: "rgba(238,240,245,0.06)", color: SAND,
    outline: "none", fontFamily: "'Barlow',sans-serif",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ minHeight: "100vh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow',sans-serif", padding: "2rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,900&family=Barlow:wght@300;400;500;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Background pattern */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(33,150,243,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(33,150,243,0.03) 1px,transparent 1px)", backgroundSize: "60px 60px", zIndex: 0 }}/>
      <div style={{ position: "fixed", top: "20%", right: "20%", width: 400, height: 400, background: "radial-gradient(circle,rgba(33,150,243,0.06) 0%,transparent 70%)", zIndex: 0 }}/>

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
            <LogoMark/>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", lineHeight: 1, textAlign: "left" }}>
              <div style={{ fontSize: 26, fontWeight: 900, fontStyle: "italic", letterSpacing: 1, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FLOWSTATE</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", color: "rgba(238,240,245,0.35)" }}>EXPERIENCES</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: MUTED }}>Admin Portal</p>
        </div>

        {/* Card */}
        <div style={{ background: NAVY_CARD, borderRadius: 20, padding: "2.5rem", border: `0.5px solid ${BORDER}` }}>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900, fontSize: 28, letterSpacing: 1, marginBottom: "0.5rem", color: SAND }}>SIGN IN</h1>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: "2rem", fontWeight: 300 }}>Enter your credentials to access the admin panel.</p>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(231,76,60,0.12)", border: "0.5px solid rgba(231,76,60,0.3)", borderRadius: 10, marginBottom: "1.5rem", fontSize: 13, color: "#E74C3C" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 6, display: "block" }}>Email</label>
              <input
                type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                style={IS} placeholder="derrestwilliams@gmail.com"
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = BLUE}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = BORDER}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginBottom: 6, display: "block" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ ...IS, paddingRight: 48 }} placeholder="••••••••••••"
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = BLUE}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = BORDER}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 14 }}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ fontSize: 15, fontWeight: 900, fontStyle: "italic", letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px", borderRadius: 100, border: "none", background: loading ? "rgba(33,150,243,0.4)" : GRAD, color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Barlow Condensed',sans-serif", marginTop: 4 }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: `0.5px solid ${BORDER}`, textAlign: "center" }}>
            <a href="/" style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>← Back to live site</a>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: 11, color: "rgba(238,240,245,0.2)" }}>
          FlowState Experiences · Admin Portal · Secured
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0F1623" }} />}>
      <LoginForm />
    </Suspense>
  );
}
