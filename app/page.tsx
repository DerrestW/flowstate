"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SiteNav, SiteFooter, GradientBtn, DC, GRAD, BLUE, ORANGE, NAVY, NAVY_MID, NAVY_CARD, SAND, MUTED, DIM, BORDER } from "@/components/shared";

const FALLBACK_STATS = [
  { value:"9+", label:"Years in Business", sub:"Since 2016" },
  { value:"65+", label:"Events Operated", sub:"Across 12+ cities" },
  { value:"330K+", label:"Participants", sub:"And counting" },
  { value:"100%", label:"Client Retention", sub:"Cities rebook" },
];

const FALLBACK_EXPERIENCES = [
  { slug:"urban-slide", title:"Urban Slide", tagline:"1,000 feet of pure summer", cat:"WATER", color:BLUE, desc:"Our flagship. A 1,000-foot modular water slide that shuts down streets and opens up cities.", hero_image:"/img-urban-slide.png", featured:true, category:"water", published:true, sort_order:1 },
  { slug:"things-to-do-austin", title:"ThingsToDoInAustin.com", tagline:"18K followers. Built from zero.", cat:"MARKETING", color:"#8B3CF7", desc:"Our live destination marketing platform — 11.4K Instagram, 18K Facebook group, 10K Facebook page. Proof we build audiences, not just events.", hero_image:"/img-color-run-1.png", category:"marketing", published:true, sort_order:15 },
  { slug:"mud-run", title:"Mud Runs", tagline:"Get dirty. Get loud.", cat:"RUN", color:"#C8A96E", desc:"Full obstacle course mud run productions — course design, branding, timing, and operations.", hero_image:"/img-mud-run-2.png", category:"run", published:true, sort_order:2 },
  { slug:"color-run", title:"Color / Graffiti Runs", tagline:"Every finish line is a canvas", cat:"RUN", color:"#E86B9A", desc:"5K color powder runs that turn your city into a living rainbow.", hero_image:"/img-color-run-1.png", category:"run", published:true, sort_order:3 },
  { slug:"donut-boat", title:"Donut Boat Rentals", tagline:"Most-photographed rental on water", cat:"RENTAL", color:ORANGE, desc:"Giant novelty donut floats that drive social content and waterfront energy.", hero_image:"/img-donut-boat.png", category:"rental", published:true, sort_order:4 },
  { slug:"light-show", title:"Light Shows", tagline:"The night belongs to us", cat:"SEASONAL", color:"#8B3CF7", desc:"Spectacular waterfront light show productions.", hero_image:"/img-light-show.png", category:"event", published:true, sort_order:5 },
  { slug:"crawfish-festival", title:"Crawfish Festivals", tagline:"Full production, full pots", cat:"SEASONAL", color:ORANGE, desc:"Complete crawfish festival productions from site planning to last boil.", hero_image:"/img-color-run-1.png", category:"event", published:true, sort_order:6 },
  { slug:"sup-rentals", title:"SUP Rentals", tagline:"Stand up and explore", cat:"RENTAL", color:BLUE, desc:"Staff-run, safety-certified paddleboard rental operations.", hero_image:"/img-sup-rentals.png", category:"rental", published:true, sort_order:7 },
  { slug:"5k-events", title:"5K Events", tagline:"Community at full speed", cat:"RUN", color:"#E86B9A", desc:"Professionally timed 5K events for municipalities and charities.", hero_image:"/img-color-run-2.png", category:"run", published:true, sort_order:8 },
  { slug:"conventions", title:"Conventions", tagline:"Where ideas meet scale", cat:"EVENT", color:BLUE, desc:"Full convention production and floor management.", hero_image:"/img-convention.png", category:"event", published:true, sort_order:9 },
];

const FALLBACK_LOGOS = [
  { name:"City of Hampton", abbr:"Hampton, VA" },
  { name:"Houston Parks Dept.", abbr:"Houston, TX" },
  { name:"City of Austin", abbr:"Austin, TX" },
  { name:"ATX Summer Fest", abbr:"Festival" },
  { name:"Discovery Green", abbr:"Houston, TX" },
  { name:"City of Norfolk", abbr:"Norfolk, VA" },
  { name:"YMCA Houston", abbr:"Nonprofit" },
  { name:"Galveston Events", abbr:"Galveston, TX" },
];

const TESTIMONIALS = [
  { quote:"FlowState handled everything — permits, traffic, staffing, ticketing. We just showed up and our residents were blown away.", author:"Marcus Webb", title:"Director of Parks & Recreation", org:"City of Hampton, VA" },
  { quote:"The Urban Slide brought over 8,000 people to our waterfront in a single day. Flawless from setup to teardown.", author:"Priya Nair", title:"Events Manager", org:"Houston Parks Department" },
  { quote:"We combined the mud run and graffiti run into one weekend. Best attendance we've ever had. FlowState made it look easy.", author:"James Okafor", title:"Festival Director", org:"ATX Summer Fest" },
];

