"use client";
import { useState, useEffect } from "react";
// Uses API routes so the service role key handles auth

const GRAD = "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)";
const BLUE = "#2196F3";
const D: React.CSSProperties = { fontFamily:"'Barlow Condensed',sans-serif", fontStyle:"italic", fontWeight:900 };
const input: React.CSSProperties = { width:"100%", padding:"9px 12px", fontSize:13, borderRadius:8, border:"0.5px solid rgba(6,7,8,0.15)", background:"#F8F6F2", fontFamily:"inherit", outline:"none" };
const label: React.CSSProperties = { fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"rgba(6,7,8,0.4)", marginBottom:5, display:"block" };

// Every slug maps exactly to a live URL — this is the source of truth
const SLUG_MAP: Record<string, { url: string; label: string; img: string }> = {
  "urban-slide":       { url:"/events/urban-slide",                label:"Urban Slide",          img:"/img-urban-slide.png" },
  "mud-run":           { url:"/events/mud-runs",                   label:"Mud Runs",             img:"/img-mud-run-2.png" },
  "color-run":         { url:"/events/color-runs",                 label:"Color / Graffiti Runs",img:"/img-color-run-1.png" },
  "5k-events":         { url:"/events/5k-marathons",               label:"5K & Marathons",       img:"/img-color-run-2.png" },
  "triathlons":        { url:"/events/triathlons",                 label:"Triathlons",           img:"/img-triathlon.png" },
  "conventions":       { url:"/events/conventions",                label:"Conventions",          img:"/img-convention.png" },
  "trade-shows":       { url:"/events/trade-shows",                label:"Trade Shows",          img:"/img-trade-show.png" },
  "fundraisers":       { url:"/events/fundraisers",                label:"Fundraisers",          img:"/img-fundraiser.png" },
  "light-shows":       { url:"/seasonal/light-shows",              label:"Light Shows",          img:"/img-light-show.png" },
  "crawfish-festival": { url:"/seasonal/crawfish-festival",        label:"Crawfish Festivals",   img:"/img-color-run-1.png" },
  "movies-on-the-lake":{ url:"/seasonal/movies-on-the-lake",      label:"Movies on the Lake",   img:"/img-sup-rentals.png" },
  "donut-boat":        { url:"/permanent/donut-boat-rentals",      label:"Donut Boat Rentals",   img:"/img-donut-boat.png" },
  "boat-rentals":      { url:"/permanent/boat-rentals",            label:"Boat Rentals",         img:"/img-donut-boat-hut.png" },
  "paddle-boards":     { url:"/permanent/paddle-boards",           label:"Paddle Board Rentals", img:"/img-sup-rentals.png" },
};

const SITE_BASE = process.env.NEXT_PUBLIC_SITE_URL || "";

type Exp = { id:string; slug:string; title:string; redirect_to?:string; tagline?:string; description?:string; long_description?:string; includes?:string[]; category:string; type?:string; is_live?:boolean; video_url?:string; hero_image?:string; gallery_images?:string[]; capacity_min?:number; capacity_max?:number; duration?:string; price_starting?:number; price_unit?:string; featured:boolean; published:boolean; sort_order:number };

