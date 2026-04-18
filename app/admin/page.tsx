"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const GRAD = "linear-gradient(90deg, #2196F3 0%, #FF6B2B 100%)";
const BLUE = "#2196F3";
const D: React.CSSProperties = { fontFamily:"'Barlow Condensed',sans-serif", fontStyle:"italic", fontWeight:900 };

export default function AdminDashboard() {
  const [stats, setStats] = useState({ inquiries:0, newInquiries:0, experiences:0, publishedExperiences:0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [inqR, expR] = await Promise.all([
          fetch("/api/inquiries"),
          fetch("/api/experiences"),
        ]);
        const inquiries = await inqR.json();
        const experiences = await expR.json();
        setStats({
          inquiries: Array.isArray(inquiries) ? inquiries.length : 0,
          newInquiries: Array.isArray(inquiries) ? inquiries.filter((i:any) => i.status==="new").length : 0,
          experiences: Array.isArray(experiences) ? experiences.length : 0,
          publishedExperiences: Array.isArray(experiences) ? experiences.filter((e:any) => e.published).length : 0,
        });
        setRecent(Array.isArray(inquiries) ? inquiries.slice(0,5) : []);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const STATUS_COLORS: Record<string,{bg:string;text:string}> = {
    new: { bg:"#E3F2FD", text:"#1565C0" },
    contacted: { bg:"#E8F5E9", text:"#1B5E20" },
    qualified: { bg:"#FFF8E1", text:"#F57F17" },
    closed: { bg:"rgba(6,7,8,0.06)", text:"rgba(6,7,8,0.4)" },
  };

  return (
    <div style={{ padding:"2.5rem", maxWidth:1100 }}>
      <div style={{ marginBottom:"2.5rem" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:BLUE, marginBottom:6 }}>Overview</div>
        <h1 style={{ ...D, fontSize:40, letterSpacing:1 }}>DASHBOARD</h1>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"2.5rem" }}>
        {[
          { label:"Total Inquiries", value: loading?"—":stats.inquiries, sub:"All time", href:"/admin/forms" },
          { label:"New Leads", value: loading?"—":stats.newInquiries, sub:"Need follow-up", href:"/admin/forms", highlight:true },
          { label:"Activations", value: loading?"—":stats.experiences, sub:"In database", href:"/admin/experiences" },
          { label:"Published", value: loading?"—":stats.publishedExperiences, sub:"Live on site", href:"/admin/experiences" },
        ].map((s,i) => (
          <Link key={i} href={s.href} style={{ background:"#fff", borderRadius:12, padding:"1.5rem", border:`0.5px solid ${s.highlight&&(stats.newInquiries>0)?"#90CAF9":"rgba(6,7,8,0.08)"}`, textDecoration:"none", display:"block", position:"relative", overflow:"hidden" }}>
            {s.highlight && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:GRAD }}/>}
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(6,7,8,0.4)", marginBottom:8, paddingTop: s.highlight?4:0 }}>{s.label}</div>
            <div style={{ ...D, fontSize:42, letterSpacing:1, background: s.highlight?GRAD:"none", WebkitBackgroundClip: s.highlight?"text":"unset", WebkitTextFillColor: s.highlight?"transparent":"#04080F" }}>{s.value}</div>
            <div style={{ fontSize:11, color:"rgba(6,7,8,0.4)", marginTop:4 }}>{s.sub}</div>
          </Link>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
        {/* Recent inquiries */}
        <div style={{ background:"#fff", borderRadius:14, border:"0.5px solid rgba(6,7,8,0.08)", overflow:"hidden" }}>
          <div style={{ padding:"1.25rem 1.5rem", borderBottom:"0.5px solid rgba(6,7,8,0.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:14, fontWeight:700 }}>Recent Inquiries</div>
            <Link href="/admin/forms" style={{ fontSize:12, color:BLUE, fontWeight:600 }}>View all →</Link>
          </div>
          {loading ? (
            <div style={{ padding:"2rem", textAlign:"center", color:"rgba(6,7,8,0.4)", fontSize:13 }}>Loading...</div>
          ) : recent.length === 0 ? (
            <div style={{ padding:"2rem", textAlign:"center", color:"rgba(6,7,8,0.4)", fontSize:13 }}>No inquiries yet</div>
          ) : recent.map((inq,i) => {
            const sc = STATUS_COLORS[inq.status] || STATUS_COLORS.new;
            return (
              <div key={inq.id||i} style={{ padding:"1rem 1.5rem", borderBottom: i<recent.length-1?"0.5px solid rgba(6,7,8,0.06)":"none", display:"flex", alignItems:"center", gap:"0.875rem" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{(inq.name||"?").charAt(0).toUpperCase()}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{inq.name}</div>
                  <div style={{ fontSize:11, color:"rgba(6,7,8,0.45)" }}>{inq.city}, {inq.state} · {inq.email}</div>
                </div>
                <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:100, background:sc.bg, color:sc.text, flexShrink:0, textTransform:"capitalize" }}>{inq.status||"new"}</span>
              </div>
            );
          })}
        </div>

        {/* Quick links */}
        <div style={{ background:"#fff", borderRadius:14, border:"0.5px solid rgba(6,7,8,0.08)", overflow:"hidden" }}>
          <div style={{ padding:"1.25rem 1.5rem", borderBottom:"0.5px solid rgba(6,7,8,0.08)" }}>
            <div style={{ fontSize:14, fontWeight:700 }}>Quick Actions</div>
          </div>
          <div style={{ padding:"1rem" }}>
            {[
              { label:"Edit Activations", sub:"Update page content, photos, descriptions", href:"/admin/experiences", icon:"▤" },
              { label:"Manage Live Experiences", sub:"Add/edit the Live Now page cards", href:"/admin/live", icon:"●" },
              { label:"Trust Logo Banner", sub:"Add partner logos to homepage", href:"/admin/trust-logos", icon:"◉" },
              { label:"SEO Settings", sub:"Edit meta titles and descriptions for all pages", href:"/admin/seo", icon:"⬡" },
              { label:"Media Library", sub:"Upload and manage images", href:"/admin/media", icon:"⊟" },
              { label:"Testimonials", sub:"Edit homepage testimonials", href:"/admin/testimonials", icon:"❝" },
            ].map((item,i) => (
              <Link key={i} href={item.href} style={{ display:"flex", alignItems:"center", gap:"0.875rem", padding:"0.875rem", borderRadius:10, marginBottom:4, textDecoration:"none", transition:"background 0.15s", background:"transparent" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="rgba(6,7,8,0.04)"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="transparent"}>
                <span style={{ fontSize:18, width:32, textAlign:"center", flexShrink:0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#04080F" }}>{item.label}</div>
                  <div style={{ fontSize:11, color:"rgba(6,7,8,0.45)" }}>{item.sub}</div>
                </div>
                <span style={{ marginLeft:"auto", color:"rgba(6,7,8,0.25)", fontSize:14 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
