"use client";
import { useState, useEffect } from "react";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)";
const BLUE = "#2196F3";

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

const D: React.CSSProperties = { fontFamily:"'Barlow Condensed',sans-serif", fontStyle:"italic", fontWeight:900 };
const input: React.CSSProperties = { width:"100%", padding:"9px 12px", fontSize:13, borderRadius:8, border:"0.5px solid rgba(6,7,8,0.15)", background:"#F8F6F2", fontFamily:"inherit", outline:"none" };
const labelSt: React.CSSProperties = { fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"rgba(6,7,8,0.4)", marginBottom:5, display:"block" };

// Convert camelCase UI → snake_case for Supabase
function toDb(exp: LiveExp) {
  return {
    id: exp.id || undefined,
    title: exp.title,
    location: exp.location,
    address: exp.address,
    status: exp.status,
    type: exp.type,
    open_since: exp.openSince,
    event_date: exp.eventDate,
    hours_days: exp.hoursDay,
    hours_time: exp.hoursTime,
    description: exp.description,
    ticket_url: exp.ticketUrl,
    hero_image: exp.heroImage,
    published: exp.published,
    pricing: exp.pricing,
  };
}

// Convert snake_case Supabase → camelCase for UI
function fromDb(row: any): LiveExp {
  return {
    id: row.id || "",
    title: row.title || "",
    location: row.location || "",
    address: row.address || "",
    status: (row.status as LiveExp["status"]) || "NOW OPEN",
    type: row.type || "PERMANENT",
    openSince: row.open_since || "",
    eventDate: row.event_date || "",
    hoursDay: row.hours_days || "",
    hoursTime: row.hours_time || "",
    description: row.description || "",
    ticketUrl: row.ticket_url || "",
    heroImage: row.hero_image || "",
    published: row.published ?? true,
    pricing: Array.isArray(row.pricing) ? row.pricing : [],
  };
}

