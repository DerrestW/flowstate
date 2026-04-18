"use client";
import { useState, useEffect } from "react";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)";
const BLUE = "#2196F3";
const D: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900 };

type Logo = { id: string; name: string; abbr: string; logo_url: string; published: boolean; sort_order: number };

const DEFAULTS: Logo[] = [
  { id: "1", name: "City of Hampton", abbr: "Hampton, VA", logo_url: "", published: true, sort_order: 1 },
  { id: "2", name: "Houston Parks Dept.", abbr: "Houston, TX", logo_url: "", published: true, sort_order: 2 },
  { id: "3", name: "City of Austin", abbr: "Austin, TX", logo_url: "", published: true, sort_order: 3 },
  { id: "4", name: "ATX Summer Fest", abbr: "Festival", logo_url: "", published: true, sort_order: 4 },
  { id: "5", name: "Discovery Green", abbr: "Houston, TX", logo_url: "", published: true, sort_order: 5 },
  { id: "6", name: "City of Norfolk", abbr: "Norfolk, VA", logo_url: "", published: true, sort_order: 6 },
  { id: "7", name: "Galveston Events", abbr: "Galveston, TX", logo_url: "", published: false, sort_order: 7 },
  { id: "8", name: "YMCA Houston", abbr: "Nonprofit", logo_url: "", published: true, sort_order: 8 },
];

const input: React.CSSProperties = { width: "100%", padding: "9px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid rgba(6,7,8,0.15)", background: "#F8F6F2", fontFamily: "'Barlow',sans-serif", outline: "none" };
const labelSt: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(6,7,8,0.4)", marginBottom: 6, display: "block" };

