"use client";
import { useState, useEffect } from "react";

type City = { id:string; name:string; state:string; country:string; description?:string; image_url?:string; featured:boolean; published:boolean; sort_order:number; created_at:string; events_count?:number; participants_count?:number; };

const EMPTY: Partial<City> = { name: "", state: "", description: "", events_count: 0, participants_count: 0, featured: false, published: true };

export default function CitiesAdmin() {
  const [cities, setCities] = useState<City[]>([]);
  const [editing, setEditing] = useState<Partial<City> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const r = await fetch("/api/cities");
      const data = await r.json();
      setCities(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    if (isNew) {
      await fetch("/api/cities", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(editing) });
    } else {
      await fetch("/api/cities", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id: editing.id, ...editing }) });
    }
    await load();
    setEditing(null);
    setSaving(false);
  }

  async function deleteCity(id: string) {
    if (!confirm("Delete this city?")) return;
    await fetch("/api/cities", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id }) });
    setCities(prev => prev.filter(c => c.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  const D: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900 };
  const input: React.CSSProperties = { width: "100%", padding: "10px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid rgba(6,7,8,0.15)", background: "#F8F6F2", fontFamily: "inherit", outline: "none" };
  const labelS: React.CSSProperties = { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(6,7,8,0.4)", marginBottom: 6, display: "block" };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* List */}
      <div style={{ flex: editing ? "0 0 50%" : "1", borderRight: "0.5px solid rgba(6,7,8,0.1)", overflow: "auto" }}>
        <div style={{ padding: "2rem 1.5rem", borderBottom: "0.5px solid rgba(6,7,8,0.08)", background: "#F0EDE8", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ ...D, fontSize: 36, letterSpacing: 1 }}>CITIES</h1>
            <button onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); }} style={{ fontSize: 12, fontWeight: 500, padding: "8px 20px", borderRadius: 100, background: "#060708", color: "#F9F7F3", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              + Add City
            </button>
          </div>
        </div>

        {loading ? <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900, fontSize: 28, letterSpacing: 1, background: "linear-gradient(90deg,#2196F3,#FF6B2B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", padding: "3rem 2rem", textAlign: "center" }}>LOADING...</div> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", padding: "1.5rem" }}>
            {cities.map(city => (
              <div key={city.id} onClick={() => { setEditing(city); setIsNew(false); }} style={{
                background: editing?.id === city.id ? "#fff" : "#F8F6F2",
                border: `0.5px solid ${editing?.id === city.id ? "rgba(6,7,8,0.2)" : "rgba(6,7,8,0.08)"}`,
                borderRadius: 12, padding: "1.5rem", cursor: "pointer",
                transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{city.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(6,7,8,0.4)" }}>{city.state}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {city.featured && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, background: "#FAEEDA", color: "#854F0B" }}>Featured</span>}
                    <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, background: city.published ? "#E3F2FD" : "rgba(6,7,8,0.06)", color: city.published ? "#1565C0" : "rgba(6,7,8,0.4)" }}>
                      {city.published ? "Live" : "Draft"}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <div>
                    <div style={{ ...D, fontSize: 28, color: "#2196F3", letterSpacing: 1 }}>{city.events_count || 0}</div>
                    <div style={{ fontSize: 11, color: "rgba(6,7,8,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Events</div>
                  </div>
                  <div>
                    <div style={{ ...D, fontSize: 28, color: "#2196F3", letterSpacing: 1 }}>{(city.participants_count || 0).toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: "rgba(6,7,8,0.4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Participants</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit panel */}
      {editing && (
        <div style={{ flex: "0 0 50%", overflow: "auto", background: "#fff", padding: "2rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: 16, fontWeight: 500 }}>{isNew ? "New City" : `Edit: ${editing.name}, ${editing.state}`}</h2>
            <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "rgba(6,7,8,0.4)" }}>✕</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelS}>City Name *</label>
                <input style={input} value={editing.name || ""} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} placeholder="Hampton" />
              </div>
              <div>
                <label style={labelS}>State *</label>
                <input style={input} value={editing.state || ""} onChange={e => setEditing(p => ({ ...p, state: e.target.value }))} placeholder="VA" maxLength={2} />
              </div>
            </div>

            <div>
              <label style={labelS}>Description</label>
              <textarea style={{ ...input, minHeight: 100, resize: "vertical" }} value={editing.description || ""} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of events in this city..." />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelS}>Events Count</label>
                <input type="number" style={input} value={editing.events_count || ""} onChange={e => setEditing(p => ({ ...p, events_count: parseInt(e.target.value) || 0 }))} placeholder="12" />
              </div>
              <div>
                <label style={labelS}>Participants Count</label>
                <input type="number" style={input} value={editing.participants_count || ""} onChange={e => setEditing(p => ({ ...p, participants_count: parseInt(e.target.value) || 0 }))} placeholder="45000" />
              </div>
            </div>

            <div>
              <label style={labelS}>Hero Image URL</label>
              <input style={input} value={(editing as any).hero_image || ""} onChange={e => setEditing(p => ({ ...p, hero_image: e.target.value }))} placeholder="https://..." />
              <div style={{ fontSize: 11, color: "rgba(6,7,8,0.35)", marginTop: 4 }}>Paste a hosted image URL (Cloudinary, Supabase Storage, etc.)</div>
            </div>

            <div style={{ display: "flex", gap: "1.5rem" }}>
              {[
                { key: "featured", label: "Featured city" },
                { key: "published", label: "Published" },
              ].map(toggle => (
                <label key={toggle.key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input type="checkbox" checked={!!(editing as any)[toggle.key]} onChange={e => setEditing(p => ({ ...p, [toggle.key]: e.target.checked }))} />
                  {toggle.label}
                </label>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "0.5px solid rgba(6,7,8,0.08)" }}>
              <button onClick={save} disabled={saving} style={{ flex: 1, fontSize: 13, fontWeight: 500, padding: "12px", borderRadius: 100, background: "#060708", color: "#F9F7F3", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                {saving ? "Saving..." : isNew ? "Add City" : "Save Changes"}
              </button>
              {!isNew && (
                <button onClick={() => deleteCity(editing.id!)} style={{ fontSize: 13, padding: "12px 20px", borderRadius: 100, background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F7C1C1", cursor: "pointer", fontFamily: "inherit" }}>
                  Delete
                </button>
              )}
              <button onClick={() => setEditing(null)} style={{ fontSize: 13, padding: "12px 24px", borderRadius: 100, background: "transparent", color: "rgba(6,7,8,0.5)", border: "0.5px solid rgba(6,7,8,0.2)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
