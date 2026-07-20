"use client";
import { useState, useEffect } from "react";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #8B3CF7 50%, #FF6B2B 100%)";
const BLUE = "#2196F3";
const PURPLE = "#8B3CF7";
const ORANGE = "#FF6B2B";
const D: React.CSSProperties = { fontFamily:"'Barlow Condensed',sans-serif", fontStyle:"italic", fontWeight:900 };
const inp: React.CSSProperties = { width:"100%", padding:"9px 12px", fontSize:13, borderRadius:8, border:"0.5px solid rgba(6,7,8,0.15)", background:"#F8F6F2", fontFamily:"inherit", outline:"none" };
const lbl: React.CSSProperties = { fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"rgba(6,7,8,0.4)", marginBottom:5, display:"block" };

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const EMAIL_STATUSES: Record<string, { bg:string; text:string; label:string }> = {
  uncontacted: { bg:"#E3F2FD", text:"#1565C0", label:"Not contacted" },
  emailed:     { bg:"#E8EAF6", text:"#283593", label:"Emailed" },
  replied:     { bg:"#E8F5E9", text:"#1B5E20", label:"Replied" },
  meeting:     { bg:"#FFF8E1", text:"#F57F17", label:"Meeting set" },
  closed:      { bg:"#F3E5F5", text:"#4A148C", label:"Closed" },
  unsubscribed:{ bg:"#FFEBEE", text:"#B71C1C", label:"Unsubscribed" },
};

const TEMPLATES = [
  { id:"urban_slide",          label:"🏄 Urban Slide Pitch",       color:BLUE,   desc:"Lead with the flagship event activation" },
  { id:"destination_marketing",label:"📱 Destination Marketing",   color:PURPLE, desc:"Lead with audience building & TDIAC proof" },
  { id:"media_buying",         label:"🎯 Media Buying",            color:ORANGE, desc:"Lead with $1M+ paid media experience" },
  { id:"full_funnel",          label:"⚡ Full Funnel (All Three)", color:"#04080F", desc:"The complete pitch — best for warm contacts" },
];

