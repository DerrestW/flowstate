"use client";
import { useState, useEffect } from "react";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)";
const BLUE = "#2196F3";
const D: React.CSSProperties = { fontFamily:"'Barlow Condensed',sans-serif", fontStyle:"italic", fontWeight:900 };
const input: React.CSSProperties = { width:"100%", padding:"9px 12px", fontSize:13, borderRadius:8, border:"0.5px solid rgba(6,7,8,0.15)", background:"#F8F6F2", fontFamily:"inherit", outline:"none" };
const labelSt: React.CSSProperties = { fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"rgba(6,7,8,0.4)", marginBottom:5, display:"block" };

const ALL_PAGES = [
  { slug:"/", name:"Homepage" },
  { slug:"/services", name:"Services" },
  { slug:"/live", name:"Live Experiences" },
  { slug:"/events", name:"Events Index" },
  { slug:"/seasonal", name:"Seasonal Index" },
  { slug:"/permanent", name:"Permanent Index" },
  { slug:"/events/urban-slide", name:"Urban Slide" },
  { slug:"/events/mud-runs", name:"Mud Runs" },
  { slug:"/events/color-runs", name:"Color Runs" },
  { slug:"/events/5k-marathons", name:"5K / Marathons" },
  { slug:"/events/triathlons", name:"Triathlons" },
  { slug:"/events/conventions", name:"Conventions" },
  { slug:"/events/trade-shows", name:"Trade Shows" },
  { slug:"/events/fundraisers", name:"Fundraisers" },
  { slug:"/seasonal/light-shows", name:"Light Shows" },
  { slug:"/seasonal/crawfish-festival", name:"Crawfish Festival" },
  { slug:"/seasonal/movies-on-the-lake", name:"Movies on the Lake" },
  { slug:"/permanent/donut-boat-rentals", name:"Donut Boat Rentals" },
  { slug:"/permanent/boat-rentals", name:"Boat Rentals" },
  { slug:"/permanent/paddle-boards", name:"Paddle Boards" },
];

const DEFAULTS: Record<string,{title:string,desc:string}> = {
  "/": { title:"FlowState Experiences | Outdoor Events & Activations | Houston, TX", desc:"FlowState produces world-class outdoor events, seasonal activations, and permanent waterfront experiences. Urban slides, mud runs, crawfish festivals and more." },
  "/services": { title:"Event Services | Ticketing, Staffing, Permitting | FlowState", desc:"Full-service event support: ticketing, staffing, marketing, permitting, traffic control, and site planning." },
  "/live": { title:"Live Experiences | FlowState", desc:"Currently operating FlowState experiences you can visit, book, or attend right now." },
  "/events": { title:"Events | Urban Slide, Mud Runs, Color Runs & More | FlowState", desc:"Full-scale outdoor event productions including urban slides, mud runs, color runs, conventions, trade shows, and fundraisers." },
  "/events/urban-slide": { title:"Urban Slide Events | 1,000-Foot Water Slide | FlowState", desc:"Book a 1,000-foot modular water slide for your city. Full permitting, staffing, and operations included." },
  "/events/mud-runs": { title:"Mud Run Events | Obstacle Course Productions | FlowState", desc:"Full mud run and obstacle course productions for cities and venues." },
  "/events/color-runs": { title:"Color Run & Graffiti Run Events | FlowState", desc:"5K color powder run events that turn your city into a living rainbow." },
  "/events/5k-marathons": { title:"5K & Marathon Events | FlowState", desc:"Professionally timed 5K and marathon events for municipalities and charities." },
  "/events/triathlons": { title:"Triathlon Event Production | FlowState", desc:"Full triathlon productions including water safety, transition zones, and certified timing." },
  "/events/conventions": { title:"Convention Production & Management | FlowState", desc:"Full convention floor management, vendor coordination, registration, and operations." },
  "/events/trade-shows": { title:"Trade Show Operations | FlowState", desc:"Trade show booth coordination, traffic flow, staffing, and full logistics." },
  "/events/fundraisers": { title:"Fundraising Event Production | FlowState", desc:"Custom fundraising activations that break attendance and donation records." },
  "/seasonal/light-shows": { title:"Light Show Productions | FlowState", desc:"Spectacular waterfront light show installations for the holiday season." },
  "/seasonal/crawfish-festival": { title:"Crawfish Festival Production | FlowState", desc:"Complete crawfish festival productions — tents, vendors, music, and operations." },
  "/seasonal/movies-on-the-lake": { title:"Movies on the Lake | Floating Cinema | FlowState", desc:"Floating and lakeside cinema experiences for waterfronts and venues." },
  "/permanent/donut-boat-rentals": { title:"Donut Boat Rentals | FlowState", desc:"Giant novelty donut boat rentals — the most-photographed rental on water." },
  "/permanent/boat-rentals": { title:"Managed Boat Rental Programs | FlowState", desc:"Turnkey boat rental programs for marinas, parks, and waterfront venues." },
  "/permanent/paddle-boards": { title:"SUP & Paddle Board Rentals | FlowState", desc:"Staff-run paddleboard rental operations for any waterfront or lake." },
};

