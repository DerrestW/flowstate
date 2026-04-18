"use client";
import { useState, useEffect } from "react";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)";
const BLUE = "#2196F3";
const D: React.CSSProperties = { fontFamily:"'Barlow Condensed',sans-serif", fontStyle:"italic", fontWeight:900 };
const inp: React.CSSProperties = { width:"100%", padding:"9px 12px", fontSize:13, borderRadius:8, border:"0.5px solid rgba(6,7,8,0.15)", background:"#F8F6F2", fontFamily:"inherit", outline:"none" };
const lbl: React.CSSProperties = { fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"rgba(6,7,8,0.4)", marginBottom:5, display:"block" };

const SECTIONS = [
  { id:"hero", label:"Hero Section", icon:"🏔", desc:"Headline, subline, badge, hero image, next event" },
  { id:"stats", label:"Stats Bar", icon:"📊", desc:"The 4 numbers below the hero" },
  { id:"why_cities", label:"Why Cities Choose Us", icon:"🏙", desc:"Section headline and 6 reason cards" },
  { id:"proven", label:"Proven Activations", icon:"✅", desc:"Real Events section — 4 bullets and photo" },
  { id:"services", label:"Services Section", icon:"🔧", desc:"6 service cards — titles and descriptions" },
  { id:"contact", label:"Contact Section", icon:"📩", desc:"Headline and subline above the form" },
];

const DEFAULTS: Record<string, Record<string, string>> = {
  hero: {
    badge:"In business since 2016 · Houston, TX",
    headline_1:"WE MAKE", headline_2:"CITIES", headline_3:"COME ALIVE.",
    subline:"FlowState produces world-class outdoor events, seasonal activations, and permanent waterfront experiences — with full ticketing, staffing, marketing, and permitting support.",
    cta_primary:"Bring Us to Your City", cta_secondary:"View Live Experiences",
    next_event_title:"Hampton, VA — July 2025", next_event_detail:"Urban Slide · 1,000ft · Est. 10K",
    hero_image:"/img-urban-slide.png",
  },
  stats: {
    stat1_value:"9+", stat1_label:"Years in Business", stat1_sub:"Since 2016",
    stat2_value:"65+", stat2_label:"Events Operated", stat2_sub:"Across 12+ cities",
    stat3_value:"330K+", stat3_label:"Participants", stat3_sub:"And counting",
    stat4_value:"100%", stat4_label:"Client Retention", stat4_sub:"Cities rebook",
  },
  why_cities: {
    eyebrow:"The FlowState Difference", headline:"WHY CITIES CHOOSE US",
    card1_icon:"◈", card1_title:"We own the whole event", card1_body:"From site plan and permitting to day-of operations — you show up, we handle everything else.",
    card2_icon:"▲", card2_title:"9+ years of proof", card2_body:"Operating since 2016 with 65+ events, 330K+ participants, and 100% city client retention.",
    card3_icon:"◎", card3_title:"Full-stack services", card3_body:"Ticketing, staffing, marketing, permitting, traffic control — one team, one contract.",
    card4_icon:"⬡", card4_title:"Municipal expertise", card4_body:"We've navigated permits and parks department approvals in a dozen markets.",
    card5_icon:"→", card5_title:"Scales to any size", card5_body:"From 500-person neighborhood activations to 10,000-person city festivals.",
    card6_icon:"◷", card6_title:"Permanent & seasonal", card6_body:"We set up and manage ongoing revenue-generating waterfront experiences.",
  },
  proven: {
    eyebrow:"Proven Activations", headline:"REAL EVENTS.\nREAL RESULTS.",
    subline:"Every activation is backed by years of operational experience, municipal relationships, and a team that has done this hundreds of times.",
    item1_title:"Urban Slide — Hampton, VA", item1_sub:"8,000+ attendees · $70K contract · Fully permitted",
    item2_title:"Graffiti Run — Houston, TX", item2_sub:"12,000+ participants · Aerial start-line coverage",
    item3_title:"Mud Run Series", item3_sub:"65+ events · 330K+ participants total",
    item4_title:"Donut Boat — Discovery Green", item4_sub:"Houston, TX · Operating daily",
    image:"/img-color-run-1.png", image_caption:"Graffiti Run · Houston", image_sub:"12,000+ participants · Fully operated by FlowState",
  },
  services: {
    eyebrow:"Full-Service Support", headline:"WE HANDLE\nEVERYTHING",
    card1_icon:"🎟", card1_title:"Ticketing", card1_desc:"End-to-end registration setup, management, and optimization.",
    card2_icon:"👥", card2_title:"Event Staffing", card2_desc:"Trained ops crew, safety officers, and event staff.",
    card3_icon:"📢", card3_title:"Event Marketing", card3_desc:"Paid social, email, influencer, and local press.",
    card4_icon:"📋", card4_title:"Permitting", card4_desc:"City permits, insurance docs, and municipal compliance.",
    card5_icon:"🚦", card5_title:"Traffic Control", card5_desc:"Certified officers and full traffic management plans.",
    card6_icon:"🗺", card6_title:"Site Planning", card6_desc:"Professional CAD-quality site layouts.",
  },
  contact: {
    eyebrow:"Let's Build Something",
    headline:"READY TO ACTIVATE\nYOUR CITY?",
    subline:"Tell us where you are. We'll respond within 48 hours.",
  },
};

