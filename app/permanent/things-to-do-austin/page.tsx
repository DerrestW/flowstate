"use client";
import { SiteNav, SiteFooter, DC, GRAD, BLUE, ORANGE, NAVY, NAVY_MID, NAVY_CARD, SAND, MUTED, DIM, BORDER, GradientBtn, EventInquiryForm } from "@/components/shared";
import Link from "next/link";

export default function ThingsToDoAustinPage() {
  return (
    <div style={{ fontFamily:"'Barlow',sans-serif", background:NAVY, color:SAND }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit} @media(max-width:768px){.two-col{grid-template-columns:1fr!important}.three-col{grid-template-columns:1fr!important}}`}</style>
      <SiteNav/>

      <div style={{ paddingTop:64 }}>
        {/* Hero */}
        <section style={{ padding:"4rem 1.5rem 3rem", background:`linear-gradient(160deg,rgba(139,60,247,0.15) 0%,${NAVY} 60%)` }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <Link href="/permanent" style={{ fontSize:12, color:DIM, fontWeight:500, display:"inline-flex", alignItems:"center", gap:6, marginBottom:"1.5rem" }}>← Permanent Activations</Link>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center" }} className="two-col">
              <div>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#8B3CF7", border:"0.5px solid rgba(139,60,247,0.4)", padding:"5px 14px", borderRadius:100, marginBottom:"1.25rem", background:"rgba(139,60,247,0.08)" }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"#4CAF50", display:"inline-block" }}/>
                  Live Platform · Austin, TX
                </div>
                <h1 style={{ ...DC, fontSize:"clamp(40px,7vw,80px)", lineHeight:0.9, letterSpacing:2, marginBottom:"1.25rem" }}>
                  THINGS TO DO<br/>IN AUSTIN
                </h1>
                <p style={{ fontSize:17, color:MUTED, lineHeight:1.75, fontWeight:300, marginBottom:"2rem" }}>
                  A live destination marketing platform we built from scratch. 39,000+ owned followers across Instagram and Facebook — proof that FlowState doesn't just operate events, we build the audiences that fill them.
                </p>
                <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
                  <GradientBtn href="https://thingstodoinaustin.com" size="lg">Visit the Platform →</GradientBtn>
                  <a href="#build-yours" style={{ fontSize:13, fontWeight:600, color:MUTED, display:"inline-flex", alignItems:"center", gap:6, letterSpacing:"0.06em", textTransform:"uppercase" }}>Build this for my city →</a>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                {[["11.4K","Instagram","📸","#E86B9A"],["18K","Facebook Group","👥",BLUE],["10K","Facebook Page","📘",BLUE],["39K+","Total Audience","🎯","#8B3CF7"]].map(([val,label,icon,color]) => (
                  <div key={label} style={{ padding:"1.5rem", background:NAVY_CARD, borderRadius:16, border:`0.5px solid ${color}30`, textAlign:"center", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${color},#8B3CF7)` }}/>
                    <div style={{ fontSize:22, marginBottom:8, paddingTop:4 }}>{icon}</div>
                    <div style={{ ...DC, fontSize:34, background:`linear-gradient(90deg,${color},#8B3CF7)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{val}</div>
                    <div style={{ fontSize:11, color:DIM, marginTop:4, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What it is */}
        <section style={{ padding:"4rem 1.5rem", background:NAVY_MID }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"start" }} className="two-col">
              <div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#8B3CF7", marginBottom:"0.75rem" }}>What It Is</div>
                <h2 style={{ ...DC, fontSize:"clamp(28px,4vw,44px)", lineHeight:0.95, letterSpacing:1, marginBottom:"1.25rem" }}>A CITY'S PERMANENT<br/>DISCOVERY ENGINE</h2>
                <p style={{ fontSize:16, color:MUTED, lineHeight:1.8, fontWeight:300, marginBottom:"1.5rem" }}>
                  ThingsToDoInAustin.com is a local event discovery platform covering events, dining, nightlife, and weekend plans in Austin. Built organically — no paid followers, no shortcuts.
                </p>
                <p style={{ fontSize:16, color:MUTED, lineHeight:1.8, fontWeight:300, marginBottom:"2rem" }}>
                  When FlowState runs an event in Austin, it hits this audience first. That's the difference between cold-starting every event and having a warm audience already waiting.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                  {["Event discovery and promotion","Restaurant and dining guides","Weekend plan roundups","Local business spotlights","Seasonal event calendars","Community engagement"].map(item => (
                    <div key={item} style={{ display:"flex", gap:10, alignItems:"center", fontSize:14, color:MUTED, fontWeight:300 }}>
                      <span style={{ color:"#8B3CF7", flexShrink:0, fontWeight:700 }}>✓</span>{item}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                <div style={{ background:NAVY_CARD, borderRadius:16, padding:"1.75rem", border:"0.5px solid rgba(139,60,247,0.25)" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:SAND, marginBottom:"1rem" }}>Why this matters for your event</div>
                  {[
                    { icon:"📣", title:"Pre-built promotion", desc:"Your event hits 39K+ people who are actively looking for things to do before you spend a dollar on ads." },
                    { icon:"🎯", title:"Hyper-local targeting", desc:"Real Austin residents and visitors — not a generic audience, but people already in the market." },
                    { icon:"📈", title:"Organic reach that scales", desc:"Every post, story, and share reaches followers and their networks. No algorithm gaming, just real community." },
                  ].map(item => (
                    <div key={item.title} style={{ display:"flex", gap:12, marginBottom:"1.25rem" }}>
                      <span style={{ fontSize:20, flexShrink:0 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:SAND, marginBottom:3 }}>{item.title}</div>
                        <div style={{ fontSize:13, color:MUTED, lineHeight:1.6, fontWeight:300 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background:NAVY_CARD, borderRadius:16, padding:"1.5rem", border:"0.5px solid rgba(139,60,247,0.2)" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#8B3CF7", marginBottom:8 }}>The bigger play</div>
                  <p style={{ fontSize:14, color:MUTED, lineHeight:1.65, fontWeight:300 }}>
                    We can build <strong style={{ color:SAND }}>DoingThingsIn[YourCity]</strong> as part of any city activation package. Within 12 months you have a permanent, owned audience that promotes every future activation — not just the one we run this year.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Build yours */}
        <section id="build-yours" style={{ padding:"4rem 1.5rem", background:NAVY }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <div style={{ marginBottom:"2.5rem" }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#8B3CF7", marginBottom:8 }}>Build This for Your City</div>
              <h2 style={{ ...DC, fontSize:"clamp(28px,5vw,52px)", lineHeight:0.95, letterSpacing:1, marginBottom:"0.75rem" }}>WANT A PLATFORM<br/>LIKE THIS?</h2>
              <p style={{ fontSize:15, color:MUTED, fontWeight:300 }}>Tell us your city. We'll put together a destination platform strategy as part of your full activation proposal.</p>
            </div>
            <EventInquiryForm defaultExperience="Destination Platform"/>
          </div>
        </section>
      </div>

      <SiteFooter/>
    </div>
  );
}
