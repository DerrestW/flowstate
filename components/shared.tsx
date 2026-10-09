"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export const GRAD = "linear-gradient(90deg, #2196F3 0%, #8B3CF7 50%, #FF6B2B 100%)";
export const BLUE = "#2196F3";
export const ORANGE = "#FF6B2B";
export const NAVY = "#111827";
export const NAVY_MID = "#1A2235";
export const NAVY_CARD = "#1E2A3F";
export const SAND = "#F1F5F9";
export const MUTED = "rgba(226,232,240,0.75)";
export const DIM = "rgba(226,232,240,0.45)";
export const BORDER = "rgba(226,232,240,0.1)";
export const DC: React.CSSProperties = { fontFamily:"'Barlow Condensed',sans-serif", fontStyle:"italic", fontWeight:900 };

export function LogoMark({ size=38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="lgorb" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2196F3"/><stop offset="55%" stopColor="#8B3CF7"/><stop offset="100%" stopColor="#FF6B2B"/>
        </linearGradient>
        <linearGradient id="lgw1" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#64B5F6" stopOpacity="0.9"/><stop offset="100%" stopColor="#2196F3" stopOpacity="0.6"/>
        </linearGradient>
        <linearGradient id="lgw2" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2196F3"/><stop offset="100%" stopColor="#8B3CF7"/>
        </linearGradient>
        <linearGradient id="lgw3" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF6B2B"/><stop offset="100%" stopColor="#FFB347" stopOpacity="0.8"/>
        </linearGradient>
        <clipPath id="lgclip"><circle cx="50" cy="50" r="46"/></clipPath>
      </defs>
      <circle cx="50" cy="50" r="46" stroke="url(#lgorb)" strokeWidth="4" fill="none" opacity="0.85"/>
      <g clipPath="url(#lgclip)">
        <path d="M4 35C20 25,30 45,50 35C70 25,80 45,96 35L96 22C80 32,70 12,50 22C30 32,20 12,4 22Z" fill="url(#lgw1)"/>
        <path d="M4 50C20 40,30 60,50 50C70 40,80 60,96 50L96 37C80 47,70 27,50 37C30 47,20 27,4 37Z" fill="url(#lgw2)"/>
        <path d="M4 65C20 55,30 75,50 65C70 55,80 75,96 65L96 52C80 62,70 42,50 52C30 62,20 42,4 52Z" fill="url(#lgw3)"/>
      </g>
    </svg>
  );
}

export function NavLogo({ dark=false }: { dark?: boolean }) {
  return (
    <Link href="/" style={{ display:"flex", alignItems:"center", gap:10 }}>
      <LogoMark size={32}/>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", lineHeight:1 }}>
        <div style={{ fontSize:19, fontWeight:900, fontStyle:"italic", letterSpacing:1, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>FLOWSTATE</div>
        <div style={{ fontSize:8, fontWeight:600, letterSpacing:"0.22em", color: dark ? "rgba(4,8,15,0.4)" : "rgba(238,240,245,0.4)" }}>EXPERIENCES</div>
      </div>
    </Link>
  );
}

const NAV_ITEMS = [
  { label:"Events", href:"/events", children:[
    {label:"Urban Slide",href:"/events/urban-slide"},{label:"Mud Runs",href:"/events/mud-runs"},
    {label:"Color Runs",href:"/events/color-runs"},{label:"5K / Marathons",href:"/events/5k-marathons"},
    {label:"Triathlons",href:"/events/triathlons"},{label:"Conventions",href:"/events/conventions"},
    {label:"Trade Shows",href:"/events/trade-shows"},{label:"Fundraisers",href:"/events/fundraisers"},
  ]},
  { label:"Seasonal", href:"/seasonal", children:[
    {label:"Light Shows",href:"/seasonal/light-shows"},
    {label:"Crawfish Festivals",href:"/seasonal/crawfish-festival"},
    {label:"Movies on the Lake",href:"/seasonal/movies-on-the-lake"},
  ]},
  { label:"Permanent", href:"/permanent", children:[
    {label:"Donut Boat Rentals",href:"/permanent/donut-boat-rentals"},
    {label:"Boat Rentals",href:"/permanent/boat-rentals"},
    {label:"Paddle Boards",href:"/permanent/paddle-boards"},
  ]},
  { label:"Live Now", href:"/live" },
  { label:"Services", href:"/services", children:[
    { label:"Event Operations", href:"/services#event-operations" },
    { label:"Destination Marketing", href:"/services#destination-marketing" },
    { label:"Media Buying", href:"/services#media-buying" },
  ]},
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string|null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setOpenMenu(null); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');
        .nav-link:hover{color:#F1F5F9!important}
        .drop-item:hover{background:rgba(33,150,243,0.1)!important;color:#F1F5F9!important}
        .mob-link:hover{color:#F1F5F9!important}
        *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}
        @media(max-width:768px){.nav-desktop{display:none!important}.nav-hamburger{display:flex!important}}
        @media(min-width:769px){.nav-hamburger{display:none!important}}
      `}</style>

      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, height:64, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 1.5rem", background: scrolled||mobileOpen ? "rgba(17,24,39,0.98)" : "transparent", backdropFilter: scrolled||mobileOpen ? "blur(16px)" : "none", borderBottom: scrolled||mobileOpen ? "0.5px solid rgba(226,232,240,0.07)" : "none", transition:"all 0.3s ease" }}>
        <NavLogo/>

        {/* Desktop nav */}
        <div className="nav-desktop" style={{ display:"flex", gap:"0.25rem", alignItems:"center" }}>
          {NAV_ITEMS.map(item => (
            <div key={item.href} style={{ position:"relative" }}
              onMouseEnter={() => item.children && setOpenMenu(item.href)}
              onMouseLeave={() => setOpenMenu(null)}>
              <Link href={item.href} className="nav-link" style={{ fontSize:13, fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase", color:MUTED, padding:"8px 12px", borderRadius:8, display:"flex", alignItems:"center", gap:4, transition:"color 0.2s" }}>
                {item.label}
                {item.children && <span style={{ fontSize:9, opacity:0.5 }}>▾</span>}
              </Link>
              {item.children && openMenu===item.href && (
                <div style={{ position:"absolute", top:"100%", left:0, background:"#1A2235", border:"0.5px solid rgba(226,232,240,0.1)", borderRadius:12, padding:"0.5rem", minWidth:200, boxShadow:"0 20px 40px rgba(0,0,0,0.5)", zIndex:100 }}>
                  {item.children.map(child => (
                    <Link key={child.href} href={child.href} className="drop-item" style={{ display:"block", padding:"8px 14px", fontSize:13, fontWeight:500, color:MUTED, borderRadius:8, transition:"all 0.15s" }}>{child.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/#contact" style={{ fontSize:12, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", padding:"9px 20px", borderRadius:100, background:GRAD, color:"#fff", marginLeft:8, fontFamily:"'Barlow Condensed',sans-serif", fontStyle:"italic" }}>Get a Quote</Link>
        </div>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)} style={{ background:"none", border:"none", color:SAND, fontSize:24, cursor:"pointer", padding:8, display:"none" }}>
          {mobileOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ position:"fixed", top:64, left:0, right:0, bottom:0, background:"rgba(17,24,39,0.99)", zIndex:999, overflowY:"auto", padding:"1.5rem" }}>
          {NAV_ITEMS.map(item => (
            <div key={item.href} style={{ marginBottom:"0.25rem" }}>
              <Link href={item.href} onClick={() => setMobileOpen(false)} className="mob-link" style={{ display:"block", padding:"12px 0", fontSize:20, fontWeight:700, fontStyle:"italic", fontFamily:"'Barlow Condensed',sans-serif", color:SAND, letterSpacing:0.5, borderBottom:"0.5px solid rgba(226,232,240,0.06)", transition:"color 0.15s" }}>
                {item.label.toUpperCase()}
              </Link>
              {item.children && (
                <div style={{ padding:"0.5rem 0 0.75rem 1rem" }}>
                  {item.children.map(child => (
                    <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)} style={{ display:"block", padding:"7px 0", fontSize:14, color:MUTED, fontWeight:500 }}>{child.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div style={{ marginTop:"1.5rem" }}>
            <Link href="/#contact" onClick={() => setMobileOpen(false)} style={{ display:"block", textAlign:"center", fontSize:15, fontWeight:900, fontStyle:"italic", letterSpacing:"0.06em", textTransform:"uppercase", padding:"15px", borderRadius:100, background:GRAD, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif" }}>
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer style={{ background:"#0A1020", borderTop:"0.5px solid rgba(226,232,240,0.06)", padding:"3rem 1.5rem 1.5rem" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"2rem", marginBottom:"2.5rem" }}>
          <div>
            <NavLogo/>
            <p style={{ fontSize:13, color:MUTED, lineHeight:1.7, marginTop:"1rem", fontWeight:300 }}>Houston-based outdoor experience company. Operating since 2016 with 65+ events and 330,000+ participants.</p>
          </div>
          {[
            { title:"Events", links:[["Urban Slide","/events/urban-slide"],["Mud Runs","/events/mud-runs"],["Color Runs","/events/color-runs"],["5K / Marathons","/events/5k-marathons"],["Conventions","/events/conventions"]] },
            { title:"Seasonal & Permanent", links:[["Light Shows","/seasonal/light-shows"],["Crawfish Festival","/seasonal/crawfish-festival"],["Boat Rentals","/permanent/boat-rentals"],["Donut Boats","/permanent/donut-boat-rentals"],["Live Now","/live"]] },
            { title:"Services", links:[["Event Operations","/services#event-operations"],["Destination Marketing","/services#destination-marketing"],["Media Buying","/services#media-buying"],["Contact","/#contact"],["Admin Login","/admin"]] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:DIM, marginBottom:"1rem" }}>{col.title}</div>
              {col.links.map(([label,href]) => (
                <Link key={href} href={href} style={{ display:"block", fontSize:13, color:MUTED, marginBottom:8, fontWeight:400 }}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"0.5px solid rgba(226,232,240,0.06)", paddingTop:"1.25rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <div style={{ fontSize:12, color:DIM }}>© 2025 FlowState Experiences LLC · Houston, TX · Since 2016</div>
          <div style={{ fontSize:12, color:DIM }}>info@flowstateexperiences.com</div>
        </div>
      </div>
    </footer>
  );
}

export function GradientBtn({ children, href, onClick, size="md" }: { children: React.ReactNode; href?: string; onClick?: () => void; size?: "sm"|"md"|"lg" }) {
  const pad = size==="lg"?"15px 40px":size==="sm"?"7px 16px":"11px 28px";
  const fs = size==="lg"?15:size==="sm"?11:13;
  const style: React.CSSProperties = { fontSize:fs, fontWeight:700, fontStyle:"italic", letterSpacing:"0.06em", textTransform:"uppercase", padding:pad, borderRadius:100, background:GRAD, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", border:"none", display:"inline-block", cursor:"pointer" };
  if (href) return <Link href={href} style={style}>{children}</Link>;
  return <button onClick={onClick} style={style}>{children}</button>;
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:"0.75rem" }}>{children}</div>;
}

export function SectionHeading({ children, light=false }: { children: React.ReactNode; light?: boolean }) {
  return <h2 style={{ ...DC, fontSize:"clamp(32px,4.5vw,58px)", lineHeight:0.95, letterSpacing:1, color: light ? "#04080F" : SAND, marginBottom:"1rem" }}>{children}</h2>;
}

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
const INTEREST_OPTIONS = ["Urban Slide","Mud Run","Color Run","5K/Marathon","Triathlon","Convention","Trade Show","Crawfish Festival","Light Show","Movies on Lake","Donut Boat","Boat Rentals","Paddle Boards","Fundraiser","Street Closure","Ticketing","Staffing","Marketing"];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function DatePicker({ value, onChange, inputStyle }: { value: string; onChange: (v: string) => void; inputStyle: React.CSSProperties }) {
  const now = new Date();
  const [month, setMonth] = useState(() => value ? String(parseInt(value.split("-")[1])) : "");
  const [day, setDay] = useState(() => value ? String(parseInt(value.split("-")[2])) : "");
  const [year, setYear] = useState(() => value ? value.split("-")[0] : "");

  const currentYear = now.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const daysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();
  const maxDay = month && year ? daysInMonth(parseInt(month), parseInt(year)) : 31;
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);

  const sel: React.CSSProperties = { ...inputStyle, cursor: "pointer", appearance: "none" as const, WebkitAppearance: "none" as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23F1F5F9' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32 };

  const update = (m: string, d: string, y: string) => {
    if (m && d && y) {
      const dd = Math.min(parseInt(d), daysInMonth(parseInt(m), parseInt(y)));
      onChange(`${y}-${m.padStart(2,"0")}-${String(dd).padStart(2,"0")}`);
    } else {
      onChange("");
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr", gap: 8 }}>
      <select aria-label="Month" style={sel} value={month} onChange={e => { setMonth(e.target.value); update(e.target.value, day, year); }}>
        <option value="">Month</option>
        {MONTHS.map((m, i) => <option key={m} value={String(i+1)}>{m}</option>)}
      </select>
      <select aria-label="Day" style={sel} value={day} onChange={e => { setDay(e.target.value); update(month, e.target.value, year); }}>
        <option value="">Day</option>
        {days.map(d => <option key={d} value={String(d)}>{d}</option>)}
      </select>
      <select aria-label="Year" style={sel} value={year} onChange={e => { setYear(e.target.value); update(month, day, e.target.value); }}>
        <option value="">Year</option>
        {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
      </select>
    </div>
  );
}

export function EventInquiryForm({ defaultExperience, showInterests=false }: { defaultExperience?: string; showInterests?: boolean }) {
  const [form, setForm] = useState({ name:"",email:"",phone:"",organization:"",city:"",state:"",event_date:"",budget_range:"",message:"",experience_interest: defaultExperience?[defaultExperience]:[] as string[], website:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [startedAt] = useState(() => Date.now()); // time-trap: bots submit instantly
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(f=>({...f,[k]:e.target.value}));
  const toggle = (v:string) => setForm(f=>({...f,experience_interest:f.experience_interest.includes(v)?f.experience_interest.filter(x=>x!==v):[...f.experience_interest,v]}));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const r = await fetch("/api/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ ...form, elapsed_ms: Date.now()-startedAt })});
      if (r.ok) { setSubmitted(true); return; }
      const d = await r.json().catch(()=>({}));
      setError(d.error || "Something went wrong. Please try again.");
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally { setLoading(false); }
  };
  const today = new Date().toISOString().slice(0,10);
  const IS: React.CSSProperties = { width:"100%", padding:"12px 14px", fontSize:15, borderRadius:10, border:"0.5px solid rgba(226,232,240,0.18)", background:"rgba(226,232,240,0.06)", color:SAND, fontFamily:"'Barlow',sans-serif" };
  const LS: React.CSSProperties = { fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:MUTED, marginBottom:6, display:"block" };
  const req = <span aria-hidden="true" style={{ color:ORANGE }}> *</span>;
  if (submitted) return (
    <div role="status" style={{ textAlign:"center", padding:"3rem 2rem", border:"0.5px solid rgba(33,150,243,0.3)", borderRadius:20, background:"rgba(33,150,243,0.06)" }}>
      <div style={{ ...DC,fontSize:48, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:"0.75rem" }}>YOU&apos;RE IN.</div>
      <p style={{ color:MUTED, margin:0 }}>Thanks, {form.name.split(" ")[0] || "friend"}. We&apos;ll reply to <strong style={{ color:SAND }}>{form.email}</strong> within 48 hours.</p>
    </div>
  );
  return (
    <form onSubmit={submit} noValidate={false} style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
      {/* Honeypot: off-screen (not display:none, which many bots skip). Humans never see or tab to it. */}
      <div aria-hidden="true" style={{ position:"absolute", left:"-10000px", top:"auto", width:1, height:1, overflow:"hidden" }}>
        <label htmlFor="inq-website">Website</label>
        <input id="inq-website" type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1rem" }}>
        <div><label htmlFor="inq-name" style={LS}>Name{req}</label><input id="inq-name" required maxLength={100} autoComplete="name" style={IS} value={form.name} onChange={set("name")} placeholder="Alex Johnson"/></div>
        <div><label htmlFor="inq-email" style={LS}>Work email{req}</label><input id="inq-email" required type="email" maxLength={200} autoComplete="email" inputMode="email" style={IS} value={form.email} onChange={set("email")} placeholder="alex@city.gov"/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1rem" }}>
        <div><label htmlFor="inq-phone" style={LS}>Phone</label><input id="inq-phone" type="tel" maxLength={30} autoComplete="tel" inputMode="tel" style={IS} value={form.phone} onChange={set("phone")} placeholder="(555) 000-0000"/></div>
        <div><label htmlFor="inq-org" style={LS}>Organization</label><input id="inq-org" maxLength={200} autoComplete="organization" style={IS} value={form.organization} onChange={set("organization")} placeholder="City of Hampton"/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"1rem" }}>
        <div><label htmlFor="inq-city" style={LS}>City{req}</label><input id="inq-city" required maxLength={100} autoComplete="address-level2" style={IS} value={form.city} onChange={set("city")} placeholder="Houston"/></div>
        <div><label htmlFor="inq-state" style={LS}>State{req}</label>
          <select id="inq-state" required autoComplete="address-level1" style={{...IS,cursor:"pointer"}} value={form.state} onChange={set("state")}>
            <option value="">—</option>{US_STATES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1rem" }}>
        <div>
          <label style={LS}>Target event date</label>
          <DatePicker value={form.event_date} onChange={v => setForm(f=>({...f,event_date:v}))} inputStyle={IS} />
        </div>
        <div><label htmlFor="inq-budget" style={LS}>Budget range</label>
          <select id="inq-budget" style={{...IS,cursor:"pointer"}} value={form.budget_range} onChange={set("budget_range")}>
            <option value="">Not sure yet</option><option>Under $25K</option><option>$25K–$50K</option><option>$50K–$100K</option><option>$100K+</option>
          </select>
        </div>
      </div>
      {showInterests && (
        <fieldset style={{ border:"none", padding:0, margin:0 }}>
          <legend style={LS}>What are you interested in?</legend>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {INTEREST_OPTIONS.map(v=>{const a=form.experience_interest.includes(v);return(
              <button type="button" key={v} aria-pressed={a} onClick={()=>toggle(v)} style={{ fontSize:12, padding:"7px 14px", borderRadius:100, cursor:"pointer", background:a?"rgba(33,150,243,0.18)":"transparent", color:a?SAND:MUTED, border:`0.5px solid ${a?"rgba(33,150,243,0.6)":"rgba(226,232,240,0.18)"}`, fontFamily:"inherit", transition:"all 0.15s" }}>{a?"✓ ":""}{v}</button>
            );})}
          </div>
        </fieldset>
      )}
      <div><label htmlFor="inq-msg" style={LS}>Tell us about your vision</label>
        <textarea id="inq-msg" maxLength={2000} style={{...IS,minHeight:110,resize:"vertical"}} value={form.message} onChange={set("message")} placeholder="Where would it happen, when, and what are you imagining?"/>
      </div>
      {error && <p role="alert" style={{ margin:0, padding:"10px 14px", borderRadius:10, background:"rgba(255,107,43,0.12)", border:"0.5px solid rgba(255,107,43,0.4)", color:SAND, fontSize:14 }}>{error} You can also email <a href="mailto:derrest@cityactivations.com" style={{ color:SAND, textDecoration:"underline" }}>derrest@cityactivations.com</a>.</p>}
      <button type="submit" disabled={loading} aria-busy={loading} style={{ fontSize:15, fontWeight:900, fontStyle:"italic", letterSpacing:"0.06em", textTransform:"uppercase", padding:"15px", borderRadius:100, border:"none", cursor:loading?"wait":"pointer", background:loading?"rgba(33,150,243,0.4)":GRAD, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif" }}>
        {loading?"Sending...":"Submit Inquiry →"}
      </button>
      <p style={{ margin:0, fontSize:12, color:DIM, textAlign:"center" }}>We reply within 48 hours. No spam, ever.</p>
    </form>
  );
}
