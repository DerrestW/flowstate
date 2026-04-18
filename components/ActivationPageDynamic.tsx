"use client";
import { useState, useEffect } from "react";
import { SiteNav, SiteFooter, DC, GRAD, BLUE, ORANGE, NAVY, NAVY_MID, NAVY_CARD, SAND, MUTED, DIM, BORDER, EventInquiryForm } from "@/components/shared";
import Link from "next/link";

type StaticFallback = {
  title: string; cat: string; catColor: string; tagline: string;
  heroImg: string; galleryImgs?: string[]; videoId?: string;
  about: string; includes: string[]; capacity?: string;
  duration?: string; pricing?: string; parentHref: string;
  parentLabel: string; stats?: { value: string; label: string }[];
  slug: string;
};

export default function ActivationPageDynamic(fallback: StaticFallback) {
  const [data, setData] = useState(fallback);
  const [activeImg, setActiveImg] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/experiences?slug=${fallback.slug}`)
      .then(r => r.json())
      .then(exp => {
        if (!exp || !exp.title) return;
        setData(prev => {
          // Extract YouTube video ID from URL
          let videoId = prev.videoId;
          if (exp.video_url) {
            const match = exp.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
            if (match) videoId = match[1];
          }
          return ({
          ...prev,
          videoId,
          // Only override if DB has a real value (not empty string)
          title: exp.title || prev.title,
          tagline: exp.tagline || prev.tagline,
          about: exp.long_description || exp.description || prev.about,
          // Always use DB hero_image if set, fall back to gallery[0], then fallback prop
          heroImg: exp.hero_image || (exp.gallery_images?.[0]) || prev.heroImg,
          galleryImgs: (exp.gallery_images && exp.gallery_images.length > 0) ? exp.gallery_images : (exp.hero_image ? [exp.hero_image] : prev.galleryImgs),
          capacity: (exp.capacity_min && exp.capacity_max)
            ? `${Number(exp.capacity_min).toLocaleString()}–${Number(exp.capacity_max).toLocaleString()} people`
            : prev.capacity,
          duration: exp.duration || prev.duration,
          pricing: exp.price_starting
            ? `From $${Number(exp.price_starting).toLocaleString()} ${exp.price_unit || "per event"}`
            : prev.pricing,
          // Use DB includes if they exist and have content
          includes: (exp.includes && Array.isArray(exp.includes) && exp.includes.filter((s:string)=>s.trim()).length > 0)
            ? exp.includes.filter((s:string)=>s.trim())
            : prev.includes,
        }); });
      })
      .catch(() => {}) // Silently fall back to hardcoded data if Supabase is unavailable
      .finally(() => setLoading(false));
  }, [fallback.slug]);

  const allImgs = Array.isArray(data.galleryImgs) && data.galleryImgs.length ? data.galleryImgs : [data.heroImg];

  return (
    <div style={{ fontFamily:"'Barlow',sans-serif", background:NAVY, color:SAND }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}
        @media(max-width:768px){
          .act-layout{grid-template-columns:1fr!important}
          .act-sidebar{position:static!important;margin-top:2rem}
          .act-includes{grid-template-columns:1fr!important}
          .act-stats{grid-template-columns:repeat(3,1fr)!important}
        }
      `}</style>
      <SiteNav/>
      {videoOpen && data.videoId && (
        <div onClick={()=>setVideoOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(17,24,39,0.95)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:900, position:"relative" }}>
            <button onClick={()=>setVideoOpen(false)} style={{ position:"absolute", top:-44, right:0, background:"none", border:"none", color:SAND, fontSize:28, cursor:"pointer" }}>✕</button>
            <div style={{ position:"relative", paddingBottom:"56.25%", height:0, borderRadius:16, overflow:"hidden" }}>
              <iframe src={`https://www.youtube.com/embed/${data.videoId}?autoplay=1`} style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" }} allow="autoplay; fullscreen" allowFullScreen/>
            </div>
          </div>
        </div>
      )}

      <div style={{ paddingTop:64 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"1.5rem 1.5rem 0" }}>
          <Link href={data.parentHref} style={{ fontSize:12, color:DIM, fontWeight:500, display:"inline-flex", alignItems:"center", gap:6 }}>← {data.parentLabel}</Link>
        </div>

        <div style={{ maxWidth:1100, margin:"0 auto", padding:"1.5rem 1.5rem 0", display:"grid", gridTemplateColumns:"1fr 360px", gap:"3rem", alignItems:"start" }} className="act-layout">
          {/* Left */}
          <div>
            <div style={{ position:"relative", borderRadius:16, overflow:"hidden", height:420, marginBottom:"0.75rem" }}>
              <img src={allImgs[activeImg]} alt={data.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(17,24,39,0.6) 0%, transparent 60%)" }}/>
              {data.videoId && (
                <button onClick={()=>setVideoOpen(true)} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:60, height:60, borderRadius:"50%", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.5)", backdropFilter:"blur(8px)", cursor:"pointer", fontSize:20, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>▶</button>
              )}
              <span style={{ position:"absolute", bottom:16, left:16, fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"4px 12px", borderRadius:100, border:`0.5px solid ${data.catColor}60`, color:data.catColor, background:"rgba(17,24,39,0.75)" }}>{data.cat}</span>
            </div>
            {allImgs.length > 1 && (
              <div style={{ display:"flex", gap:8, marginBottom:"2.5rem" }}>
                {allImgs.map((img,i) => (
                  <div key={i} onClick={()=>setActiveImg(i)} style={{ width:80, height:60, borderRadius:8, overflow:"hidden", cursor:"pointer", border:`2px solid ${activeImg===i?data.catColor:"transparent"}`, transition:"border-color 0.15s", flexShrink:0 }}>
                    <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  </div>
                ))}
              </div>
            )}

            <h2 style={{ ...DC, fontSize:28, letterSpacing:1, marginBottom:"1rem", marginTop:"1.5rem" }}>ABOUT THIS ACTIVATION</h2>
            <p style={{ fontSize:16, color:MUTED, lineHeight:1.8, fontWeight:300, marginBottom:"2.5rem" }}>{data.about}</p>

            <h2 style={{ ...DC, fontSize:24, letterSpacing:1, marginBottom:"1.25rem" }}>WHAT'S INCLUDED</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"0.75rem", marginBottom:"2.5rem" }} className="act-includes">
              {data.includes.map(inc => (
                <div key={inc} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:NAVY_CARD, borderRadius:10, border:BORDER }}>
                  <span style={{ color:data.catColor, fontSize:14, flexShrink:0 }}>✓</span>
                  <span style={{ fontSize:13, color:MUTED, fontWeight:400 }}>{inc}</span>
                </div>
              ))}
            </div>

            {data.stats && data.stats.length > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:"1rem" }} className="act-stats">
                {data.stats.map(s => (
                  <div key={s.label} style={{ padding:"1.5rem", background:NAVY_CARD, borderRadius:14, border:BORDER, textAlign:"center", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:GRAD }}/>
                    <div style={{ ...DC, fontSize:34, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", paddingTop:4 }}>{s.value}</div>
                    <div style={{ fontSize:11, color:DIM, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginTop:4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="act-sidebar" style={{ position:"sticky", top:88 }}>
            <div style={{ background:NAVY_MID, borderRadius:18, padding:"1.75rem", border:"0.5px solid rgba(226,232,240,0.1)" }}>
              <span style={{ fontSize:10, fontWeight:700, padding:"4px 12px", borderRadius:100, background:`${data.catColor}18`, color:data.catColor, border:`0.5px solid ${data.catColor}40`, marginBottom:"1rem", display:"inline-block" }}>{data.cat}</span>
              <h1 style={{ ...DC, fontSize:"clamp(26px,3vw,38px)", lineHeight:0.95, letterSpacing:1, marginBottom:"0.5rem" }}>{data.title}</h1>
              <p style={{ fontSize:14, color:MUTED, marginBottom:"1.5rem", fontStyle:"italic", fontWeight:300 }}>{data.tagline}</p>

              {([data.capacity&&["Capacity",data.capacity], data.duration&&["Duration",data.duration], data.pricing&&["Pricing",data.pricing]] as ([string,string]|false)[]).filter((x): x is [string,string] => !!x).map(([label,value]) => (
                <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"0.75rem 0", borderBottom:BORDER }}>
                  <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:DIM }}>{label}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:SAND }}>{value}</span>
                </div>
              ))}

              <div style={{ marginTop:"1.5rem", display:"flex", flexDirection:"column", gap:10 }}>
                <a href="#inquiry" style={{ display:"block", textAlign:"center", fontSize:14, fontWeight:900, fontStyle:"italic", letterSpacing:"0.06em", textTransform:"uppercase", padding:"13px", borderRadius:100, background:GRAD, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif" }}>Get a Quote →</a>
                <a href="/#contact" style={{ display:"block", textAlign:"center", fontSize:13, fontWeight:600, padding:"11px", borderRadius:100, border:"0.5px solid rgba(226,232,240,0.2)", color:MUTED }}>Ask a Question</a>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry form */}
        <section id="inquiry" style={{ padding:"5rem 1.5rem", background:NAVY_MID, marginTop:"4rem" }}>
          <div style={{ maxWidth:660, margin:"0 auto" }}>
            <div style={{ marginBottom:"2.5rem" }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:8 }}>Book This Activation</div>
              <h2 style={{ ...DC, fontSize:"clamp(28px,4vw,48px)", lineHeight:0.95, letterSpacing:1 }}>HOST {data.title.toUpperCase()}<br/>IN YOUR CITY</h2>
            </div>
            <EventInquiryForm defaultExperience={data.title}/>
          </div>
        </section>
      </div>

      <SiteFooter/>
    </div>
  );
}
