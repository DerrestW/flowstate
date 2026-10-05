"use client";
import { useState, useEffect } from "react";
import { SiteNav, SiteFooter, GradientBtn, DC, GRAD, BLUE, ORANGE, NAVY, NAVY_MID, NAVY_CARD, SAND, MUTED, DIM, BORDER } from "@/components/shared";

type Exp = {
  id: string; title: string; location: string; address?: string; status: string; type: string;
  open_since?: string; event_date?: string | null; hours_day?: string; hours_days?: string; hours_time?: string;
  description?: string; ticket_url?: string; hero_image?: string; published?: boolean;
  pricing?: { name: string; price: string; url?: string }[]; features?: string[];
};

// Events that also have a full, search-friendly page
const EVENT_PAGES: Record<string, string> = { "lake-austin-lights": "/lake-austin-lights" };

function slugify(t: string) {
  return (t || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}


// Event dates are free text ("July 26, 2026", "Nov 20, 2026 – Jan 3, 2027").
// Returns [start, end] when they can be read, so past events drop off and running ones show as open.
function eventRange(text?: string | null): [Date, Date] | null {
  if (!text || !/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\b|\d{1,2}\/\d{1,2}/i.test(text)) return null;
  const years = text.match(/\b20\d{2}\b/g);
  const parts = text.split(/\s*(?:–|—|\s-\s|\bto\b|\bthrough\b)\s*/i).filter(Boolean);
  const parse = (str: string, fallbackYear?: string) => {
    const withYear = /\b20\d{2}\b/.test(str) || !fallbackYear ? str : `${str}, ${fallbackYear}`;
    const d = new Date(withYear);
    return isNaN(d.getTime()) ? null : d;
  };
  const lastYear = years ? years[years.length - 1] : String(new Date().getFullYear());
  const start = parse(parts[0], years ? years[0] : lastYear);
  let end = parse(parts[parts.length - 1], lastYear);
  if (!start || !end) return null;
  if (end < start) end = new Date(end.getFullYear() + 1, end.getMonth(), end.getDate());
  // "July 2025" (no day) runs to the end of that month
  if (!/\b\d{1,2}\b(?!\d)/.test(parts[parts.length - 1].replace(/\b20\d{2}\b/g, ""))) end = new Date(end.getFullYear(), end.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return [start, end];
}

function withLiveStatus<T extends { status: string; event_date?: string | null }>(list: T[]): T[] {
  const now = new Date();
  return list.map(e => {
    const r = eventRange(e.event_date);
    if (r && r[1] < now) return { ...e, status: "PAST" };                       // event has ended
    if (r && e.status === "UPCOMING" && r[0] <= now) return { ...e, status: "NOW OPEN" }; // running now
    return e;
  });
}

const STATUS_COLORS: Record<string,{bg:string,text:string,dot:string}> = {
  "NOW OPEN": { bg:"rgba(76,175,80,0.12)", text:"#4CAF50", dot:"#4CAF50" },
  "UPCOMING": { bg:"rgba(255,152,0,0.12)", text:"#FF9800", dot:"#FF9800" },
  "SEASONAL": { bg:"rgba(139,60,247,0.12)", text:"#8B3CF7", dot:"#8B3CF7" },
  "PAST":     { bg:"rgba(226,232,240,0.10)", text:"rgba(226,232,240,0.6)", dot:"rgba(226,232,240,0.6)" },
};

const TABS: { id: string; label: string }[] = [
  { id: "All", label: "All" },
  { id: "NOW OPEN", label: "Now Open" },
  { id: "UPCOMING", label: "Upcoming" },
  { id: "SEASONAL", label: "Seasonal" },
  { id: "PAST", label: "Past Events" },
];


export default function LivePage() {
  const [experiences, setExperiences] = useState<Exp[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<Exp|null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/live-experiences").then(r=>r.json()).then(d=>{
      if (Array.isArray(d)) setExperiences(d.filter((e:any)=>e.published));
    }).catch(()=>{}).finally(()=>setLoaded(true));
  }, []);

  useEffect(() => { setActiveImg(0); }, [selected]);

  // Open the pop-up from a link like /live?event=lake-austin-lights
  useEffect(() => {
    if (!loaded) return;
    const slug = new URLSearchParams(window.location.search).get("event");
    if (!slug) return;
    const match = withLiveStatus(experiences).find(e => slugify(e.title) === slug || e.id === slug);
    if (match) setSelected(match);
  }, [loaded, experiences]);

  useEffect(() => {
    if (!loaded) return;
    const url = new URL(window.location.href);
    if (selected) url.searchParams.set("event", slugify(selected.title)); else url.searchParams.delete("event");
    window.history.replaceState(null, "", url.toString());
  }, [selected, loaded]);

  // Close modal on escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if(e.key==="Escape") setSelected(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const current = withLiveStatus(experiences);
  const filtered = filter === "All"
    ? current.filter(e => e.status !== "PAST")
    : filter === "SEASONAL"
      ? current.filter(e => e.status !== "PAST" && (e.status === "SEASONAL" || e.type === "SEASONAL"))
      : current.filter(e => e.status === filter);
  const emptyText = filter === "PAST" ? "No past events yet." : loaded ? "Nothing here right now — check back soon." : "Loading…";

  return (
    <div style={{ fontFamily:"'Barlow',sans-serif", background:NAVY, color:SAND }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}
        @media(max-width:768px){
          .live-grid{grid-template-columns:1fr!important}
          .modal-inner{grid-template-columns:1fr!important;max-height:90vh;overflow-y:auto}
          .modal-sidebar{border-left:none!important;border-top:0.5px solid rgba(226,232,240,0.08)!important;padding:1.5rem!important}
          .live-filters{gap:6px!important}
          .live-filters button{font-size:10px!important;padding:5px 10px!important}
        }
      `}</style>
      <SiteNav/>

      <div style={{ paddingTop:64 }}>
        <section style={{ padding:"3rem 1.5rem 2rem" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"1rem", marginBottom:"2rem" }}>
              <div>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:"#4CAF50", display:"inline-block", boxShadow:"0 0 0 3px rgba(76,175,80,0.25)" }}/>
                  <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#4CAF50" }}>Live Now</span>
                </div>
                <h1 style={{ ...DC, fontSize:"clamp(36px,7vw,68px)", lineHeight:0.9, letterSpacing:2 }}>LIVE EXPERIENCES</h1>
                <p style={{ fontSize:15, color:MUTED, marginTop:"0.75rem", fontWeight:300, maxWidth:480 }}>Currently operating FlowState experiences you can visit, book, or attend.</p>
              </div>
            </div>
            {/* Filters */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"2rem" }} className="live-filters">
              {TABS.map(({ id: f, label })=>(
                <button key={f} onClick={()=>setFilter(f)} aria-pressed={filter===f} style={{ fontSize:11, padding:"7px 16px", borderRadius:100, border:"0.5px solid", background:filter===f?GRAD:"transparent", color:filter===f?"#fff":MUTED, borderColor:filter===f?"transparent":"rgba(226,232,240,0.15)", cursor:"pointer", fontFamily:"inherit", fontWeight:filter===f?700:400, letterSpacing:"0.04em", textTransform:"uppercase" }}>{label}</button>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1.5rem" }} className="live-grid">
              {filtered.length === 0 && (
                <div style={{ gridColumn:"1/-1", padding:"2rem 0", color:DIM, fontSize:14 }}>{emptyText}</div>
              )}
              {filtered.map(exp => {
                const sc = STATUS_COLORS[exp.status] || STATUS_COLORS["UPCOMING"];
                const pricing = Array.isArray(exp.pricing) ? exp.pricing : [];
                return (
                  <div key={exp.id} onClick={()=>setSelected(exp)} style={{ opacity: exp.status==="PAST" ? 0.75 : 1, background:NAVY_CARD, borderRadius:16, overflow:"hidden", border:"0.5px solid rgba(226,232,240,0.08)", cursor:"pointer", transition:"transform 0.2s, border-color 0.2s" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-4px)";(e.currentTarget as HTMLElement).style.borderColor=BLUE+"40";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.borderColor="rgba(226,232,240,0.08)";}}>
                    <div style={{ height:220, overflow:"hidden", position:"relative" }}>
                      <img src={exp.hero_image} alt={exp.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }} onMouseEnter={e=>(e.target as HTMLElement).style.transform="scale(1.05)"} onMouseLeave={e=>(e.target as HTMLElement).style.transform="scale(1)"}/>
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(30,42,63,0.85) 0%, transparent 60%)" }}/>
                      <div style={{ position:"absolute", top:14, left:14, display:"flex", gap:8 }}>
                        <span style={{ fontSize:10, fontWeight:700, padding:"4px 12px", borderRadius:100, background:sc.bg, color:sc.text }}>{exp.status}</span>
                        <span style={{ fontSize:10, fontWeight:700, padding:"4px 12px", borderRadius:100, background:"rgba(226,232,240,0.1)", color:MUTED }}>{exp.type}</span>
                      </div>
                    </div>
                    <div style={{ padding:"1.25rem" }}>
                      <h3 style={{ ...DC, fontSize:22, letterSpacing:0.5, marginBottom:6 }}>{exp.title}</h3>
                      <div style={{ fontSize:13, color:MUTED, marginBottom:6 }}>📍 {exp.location}</div>
                      {exp.event_date && <div style={{ fontSize:12, color:ORANGE, fontWeight:700, marginBottom:6 }}>📅 {exp.event_date}</div>}
                      {exp.open_since && <div style={{ fontSize:12, color:MUTED, marginBottom:6 }}>🗓 Open since {exp.open_since}</div>}
                      {exp.hours_time && <div style={{ fontSize:12, color:MUTED, marginBottom:"1rem" }}>🕐 {exp.hours_time}</div>}
                      {pricing.length > 0 && (
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:"1rem" }}>
                          {pricing.slice(0,2).map((p:any) => (
                            <span key={p.name} style={{ fontSize:10, padding:"3px 10px", borderRadius:100, background:"rgba(33,150,243,0.1)", color:BLUE, border:"0.5px solid rgba(33,150,243,0.25)" }}>{p.name}: {p.price}</span>
                          ))}
                          {pricing.length > 2 && <span style={{ fontSize:10, color:DIM }}>+{pricing.length-2} more</span>}
                        </div>
                      )}
                      <button style={{ width:"100%", fontSize:13, fontWeight:700, fontStyle:"italic", padding:"10px", borderRadius:100, background:GRAD, color:"#fff", border:"none", fontFamily:"'Barlow Condensed',sans-serif", cursor:"pointer" }}>
                        {exp.status==="PAST" ? "See Recap →" : "View Details →"}
                      </button>
                    </div>
                  </div>
                );
              })}
              {/* CTA card */}
              {filter !== "PAST" && <div style={{ background:"transparent", borderRadius:16, border:"1.5px dashed rgba(226,232,240,0.12)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2.5rem 1.5rem", textAlign:"center", gap:"1rem", minHeight:300 }}>
                <div style={{ ...DC, fontSize:28, letterSpacing:1, color:DIM }}>YOUR CITY</div>
                <p style={{ fontSize:14, color:DIM, fontWeight:300 }}>Want to add an experience to your waterfront or venue?</p>
                <GradientBtn href="/#contact">Get a Quote</GradientBtn>
              </div>}
            </div>
          </div>
        </section>
      </div>

      {/* Detail Modal - mobile optimized */}
      {selected && (
        <div onClick={()=>setSelected(null)} style={{ position:"fixed", inset:0, background:"rgba(17,24,39,0.92)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", overflowY:"auto" }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:920, background:NAVY_MID, borderRadius:20, overflow:"hidden", border:"0.5px solid rgba(226,232,240,0.1)", maxHeight:"92vh", overflowY:"auto" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 320px" }} className="modal-inner">
              {/* Left */}
              <div style={{ padding:"1.5rem" }}>
                <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none", color:MUTED, fontSize:13, cursor:"pointer", marginBottom:"1.25rem", display:"flex", alignItems:"center", gap:6 }}>← Back</button>
                <div style={{ borderRadius:12, overflow:"hidden", height:280, marginBottom:"0.75rem", position:"relative" }}>
                  <img src={selected.hero_image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  <div style={{ position:"absolute", top:14, left:14, display:"flex", gap:8 }}>
                    {(() => { const sc=STATUS_COLORS[selected.status]||STATUS_COLORS["UPCOMING"]; return <span style={{ fontSize:10, fontWeight:700, padding:"4px 12px", borderRadius:100, background:sc.bg, color:sc.text }}>{selected.status}</span>; })()}
                  </div>
                </div>
                <h2 style={{ fontSize:13, fontWeight:700, letterSpacing:1, marginBottom:"1rem", color:SAND }}>ABOUT THIS ACTIVATION</h2>
                <p style={{ fontSize:14, color:MUTED, lineHeight:1.75, marginBottom:"1.5rem", fontWeight:300 }}>{selected.description}</p>
                {Array.isArray(selected.features) && selected.features.length > 0 && (
                  <div>
                    <h2 style={{ fontSize:13, fontWeight:700, letterSpacing:1, marginBottom:"1rem", color:SAND }}>WHAT'S AVAILABLE</h2>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"0.5rem" }}>
                      {selected.features.map((f:string) => (
                        <div key={f} style={{ display:"flex", gap:8, alignItems:"flex-start", fontSize:13, color:MUTED, fontWeight:300 }}>
                          <span style={{ color:BLUE, flexShrink:0, marginTop:2 }}>✓</span>{f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Right sidebar */}
              <div style={{ background:NAVY_CARD, padding:"1.5rem", borderLeft:"0.5px solid rgba(226,232,240,0.06)" }} className="modal-sidebar">
                <h1 style={{ ...DC, fontSize:24, lineHeight:1, letterSpacing:0.5, marginBottom:"0.5rem" }}>{selected.title}</h1>
                <div style={{ fontSize:13, color:MUTED, marginBottom:3 }}>📍 {selected.location}</div>
                <div style={{ fontSize:11, color:DIM, marginBottom:"1.5rem" }}>{selected.address}</div>
                {selected.open_since && (
                  <div style={{ padding:"0.875rem 0", borderBottom:BORDER, marginBottom:"0.875rem" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:DIM, marginBottom:3 }}>Open Since</div>
                    <div style={{ fontSize:14, fontWeight:700, color:SAND }}>{selected.open_since}</div>
                  </div>
                )}
                {selected.event_date && (
                  <div style={{ padding:"0.875rem 0", borderBottom:BORDER, marginBottom:"0.875rem" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:DIM, marginBottom:3 }}>Event Date</div>
                    <div style={{ fontSize:14, fontWeight:700, color:SAND }}>{selected.event_date}</div>
                  </div>
                )}
                {(selected.hours_day || selected.hours_days || selected.hours_time) && <div style={{ padding:"0.875rem 0", borderBottom:BORDER, marginBottom:"0.875rem" }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:DIM, marginBottom:6 }}>Hours</div>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                    <span style={{ color:MUTED }}>{selected.hours_days || selected.hours_day}</span>
                    <span style={{ fontWeight:600, color:SAND }}>{selected.hours_time}</span>
                  </div>
                </div>}
                {Array.isArray(selected.pricing) && selected.pricing.length > 0 && (
                  <div style={{ padding:"0.875rem 0", borderBottom:BORDER, marginBottom:"1.25rem" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:DIM, marginBottom:10 }}>Pricing</div>
                    {selected.pricing.map((p:any) => (
                      <div key={p.name} style={{ display:"flex", justifyContent:"space-between", gap:12, marginBottom:8, fontSize:13 }}>
                        <span style={{ color:MUTED }}>{p.name}</span>
                        {p.url && selected.status!=="PAST"
                          ? <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight:700, color:BLUE, textDecoration:"underline", whiteSpace:"nowrap" }}>{p.price} · Book</a>
                          : <span style={{ fontWeight:700, color:BLUE, whiteSpace:"nowrap" }}>{p.price}</span>}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {selected.status === "PAST" ? (
                    <div style={{ textAlign:"center", fontSize:13, fontWeight:700, padding:"12px", borderRadius:100, border:"0.5px solid rgba(226,232,240,0.15)", color:DIM }}>This event has ended</div>
                  ) : selected.ticket_url ? (
                    <a href={selected.ticket_url} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:14, fontWeight:900, fontStyle:"italic", padding:"12px", borderRadius:100, background:GRAD, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", textDecoration:"none" }}>
                      🎟 Buy Tickets →
                    </a>
                  ) : (
                    <a href="/#contact" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:14, fontWeight:900, fontStyle:"italic", padding:"12px", borderRadius:100, background:GRAD, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", textDecoration:"none" }}>
                      Get Notified
                    </a>
                  )}
                  {EVENT_PAGES[slugify(selected.title)] && (
                    <a href={EVENT_PAGES[slugify(selected.title)]} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:13, fontWeight:700, padding:"10px", borderRadius:100, border:"0.5px solid rgba(33,150,243,0.5)", color:SAND, textDecoration:"none" }}>
                      Full event page →
                    </a>
                  )}
                  <a href={`https://maps.google.com?q=${encodeURIComponent(selected.address||selected.location)}`} target="_blank" rel="noopener noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:13, fontWeight:600, padding:"10px", borderRadius:100, border:"0.5px solid rgba(226,232,240,0.2)", color:MUTED, textDecoration:"none" }}>
                    📍 Get Directions
                  </a>
                  <button onClick={()=>setSelected(null)} style={{ fontSize:12, padding:"8px", borderRadius:100, border:"0.5px solid rgba(226,232,240,0.15)", background:"transparent", color:DIM, cursor:"pointer", fontFamily:"inherit" }}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter/>
    </div>
  );
}
