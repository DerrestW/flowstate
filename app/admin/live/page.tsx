"use client";
import { useState } from "react";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)";
const BLUE = "#2196F3";
const D: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900 };
const input: React.CSSProperties = { width: "100%", padding: "9px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid rgba(6,7,8,0.15)", background: "#F8F6F2", fontFamily: "inherit", outline: "none" };
const labelSt: React.CSSProperties = { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(6,7,8,0.4)", marginBottom: 6, display: "block" };

type LiveExp = {
  id: string; title: string; location: string; address: string; status: "NOW OPEN"|"UPCOMING"|"SEASONAL";
  type: string; openSince: string; eventDate: string; hoursDay: string; hoursTime: string;
  description: string; ticketUrl: string; heroImage: string; published: boolean;
  pricing: { name: string; price: string }[];
};

const EMPTY: Omit<LiveExp, "id"> = {
  title: "", location: "", address: "", status: "NOW OPEN", type: "PERMANENT",
  openSince: "", eventDate: "", hoursDay: "Monday - Sunday", hoursTime: "10:00 AM - 10:00 PM",
  description: "", ticketUrl: "", heroImage: "", published: true,
  pricing: [{ name: "", price: "" }],
};

const STATUS_COLORS = {
  "NOW OPEN": { bg: "rgba(76,175,80,0.12)", text: "#2E7D32" },
  "UPCOMING": { bg: "rgba(255,152,0,0.12)", text: "#E65100" },
  "SEASONAL": { bg: "rgba(139,60,247,0.12)", text: "#6A1B9A" },
};

export default function AdminLiveExperiences() {
  const [experiences, setExperiences] = useState<LiveExp[]>([
    { id: "1", title: "Boats at Discovery Green", location: "Houston, Texas", address: "1500 McKinney St, Houston, TX 77010", status: "NOW OPEN", type: "PERMANENT", openSince: "February 27, 2026", eventDate: "", hoursDay: "Monday - Sunday", hoursTime: "10:00 AM - 10:00 PM", description: "Motorized bumper boats, cruiser boats, and LED kayaks at Discovery Green.", ticketUrl: "https://discoverygreen.com", heroImage: "/img-donut-boat-hut.png", published: true, pricing: [{ name: "Cruiser Boats", price: "$25" }, { name: "Bumper Boats", price: "$12" }, { name: "Kayaks", price: "$12" }] },
    { id: "2", title: "Urban Slide — Hampton, VA", location: "Hampton, Virginia", address: "Settlers Landing Road, Hampton, VA", status: "UPCOMING", type: "EVENT", openSince: "", eventDate: "July 2025", hoursDay: "Event Day Only", hoursTime: "10:00 AM - 6:00 PM", description: "500-foot water slide on city streets.", ticketUrl: "", heroImage: "/img-urban-slide.png", published: true, pricing: [{ name: "General Admission", price: "TBD" }] },
  ]);
  const [editing, setEditing] = useState<LiveExp | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  function save() {
    setSaving(true);
    if (isNew) {
      setExperiences(prev => [...prev, { ...editing!, id: Date.now().toString() }]);
    } else {
      setExperiences(prev => prev.map(e => e.id === editing?.id ? editing! : e));
    }
    setTimeout(() => { setSaving(false); setEditing(null); }, 600);
  }

  function addPricingRow() {
    setEditing(e => e ? { ...e, pricing: [...e.pricing, { name: "", price: "" }] } : e);
  }

  function updatePricing(i: number, field: "name" | "price", val: string) {
    setEditing(e => {
      if (!e) return e;
      const p = [...e.pricing];
      p[i] = { ...p[i], [field]: val };
      return { ...e, pricing: p };
    });
  }

  function removePricing(i: number) {
    setEditing(e => e ? { ...e, pricing: e.pricing.filter((_, idx) => idx !== i) } : e);
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* List */}
      <div style={{ flex: editing ? "0 0 50%" : "1", borderRight: "0.5px solid rgba(6,7,8,0.1)", overflow: "auto" }}>
        <div style={{ padding: "1.75rem 2rem 1rem", background: "#F0EDE8", borderBottom: "0.5px solid rgba(6,7,8,0.08)", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BLUE, marginBottom: 4 }}>Public Page</div>
              <h1 style={{ ...D, fontSize: 32, letterSpacing: 1 }}>LIVE EXPERIENCES</h1>
            </div>
            <button onClick={() => { setEditing({ ...EMPTY, id: "" } as LiveExp); setIsNew(true); }}
              style={{ fontSize: 12, fontWeight: 700, padding: "8px 20px", borderRadius: 100, background: "#04080F", color: "#F8F6F2", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              + Add Experience
            </button>
          </div>
        </div>

        {experiences.map(exp => {
          const sc = STATUS_COLORS[exp.status];
          return (
            <div key={exp.id} onClick={() => { setEditing(exp); setIsNew(false); }} style={{ padding: "1.25rem 2rem", cursor: "pointer", borderBottom: "0.5px solid rgba(6,7,8,0.06)", background: editing?.id === exp.id ? "#fff" : "transparent", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 64, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                <img src={exp.heroImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: sc.bg, color: sc.text }}>{exp.status}</span>
                  <span style={{ fontSize: 10, color: "rgba(6,7,8,0.4)" }}>{exp.type}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{exp.title}</div>
                <div style={{ fontSize: 12, color: "rgba(6,7,8,0.5)" }}>{exp.location} · {exp.eventDate || exp.openSince}</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, background: exp.published ? "#E3F2FD" : "rgba(6,7,8,0.06)", color: exp.published ? "#1565C0" : "rgba(6,7,8,0.4)", fontWeight: 700 }}>
                {exp.published ? "Live" : "Draft"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Edit panel */}
      {editing && (
        <div style={{ flex: "0 0 50%", overflow: "auto", background: "#fff", padding: "2rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>{isNew ? "New Live Experience" : `Edit: ${editing.title}`}</h2>
            <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "rgba(6,7,8,0.4)" }}>✕</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div><label style={labelSt}>Title *</label><input style={input} value={editing.title} onChange={e => setEditing(p => p ? { ...p, title: e.target.value } : p)} placeholder="Boats at Discovery Green" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div><label style={labelSt}>Status</label>
                <select style={{ ...input, cursor: "pointer" }} value={editing.status} onChange={e => setEditing(p => p ? { ...p, status: e.target.value as LiveExp["status"] } : p)}>
                  <option>NOW OPEN</option><option>UPCOMING</option><option>SEASONAL</option>
                </select>
              </div>
              <div><label style={labelSt}>Type</label>
                <select style={{ ...input, cursor: "pointer" }} value={editing.type} onChange={e => setEditing(p => p ? { ...p, type: e.target.value } : p)}>
                  <option>PERMANENT</option><option>EVENT</option><option>SEASONAL</option>
                </select>
              </div>
            </div>
            <div><label style={labelSt}>Location (City, State)</label><input style={input} value={editing.location} onChange={e => setEditing(p => p ? { ...p, location: e.target.value } : p)} placeholder="Houston, Texas" /></div>
            <div><label style={labelSt}>Full Address</label><input style={input} value={editing.address} onChange={e => setEditing(p => p ? { ...p, address: e.target.value } : p)} placeholder="1500 McKinney St, Houston, TX 77010" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div><label style={labelSt}>Open Since (permanent)</label><input style={input} value={editing.openSince} onChange={e => setEditing(p => p ? { ...p, openSince: e.target.value } : p)} placeholder="February 27, 2026" /></div>
              <div><label style={labelSt}>Event Date (events)</label><input style={input} value={editing.eventDate} onChange={e => setEditing(p => p ? { ...p, eventDate: e.target.value } : p)} placeholder="July 2025" /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div><label style={labelSt}>Hours — Days</label><input style={input} value={editing.hoursDay} onChange={e => setEditing(p => p ? { ...p, hoursDay: e.target.value } : p)} placeholder="Monday - Sunday" /></div>
              <div><label style={labelSt}>Hours — Time</label><input style={input} value={editing.hoursTime} onChange={e => setEditing(p => p ? { ...p, hoursTime: e.target.value } : p)} placeholder="10:00 AM - 10:00 PM" /></div>
            </div>
            <div><label style={labelSt}>Description</label><textarea style={{ ...input, minHeight: 80, resize: "vertical" }} value={editing.description} onChange={e => setEditing(p => p ? { ...p, description: e.target.value } : p)} /></div>
            <div><label style={labelSt}>Hero Image URL</label><input style={input} value={editing.heroImage} onChange={e => setEditing(p => p ? { ...p, heroImage: e.target.value } : p)} placeholder="https://... or /img-urban-slide.png" /></div>
            <div><label style={labelSt}>Ticket / Website URL</label><input style={input} value={editing.ticketUrl} onChange={e => setEditing(p => p ? { ...p, ticketUrl: e.target.value } : p)} placeholder="https://discoverygreen.com" /></div>

            {/* Pricing */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ ...labelSt, marginBottom: 0 }}>Pricing</label>
                <button onClick={addPricingRow} style={{ fontSize: 11, padding: "4px 12px", borderRadius: 100, background: "transparent", border: "0.5px solid rgba(6,7,8,0.2)", cursor: "pointer", fontFamily: "inherit" }}>+ Add row</button>
              </div>
              {editing.pricing.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input style={{ ...input, flex: 2 }} value={p.name} onChange={e => updatePricing(i, "name", e.target.value)} placeholder="Ticket type" />
                  <input style={{ ...input, flex: 1 }} value={p.price} onChange={e => updatePricing(i, "price", e.target.value)} placeholder="$25" />
                  <button onClick={() => removePricing(i)} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 8, background: "#FFEBEE", color: "#B71C1C", border: "none", cursor: "pointer", fontFamily: "inherit" }}>✕</button>
                </div>
              ))}
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
              <input type="checkbox" checked={editing.published} onChange={e => setEditing(p => p ? { ...p, published: e.target.checked } : p)} />
              Published (visible on live experiences page)
            </label>

            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "0.5px solid rgba(6,7,8,0.08)" }}>
              <button onClick={save} disabled={saving} style={{ flex: 1, fontSize: 13, fontWeight: 700, padding: "12px", borderRadius: 100, background: saving ? "rgba(33,150,243,0.4)" : "#04080F", color: "#F8F6F2", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                {saving ? "Saving..." : isNew ? "Add Experience" : "Save Changes"}
              </button>
              <button onClick={() => setEditing(null)} style={{ fontSize: 13, padding: "12px 24px", borderRadius: 100, background: "transparent", color: "rgba(6,7,8,0.5)", border: "0.5px solid rgba(6,7,8,0.2)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