export default function AdminLiveExperiences() {
  const [experiences, setExperiences] = useState<LiveExp[]>([]);
  const [editing, setEditing] = useState<LiveExp | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/live-experiences")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setExperiences(data.map(fromDb));
        else console.error("Load error:", data?.error);
      })
      .catch(e => console.error("Fetch failed:", e));
  }, []);

  function addPriceRow() {
    setEditing(e => e ? { ...e, pricing: [...e.pricing, { name: "", price: "" }] } : e);
  }

  function updatePrice(i: number, field: "name"|"price", val: string) {
    setEditing(e => {
      if (!e) return e;
      const pricing = [...e.pricing];
      pricing[i] = { ...pricing[i], [field]: val };
      return { ...e, pricing };
    });
  }

  function removePrice(i: number) {
    setEditing(e => e ? { ...e, pricing: e.pricing.filter((_, idx) => idx !== i) } : e);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const dbPayload = toDb(editing);

      if (isNew) {
        // Remove id for insert
        const { id, ...insertPayload } = dbPayload;
        const r = await fetch("/api/live-experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(insertPayload),
        });
        const result = await r.json();
        if (!r.ok) { alert("Save failed: " + (result.error || r.status)); return; }
        const saved = fromDb(result);
        setExperiences(prev => [...prev, saved]);
        setEditing(saved);
        setIsNew(false);
      } else {
        const r = await fetch("/api/live-experiences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dbPayload),
        });
        const result = await r.json();
        if (!r.ok) { alert("Save failed: " + (result.error || r.status)); return; }
        const updated = result.id ? fromDb(result) : editing;
        setExperiences(prev => prev.map(e => e.id === editing.id ? updated : e));
        setEditing(updated);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(e: any) {
      alert("Save failed: " + (e?.message || "Network error"));
    } finally {
      setSaving(false);
    }
  }

  async function deleteExp(id: string) {
    if (!confirm("Delete this experience?")) return;
    const r = await fetch("/api/live-experiences", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) {
      setExperiences(prev => prev.filter(e => e.id !== id));
      if (editing?.id === id) setEditing(null);
    }
  }

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Barlow',sans-serif" }}>

      {/* List */}
      <div style={{ flex: editing ? "0 0 50%" : "1", borderRight:"0.5px solid rgba(6,7,8,0.1)", overflow:"auto" }}>
        <div style={{ padding:"1.75rem 2rem 1rem", background:"#F0EDE8", borderBottom:"0.5px solid rgba(6,7,8,0.08)", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:BLUE, marginBottom:4 }}>Live Now</div>
          <h1 style={{ ...D, fontSize:32, letterSpacing:1, marginBottom:"0.875rem" }}>LIVE EXPERIENCES</h1>
          <button onClick={() => { setEditing({ ...EMPTY, id:"" }); setIsNew(true); }} style={{ fontSize:13, fontWeight:700, padding:"9px 22px", borderRadius:100, background:"#04080F", color:"#F8F6F2", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
            + Add Experience
          </button>
        </div>

        {experiences.length === 0 ? (
          <div style={{ padding:"3rem 2rem", textAlign:"center", color:"rgba(6,7,8,0.35)", fontSize:13 }}>No live experiences yet.</div>
        ) : experiences.map(exp => {
          const sc = STATUS_COLORS[exp.status] || STATUS_COLORS["NOW OPEN"];
          return (
            <div key={exp.id} onClick={() => { setEditing(exp); setIsNew(false); }} style={{ padding:"1.25rem 2rem", cursor:"pointer", borderBottom:"0.5px solid rgba(6,7,8,0.06)", background:editing?.id===exp.id?"#fff":"transparent", display:"flex", alignItems:"center", gap:"1rem" }}>
              {exp.heroImage && <img src={exp.heroImage} alt="" style={{ width:56, height:44, objectFit:"cover", borderRadius:8, flexShrink:0 }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700 }}>{exp.title}</div>
                <div style={{ fontSize:12, color:"rgba(6,7,8,0.45)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{exp.location}</div>
              </div>
              <span style={{ fontSize:10, padding:"3px 10px", borderRadius:100, background:sc.bg, color:sc.text, fontWeight:700, flexShrink:0 }}>{exp.status}</span>
              <button onClick={e=>{e.stopPropagation();deleteExp(exp.id);}} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(6,7,8,0.3)", fontSize:16, flexShrink:0 }}>✕</button>
            </div>
          );
        })}
      </div>

      {/* Edit panel */}
      {editing && (
        <div style={{ flex:"0 0 50%", overflow:"auto", background:"#fff" }}>
          {/* Sticky header */}
          <div style={{ position:"sticky", top:0, zIndex:10, background:"#fff", borderBottom:"0.5px solid rgba(6,7,8,0.08)", padding:"1.25rem 1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700 }}>{isNew ? "New Experience" : `Edit: ${editing.title}`}</div>
              {saved && <div style={{ fontSize:11, color:"#1B5E20", fontWeight:700, marginTop:2 }}>✓ Saved</div>}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={save} disabled={saving} style={{ fontSize:13, fontWeight:700, padding:"9px 22px", borderRadius:100, background:saving?"rgba(6,7,8,0.2)":"#04080F", color:"#F8F6F2", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={()=>setEditing(null)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"rgba(6,7,8,0.4)" }}>✕</button>
            </div>
          </div>

          <div style={{ padding:"1.5rem", display:"flex", flexDirection:"column", gap:"1.25rem" }}>

            <div><label style={labelSt}>Title *</label><input style={input} value={editing.title} onChange={e=>setEditing(p=>p?{...p,title:e.target.value}:p)} placeholder="Urban Slide — Hampton, VA"/></div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <div>
                <label style={labelSt}>Status</label>
                <select style={{...input,cursor:"pointer"}} value={editing.status} onChange={e=>setEditing(p=>p?{...p,status:e.target.value as LiveExp["status"]}:p)}>
                  <option>NOW OPEN</option><option>UPCOMING</option><option>SEASONAL</option>
                </select>
              </div>
              <div>
                <label style={labelSt}>Type</label>
                <select style={{...input,cursor:"pointer"}} value={editing.type} onChange={e=>setEditing(p=>p?{...p,type:e.target.value}:p)}>
                  <option value="PERMANENT">Permanent</option><option value="EVENT">Event</option><option value="SEASONAL">Seasonal</option>
                </select>
              </div>
            </div>

            <div><label style={labelSt}>Location (City, State)</label><input style={input} value={editing.location} onChange={e=>setEditing(p=>p?{...p,location:e.target.value}:p)} placeholder="Austin, Texas"/></div>
            <div><label style={labelSt}>Full Address</label><input style={input} value={editing.address} onChange={e=>setEditing(p=>p?{...p,address:e.target.value}:p)} placeholder="3rd Street, Austin, TX"/></div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <div><label style={labelSt}>Open Since (Permanent)</label><input style={input} value={editing.openSince} onChange={e=>setEditing(p=>p?{...p,openSince:e.target.value}:p)} placeholder="February 27, 2026"/></div>
              <div><label style={labelSt}>Event Date (Events)</label><input style={input} value={editing.eventDate} onChange={e=>setEditing(p=>p?{...p,eventDate:e.target.value}:p)} placeholder="July 2025"/></div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <div><label style={labelSt}>Hours — Days</label><input style={input} value={editing.hoursDay} onChange={e=>setEditing(p=>p?{...p,hoursDay:e.target.value}:p)} placeholder="Event Day Only"/></div>
              <div><label style={labelSt}>Hours — Time</label><input style={input} value={editing.hoursTime} onChange={e=>setEditing(p=>p?{...p,hoursTime:e.target.value}:p)} placeholder="10:00 AM - 6:00 PM"/></div>
            </div>

            <div><label style={labelSt}>Description</label><textarea style={{...input,minHeight:80,resize:"vertical"}} value={editing.description} onChange={e=>setEditing(p=>p?{...p,description:e.target.value}:p)}/></div>
            <div><label style={labelSt}>Hero Image URL</label><input style={input} value={editing.heroImage} onChange={e=>setEditing(p=>p?{...p,heroImage:e.target.value}:p)} placeholder="/img-urban-slide.png"/></div>
            <div><label style={labelSt}>Ticket / Website URL</label><input style={input} value={editing.ticketUrl} onChange={e=>setEditing(p=>p?{...p,ticketUrl:e.target.value}:p)} placeholder="https://tickets.eventhub.net/..."/></div>

            {/* Pricing */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <label style={labelSt}>Pricing</label>
                <button type="button" onClick={addPriceRow} style={{ fontSize:11, padding:"4px 12px", borderRadius:100, border:"0.5px solid rgba(6,7,8,0.2)", background:"transparent", cursor:"pointer", fontFamily:"inherit" }}>+ Add row</button>
              </div>
              {editing.pricing.map((row, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:8, marginBottom:8 }}>
                  <input style={input} value={row.name} onChange={e=>updatePrice(i,"name",e.target.value)} placeholder="General Admission"/>
                  <input style={input} value={row.price} onChange={e=>updatePrice(i,"price",e.target.value)} placeholder="$25"/>
                  <button type="button" onClick={()=>removePrice(i)} style={{ padding:"6px 10px", borderRadius:8, background:"#FFEBEE", color:"#B71C1C", border:"none", cursor:"pointer" }}>✕</button>
                </div>
              ))}
            </div>

            <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:500 }}>
              <input type="checkbox" checked={editing.published} onChange={e=>setEditing(p=>p?{...p,published:e.target.checked}:p)}/>
              Published (visible on live experiences page)
            </label>

            <button onClick={save} disabled={saving} style={{ fontSize:14, fontWeight:700, padding:"13px", borderRadius:100, background:saving?"rgba(6,7,8,0.2)":"#04080F", color:"#F8F6F2", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