export default function TrustLogosAdmin() {
  const [logos, setLogos] = useState<Logo[]>(DEFAULTS);
  const [editing, setEditing] = useState<Logo | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("flowstate_trust_logos");
    if (stored) try { setLogos(JSON.parse(stored)); } catch {}
  }, []);

  function save(items: Logo[]) {
    localStorage.setItem("flowstate_trust_logos", JSON.stringify(items));
    setLogos(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function saveEditing() {
    if (!editing) return;
    let updated: Logo[];
    if (isNew) {
      updated = [...logos, { ...editing, id: Date.now().toString(), sort_order: logos.length + 1 }];
    } else {
      updated = logos.map(l => l.id === editing.id ? editing : l);
    }
    save(updated);
    setEditing(null);
  }

  function toggle(id: string) {
    const updated = logos.map(l => l.id === id ? { ...l, published: !l.published } : l);
    save(updated);
  }

  function remove(id: string) {
    if (!confirm("Remove this partner?")) return;
    save(logos.filter(l => l.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  function moveUp(i: number) {
    if (i === 0) return;
    const updated = [...logos];
    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
    save(updated.map((l, idx) => ({ ...l, sort_order: idx + 1 })));
  }

  function moveDown(i: number) {
    if (i === logos.length - 1) return;
    const updated = [...logos];
    [updated[i], updated[i + 1]] = [updated[i + 1], updated[i]];
    save(updated.map((l, idx) => ({ ...l, sort_order: idx + 1 })));
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* List */}
      <div style={{ flex: editing ? "0 0 55%" : "1", borderRight: "0.5px solid rgba(6,7,8,0.1)", overflow: "auto" }}>
        <div style={{ padding: "1.75rem 2rem 1rem", background: "#F0EDE8", borderBottom: "0.5px solid rgba(6,7,8,0.08)", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BLUE, marginBottom: 4 }}>Homepage Banner</div>
              <h1 style={{ ...D, fontSize: 32, letterSpacing: 1 }}>TRUST LOGOS</h1>
            </div>
            <button onClick={() => { setEditing({ id: "", name: "", abbr: "", logo_url: "", published: true, sort_order: logos.length + 1 }); setIsNew(true); }}
              style={{ fontSize: 12, fontWeight: 700, padding: "8px 20px", borderRadius: 100, background: "#04080F", color: "#F8F6F2", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              + Add Partner
            </button>
          </div>
          <p style={{ fontSize: 12, color: "rgba(6,7,8,0.45)" }}>These appear in the rotating trust banner on the homepage. Drag to reorder.</p>
        </div>

        {/* Live preview strip */}
        <div style={{ padding: "1rem 2rem", borderBottom: "0.5px solid rgba(6,7,8,0.08)", background: "#fff" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 10 }}>Live preview</div>
          <div style={{ display: "flex", gap: 1, borderRadius: 10, overflow: "hidden", background: "rgba(6,7,8,0.06)" }}>
            {logos.filter(l => l.published).slice(0, 6).map(l => (
              <div key={l.id} style={{ flex: 1, padding: "10px 8px", background: "#F8F6F2", textAlign: "center" }}>
                {l.logo_url ? (
                  <img src={l.logo_url} alt={l.name} style={{ height: 28, objectFit: "contain", maxWidth: "100%", marginBottom: 3 }} />
                ) : (
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#04080F", lineHeight: 1.2 }}>{l.name}</div>
                )}
                <div style={{ fontSize: 9, color: "rgba(6,7,8,0.4)", marginTop: 2 }}>{l.abbr}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logos list */}
        <div>
          {logos.map((logo, i) => (
            <div key={logo.id} style={{ padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem", borderBottom: "0.5px solid rgba(6,7,8,0.06)", background: editing?.id === logo.id ? "#fff" : "transparent" }}>
              {/* Reorder arrows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
                <button onClick={() => moveUp(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(6,7,8,0.3)", fontSize: 12, padding: "2px 4px" }} disabled={i === 0}>▲</button>
                <button onClick={() => moveDown(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(6,7,8,0.3)", fontSize: 12, padding: "2px 4px" }} disabled={i === logos.length - 1}>▼</button>
              </div>

              {/* Logo preview or initials */}
              <div style={{ width: 48, height: 40, borderRadius: 8, background: "rgba(6,7,8,0.05)", border: "0.5px solid rgba(6,7,8,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                {logo.logo_url ? (
                  <img src={logo.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => (e.target as HTMLElement).style.display = "none"} />
                ) : (
                  <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(6,7,8,0.3)" }}>{logo.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => { setEditing(logo); setIsNew(false); }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{logo.name}</div>
                <div style={{ fontSize: 12, color: "rgba(6,7,8,0.45)" }}>{logo.abbr}</div>
              </div>

              {/* Sort order badge */}
              <div style={{ fontSize: 11, color: "rgba(6,7,8,0.3)", fontWeight: 600, minWidth: 24, textAlign: "center" }}>#{i + 1}</div>

              {/* Toggle */}
              <button onClick={() => toggle(logo.id)} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 100, border: "0.5px solid", background: logo.published ? "#E3F2FD" : "rgba(6,7,8,0.05)", color: logo.published ? "#1565C0" : "rgba(6,7,8,0.4)", borderColor: logo.published ? "#90CAF9" : "rgba(6,7,8,0.15)", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                {logo.published ? "Visible" : "Hidden"}
              </button>

              {/* Edit + Delete */}
              <button onClick={() => { setEditing(logo); setIsNew(false); }} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "0.5px solid rgba(6,7,8,0.15)", background: "transparent", color: "rgba(6,7,8,0.6)", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
              <button onClick={() => remove(logo.id)} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, border: "0.5px solid #FFCDD2", background: "#FFEBEE", color: "#B71C1C", cursor: "pointer", fontFamily: "inherit" }}>✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit panel */}
      {editing && (
        <div style={{ flex: "0 0 45%", overflow: "auto", background: "#fff", padding: "2rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>{isNew ? "Add Partner" : `Edit: ${editing.name}`}</h2>
            <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "rgba(6,7,8,0.4)" }}>✕</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelSt}>Partner / City Name *</label>
              <input style={input} value={editing.name} onChange={e => setEditing(p => p ? { ...p, name: e.target.value } : p)} placeholder="City of Hampton" />
            </div>
            <div>
              <label style={labelSt}>Short Label (city, state, or type)</label>
              <input style={input} value={editing.abbr} onChange={e => setEditing(p => p ? { ...p, abbr: e.target.value } : p)} placeholder="Hampton, VA" />
            </div>
            <div>
              <label style={labelSt}>Logo Image URL <span style={{ color: "rgba(6,7,8,0.3)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>optional — leave blank for text fallback</span></label>
              <input style={input} value={editing.logo_url} onChange={e => setEditing(p => p ? { ...p, logo_url: e.target.value } : p)} placeholder="https://... (upload via Media Library first)" />
              {editing.logo_url && (
                <div style={{ marginTop: 8, padding: 12, background: "rgba(6,7,8,0.03)", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={editing.logo_url} alt="" style={{ height: 40, objectFit: "contain", maxWidth: 120 }} onError={e => (e.target as HTMLElement).style.display = "none"} />
                  <span style={{ fontSize: 12, color: "rgba(6,7,8,0.4)" }}>Preview</span>
                </div>
              )}
            </div>

            {/* Text fallback preview */}
            {!editing.logo_url && editing.name && (
              <div>
                <label style={labelSt}>Text Fallback Preview</label>
                <div style={{ padding: "1rem", background: "#F8F6F2", borderRadius: 10, textAlign: "center", border: "0.5px solid rgba(6,7,8,0.08)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{editing.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(6,7,8,0.4)", marginTop: 3 }}>{editing.abbr}</div>
                </div>
              </div>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
              <input type="checkbox" checked={editing.published} onChange={e => setEditing(p => p ? { ...p, published: e.target.checked } : p)} />
              Show in homepage banner
            </label>

            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "0.5px solid rgba(6,7,8,0.08)" }}>
              <button onClick={saveEditing} style={{ flex: 1, fontSize: 13, fontWeight: 700, padding: "12px", borderRadius: 100, background: "#04080F", color: "#F8F6F2", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                {isNew ? "Add Partner" : "Save Changes"}
              </button>
              <button onClick={() => setEditing(null)} style={{ fontSize: 13, padding: "12px 24px", borderRadius: 100, background: "transparent", color: "rgba(6,7,8,0.5)", border: "0.5px solid rgba(6,7,8,0.2)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            </div>

            <div style={{ padding: "1rem", background: "#E3F2FD", borderRadius: 10, border: "0.5px solid #90CAF9" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1565C0", marginBottom: 4 }}>Tip: Adding logo images</div>
              <div style={{ fontSize: 12, color: "#1565C0" }}>Upload the logo PNG to Media Library first, copy the URL, then paste it here. Use transparent PNGs for best results on the dark homepage background.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