type SeoRecord = { id?:string; page_slug:string; page_name:string; meta_title:string; meta_description:string; og_title:string; og_description:string; og_image:string; noindex:boolean };

export default function SeoAdmin() {
  const [records, setRecords] = useState<Record<string,SeoRecord>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SeoRecord|null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const r = await fetch("/api/seo"); const data = await r.json();
    const map: Record<string,SeoRecord> = {};
    (data||[]).forEach((r:any) => { map[r.page_slug] = r; });
    setRecords(map);
    setLoading(false);
  }

  function getRecord(slug: string, name: string): SeoRecord {
    return records[slug] || {
      page_slug: slug, page_name: name,
      meta_title: DEFAULTS[slug]?.title || `${name} | FlowState Experiences`,
      meta_description: DEFAULTS[slug]?.desc || "",
      og_title: "", og_description: "", og_image: "", noindex: false,
    };
  }

  function edit(slug: string, name: string) {
    setEditing(getRecord(slug, name));
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const existing = records[editing.page_slug];
    if (existing?.id) {
      await fetch("/api/seo", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id: existing.id, ...editing }) });
    } else {
      await fetch("/api/seo", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(editing) });
    }
    await load();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const pages = ALL_PAGES.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search));
  const titleLen = editing?.meta_title?.length || 0;
  const descLen = editing?.meta_description?.length || 0;

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Barlow',sans-serif" }}>
      {/* Page list */}
      <div style={{ flex:editing?"0 0 42%":"1", borderRight:"0.5px solid rgba(6,7,8,0.1)", overflow:"auto" }}>
        <div style={{ padding:"1.75rem 1.5rem 1rem", background:"#F0EDE8", borderBottom:"0.5px solid rgba(6,7,8,0.08)", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:BLUE, marginBottom:4 }}>All Pages · {ALL_PAGES.length} pages</div>
          <h1 style={{ ...D, fontSize:30, letterSpacing:1, marginBottom:"0.75rem" }}>SEO SETTINGS</h1>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search pages..." style={{ ...input, background:"#fff" }}/>
        </div>

        {loading ? <div style={{ padding:"2rem", textAlign:"center", color:"rgba(6,7,8,0.4)" }}>Loading...</div> : (
          pages.map(p => {
            const r = records[p.slug];
            const hasData = !!r?.meta_title;
            return (
              <div key={p.slug} onClick={()=>edit(p.slug, p.name)} style={{ padding:"0.875rem 1.5rem", display:"flex", alignItems:"center", gap:"0.875rem", background:editing?.page_slug===p.slug?"#fff":"transparent", borderBottom:"0.5px solid rgba(6,7,8,0.06)", cursor:"pointer" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:2 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {r?.meta_title || DEFAULTS[p.slug]?.title || `${p.name} | FlowState`}
                  </div>
                </div>
                <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:100, background:hasData?"#E8F5E9":"rgba(6,7,8,0.06)", color:hasData?"#1B5E20":"rgba(6,7,8,0.4)", flexShrink:0 }}>
                  {hasData?"Saved":"Default"}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Edit panel */}
      {editing && (
        <div style={{ flex:"0 0 58%", overflow:"auto", background:"#fff", padding:"2rem 1.5rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
            <div>
              <h2 style={{ fontSize:16, fontWeight:700, marginBottom:2 }}>SEO: {editing.page_name}</h2>
              <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)", fontFamily:"monospace" }}>{editing.page_slug}</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {saved && <span style={{ fontSize:12, color:"#1B5E20", fontWeight:700, padding:"8px 14px", background:"#E8F5E9", borderRadius:8 }}>✓ Saved</span>}
              <button onClick={save} disabled={saving} style={{ fontSize:13, fontWeight:700, padding:"9px 22px", borderRadius:100, background:saving?"rgba(6,7,8,0.2)":"#04080F", color:"#F8F6F2", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
                {saving?"Saving...":"Save"}
              </button>
              <button onClick={()=>setEditing(null)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"rgba(6,7,8,0.4)" }}>✕</button>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
            {/* Meta title */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <label style={labelSt}>Meta Title</label>
                <span style={{ fontSize:10, color: titleLen>60?"#B71C1C":titleLen>50?"#E65100":"rgba(6,7,8,0.4)" }}>{titleLen}/60</span>
              </div>
              <input style={{ ...input, borderColor: titleLen>60?"#E57373":"rgba(6,7,8,0.15)" }} value={editing.meta_title||""} onChange={e=>setEditing(p=>p?{...p,meta_title:e.target.value}:p)}/>
              {titleLen>60 && <div style={{ fontSize:11, color:"#B71C1C", marginTop:4 }}>Over 60 chars — Google may truncate this</div>}
              {/* Preview */}
              <div style={{ marginTop:10, padding:"0.875rem", background:"rgba(6,7,8,0.03)", borderRadius:8, border:"0.5px solid rgba(6,7,8,0.08)" }}>
                <div style={{ fontSize:11, color:"rgba(6,7,8,0.35)", marginBottom:4 }}>Google preview:</div>
                <div style={{ fontSize:16, color:"#1558D6", fontWeight:400, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{editing.meta_title || "Page title"}</div>
                <div style={{ fontSize:12, color:"#006621", marginBottom:3 }}>flowstateexperiences.com{editing.page_slug}</div>
                <div style={{ fontSize:13, color:"rgba(6,7,8,0.6)", lineHeight:1.5 }}>{editing.meta_description?.slice(0,155) || "Page description..."}</div>
              </div>
            </div>

            {/* Meta description */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <label style={labelSt}>Meta Description</label>
                <span style={{ fontSize:10, color:descLen>155?"#B71C1C":descLen>140?"#E65100":"rgba(6,7,8,0.4)" }}>{descLen}/155</span>
              </div>
              <textarea style={{ ...input, minHeight:90, resize:"vertical", borderColor:descLen>155?"#E57373":"rgba(6,7,8,0.15)" }} value={editing.meta_description||""} onChange={e=>setEditing(p=>p?{...p,meta_description:e.target.value}:p)}/>
              {descLen>155 && <div style={{ fontSize:11, color:"#B71C1C", marginTop:4 }}>Over 155 chars — Google may truncate</div>}
            </div>

            {/* OG fields */}
            <div style={{ padding:"1.25rem", background:"rgba(6,7,8,0.02)", borderRadius:10, border:"0.5px solid rgba(6,7,8,0.08)" }}>
              <div style={{ fontSize:12, fontWeight:700, marginBottom:"1rem" }}>Social Sharing (Open Graph)</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div><label style={labelSt}>OG Title <span style={{ color:"rgba(6,7,8,0.3)", fontWeight:400, textTransform:"none" }}>— leave blank to use Meta Title</span></label><input style={input} value={editing.og_title||""} onChange={e=>setEditing(p=>p?{...p,og_title:e.target.value}:p)} placeholder="Same as meta title if blank"/></div>
                <div><label style={labelSt}>OG Description</label><input style={input} value={editing.og_description||""} onChange={e=>setEditing(p=>p?{...p,og_description:e.target.value}:p)} placeholder="Same as meta description if blank"/></div>
                <div><label style={labelSt}>OG Image URL</label><input style={input} value={editing.og_image||""} onChange={e=>setEditing(p=>p?{...p,og_image:e.target.value}:p)} placeholder="/img-urban-slide.png or full URL"/>
                  <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)", marginTop:4 }}>Recommended: 1200×630px. Copy URL from Media Library.</div>
                  {editing.og_image && <img src={editing.og_image} alt="" style={{ marginTop:8, width:"100%", maxHeight:140, objectFit:"cover", borderRadius:8 }} onError={e=>{(e.target as HTMLElement).style.display="none";}}/>}
                </div>
              </div>
            </div>

            {/* Noindex */}
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", fontSize:13, fontWeight:500, padding:"0.875rem", background:"#FFF3E0", borderRadius:8, border:"0.5px solid #FFE0B2" }}>
              <input type="checkbox" checked={editing.noindex||false} onChange={e=>setEditing(p=>p?{...p,noindex:e.target.checked}:p)}/>
              <div>
                <div style={{ fontWeight:700, color:"#E65100" }}>No Index — hide from Google</div>
                <div style={{ fontSize:12, color:"#BF360C" }}>Check this to prevent search engines from indexing this page</div>
              </div>
            </label>

            <button onClick={save} disabled={saving} style={{ fontSize:14, fontWeight:700, padding:"13px", borderRadius:100, background:saving?"rgba(6,7,8,0.2)":"#04080F", color:"#F8F6F2", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
              {saving?"Saving...":"Save SEO Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