const PROVEN = [
  { title:"Urban Slide — Hampton, VA", sub:"8,000+ attendees · $70K contract · Fully permitted" },
  { title:"Graffiti Run — Houston, TX", sub:"12,000+ participants · Aerial start-line coverage" },
  { title:"Mud Run Series", sub:"65+ events · 330K+ participants total" },
  { title:"Donut Boat — Discovery Green", sub:"Houston, TX · Operating daily" },
];

function getCatColor(cat: string) {
  const map: Record<string,string> = { water:BLUE, run:"#E86B9A", rental:ORANGE, event:"#8B3CF7", logistics:"#888", services:"#C8A96E", marketing:"#8B3CF7", WATER:BLUE, RUN:"#E86B9A", RENTAL:ORANGE, EVENT:"#8B3CF7", SEASONAL:"#FF6B2B", MARKETING:"#8B3CF7" };
  return map[cat] || BLUE;
}

// Explicit slug → URL map — single source of truth
const SLUG_TO_URL: Record<string, string> = {
  "urban-slide": "/events/urban-slide",
  "mud-run": "/events/mud-runs",
  "color-run": "/events/color-runs",
  "5k-events": "/events/5k-marathons",
  "triathlons": "/events/triathlons",
  "conventions": "/events/conventions",
  "trade-shows": "/events/trade-shows",
  "fundraisers": "/events/fundraisers",
  "light-shows": "/seasonal/light-shows",
  "crawfish-festival": "/seasonal/crawfish-festival",
  "movies-on-the-lake": "/seasonal/movies-on-the-lake",
  "donut-boat": "/permanent/donut-boat-rentals",
  "boat-rentals": "/permanent/boat-rentals",
  "paddle-boards": "/permanent/paddle-boards",
  "things-to-do-austin": "/permanent/things-to-do-austin",
};

function getHref(exp: any) {
  // Use explicit map first
  if (SLUG_TO_URL[exp.slug]) return SLUG_TO_URL[exp.slug];
  if (exp.category === "rental") return `/permanent/${exp.slug}`;
  if (exp.category === "marketing") return "/permanent/things-to-do-austin";
  if (["light-shows","crawfish-festival","movies-on-the-lake"].includes(exp.slug)) return `/seasonal/${exp.slug}`;
  return `/events/${exp.slug}`;
}