type Prospect = {
  id:string; name:string; email:string; title:string; department:string;
  city:string; state:string; source_url?:string; email_verified:string;
  email_status:string; notes?:string; last_emailed_at?:string; last_template?:string; created_at:string;
};

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"list"|"email">("list");

  // Filters
  const [filterState, setFilterState] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  // Scan form
  const [scanState, setScanState] = useState("TX");
  const [scanTitles, setScanTitles] = useState([
    "special events director",
    "special events coordinator",
    "parks and recreation director",
    "event manager city",
    "procurement director city",
    "recreation director",
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [scanCity, setScanCity] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  // Email form
  const [template, setTemplate] = useState("urban_slide");
  const [sendResult, setSendResult] = useState<any>(null);

  // Edit
  const [editing, setEditing] = useState<Prospect|null>(null);

  useEffect(() => { load(); }, [filterState, filterCity, filterStatus]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterState) params.set("state", filterState);
      if (filterCity) params.set("city", filterCity);
      if (filterStatus !== "all") params.set("status", filterStatus);
      const r = await fetch(`/api/prospects?${params}`);
      const data = await r.json();
      setProspects(Array.isArray(data) ? data : []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function scan() {
    if (!scanCity.trim()) { alert("Enter a city name"); return; }
    setScanning(true);
    setScanResult(null);
    try {
      const r = await fetch("/api/prospects/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: scanCity.trim(), state: scanState, titles: scanTitles }),
      });
      const result = await r.json();
      setScanResult(result);
      if (result.saved > 0) await load();
    } catch(e: any) {
      setScanResult({ error: e.message });
    } finally { setScanning(false); }
  }

  async function sendEmails() {
    if (selected.size === 0) { alert("Select at least one prospect"); return; }
    if (!confirm(`Send "${TEMPLATES.find(t=>t.id===template)?.label}" to ${selected.size} contact${selected.size>1?"s":""}?`)) return;
    setSending(true);
    setSendResult(null);
    try {
      const r = await fetch("/api/prospects/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect_ids: Array.from(selected), template }),
      });
      const result = await r.json();
      setSendResult(result);
      if (result.sent > 0) {
        setSelected(new Set());
        await load();
      }
    } catch(e: any) {
      setSendResult({ error: e.message });
    } finally { setSending(false); }
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/prospects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email_status: status }),
    });
    setProspects(p => p.map(x => x.id===id ? {...x,email_status:status} : x));
  }

  async function deleteProspect(id: string) {
    if (!confirm("Delete this contact?")) return;
    await fetch("/api/prospects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setProspects(p => p.filter(x => x.id!==id));
    setSelected(s => { s.delete(id); return new Set(s); });
  }

  const filtered = prospects.filter(p =>
    !search || [p.name, p.email, p.city, p.title, p.department].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const cities = [...new Set(prospects.map(p => p.city))].sort();
  const stats = {
    total: prospects.length,
    uncontacted: prospects.filter(p => p.email_status === "uncontacted").length,
    emailed: prospects.filter(p => p.email_status === "emailed").length,
    replied: prospects.filter(p => p.email_status === "replied").length,
    verified: prospects.filter(p => p.email_verified === "valid").length,
  };

  return (
    <div style={{ padding:"2rem", maxWidth:1300, fontFamily:"'Barlow',sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom:"2rem" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:BLUE, marginBottom:6 }}>Outbound Sales</div>
        <h1 style={{ ...D, fontSize:40, letterSpacing:1, marginBottom:8 }}>CITY PROSPECTS</h1>
        <p style={{ fontSize:14, color:"rgba(6,7,8,0.5)", fontWeight:300 }}>Scan cities for event directors, procurement managers, and parks departments. Then pitch them.</p>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"1rem", marginBottom:"2rem" }}>
        {[
          { label:"Total Contacts", value:stats.total, color:BLUE },
          { label:"Not Contacted", value:stats.uncontacted, color:"#8B3CF7" },
          { label:"Emailed", value:stats.emailed, color:ORANGE },
          { label:"Replied", value:stats.replied, color:"#16A34A" },
          { label:"Verified Emails", value:stats.verified, color:BLUE },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:12, padding:"1.25rem", border:"0.5px solid rgba(6,7,8,0.08)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:GRAD }}/>
            <div style={{ ...D, fontSize:36, color:s.color, paddingTop:4 }}>{s.value}</div>
            <div style={{ fontSize:11, color:"rgba(6,7,8,0.45)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:"1.5rem", alignItems:"start" }}>

        {/* Left panel — Scan + Email */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

          {/* Scan new city */}
          <div style={{ background:"#fff", borderRadius:14, border:"0.5px solid rgba(6,7,8,0.08)", overflow:"hidden" }}>
            <div style={{ padding:"1.25rem", borderBottom:"0.5px solid rgba(6,7,8,0.06)", background:"#F8F6F2" }}>
              <div style={{ ...D, fontSize:18, letterSpacing:0.5 }}>SCAN A CITY</div>
              <div style={{ fontSize:12, color:"rgba(6,7,8,0.4)", marginTop:3 }}>Apify scrapes government contacts</div>
            </div>
            <div style={{ padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.875rem" }}>
              <div>
                <label style={lbl}>State</label>
                <select style={inp} value={scanState} onChange={e=>setScanState(e.target.value)}>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>City</label>
                <input style={inp} value={scanCity} onChange={e=>setScanCity(e.target.value)} placeholder="e.g. Austin" onKeyDown={e=>e.key==="Enter"&&scan()}/>
              </div>
              <button onClick={scan} disabled={scanning} style={{ padding:"10px", borderRadius:100, background:scanning?"rgba(6,7,8,0.1)":BLUE, color:scanning?"rgba(6,7,8,0.4)":"#fff", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:"inherit" }}>
                {scanning ? "Scanning... (takes ~2 min)" : "🔍 Scan for Contacts"}
              </button>
              {scanResult && (
                <div style={{ padding:"0.875rem", borderRadius:8, background:scanResult.error?"#FFEBEE":"#E8F5E9", fontSize:12, color:scanResult.error?"#B71C1C":"#1B5E20" }}>
                  {scanResult.error ? `Error: ${scanResult.error}` :
                    `Found ${scanResult.found || 0} contacts · ${scanResult.saved || 0} new saved`}
                </div>
              )}
            </div>
          </div>

          {/* Send emails */}
          <div style={{ background:"#fff", borderRadius:14, border:"0.5px solid rgba(6,7,8,0.08)", overflow:"hidden" }}>
            <div style={{ padding:"1.25rem", borderBottom:"0.5px solid rgba(6,7,8,0.06)", background:"#F8F6F2" }}>
              <div style={{ ...D, fontSize:18, letterSpacing:0.5 }}>SEND EMAIL</div>
              <div style={{ fontSize:12, color:"rgba(6,7,8,0.4)", marginTop:3 }}>
                {selected.size > 0 ? `${selected.size} contact${selected.size>1?"s":""} selected` : "Select contacts from the list →"}
              </div>
            </div>
            <div style={{ padding:"1.25rem", display:"flex", flexDirection:"column", gap:"0.875rem" }}>
              <div>
                <label style={lbl}>Email Template</label>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {TEMPLATES.map(t => (
                    <label key={t.id} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px", borderRadius:8, border:`0.5px solid ${template===t.id?t.color:"rgba(6,7,8,0.12)"}`, background:template===t.id?`${t.color}08`:"transparent", cursor:"pointer" }}>
                      <input type="radio" name="template" value={t.id} checked={template===t.id} onChange={()=>setTemplate(t.id)} style={{ marginTop:2, flexShrink:0 }}/>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:template===t.id?t.color:"#04080F" }}>{t.label}</div>
                        <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)", marginTop:1 }}>{t.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={sendEmails} disabled={sending||selected.size===0} style={{ padding:"10px", borderRadius:100, background:selected.size===0?"rgba(6,7,8,0.06)":BLUE, color:selected.size===0?"rgba(6,7,8,0.3)":"#fff", border:"none", cursor:selected.size===0?"not-allowed":"pointer", fontSize:13, fontWeight:700, fontFamily:"inherit" }}>
                {sending ? "Sending..." : `📧 Send to ${selected.size || 0} Contact${selected.size!==1?"s":""}`}
              </button>
              {sendResult && (
                <div style={{ padding:"0.875rem", borderRadius:8, background:sendResult.error?"#FFEBEE":"#E8F5E9", fontSize:12, color:sendResult.error?"#B71C1C":"#1B5E20" }}>
                  {sendResult.error ? `Error: ${sendResult.error}` :
                    `✓ Sent ${sendResult.sent} · Failed ${sendResult.failed}`}
                  {sendResult.errors?.length > 0 && (
                    <div style={{ marginTop:4, fontSize:11 }}>{sendResult.errors.join(", ")}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cron status */}
          <div style={{ background:"#F0EDE8", borderRadius:12, padding:"1rem", border:"0.5px solid rgba(6,7,8,0.08)" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(6,7,8,0.5)", marginBottom:4 }}>⏰ Auto-Scan Schedule</div>
            <div style={{ fontSize:12, color:"rgba(6,7,8,0.6)", lineHeight:1.6 }}>
              Runs every night at 2am CT — scans 2 cities per night from a 20-city rotation. ~40 cities/month covered automatically.
            </div>
          </div>
        </div>

        {/* Right panel — Contact list */}
        <div style={{ background:"#fff", borderRadius:14, border:"0.5px solid rgba(6,7,8,0.08)", overflow:"hidden" }}>

          {/* List header */}
          <div style={{ padding:"1.25rem", borderBottom:"0.5px solid rgba(6,7,8,0.06)", background:"#F8F6F2" }}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:"0.75rem" }}>
              <input style={{...inp, flex:1, minWidth:200, background:"#fff"}} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, title..."/>
              <select style={{...inp,width:"auto",cursor:"pointer"}} value={filterState} onChange={e=>{setFilterState(e.target.value);setFilterCity("");}}>
                <option value="">All states</option>
                {US_STATES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <select style={{...inp,width:"auto",cursor:"pointer"}} value={filterCity} onChange={e=>setFilterCity(e.target.value)}>
                <option value="">All cities</option>
                {cities.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <select style={{...inp,width:"auto",cursor:"pointer"}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                <option value="all">All statuses</option>
                {Object.entries(EMAIL_STATUSES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:12, color:"rgba(6,7,8,0.4)" }}>
                {filtered.length} contact{filtered.length!==1?"s":""} · {selected.size} selected
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setSelected(new Set(filtered.map(p=>p.id)))} style={{ fontSize:11, padding:"4px 12px", borderRadius:100, border:"0.5px solid rgba(6,7,8,0.2)", background:"transparent", cursor:"pointer", fontFamily:"inherit" }}>Select all</button>
                <button onClick={()=>setSelected(new Set())} style={{ fontSize:11, padding:"4px 12px", borderRadius:100, border:"0.5px solid rgba(6,7,8,0.2)", background:"transparent", cursor:"pointer", fontFamily:"inherit" }}>Clear</button>
              </div>
            </div>
          </div>

          {/* Contact rows */}
          <div style={{ maxHeight:600, overflowY:"auto" }}>
            {loading ? (
              <div style={{ padding:"3rem", textAlign:"center", color:"rgba(6,7,8,0.4)", fontSize:13 }}>Loading contacts...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding:"3rem", textAlign:"center" }}>
                <div style={{ ...D, fontSize:22, color:"rgba(6,7,8,0.2)", marginBottom:8 }}>NO CONTACTS YET</div>
                <div style={{ fontSize:13, color:"rgba(6,7,8,0.35)" }}>Scan a city to start building your prospect list.</div>
              </div>
            ) : filtered.map((p, i) => {
              const sc = EMAIL_STATUSES[p.email_status] || EMAIL_STATUSES.uncontacted;
              const isSelected = selected.has(p.id);
              return (
                <div key={p.id} style={{ padding:"0.875rem 1.25rem", borderBottom:"0.5px solid rgba(6,7,8,0.06)", background:isSelected?"#F0F7FF":i%2===0?"transparent":"rgba(6,7,8,0.015)", display:"flex", alignItems:"center", gap:"0.875rem" }}>
                  <input type="checkbox" checked={isSelected} onChange={e=>{const s=new Set(selected);e.target.checked?s.add(p.id):s.delete(p.id);setSelected(s);}} style={{ flexShrink:0, cursor:"pointer", width:14, height:14 }}/>

                  {/* Avatar */}
                  <div style={{ width:34, height:34, borderRadius:"50%", background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{p.name.charAt(0).toUpperCase()}</span>
                  </div>

                  {/* Main info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
                    <div style={{ fontSize:11, color:"rgba(6,7,8,0.45)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title} · {p.department}</div>
                    <div style={{ fontSize:11, color:BLUE, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.email}</div>
                  </div>

                  {/* Location */}
                  <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)", flexShrink:0, textAlign:"center" }}>
                    <div style={{ fontWeight:600 }}>{p.city}</div>
                    <div>{p.state}</div>
                  </div>

                  {/* Verified badge */}
                  <div style={{ flexShrink:0 }}>
                    {p.email_verified === "valid" && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:100, background:"#E8F5E9", color:"#1B5E20", fontWeight:700 }}>✓ Valid</span>}
                    {p.email_verified === "unknown" && <span style={{ fontSize:9, padding:"2px 6px", borderRadius:100, background:"#F5F5F5", color:"#888", fontWeight:700 }}>?</span>}
                  </div>

                  {/* Status + actions */}
                  <div style={{ flexShrink:0, display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end" }}>
                    <select value={p.email_status} onChange={e=>updateStatus(p.id,e.target.value)} style={{ fontSize:10, padding:"2px 6px", borderRadius:100, border:`0.5px solid ${sc.text}40`, background:sc.bg, color:sc.text, cursor:"pointer", fontFamily:"inherit", fontWeight:700 }}>
                      {Object.entries(EMAIL_STATUSES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                    </select>
                    {p.last_emailed_at && (
                      <div style={{ fontSize:9, color:"rgba(6,7,8,0.3)" }}>
                        Sent {new Date(p.last_emailed_at).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                      </div>
                    )}
                  </div>

                  {/* Delete */}
                  <button onClick={()=>deleteProspect(p.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(6,7,8,0.2)", fontSize:14, padding:"0 4px", flexShrink:0 }}>✕</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