type Content = Record<string, Record<string, string>>;

function Field({ label, value, onChange, multiline = false, hint = "" }: { label:string; value:string; onChange:(v:string)=>void; multiline?:boolean; hint?:string }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      {hint && <div style={{ fontSize:10, color:"rgba(6,7,8,0.35)", marginBottom:5 }}>{hint}</div>}
      {multiline
        ? <textarea style={{...inp,minHeight:80,resize:"vertical"}} value={value} onChange={e=>onChange(e.target.value)}/>
        : <input style={inp} value={value} onChange={e=>onChange(e.target.value)}/>
      }
    </div>
  );
}

function ImageField({ label, value, onChange }: { label:string; value:string; onChange:(v:string)=>void }) {
  const QUICK = ["/img-urban-slide.png","/img-mud-run-2.png","/img-color-run-1.png","/img-color-run-2.png","/img-donut-boat.png","/img-light-show.png","/img-convention.png","/img-triathlon.png","/img-fundraiser.png","/img-trade-show.png"];
  return (
    <div>
      <label style={lbl}>{label}</label>
      {value && <img src={value} alt="" style={{ width:"100%", maxHeight:140, objectFit:"cover", borderRadius:8, marginBottom:8, display:"block" }} onError={e=>{(e.target as HTMLElement).style.display="none";}}/>}
      <input style={inp} value={value} onChange={e=>onChange(e.target.value)} placeholder="Paste URL from Media Library"/>
      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
        {QUICK.map(img => (
          <button key={img} type="button" onClick={()=>onChange(img)} style={{ fontSize:9, padding:"2px 8px", borderRadius:6, border:`0.5px solid ${value===img?"#2196F3":"rgba(6,7,8,0.15)"}`, background:value===img?"#E3F2FD":"transparent", color:value===img?"#1565C0":"rgba(6,7,8,0.5)", cursor:"pointer", fontFamily:"inherit" }}>
            {img.replace("/img-","").replace(".png","")}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PageEditor() {
  const [content, setContent] = useState<Content>(DEFAULTS);
  const [activeSection, setActiveSection] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/page-content?page=homepage")
      .then(r=>r.json())
      .then(data => {
        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          const merged: Content = {};
          SECTIONS.forEach(s => {
            merged[s.id] = { ...DEFAULTS[s.id], ...(data[s.id] || {}) };
          });
          setContent(merged);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function update(section: string, key: string, value: string) {
    setContent(prev => ({ ...prev, [section]: { ...(prev[section]||{}), [key]: value } }));
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/page-content", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ page:"homepage", section:activeSection, data: content[activeSection] }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch(e) { console.error(e); }
    finally { setSaving(false); }
  }

  const sec = content[activeSection] || {};

  function renderSection() {
    switch(activeSection) {
      case "hero": return (
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <ImageField label="Hero Background Image" value={sec.hero_image||""} onChange={v=>update("hero","hero_image",v)}/>
          <Field label="Badge Text (pill above headline)" value={sec.badge||""} onChange={v=>update("hero","badge",v)}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.75rem" }}>
            <Field label="Headline Line 1" value={sec.headline_1||""} onChange={v=>update("hero","headline_1",v)}/>
            <Field label="Headline Line 2" value={sec.headline_2||""} onChange={v=>update("hero","headline_2",v)}/>
            <Field label="Line 3 (gradient color)" value={sec.headline_3||""} onChange={v=>update("hero","headline_3",v)}/>
          </div>
          <Field label="Subline Paragraph" value={sec.subline||""} onChange={v=>update("hero","subline",v)} multiline/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            <Field label="Primary Button" value={sec.cta_primary||""} onChange={v=>update("hero","cta_primary",v)}/>
            <Field label="Secondary Button" value={sec.cta_secondary||""} onChange={v=>update("hero","cta_secondary",v)}/>
          </div>
          <div style={{ padding:"1rem", background:"rgba(6,7,8,0.03)", borderRadius:10, border:"0.5px solid rgba(6,7,8,0.08)" }}>
            <div style={{ fontSize:12, fontWeight:700, marginBottom:"0.75rem" }}>Floating "Next Activation" badge (bottom right of hero)</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
              <Field label="Title" value={sec.next_event_title||""} onChange={v=>update("hero","next_event_title",v)}/>
              <Field label="Detail" value={sec.next_event_detail||""} onChange={v=>update("hero","next_event_detail",v)}/>
            </div>
          </div>
        </div>
      );
      case "stats": return (
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <div style={{ fontSize:12, color:"rgba(6,7,8,0.5)", padding:"0.75rem", background:"#E3F2FD", borderRadius:8 }}>4 stat tiles below the hero.</div>
          {[1,2,3,4].map(n => (
            <div key={n} style={{ padding:"1rem", background:"rgba(6,7,8,0.03)", borderRadius:10, border:"0.5px solid rgba(6,7,8,0.08)" }}>
              <div style={{ fontSize:12, fontWeight:700, marginBottom:"0.75rem" }}>Stat {n}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.75rem" }}>
                <Field label="Value" value={sec[`stat${n}_value`]||""} onChange={v=>update("stats",`stat${n}_value`,v)}/>
                <Field label="Label" value={sec[`stat${n}_label`]||""} onChange={v=>update("stats",`stat${n}_label`,v)}/>
                <Field label="Sub-label" value={sec[`stat${n}_sub`]||""} onChange={v=>update("stats",`stat${n}_sub`,v)}/>
              </div>
            </div>
          ))}
        </div>
      );
      case "why_cities": return (
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            <Field label="Eyebrow" value={sec.eyebrow||""} onChange={v=>update("why_cities","eyebrow",v)}/>
            <Field label="Headline" value={sec.headline||""} onChange={v=>update("why_cities","headline",v)}/>
          </div>
          {[1,2,3,4,5,6].map(n => (
            <div key={n} style={{ padding:"1rem", background:"rgba(6,7,8,0.03)", borderRadius:10, border:"0.5px solid rgba(6,7,8,0.08)" }}>
              <div style={{ fontSize:12, fontWeight:700, marginBottom:"0.75rem" }}>Card {n}</div>
              <div style={{ display:"grid", gridTemplateColumns:"60px 1fr", gap:"0.75rem" }}>
                <Field label="Icon" value={sec[`card${n}_icon`]||""} onChange={v=>update("why_cities",`card${n}_icon`,v)}/>
                <Field label="Title" value={sec[`card${n}_title`]||""} onChange={v=>update("why_cities",`card${n}_title`,v)}/>
              </div>
              <div style={{ marginTop:"0.75rem" }}>
                <Field label="Body text" value={sec[`card${n}_body`]||""} onChange={v=>update("why_cities",`card${n}_body`,v)} multiline/>
              </div>
            </div>
          ))}
        </div>
      );
      case "proven": return (
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            <Field label="Eyebrow" value={sec.eyebrow||""} onChange={v=>update("proven","eyebrow",v)}/>
            <Field label="Headline" value={sec.headline||""} onChange={v=>update("proven","headline",v)}/>
          </div>
          <Field label="Subline" value={sec.subline||""} onChange={v=>update("proven","subline",v)} multiline/>
          {[1,2,3,4].map(n => (
            <div key={n} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
              <Field label={`Item ${n} — Title`} value={sec[`item${n}_title`]||""} onChange={v=>update("proven",`item${n}_title`,v)}/>
              <Field label={`Item ${n} — Sub`} value={sec[`item${n}_sub`]||""} onChange={v=>update("proven",`item${n}_sub`,v)}/>
            </div>
          ))}
          <ImageField label="Right-side photo" value={sec.image||""} onChange={v=>update("proven","image",v)}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            <Field label="Photo caption" value={sec.image_caption||""} onChange={v=>update("proven","image_caption",v)}/>
            <Field label="Photo sub-caption" value={sec.image_sub||""} onChange={v=>update("proven","image_sub",v)}/>
          </div>
        </div>
      );
      case "services": return (
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            <Field label="Eyebrow" value={sec.eyebrow||""} onChange={v=>update("services","eyebrow",v)}/>
            <Field label="Headline" value={sec.headline||""} onChange={v=>update("services","headline",v)}/>
          </div>
          {[1,2,3,4,5,6].map(n => (
            <div key={n} style={{ padding:"1rem", background:"rgba(6,7,8,0.03)", borderRadius:10, border:"0.5px solid rgba(6,7,8,0.08)" }}>
              <div style={{ display:"grid", gridTemplateColumns:"60px 1fr 2fr", gap:"0.75rem" }}>
                <Field label="Icon" value={sec[`card${n}_icon`]||""} onChange={v=>update("services",`card${n}_icon`,v)}/>
                <Field label="Title" value={sec[`card${n}_title`]||""} onChange={v=>update("services",`card${n}_title`,v)}/>
                <Field label="Description" value={sec[`card${n}_desc`]||""} onChange={v=>update("services",`card${n}_desc`,v)}/>
              </div>
            </div>
          ))}
        </div>
      );
      case "contact": return (
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
          <div style={{ fontSize:12, color:"rgba(6,7,8,0.5)", padding:"0.75rem", background:"#E3F2FD", borderRadius:8 }}>Section above the inquiry form at the bottom of the homepage.</div>
          <Field label="Eyebrow" value={sec.eyebrow||""} onChange={v=>update("contact","eyebrow",v)}/>
          <Field label="Headline" value={sec.headline||""} onChange={v=>update("contact","headline",v)} hint="Use \n for line breaks"/>
          <Field label="Subline" value={sec.subline||""} onChange={v=>update("contact","subline",v)} multiline/>
        </div>
      );
      default: return null;
    }
  }

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Barlow',sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width:240, background:"#F0EDE8", borderRight:"0.5px solid rgba(6,7,8,0.1)", flexShrink:0, overflow:"auto" }}>
        <div style={{ padding:"1.5rem 1.5rem 1rem", borderBottom:"0.5px solid rgba(6,7,8,0.08)" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:BLUE, marginBottom:4 }}>Homepage</div>
          <h1 style={{ ...D, fontSize:26, letterSpacing:1 }}>PAGE EDITOR</h1>
          <div style={{ fontSize:11, color:"rgba(6,7,8,0.45)", marginTop:4 }}>Saves to Supabase — live instantly</div>
        </div>
        {SECTIONS.map(s => (
          <div key={s.id} onClick={()=>setActiveSection(s.id)} style={{ padding:"0.875rem 1.5rem", cursor:"pointer", background:activeSection===s.id?"#fff":"transparent", borderBottom:"0.5px solid rgba(6,7,8,0.06)", borderRight:activeSection===s.id?`2px solid ${BLUE}`:"2px solid transparent" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
              <span style={{ fontSize:15 }}>{s.icon}</span>
              <span style={{ fontSize:13, fontWeight:700 }}>{s.label}</span>
            </div>
            <div style={{ fontSize:10, color:"rgba(6,7,8,0.4)", paddingLeft:23 }}>{s.desc}</div>
          </div>
        ))}
        <div style={{ padding:"1rem 1.5rem", marginTop:8, background:"rgba(6,7,8,0.04)", margin:"1rem" , borderRadius:10}}>
          <div style={{ fontSize:11, color:"rgba(6,7,8,0.5)", lineHeight:1.5 }}>
            <strong>To edit display card descriptions:</strong> go to Activations → click any card → edit Short Description.
          </div>
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"1.25rem 2rem", borderBottom:"0.5px solid rgba(6,7,8,0.08)", background:"#fff", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700 }}>{SECTIONS.find(s=>s.id===activeSection)?.icon} {SECTIONS.find(s=>s.id===activeSection)?.label}</div>
            <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)" }}>{SECTIONS.find(s=>s.id===activeSection)?.desc}</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            {saved && <span style={{ fontSize:12, color:"#1B5E20", fontWeight:700, padding:"7px 14px", background:"#E8F5E9", borderRadius:8 }}>✓ Saved to Supabase</span>}
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:BLUE, fontWeight:600, textDecoration:"none" }}>Preview →</a>
            <button onClick={save} disabled={saving||loading} style={{ fontSize:13, fontWeight:700, padding:"10px 28px", borderRadius:100, background:saving?"rgba(6,7,8,0.2)":"#04080F", color:"#F8F6F2", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
              {loading?"Loading...":saving?"Saving...":"Save Section"}
            </button>
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"2rem" }}>
          {loading ? <div style={{ textAlign:"center", padding:"3rem", color:"rgba(6,7,8,0.4)" }}>Loading saved content...</div> : renderSection()}
        </div>
      </div>
    </div>
  );
}