export default function HomePage() {
  const [activeT, setActiveT] = useState(0);
  const [activeTab, setActiveTab] = useState<"events"|"seasonal"|"permanent">("events");
  const [trustLogos, setTrustLogos] = useState(FALLBACK_LOGOS);
  const [experiences, setExperiences] = useState(FALLBACK_EXPERIENCES as any[]);
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [pc, setPc] = useState<Record<string,Record<string,string>>>({});

  useEffect(() => {
    fetch("/api/trust-logos").then(r=>r.json()).then(d=>{ if(Array.isArray(d)&&d.length>0) setTrustLogos(d.filter((l:any)=>l.published)); }).catch(()=>{});
    fetch("/api/experiences").then(r=>r.json()).then(d=>{ if(Array.isArray(d)&&d.length>0) setExperiences(d); }).catch(()=>{});
    fetch("/api/page-content?page=homepage").then(r=>r.json()).then(data=>{
      if(data && typeof data === "object") {
        setPc(data);
        // Update stats from page content if available
        if(data.stats) {
          const s = data.stats;
          setStats([
            { value:s.stat1_value||"9+", label:s.stat1_label||"Years in Business", sub:s.stat1_sub||"Since 2016" },
            { value:s.stat2_value||"65+", label:s.stat2_label||"Events Operated", sub:s.stat2_sub||"Across 12+ cities" },
            { value:s.stat3_value||"330K+", label:s.stat3_label||"Participants", sub:s.stat3_sub||"And counting" },
            { value:s.stat4_value||"100%", label:s.stat4_label||"Client Retention", sub:s.stat4_sub||"Cities rebook" },
          ]);
        }
      }
    }).catch(()=>{});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveT(p=>(p+1)%TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  const featuredExps = experiences.filter((e:any) => e.featured || e.sort_order <= 1).slice(0,1);
  const otherExps = experiences.filter((e:any) => !featuredExps.includes(e)).slice(0,8);
  // Helper to get editable page content with fallback
  function p(section: string, key: string, fallback: string) {
    return pc[section]?.[key] || fallback;
  }

  return (
    <div style={{ fontFamily:"'Barlow',sans-serif", background:NAVY, color:SAND, overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit} ::selection{background:#2196F3;color:#fff}
        @media(max-width:768px){
          .hero-h1{font-size:clamp(52px,14vw,88px)!important}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
          .logos-grid{grid-template-columns:repeat(2,1fr)!important;gap:1px!important}
          .exp-grid{grid-template-columns:repeat(2,1fr)!important}
          .exp-featured{grid-column:1/-1!important}
          .why-grid{display:none!important}
          .why-carousel{display:flex!important}
          .proven-grid{grid-template-columns:1fr!important}
          .services-grid{grid-template-columns:1fr 1fr!important}
          .about-grid{grid-template-columns:1fr!important}
          .hero-badge{display:none!important}
          .process-grid{grid-template-columns:1fr 1fr!important}
          .section-pad{padding:4rem 1.25rem!important}
        }
        .why-carousel{display:none;overflow-x:auto;gap:1rem;padding-bottom:0.5rem;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
        .why-carousel::-webkit-scrollbar{display:none}
        .carousel-card{min-width:260px;scroll-snap-align:start;flex-shrink:0}
        .live-now-badge{display:inline-flex;align-items:center;gap:6px}
      `}</style>
      <SiteNav/>

      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 1.5rem 5rem", position:"relative", overflow:"hidden" }}>
        <img src="/img-urban-slide.png" alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(17,24,39,1) 0%, rgba(17,24,39,0.72) 45%, rgba(17,24,39,0.25) 100%)" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(33,150,243,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(33,150,243,0.04) 1px,transparent 1px)", backgroundSize:"60px 60px", zIndex:1 }}/>
        <div style={{ position:"relative", zIndex:2, maxWidth:900, paddingTop:"5rem" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#93C5FD", border:"0.5px solid rgba(147,197,253,0.4)", padding:"6px 16px", borderRadius:100, marginBottom:"1.5rem", background:"rgba(147,197,253,0.1)" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#93C5FD", display:"inline-block" }}/>
            {p("hero","badge","In business since 2016 · Houston, TX")}
          </div>
          <h1 className="hero-h1" style={{ ...DC, fontSize:"clamp(64px,10vw,136px)", lineHeight:0.9, letterSpacing:2, marginBottom:"1.5rem" }}>
            <span style={{ display:"block" }}>{p("hero","headline_1","WE MAKE")}</span>
            <span style={{ display:"block" }}>{p("hero","headline_2","CITIES")}</span>
            <span style={{ display:"block", background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{p("hero","headline_3","COME ALIVE.")}</span>
          </h1>
          <p style={{ fontSize:"clamp(15px,2.5vw,18px)", fontWeight:300, color:"rgba(226,232,240,0.7)", maxWidth:500, lineHeight:1.7, marginBottom:"2.5rem" }}>
            FlowState activates cities — we build the experience, market the destination, and bring the crowd. From 1,000-foot water slides to destination marketing platforms, we're your full-funnel city activation partner.
          </p>
          <div style={{ display:"flex", gap:"1rem", alignItems:"center", flexWrap:"wrap" }}>
            <GradientBtn href="/#contact" size="lg">Bring Us to Your City</GradientBtn>
            <Link href="/live" style={{ fontSize:13, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:MUTED, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#4CAF50", display:"inline-block", boxShadow:"0 0 0 3px rgba(76,175,80,0.25)" }}/>
              View Live Experiences
            </Link>
          </div>
        </div>
        {/* Floating badge — hidden mobile */}
        <div className="hero-badge" style={{ position:"absolute", bottom:"5rem", right:"1.5rem", zIndex:2, background:"rgba(17,24,39,0.8)", border:"0.5px solid rgba(226,232,240,0.12)", borderRadius:14, padding:"1.25rem 1.5rem", backdropFilter:"blur(12px)" }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:DIM, marginBottom:4 }}>Next Activation</div>
          <div style={{ fontSize:15, fontWeight:600, color:SAND }}>{p("hero","next_event_title","Hampton, VA — July 2025")}</div>
          <div style={{ fontSize:12, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginTop:2, fontWeight:700 }}>{p("hero","next_event_detail","Urban Slide · 1,000ft · Est. 10K")}</div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background:NAVY_MID, borderTop:BORDER, borderBottom:BORDER }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }} className="stats-grid">
          {stats.map((s,i) => (
            <div key={i} style={{ padding:"2rem 1.5rem", textAlign:"center", borderRight:i<3?BORDER:"none" }}>
              <div style={{ ...DC, fontSize:"clamp(38px,5vw,50px)", background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:1 }}>{s.value}</div>
              <div style={{ fontSize:13, fontWeight:600, color:SAND, marginTop:2 }}>{s.label}</div>
              <div style={{ fontSize:11, color:DIM, marginTop:2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUST LOGOS */}
      <div style={{ background:NAVY, borderBottom:BORDER, padding:"1.25rem 1.5rem" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:DIM, textAlign:"center", marginBottom:"1rem" }}>Trusted by cities, parks departments & event organizers</div>
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(trustLogos.length,8)},1fr)`, gap:1, background:BORDER, borderRadius:10, overflow:"hidden" }} className="logos-grid">
            {trustLogos.slice(0,8).map((logo:any,i:number) => (
              <div key={i} style={{ padding:"0.875rem 0.5rem", background:NAVY_MID, textAlign:"center" }}>
                {logo.logo_url ? (
                  <img src={logo.logo_url} alt={logo.name} style={{ height:28, objectFit:"contain", maxWidth:"100%", marginBottom:3 }} onError={e=>(e.target as HTMLElement).style.display="none"}/>
                ) : (
                  <div style={{ fontSize:"clamp(10px,1.5vw,12px)", fontWeight:700, color:SAND, lineHeight:1.2 }}>{logo.name}</div>
                )}
                <div style={{ fontSize:"clamp(9px,1.2vw,10px)", color:DIM, marginTop:2 }}>{logo.abbr}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXPERIENCES */}
      <section style={{ padding:"5rem 1.5rem" }} className="section-pad">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"2rem", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:"0.75rem" }}>What We Do</div>
              <h2 style={{ ...DC, fontSize:"clamp(32px,5vw,58px)", lineHeight:0.95, letterSpacing:1 }}>EVERY EXPERIENCE,<br/>PURPOSE-BUILT</h2>
            </div>
            <Link href={`/${activeTab === "events" ? "events" : activeTab === "seasonal" ? "seasonal" : "permanent"}`} style={{ fontSize:13, fontWeight:700, color:BLUE }}>View all →</Link>
          </div>
          {/* Tab switcher */}
          <div style={{ display:"flex", gap:6, marginBottom:"2rem", background:NAVY_CARD, padding:4, borderRadius:12, border:BORDER, width:"fit-content" }}>
            {(["events","seasonal","permanent"] as const).map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)} style={{ fontSize:13, fontWeight:700, fontStyle:"italic", padding:"9px 22px", borderRadius:8, border:"none", background:activeTab===tab?GRAD:"transparent", color:activeTab===tab?"#fff":MUTED, fontFamily:"'Barlow Condensed',sans-serif", textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s", letterSpacing:0.5 }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem" }} className="exp-grid">
            {experiences.filter((e:any) => {
              if (!e.published && e.published !== undefined) return false;
              if (activeTab === "events") return ["water","run","event","logistics"].includes(e.category);
              if (activeTab === "seasonal") return ["light-shows","crawfish-festival","movies-on-the-lake"].includes(e.slug) || e.category === "seasonal";
              if (activeTab === "permanent") return e.category === "rental";
              return true;
            }).slice(0,9).map((exp:any,i:number) => {
              const color = getCatColor(exp.category || exp.cat || "event");
              const href = getHref(exp);
              const isFeatured = i===0;
              return (
                <Link key={exp.slug||exp.id||i} href={href} className={isFeatured?"exp-featured":""} style={{ display:"flex", flexDirection:"column", background:NAVY_CARD, borderRadius:14, overflow:"hidden", border:"0.5px solid rgba(226,232,240,0.08)", transition:"transform 0.2s, border-color 0.2s", gridColumn:isFeatured?"1/3":undefined, textDecoration:"none" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-3px)";(e.currentTarget as HTMLElement).style.borderColor=`${color}40`;}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.borderColor="rgba(226,232,240,0.08)";}}>
                  <div style={{ position:"relative", height:isFeatured?220:170, overflow:"hidden" }}>
                    <img src={exp.hero_image||"/img-urban-slide.png"} alt={exp.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }} onMouseEnter={e=>(e.target as HTMLElement).style.transform="scale(1.05)"} onMouseLeave={e=>(e.target as HTMLElement).style.transform="scale(1)"}/>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(30,42,63,0.9) 0%, transparent 60%)" }}/>
                    <span style={{ position:"absolute", top:12, left:12, fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"3px 10px", borderRadius:100, border:`0.5px solid ${color}50`, color, background:"rgba(17,24,39,0.7)" }}>{(exp.cat || exp.category || "").toUpperCase()}</span>
                  </div>
                  <div style={{ padding:"1.25rem", flex:1, display:"flex", flexDirection:"column", gap:"0.4rem" }}>
                    <h3 style={{ ...DC, fontSize:isFeatured?26:20, letterSpacing:0.5, color:SAND }}>{exp.title}</h3>
                    <p style={{ fontSize:12, color:MUTED, fontStyle:"italic", fontWeight:300 }}>{exp.tagline}</p>
                    <p style={{ fontSize:12, color:MUTED, lineHeight:1.6, fontWeight:300, flex:1 }}>{exp.description || exp.desc}</p>
                    <span style={{ fontSize:11, fontWeight:700, color, marginTop:6 }}>Learn more →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PHOTO STRIP */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", height:180, gap:2 }}>
        {["/img-mud-run-1.png","/img-color-run-2.png","/img-urban-slide-splash.png","/img-donut-boat-hut.png","/img-light-show.png"].map((src,i)=>(
          <div key={i} style={{ overflow:"hidden", position:"relative" }}>
            <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} onMouseEnter={e=>(e.target as HTMLElement).style.transform="scale(1.08)"} onMouseLeave={e=>(e.target as HTMLElement).style.transform="scale(1)"}/>
            <div style={{ position:"absolute", inset:0, background:"rgba(17,24,39,0.3)" }}/>
          </div>
        ))}
      </div>

      {/* FULL FUNNEL SECTION */}
      <section style={{ padding:"5rem 1.5rem", background:NAVY }} className="section-pad">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center" }} className="proven-grid">
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#8B3CF7", marginBottom:"0.75rem" }}>Beyond Event Operations</div>
              <h2 style={{ ...DC, fontSize:"clamp(32px,5vw,58px)", lineHeight:0.95, letterSpacing:1, marginBottom:"1.5rem" }}>WE BRING THE<br/>CROWD, THEN<br/>THE EXPERIENCE.</h2>
              <p style={{ fontSize:16, color:MUTED, lineHeight:1.8, fontWeight:300, marginBottom:"2rem" }}>
                Most event companies wait for cities to market their own events. We don't. We've built the audiences, the platforms, and the distribution — so when your event launches, people already know about it.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"2rem" }}>
                {[
                  { icon:"📱", title:"Owned Audience", body:"11.4K Instagram · 18K Facebook group · 10K Facebook page. Built organically across Texas markets." },
                  { icon:"🎯", title:"Paid Media", body:"Meta, Google, and TikTok campaigns targeted at local event-goers. We've managed $1M+ in monthly ad spend." },
                  { icon:"🤝", title:"Influencer Network", body:"Local creators, food bloggers, and community voices who amplify every activation we run." },
                  { icon:"📍", title:"Destination Platforms", body:"We build 'Things To Do In [City]' platforms that drive ongoing discovery — events, dining, nightlife." },
                ].map((item,i) => (
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"1rem", background:NAVY_CARD, borderRadius:12, border:BORDER }}>
                    <span style={{ fontSize:22, flexShrink:0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:SAND, marginBottom:3 }}>{item.title}</div>
                      <div style={{ fontSize:13, color:MUTED, lineHeight:1.6, fontWeight:300 }}>{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <GradientBtn href="/services#destination-marketing">See Destination Marketing</GradientBtn>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {/* Loop diagram */}
              <div style={{ background:NAVY_CARD, borderRadius:20, padding:"2rem", border:BORDER, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:GRAD }}/>
                <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:DIM, marginBottom:"1.5rem" }}>The FlowState Loop</div>
                {[
                  { step:"01", label:"Build Audience", desc:"Organic social, discovery platforms, community growth", color:BLUE },
                  { step:"02", label:"Launch Experience", desc:"Urban Slide, crawfish festival, color run — any activation", color:"#8B3CF7" },
                  { step:"03", label:"Drive Demand", desc:"Paid media + influencers + owned channels = sold-out events", color:ORANGE },
                  { step:"04", label:"Prove ROI → Rebook", desc:"Data, attendance numbers, press coverage. Then do it again.", color:BLUE },
                ].map((item,i) => (
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom: i < 3 ? "1.25rem" : 0 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:`${item.color}20`, border:`1.5px solid ${item.color}50`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontSize:11, fontWeight:800, color:item.color }}>{item.step}</span>
                    </div>
                    <div style={{ paddingTop:2 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:SAND }}>{item.label}</div>
                      <div style={{ fontSize:12, color:MUTED, marginTop:2, fontWeight:300 }}>{item.desc}</div>
                    </div>
                    {i < 3 && <div style={{ position:"absolute", left:49, marginTop:36, width:1.5, height:16, background:`${item.color}30` }}/>}
                  </div>
                ))}
              </div>
              {/* ThingsToDoInAustin proof point */}
              <div style={{ background:NAVY_CARD, borderRadius:20, padding:"1.5rem", border:"0.5px solid rgba(139,60,247,0.3)", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#8B3CF7,#2196F3)" }}/>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#8B3CF7", marginBottom:8 }}>Live Proof of Concept</div>
                <div style={{ ...DC, fontSize:22, letterSpacing:0.5, marginBottom:4 }}>ThingsToDoInAustin.com</div>
                <div style={{ fontSize:13, color:MUTED, marginBottom:"1.25rem", fontWeight:300 }}>A live destination marketing platform built and operated by FlowState — proving the model before we pitch it to your city.</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.75rem" }}>
                  {[["11.4K","Instagram"],["18K","Facebook Group"],["10K","Facebook Page"]].map(([val,label]) => (
                    <div key={label} style={{ textAlign:"center", padding:"0.75rem", background:"rgba(139,60,247,0.08)", borderRadius:10 }}>
                      <div style={{ ...DC, fontSize:28, background:"linear-gradient(90deg,#8B3CF7,#2196F3)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{val}</div>
                      <div style={{ fontSize:10, color:DIM, marginTop:2, fontWeight:600 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTNER WITH US — Carousel on mobile */}
      <section style={{ padding:"5rem 1.5rem", background:NAVY_MID }} className="section-pad">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:"0.75rem" }}>{p("why_cities","eyebrow","The FlowState Difference")}</div>
            <h2 style={{ ...DC, fontSize:"clamp(32px,5vw,58px)", lineHeight:0.95, letterSpacing:1 }}>{p("why_cities","headline","WHY CITIES CHOOSE US")}</h2>
          </div>
          {/* Desktop grid */}
          <div className="why-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.25rem" }}>
            {[1,2,3,4,5,6].map((n,i) => {
              const item = { icon:p("why_cities",`card${n}_icon`,["◈","▲","◎","⬡","→","◷"][i]), title:p("why_cities",`card${n}_title`,["We own the whole event","9+ years of proof","Full-stack services","Municipal expertise","Scales to any size","Permanent & seasonal"][i]), body:p("why_cities",`card${n}_body`,["From site plan and permitting to day-of operations.","Operating since 2016 with 65+ events and 330K+ participants.","Ticketing, staffing, marketing, permitting — one team.","We've navigated permits in a dozen markets.","500 to 10,000+ participants — same quality.","We set up revenue-generating waterfront experiences."][i]) };
              return (
              <div key={i} style={{ padding:"1.75rem", background:NAVY_CARD, borderRadius:14, border:BORDER, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:GRAD }}/>
                <div style={{ fontSize:20, marginBottom:"0.875rem", paddingTop:4 }}>{item.icon}</div>
                <h3 style={{ fontSize:16, fontWeight:700, marginBottom:"0.5rem", color:SAND }}>{item.title}</h3>
                <p style={{ fontSize:13, color:MUTED, lineHeight:1.65, fontWeight:300 }}>{item.body}</p>
              </div>
            ); })}
          </div>
          {/* Mobile carousel */}
          <div className="why-carousel">
            {[
              { icon:"◈", title:"We own the whole event", body:"From site plan and permitting to day-of operations." },
              { icon:"▲", title:"9+ years of proof", body:"65+ events, 330K+ participants, 100% client retention." },
              { icon:"◎", title:"Full-stack services", body:"Ticketing, staffing, marketing, permitting — one team." },
              { icon:"⬡", title:"Municipal expertise", body:"Permitted in a dozen markets." },
              { icon:"→", title:"Any size", body:"500 to 10,000+ participants." },
              { icon:"◷", title:"Permanent & seasonal", body:"Revenue-generating waterfront experiences." },
            ].map((item,i) => (
              <div key={i} className="carousel-card" style={{ padding:"1.5rem", background:NAVY_CARD, borderRadius:14, border:BORDER, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:GRAD }}/>
                <div style={{ fontSize:20, marginBottom:"0.875rem", paddingTop:4 }}>{item.icon}</div>
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:"0.5rem", color:SAND }}>{item.title}</h3>
                <p style={{ fontSize:13, color:MUTED, lineHeight:1.6, fontWeight:300 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVEN ACTIVATIONS */}
      <section style={{ padding:"5rem 1.5rem", background:NAVY }} className="section-pad">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center" }} className="proven-grid">
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:"0.75rem" }}>{p("proven","eyebrow","Proven Activations")}</div>
              <h2 style={{ ...DC, fontSize:"clamp(30px,4.5vw,54px)", lineHeight:0.95, letterSpacing:1, marginBottom:"1.5rem" }}>
                {p("proven","headline","REAL EVENTS.\nREAL RESULTS.").split("\n").map((line:string, i:number) => (
                  <span key={i} style={{ display:"block" }}>{line}</span>
                ))}
              </h2>
              <p style={{ fontSize:15, color:MUTED, lineHeight:1.75, marginBottom:"1.5rem", fontWeight:300 }}>{p("proven","subline","Every activation is backed by years of operational experience, municipal relationships, and a team that has done this hundreds of times.")}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", marginBottom:"2rem" }}>
                {[1,2,3,4].map(n => {
                  const title = p("proven",`item${n}_title`, PROVEN[n-1]?.title||"");
                  const sub = p("proven",`item${n}_sub`, PROVEN[n-1]?.sub||"");
                  if (!title) return null;
                  return (
                    <div key={n} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"0.875rem", background:NAVY_CARD, borderRadius:10, border:BORDER }}>
                      <span style={{ width:8, height:8, borderRadius:"50%", background:BLUE, display:"inline-block", marginTop:6, flexShrink:0 }}/>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:SAND }}>{title}</div>
                        <div style={{ fontSize:12, color:DIM, marginTop:2 }}>{sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <GradientBtn href="/live">See Live Experiences</GradientBtn>
            </div>
            <div style={{ position:"relative", borderRadius:18, overflow:"hidden", height:420 }}>
              <img src={p("proven","image","/img-color-run-1.png")} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(17,24,39,0.85) 0%, transparent 60%)" }}/>
              <div style={{ position:"absolute", bottom:24, left:24, right:24, background:"rgba(17,24,39,0.85)", backdropFilter:"blur(12px)", borderRadius:12, padding:"1.25rem", border:"0.5px solid rgba(226,232,240,0.1)" }}>
                <div style={{ ...DC, fontSize:20, marginBottom:4 }}>{p("proven","image_caption","Graffiti Run · Houston")}</div>
                <div style={{ fontSize:12, color:MUTED }}>{p("proven","image_sub","12,000+ participants · Fully operated by FlowState")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding:"5rem 1.5rem", background:NAVY_MID }} className="section-pad">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"2.5rem", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:"0.75rem" }}>{p("services","eyebrow","Full-Service Support")}</div>
              <h2 style={{ ...DC, fontSize:"clamp(32px,5vw,56px)", lineHeight:0.95, letterSpacing:1 }}>{p("services","headline","WE HANDLE\nEVERYTHING").split("\n").map((l:string,i:number)=><span key={i} style={{display:"block"}}>{l}</span>)}</h2>
            </div>
            <GradientBtn href="/services">View All Services</GradientBtn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem" }} className="services-grid">
            {[1,2,3,4,5,6].map((n,i) => {
              const defaults = [
                {icon:"🎟",title:"Event Operations",desc:"Ticketing, staffing, permitting, traffic control, and site planning — end to end."},
                {icon:"📱",title:"Destination Marketing",desc:"Social media, influencer, email, press, and destination platform buildout."},
                {icon:"🎯",title:"Media Buying",desc:"Meta, Google, TikTok, programmatic, and traditional media — $1M+ monthly managed."},
                {icon:"📋",title:"Permitting & Compliance",desc:"City permits, insurance docs, and municipal compliance handled for you."},
                {icon:"🤳",title:"Influencer & Content",desc:"Local creators and community voices amplifying every activation."},
                {icon:"📊",title:"Analytics & Reporting",desc:"Cross-channel attribution, ROAS tracking, and weekly performance reports."},
              ];
              const s = { icon:p("services",`card${n}_icon`,defaults[i].icon), title:p("services",`card${n}_title`,defaults[i].title), desc:p("services",`card${n}_desc`,defaults[i].desc) };
              return (
              <div key={i} style={{ padding:"1.5rem", background:NAVY_CARD, borderRadius:12, border:BORDER, display:"flex", gap:"0.875rem", alignItems:"flex-start" }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:SAND, marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:13, color:MUTED, lineHeight:1.6, fontWeight:300 }}>{s.desc}</div>
                </div>
              </div>
            ); })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:"5rem 1.5rem", background:NAVY }} className="section-pad">
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:"2.5rem" }}>What Cities Say</div>
          <div style={{ position:"relative", minHeight:200 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} style={{ position:"absolute", top:0, left:0, right:0, opacity:activeT===i?1:0, transition:"opacity 0.7s", pointerEvents:activeT===i?"auto":"none" }}>
                <p style={{ fontSize:"clamp(16px,2.5vw,22px)", fontWeight:300, lineHeight:1.65, fontStyle:"italic", color:SAND, marginBottom:"2rem" }}>"{t.quote}"</p>
                <div style={{ fontSize:14, fontWeight:700, color:SAND }}>{t.author}</div>
                <div style={{ fontSize:12, color:MUTED, marginTop:3 }}>{t.title} · {t.org}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:220 }}>
            {TESTIMONIALS.map((_,i) => (
              <button key={i} onClick={()=>setActiveT(i)} style={{ width:activeT===i?26:6, height:6, borderRadius:100, background:activeT===i?BLUE:"rgba(226,232,240,0.2)", border:"none", transition:"all 0.3s", cursor:"pointer" }}/>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:"5rem 1.5rem", background:NAVY_MID }} className="section-pad">
        <div style={{ maxWidth:660, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:"0.75rem" }}>{p("contact","eyebrow","Let's Build Something")}</div>
            <h2 style={{ ...DC, fontSize:"clamp(36px,7vw,72px)", lineHeight:0.92, letterSpacing:1, marginBottom:"1rem" }}>
              {p("contact","headline","READY TO ACTIVATE\nYOUR CITY?").split("\n").map((l:string,i:number)=><span key={i} style={{display:"block"}}>{l}</span>)}
            </h2>
            <p style={{ fontSize:15, color:MUTED, fontWeight:300 }}>{p("contact","subline","Tell us where you are. We'll respond within 48 hours.")}</p>
          </div>
          <ContactForm/>
        </div>
      </section>

      <SiteFooter/>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name:"",email:"",phone:"",organization:"",city:"",state:"",event_date:"",expected_attendance:"",budget_range:"",message:"",experience_interest:[] as string[], website:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const interests = ["Urban Slide","Mud Run","Color Run","5K/Marathon","Triathlon","Convention","Trade Show","Crawfish Festival","Light Show","Movies on Lake","Donut Boat","Boat Rentals","Paddle Boards","Fundraiser","Street Closure","Ticketing","Staffing","Marketing"];
  const toggle = (v:string) => setForm(f=>({...f,experience_interest:f.experience_interest.includes(v)?f.experience_interest.filter(x=>x!==v):[...f.experience_interest,v]}));
  const submit = async (e:React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { const r = await fetch("/api/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}); if(r.ok) setSubmitted(true); } finally { setLoading(false); }
  };
  const IS: React.CSSProperties = { width:"100%", padding:"11px 14px", fontSize:14, borderRadius:10, border:"0.5px solid rgba(226,232,240,0.12)", background:"rgba(226,232,240,0.06)", color:SAND, outline:"none", fontFamily:"'Barlow',sans-serif" };
  const LS: React.CSSProperties = { fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:MUTED, marginBottom:6, display:"block" };
  if (submitted) return (
    <div style={{ textAlign:"center", padding:"3rem", border:"0.5px solid rgba(33,150,243,0.3)", borderRadius:20, background:"rgba(33,150,243,0.06)" }}>
      <div style={{ ...DC,fontSize:52, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:"0.75rem" }}>YOU'RE IN.</div>
      <p style={{ color:MUTED }}>We'll be in touch within 48 hours.</p>
    </div>
  );
  return (
    <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
      <input type="text" name="website" value={form.website} onChange={e=>setForm(f=>({...f,website:e.target.value}))} style={{ display:"none" }} tabIndex={-1} autoComplete="off"/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1rem" }}>
        <div><label style={LS}>Name *</label><input required style={IS} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Alex Johnson"/></div>
        <div><label style={LS}>Email *</label><input required type="email" style={IS} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="alex@city.gov"/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1rem" }}>
        <div><label style={LS}>Phone</label><input style={IS} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="(555) 000-0000"/></div>
        <div><label style={LS}>Organization</label><input style={IS} value={form.organization} onChange={e=>setForm(f=>({...f,organization:e.target.value}))} placeholder="City of Hampton"/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"1rem" }}>
        <div><label style={LS}>City *</label><input required style={IS} value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} placeholder="Houston"/></div>
        <div><label style={LS}>State *</label><input required style={IS} value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))} placeholder="TX" maxLength={2}/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"1rem" }}>
        <div><label style={LS}>Event Date</label><input type="date" style={IS} value={form.event_date} onChange={e=>setForm(f=>({...f,event_date:e.target.value}))}/></div>
        <div><label style={LS}>Est. Attendance</label><input type="number" style={IS} value={form.expected_attendance} onChange={e=>setForm(f=>({...f,expected_attendance:e.target.value}))} placeholder="5,000"/></div>
        <div><label style={LS}>Budget</label>
          <select style={{...IS,cursor:"pointer"}} value={form.budget_range} onChange={e=>setForm(f=>({...f,budget_range:e.target.value}))}>
            <option value="">Select...</option><option>Under $25K</option><option>$25K–$50K</option><option>$50K–$100K</option><option>$100K+</option>
          </select>
        </div>
      </div>
      <div><label style={LS}>What are you interested in?</label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {interests.map(v=>{const a=form.experience_interest.includes(v);return(
            <button type="button" key={v} onClick={()=>toggle(v)} style={{ fontSize:11, padding:"5px 12px", borderRadius:100, background:a?"rgba(33,150,243,0.18)":"transparent", color:a?SAND:MUTED, border:`0.5px solid ${a?"rgba(33,150,243,0.5)":"rgba(226,232,240,0.15)"}`, fontFamily:"inherit", transition:"all 0.15s" }}>{v}</button>
          );})}
        </div>
      </div>
      <div><label style={LS}>Tell us about your vision</label>
        <textarea style={{...IS,minHeight:90,resize:"vertical"}} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Tell us about the venue, expected turnout, and what you're imagining..."/>
      </div>
      <button type="submit" disabled={loading} style={{ fontSize:15, fontWeight:900, fontStyle:"italic", letterSpacing:"0.06em", textTransform:"uppercase", padding:"15px", borderRadius:100, border:"none", background:loading?"rgba(33,150,243,0.4)":GRAD, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif" }}>
        {loading?"Sending...":"Submit Inquiry →"}
      </button>
    </form>
  );
}
