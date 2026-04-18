"use client";
import { useState, useEffect } from "react";

type Testimonial = { id:string; quote:string; author:string; title?:string; org?:string; organization?:string; city?:string; experience?:string; featured?:boolean; published:boolean; sort_order:number; created_at:string; };

const EMPTY: Partial<Testimonial> = { author: "", title: "", organization: "", quote: "", city: "", experience: "", featured: false, published: true, sort_order: 0 };

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const r = await fetch("/api/testimonials");
      const data = await r.json();
      setItems(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    if (isNew) {
      /* TODO: use API */
    } else {
      await fetch("/api/testimonials", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id: editing.id, ...editing }) });
    }
    await load();
    setEditing(null);
    setSaving(false);
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch("/api/testimonials", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id }) });
    setItems(prev => prev.filter(t => t.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  const D: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900 };
  const input: React.CSSProperties = { width: "100%", padding: "10px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid rgba(6,7,8,0.15)", background: "#F8F6F2", fontFamily: "inherit", outline: "none" };
  const labelS: React.CSSProperties = { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(6,7,8,0.4)", marginBottom: 6, display: "block" };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ flex: editing ? "0 0 50%" : "1", borderRight: "0.5px solid rgba(6,7,8,0.1)", overflow: "auto" }}>
        <div style={{ padding: "2rem 1.5rem", borderBottom: "0.5px solid rgba(6,7,8,0.08)", background: "#F0EDE8", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ ...D, fontSize: 36, letterSpacing: 1 }}>TESTIMONIALS</h1>
            <button onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); }} style={{ fontSize: 12, fontWeight: 500, padding: "8px 20px", borderRadius: 100, background: "#060708", color: "#F9F7F3", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              + Add Testimonial
            </button>
          </div>
        </div>

        {loading ? <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900, fontSize: 28, letterSpacing: 1, background: "linear-gradient(90deg,#2196F3,#FF6B2B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", padding: "3rem 2rem", textAlign: "center" }}>LOADING...</div> : (
          items.map(item => (
            <div key={item.id} onClick={() => { setEditing(item); setIsNew(false); }} style={{
              padding: "1.5rem", cursor: "pointer",
              background: editing?.id === item.id ? "#fff" : "transparent",
              borderBottom: "0.5px solid rgba(6,7,8,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{item.author}</div>
                  <div style={{ fontSize: 12, color: "rgba(6,7,8,0.45)" }}>{item.title} · {item.organization}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {item.featured && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, background: "#FAEEDA", color: "#854F0B" }}>Featured</span>}
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, background: item.published ? "#E3F2FD" : "rgba(6,7,8,0.06)", color: item.published ? "#1565C0" : "rgba(6,7,8,0.4)" }}>
                    {item.published ? "Live" : "Draft"}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "rgba(6,7,8,0.55)", lineHeight: 1.65, fontStyle: "italic" }}>"{item.quote}"</p>
            </div>
          ))
        )}
      </div>

      {editing && (
        <div style={{ flex: "0 0 50%", overflow: "auto", background: "#fff", padding: "2rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: 16, fontWeight: 500 }}>{isNew ? "New Testimonial" : "Edit Testimonial"}</h2>
            <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "rgba(6,7,8,0.4)" }}>✕</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelS}>Quote *</label>
              <textarea style={{ ...input, minHeight: 120, resize: "vertical" }} value={editing.quote || ""} onChange={e => setEditing(p => ({ ...p, quote: e.target.value }))} placeholder="FlowState handled everything and our residents were blown away..." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelS}>Author Name *</label>
                <input style={input} value={editing.author || ""} onChange={e => setEditing(p => ({ ...p, author: e.target.value }))} placeholder="Marcus Webb" />
              </div>
              <div>
                <label style={labelS}>Title</label>
                <input style={input} value={editing.title || ""} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} placeholder="Director of Parks & Recreation" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelS}>Organization</label>
                <input style={input} value={editing.organization || ""} onChange={e => setEditing(p => ({ ...p, organization: e.target.value }))} placeholder="City of Hampton, VA" />
              </div>
              <div>
                <label style={labelS}>Experience Referenced</label>
                <input style={input} value={editing.experience || ""} onChange={e => setEditing(p => ({ ...p, experience: e.target.value }))} placeholder="Urban Slide" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelS}>City</label>
                <input style={input} value={editing.city || ""} onChange={e => setEditing(p => ({ ...p, city: e.target.value }))} placeholder="Hampton, VA" />
              </div>
              <div>
                <label style={labelS}>Sort Order</label>
                <input type="number" style={input} value={editing.sort_order || 0} onChange={e => setEditing(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {[{ key: "featured", label: "Featured" }, { key: "published", label: "Published" }].map(toggle => (
                <label key={toggle.key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                  <input type="checkbox" checked={!!(editing as any)[toggle.key]} onChange={e => setEditing(p => ({ ...p, [toggle.key]: e.target.checked }))} />
                  {toggle.label}
                </label>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "0.5px solid rgba(6,7,8,0.08)" }}>
              <button onClick={save} disabled={saving} style={{ flex: 1, fontSize: 13, fontWeight: 500, padding: "12px", borderRadius: 100, background: "#060708", color: "#F9F7F3", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                {saving ? "Saving..." : isNew ? "Add Testimonial" : "Save Changes"}
              </button>
              {!isNew && (
                <button onClick={() => deleteItem(editing.id!)} style={{ fontSize: 13, padding: "12px 20px", borderRadius: 100, background: "#FCEBEB", color: "#A32D2D", border: "0.5px solid #F7C1C1", cursor: "pointer", fontFamily: "inherit" }}>
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