export default function ExperiencesAdmin() {
  const [experiences, setExperiences] = useState<Exp[]>([]);
  const [editing, setEditing] = useState<Partial<Exp>|null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const r = await fetch("/api/experiences");
      const data = await r.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch(e) { console.error("Load error:", e); }
    finally { setLoading(false); }
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await fetch("/api/experiences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        });
      } else {
        await fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing),
        });
      }
      await load();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(e) { console.error("Save error:", e); }
    finally { setSaving(false); }
  }

  async function togglePublished(id: string, current: boolean) {
    await fetch("/api/experiences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published: !current }),
    });
    setExperiences(p => p.map(e => e.id===id ? {...e,published:!current} : e));
  }

  async function deleteExperience(id: string, slug: string, redirectTo: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone. Visitors will be redirected to ${redirectTo}.`)) return;
    // Save redirect first
    await fetch("/api/page-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "redirects", section: slug, data: { to: redirectTo } }),
    });
    await fetch("/api/experiences", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setExperiences(p => p.filter(e => e.id !== id));
    setEditing(null);
  }

  const filtered = experiences.filter(e => !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.slug?.includes(search));
  const mapped = SLUG_MAP;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Barlow',sans-serif" }}>

      {/* LIST */}
      <div style={{ flex: editing ? "0 0 46%" : "1", borderRight:"0.5px solid rgba(6,7,8,0.1)", overflow:"auto", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"1.5rem 1.5rem 1rem", background:"#F0EDE8", borderBottom:"0.5px solid rgba(6,7,8,0.08)", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:BLUE, marginBottom:4 }}>Content → Live Pages</div>
          <h1 style={{ ...D, fontSize:30, letterSpacing:1, marginBottom:"0.5rem" }}>ACTIVATIONS</h1>
          <div style={{ fontSize:12, color:"rgba(6,7,8,0.5)", marginBottom:"0.875rem", lineHeight:1.5 }}>
            Edit any activation here. Changes go live instantly on the linked page.
          </div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search activations..." style={{...input, background:"#fff"}}/>
        </div>

        {loading ? (
          <div style={{ padding:"3rem", textAlign:"center", color:"rgba(6,7,8,0.4)" }}>Loading...</div>
        ) : (
          <div style={{ flex:1, overflow:"auto" }}>
            {filtered.map(exp => {
              const info = mapped[exp.slug] || { url:`/experiences/${exp.slug}`, label:exp.title, img:"/img-urban-slide.png" };
              return (
                <div key={exp.id} style={{ borderBottom:"0.5px solid rgba(6,7,8,0.06)", background:editing?.id===exp.id?"#fff":"transparent" }}>
                  <div style={{ padding:"1rem 1.5rem", display:"flex", alignItems:"center", gap:"0.875rem", cursor:"pointer" }} onClick={() => setEditing(exp)}>
                    {/* Thumbnail */}
                    <div style={{ width:56, height:44, borderRadius:8, overflow:"hidden", background:"rgba(6,7,8,0.06)", flexShrink:0 }}>
                      <img src={exp.hero_image||info.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:700, marginBottom:2 }}>{exp.title}</div>
                      <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        slug: <code style={{ fontFamily:"monospace" }}>{exp.slug}</code>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end", flexShrink:0 }}>
                      <button onClick={e=>{e.stopPropagation();togglePublished(exp.id,exp.published);}} style={{ fontSize:10, padding:"3px 10px", borderRadius:100, border:"0.5px solid", background:exp.published?"#E3F2FD":"rgba(6,7,8,0.05)", color:exp.published?"#1565C0":"rgba(6,7,8,0.4)", borderColor:exp.published?"#90CAF9":"rgba(6,7,8,0.15)", cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>
                        {exp.published?"Live":"Draft"}
                      </button>
                      <a href={info.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:10, color:BLUE, fontWeight:600 }}>View page →</a>
                    </div>
                  </div>
                  {/* Live URL strip */}
                  <div style={{ padding:"0 1.5rem 0.875rem", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:10, color:"rgba(6,7,8,0.3)", fontFamily:"monospace", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      flowstateexperiences.com{info.url}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT PANEL */}
      {editing && (
        <div style={{ flex:"0 0 54%", overflow:"auto", background:"#fff" }}>
          {/* Sticky header */}
          <div style={{ position:"sticky", top:0, zIndex:10, background:"#fff", borderBottom:"0.5px solid rgba(6,7,8,0.08)", padding:"1.25rem 1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700 }}>Editing: {editing.title}</div>
              {editing.slug && mapped[editing.slug] && (
                <a href={mapped[editing.slug].url} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:BLUE, fontWeight:600 }}>
                  View live page: {mapped[editing.slug].url} →
                </a>
              )}
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {saved && <span style={{ fontSize:11, color:"#1B5E20", fontWeight:700, padding:"6px 12px", background:"#E8F5E9", borderRadius:8 }}>✓ Saved — page updated live</span>}
              <button onClick={save} disabled={saving} style={{ fontSize:13, fontWeight:700, padding:"9px 22px", borderRadius:100, background:saving?"rgba(6,7,8,0.2)":"#04080F", color:"#F8F6F2", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                {saving?"Saving...":"Save Changes"}
              </button>
              <button onClick={()=>setEditing(null)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"rgba(6,7,8,0.4)" }}>✕</button>
            </div>
          </div>

          <div style={{ padding:"1.5rem" }}>
            {/* How it works notice */}
            <div style={{ padding:"1rem 1.25rem", background:"#E3F2FD", borderRadius:10, border:"0.5px solid #90CAF9", marginBottom:"1.5rem" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#1565C0", marginBottom:4 }}>How editing works</div>
              <div style={{ fontSize:12, color:"#1565C0", lineHeight:1.6 }}>
                Changes you save here update the live page at <strong>{editing.slug && mapped[editing.slug]?.url}</strong> immediately.
                The page reads from Supabase on every visit — no redeploy needed.
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>

              {/* Hero Image */}
              <div>
                <label style={label}>Hero Image</label>
                {editing.hero_image && (
                  <div style={{ marginBottom:8, borderRadius:10, overflow:"hidden", height:160, position:"relative" }}>
                    <img src={editing.hero_image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e=>{(e.target as HTMLImageElement).style.opacity="0.2";}}/>
                    <div style={{ position:"absolute", bottom:10, left:10, background:"rgba(0,0,0,0.6)", color:"#fff", fontSize:11, padding:"3px 10px", borderRadius:6 }}>{editing.hero_image}</div>
                  </div>
                )}
                <input style={input} value={editing.hero_image||""} onChange={e=>{
                  const url = e.target.value;
                  setEditing(p=>{
                    if(!p) return p;
                    const gallery = [...(p.gallery_images||[])];
                    if(gallery.length===0) gallery.push(url);
                    else gallery[0] = url; // keep hero_image and gallery[0] in sync
                    return {...p, hero_image:url, gallery_images:gallery};
                  });
                }} placeholder="Paste URL from Media Library or /img-urban-slide.png"/>
                <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)", marginTop:4 }}>Upload in Media Library → Copy URL → paste here</div>
                {/* Quick image picks */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>
                  {Object.values(SLUG_MAP).map(s => (
                    <button key={s.img} onClick={()=>setEditing(p=>p?{...p,hero_image:s.img}:p)} style={{ fontSize:10, padding:"3px 9px", borderRadius:6, border:`0.5px solid ${editing.hero_image===s.img?"#2196F3":"rgba(6,7,8,0.15)"}`, background:editing.hero_image===s.img?"#E3F2FD":"transparent", color:editing.hero_image===s.img?"#1565C0":"rgba(6,7,8,0.5)", cursor:"pointer", fontFamily:"inherit" }}>
                      {s.img.replace("/img-","").replace(".png","")}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                <div>
                  <label style={label}>Title</label>
                  <input style={input} value={editing.title||""} onChange={e=>setEditing(p=>p?{...p,title:e.target.value}:p)}/>
                </div>
                <div>
                  <label style={label}>Tagline <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>— shown under title</span></label>
                  <input style={input} value={editing.tagline||""} onChange={e=>setEditing(p=>p?{...p,tagline:e.target.value}:p)} placeholder="1,000 feet of pure summer"/>
                </div>
              </div>

              <div>
                <label style={label}>Short Description <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>— shown on homepage cards</span></label>
                <textarea style={{...input, minHeight:70, resize:"vertical"}} value={editing.description||""} onChange={e=>setEditing(p=>p?{...p,description:e.target.value}:p)}/>
              </div>

              <div>
                <label style={label}>Full Description <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>— shown on the inner page "About This Activation"</span></label>
                <textarea style={{...input, minHeight:120, resize:"vertical"}} value={editing.long_description||""} onChange={e=>setEditing(p=>p?{...p,long_description:e.target.value}:p)} placeholder="Detailed description shown on the individual page..."/>
              </div>

              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <label style={label}>What's Included <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>— checklist shown on inner page</span></label>
                  <button type="button" onClick={()=>setEditing(p=>p?{...p,includes:[...(p.includes||[]),""]}:p)} style={{ fontSize:11, padding:"4px 12px", borderRadius:100, border:"0.5px solid rgba(6,7,8,0.2)", background:"transparent", cursor:"pointer", fontFamily:"inherit" }}>+ Add item</button>
                </div>
                {(editing.includes||[]).map((item:string, idx:number) => (
                  <div key={idx} style={{ display:"flex", gap:8, marginBottom:8 }}>
                    <input style={{...input, flex:1}} value={item} onChange={e=>{const arr=[...(editing.includes||[])];arr[idx]=e.target.value;setEditing(p=>p?{...p,includes:arr}:p);}} placeholder="e.g. Full permitting support"/>
                    <button type="button" onClick={()=>{const arr=(editing.includes||[]).filter((_:string,i:number)=>i!==idx);setEditing(p=>p?{...p,includes:arr}:p);}} style={{ fontSize:12, padding:"6px 10px", borderRadius:8, background:"#FFEBEE", color:"#B71C1C", border:"none", cursor:"pointer", fontFamily:"inherit" }}>✕</button>
                  </div>
                ))}
                {(!editing.includes || editing.includes.length===0) && (
                  <div style={{ fontSize:12, color:"rgba(6,7,8,0.35)", padding:"0.75rem", background:"rgba(6,7,8,0.03)", borderRadius:8, textAlign:"center" }}>No items yet. Click "+ Add item" above.</div>
                )}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem" }}>
                <div>
                  <label style={label}>Min Capacity</label>
                  <input type="number" style={input} value={editing.capacity_min||""} onChange={e=>setEditing(p=>p?{...p,capacity_min:parseInt(e.target.value)||0}:p)} placeholder="500"/>
                </div>
                <div>
                  <label style={label}>Max Capacity</label>
                  <input type="number" style={input} value={editing.capacity_max||""} onChange={e=>setEditing(p=>p?{...p,capacity_max:parseInt(e.target.value)||0}:p)} placeholder="15000"/>
                </div>
                <div>
                  <label style={label}>Duration</label>
                  <input style={input} value={editing.duration||""} onChange={e=>setEditing(p=>p?{...p,duration:e.target.value}:p)} placeholder="4–8 hours"/>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem" }}>
                <div>
                  <label style={label}>Starting Price ($)</label>
                  <input type="number" style={input} value={editing.price_starting||""} onChange={e=>setEditing(p=>p?{...p,price_starting:parseInt(e.target.value)||0}:p)} placeholder="25000"/>
                </div>
                <div>
                  <label style={label}>Price Unit</label>
                  <select style={{...input,cursor:"pointer"}} value={editing.price_unit||"per event"} onChange={e=>setEditing(p=>p?{...p,price_unit:e.target.value}:p)}>
                    <option>per event</option><option>per day</option><option>per person</option><option>custom quote</option><option>revenue share</option>
                  </select>
                </div>
                <div>
                  <label style={label}>Sort Order</label>
                  <input type="number" style={input} value={editing.sort_order||0} onChange={e=>setEditing(p=>p?{...p,sort_order:parseInt(e.target.value)||0}:p)}/>
                </div>
              </div>

              {/* Type tag */}
              <div>
                <label style={label}>Activation Type <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>— controls which homepage tab it appears under</span></label>
                <div style={{ display:"flex", gap:8 }}>
                  {["event","seasonal","permanent"].map(t => (
                    <button key={t} type="button" onClick={()=>setEditing(p=>p?{...p,type:t}:p)} style={{ fontSize:12, fontWeight:700, padding:"8px 20px", borderRadius:100, border:`0.5px solid ${(editing.type||"event")===t?"#2196F3":"rgba(6,7,8,0.2)"}`, background:(editing.type||"event")===t?"#E3F2FD":"transparent", color:(editing.type||"event")===t?"#1565C0":"rgba(6,7,8,0.5)", cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label style={label}>YouTube Video URL <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>— play button appears on inner page image</span></label>
                <input style={input} value={editing.video_url||""} onChange={e=>setEditing(p=>p?{...p,video_url:e.target.value}:p)} placeholder="https://www.youtube.com/watch?v=yxdALAzbnqc"/>
              </div>

              <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap" }}>
                <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:500 }}>
                  <input type="checkbox" checked={!!editing.featured} onChange={e=>setEditing(p=>p?{...p,featured:e.target.checked}:p)}/>
                  Featured on homepage
                </label>
                <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:500 }}>
                  <input type="checkbox" checked={!!editing.published} onChange={e=>setEditing(p=>p?{...p,published:e.target.checked}:p)}/>
                  Published (visible on site)
                </label>
                <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, fontWeight:500 }}>
                  <input type="checkbox" checked={!!editing.is_live} onChange={e=>setEditing(p=>p?{...p,is_live:e.target.checked}:p)}/>
                  <span>🟢 Currently Live <span style={{ fontSize:11, color:"rgba(6,7,8,0.4)", fontWeight:400 }}>— shows on Live Now page</span></span>
                </label>
              </div>

              {/* Redirect URL for when slug changes or activation deleted */}
              <div style={{ padding:"1rem", background:"rgba(6,7,8,0.03)", borderRadius:10, border:"0.5px solid rgba(6,7,8,0.08)" }}>
                <label style={label}>Redirect URL <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>— where to send visitors if this page is unpublished or deleted</span></label>
                <input style={input} value={editing.redirect_to||"/"} onChange={e=>setEditing(p=>p?{...p,redirect_to:e.target.value}:p)} placeholder="/ or /events or /events/urban-slide"/>
              </div>

              <div style={{ display:"flex", gap:"0.75rem" }}>
                <button onClick={save} disabled={saving} style={{ flex:1, fontSize:14, fontWeight:700, padding:"13px", borderRadius:100, background:saving?"rgba(6,7,8,0.2)":"#04080F", color:"#F8F6F2", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                  {saving ? "Saving..." : "Save Changes — Updates Live Page"}
                </button>
                {editing.id && (
                  <button onClick={()=>deleteExperience(editing.id!, editing.slug||"", editing.redirect_to||"/")} style={{ fontSize:13, padding:"13px 20px", borderRadius:100, background:"#FFEBEE", color:"#B71C1C", border:"0.5px solid #FFCDD2", cursor:"pointer", fontFamily:"inherit", fontWeight:600, flexShrink:0 }}>
                    Delete
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
