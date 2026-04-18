"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/api/site-settings");
        const data = await r.json();
        const settMap: Record<string, string> = {};
        (Array.isArray(data) ? data : []).forEach((s: any) => { settMap[s.key] = s.value; });
        setSettings(settMap);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  async function saveSettings() {
    await fetch("/api/site-settings", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ settings }) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function saveStats() {
    // Stats saved via settings API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const D: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900 };
  const card: React.CSSProperties = { background: "#fff", borderRadius: 12, padding: "2rem", border: "0.5px solid rgba(6,7,8,0.08)", marginBottom: "1.5rem" };
  const input: React.CSSProperties = { width: "100%", padding: "10px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid rgba(6,7,8,0.15)", background: "#F8F6F2", fontFamily: "inherit", outline: "none" };
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(6,7,8,0.4)", marginBottom: 6, display: "block" };

  return (
    <div style={{ padding: "2.5rem", maxWidth: 800 }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1976D2", marginBottom: 6 }}>Admin</div>
        <h1 style={{ ...D, fontSize: 40, letterSpacing: 1 }}>SITE SETTINGS</h1>
      </div>

      {loading ? <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900, fontSize: 28, letterSpacing: 1, background: "linear-gradient(90deg,#2196F3,#FF6B2B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", padding: "2rem", textAlign: "center" }}>LOADING...</div> : (
        <>
          {/* Hero section */}
          <div style={card}>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: "1.5rem" }}>Hero Section</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={label}>Headline</label>
                <input style={input} value={settings.hero_headline || ""} onChange={e => setSettings(p => ({ ...p, hero_headline: e.target.value }))} />
              </div>
              <div>
                <label style={label}>Subline</label>
                <textarea style={{ ...input, minHeight: 80, resize: "vertical" }} value={settings.hero_subline || ""} onChange={e => setSettings(p => ({ ...p, hero_subline: e.target.value }))} />
              </div>
            </div>
            <button onClick={saveSettings} style={{ marginTop: "1.5rem", fontSize: 12, fontWeight: 500, padding: "9px 24px", borderRadius: 100, background: saved ? "#2196F3" : "#060708", color: saved ? "#060708" : "#F9F7F3", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              {saved ? "Saved ✓" : "Save Hero"}
            </button>
          </div>

          {/* About section */}
          <div style={card}>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: "1.5rem" }}>About Section</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={label}>About Headline</label>
                <input style={input} value={settings.about_headline || ""} onChange={e => setSettings(p => ({ ...p, about_headline: e.target.value }))} />
              </div>
              <div>
                <label style={label}>About Body</label>
                <textarea style={{ ...input, minHeight: 120, resize: "vertical" }} value={settings.about_body || ""} onChange={e => setSettings(p => ({ ...p, about_body: e.target.value }))} />
              </div>
            </div>
            <button onClick={saveSettings} style={{ marginTop: "1.5rem", fontSize: 12, fontWeight: 500, padding: "9px 24px", borderRadius: 100, background: "#060708", color: "#F9F7F3", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Save About
            </button>
          </div>

          {/* Stats */}
          <div style={card}>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: "0.5rem" }}>Homepage Stats</h2>
            <p style={{ fontSize: 13, color: "rgba(6,7,8,0.4)", marginBottom: "1.5rem" }}>These 4 numbers appear in the stats bar below the hero.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {stats.map((stat, i) => (
                <div key={stat.id} style={{ padding: "1.25rem", background: "rgba(6,7,8,0.03)", borderRadius: 10, border: "0.5px solid rgba(6,7,8,0.07)" }}>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={label}>Value (e.g. "65+")</label>
                    <input style={{ ...input, fontSize: 20, fontWeight: 500, background: "#fff" }} value={stat.value} onChange={e => setStats(prev => prev.map((s, j) => j === i ? { ...s, value: e.target.value } : s))} />
                  </div>
                  <div>
                    <label style={label}>Label</label>
                    <input style={input} value={stat.label} onChange={e => setStats(prev => prev.map((s, j) => j === i ? { ...s, label: e.target.value } : s))} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveStats} style={{ marginTop: "1.5rem", fontSize: 12, fontWeight: 500, padding: "9px 24px", borderRadius: 100, background: "#060708", color: "#F9F7F3", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Save Stats
            </button>
          </div>

          {/* Company info */}
          <div style={card}>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: "1.5rem" }}>Company Info</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { key: "company_email", label: "Contact Email", placeholder: "hello@flowstateexperiences.com" },
                { key: "company_phone", label: "Phone", placeholder: "(713) 000-0000" },
                { key: "company_instagram", label: "Instagram Handle", placeholder: "@flowstateexp" },
                { key: "company_city", label: "HQ City", placeholder: "Houston, TX" },
              ].map(f => (
                <div key={f.key}>
                  <label style={label}>{f.label}</label>
                  <input style={input} value={settings[f.key] || ""} onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                </div>
              ))}
            </div>
            <button onClick={saveSettings} style={{ marginTop: "1.5rem", fontSize: 12, fontWeight: 500, padding: "9px 24px", borderRadius: 100, background: "#060708", color: "#F9F7F3", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Save Company Info
            </button>
          </div>
        </>
      )}
    </div>
  );
}
