"use client";
import { SiteNav, SiteFooter, DC, GRAD, BLUE, ORANGE, NAVY, NAVY_MID, NAVY_CARD, SAND, MUTED, DIM, BORDER, GradientBtn, EventInquiryForm } from "@/components/shared";

const EVENT_SERVICES = [
  { icon:"🎟", title:"Ticketing", color:BLUE, tagline:"Sell out before the gates open", desc:"End-to-end event ticketing — platform setup, pricing optimization, waitlists, day-of scanning, and revenue reporting.", includes:["Platform setup","Pricing strategy","Waitlist management","Day-of scanning","Revenue reporting","Refund handling"] },
  { icon:"👥", title:"Event Staffing", color:"#8B3CF7", tagline:"Your event. Our people.", desc:"Background-checked, trained event staff for any size activation. Safety officers, ops crew, registration staff, and crowd management.", includes:["Background checks","Event-specific training","Safety officers","Ops crew","Registration staff","Crowd management"] },
  { icon:"📋", title:"Permitting & Compliance", color:ORANGE, tagline:"We handle the paperwork.", desc:"We've navigated city permits in a dozen markets. Full permitting, insurance documentation, and municipal compliance.", includes:["City permit applications","Insurance documentation","Municipal coordination","Health permits","Fire marshal approval","ADA compliance"] },
  { icon:"🚦", title:"Traffic Control", color:"#C8A96E", tagline:"Safe. Permitted. Professional.", desc:"Certified traffic control officers and full traffic management planning for street closures, road races, and waterfront events.", includes:["Certified officers","Traffic management plan","Street closure coordination","Signage and cones","City coordination","Event day management"] },
  { icon:"🗺", title:"Site Planning", color:BLUE, tagline:"Every great event starts on paper.", desc:"Professional site plan design for parks departments, city planners, and venue operators. CAD-quality layouts for any activation.", includes:["CAD-quality layouts","Vendor placement","Flow planning","Emergency egress","ADA access routes","City submittal format"] },
  { icon:"📸", title:"Event Production", color:"#E86B9A", tagline:"The details that make the memory.", desc:"Full event production management — A/V, staging, lighting, entertainment, vendor coordination, and post-event recap.", includes:["A/V and staging","Entertainment booking","Vendor coordination","Photography","Post-event reporting","Sponsor activation"] },
];

const MARKETING_SERVICES = [
  { icon:"📱", title:"Social Media & Content", color:"#8B3CF7", tagline:"Audiences built from zero.", desc:"Organic social media strategy, content creation, and community management across Instagram, Facebook, and TikTok.", includes:["Content strategy","Photo and video","Community management","Stories and reels","Audience growth","Analytics reporting"] },
  { icon:"🎯", title:"Paid Media", color:BLUE, tagline:"We fill seats with data.", desc:"Meta, Google, and TikTok ad campaigns. We've managed $1M+ monthly in paid media — we know what converts.", includes:["Meta ads","Google ads","TikTok ads","Audience targeting","A/B testing","ROAS optimization"] },
  { icon:"🤝", title:"Influencer Marketing", color:"#E86B9A", tagline:"The right voices at the right moment.", desc:"Local creators, food bloggers, and community voices who amplify every activation. We handle outreach, contracts, and content review.", includes:["Influencer identification","Outreach and contracts","Brief creation","Content review","Placements","Performance tracking"] },
  { icon:"📧", title:"Email & SMS Marketing", color:ORANGE, tagline:"Own your audience.", desc:"List building, segmentation, and campaigns that drive ticket sales, event awareness, and repeat attendance.", includes:["List building","Campaign design","Segmentation","Automated flows","A/B testing","Revenue attribution"] },
  { icon:"🗞", title:"Press & Media Relations", color:"#C8A96E", tagline:"Get the coverage that counts.", desc:"Local and regional press outreach, press kit creation, and media coordination for pre-event buzz and post-event coverage.", includes:["Press kit","Media list","Story pitching","Press releases","Media day","Coverage tracking"] },
  { icon:"📍", title:"Destination Platforms", color:"#8B3CF7", tagline:"Build the local discovery engine.", desc:"We build 'Things To Do In [City]' digital platforms — creating a permanent audience asset that promotes every activation you run.", includes:["Platform strategy","Website development","Social buildout","Content calendar","Monetization","Audience growth"] },
];

function ServiceCard({ s }: { s: typeof EVENT_SERVICES[0] }) {
  return (
    <div style={{ background:NAVY_CARD, borderRadius:18, padding:"2rem", border:BORDER, position:"relative", overflow:"hidden", transition:"border-color 0.2s" }}
      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor=`${s.color}40`}
      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor="rgba(226,232,240,0.1)"}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:GRAD }}/>
      <div style={{ fontSize:30, marginBottom:"1rem", paddingTop:8 }}>{s.icon}</div>
      <div style={{ ...DC, fontSize:24, letterSpacing:0.5, marginBottom:4 }}>{s.title}</div>
      <p style={{ fontSize:13, color:s.color, fontStyle:"italic", marginBottom:"0.75rem" }}>{s.tagline}</p>
      <p style={{ fontSize:14, color:MUTED, lineHeight:1.7, fontWeight:300, marginBottom:"1.25rem" }}>{s.desc}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
        {s.includes.map(inc => (
          <span key={inc} style={{ fontSize:10, padding:"3px 10px", borderRadius:100, background:`${s.color}10`, color:s.color, border:`0.5px solid ${s.color}30` }}>{inc}</span>
        ))}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div style={{ fontFamily:"'Barlow',sans-serif", background:NAVY, color:SAND }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}
        @media(max-width:768px){.two-col{grid-template-columns:1fr!important}.four-col{grid-template-columns:1fr 1fr!important}.three-col{grid-template-columns:1fr!important}}
      `}</style>
      <SiteNav/>

      {/* HERO */}
      <section style={{ paddingTop:64, padding:"88px 1.5rem 5rem", background:`linear-gradient(160deg,#0D1A2E 0%,${NAVY} 100%)` }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center" }} className="two-col">
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:"0.75rem" }}>Full-Service City Activation Partner</div>
            <h1 style={{ ...DC, fontSize:"clamp(44px,7vw,82px)", lineHeight:0.9, letterSpacing:2, marginBottom:"1.5rem" }}>
              EVENT OPS<br/>+ MARKETING<br/>
              <span style={{ background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>+ MEDIA BUYING.</span>
            </h1>
            <p style={{ fontSize:17, color:MUTED, lineHeight:1.75, fontWeight:300, marginBottom:"2rem" }}>
              We're the only partner in the room who can produce your event, market your destination, <em>and</em> run your paid media. From permits and staffing to programmatic campaigns and influencer buys — one team, one contract, full accountability.
            </p>
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
              <GradientBtn href="#contact" size="lg">Get a Proposal</GradientBtn>
              <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
              <a href="#destination-marketing" style={{ fontSize:13, fontWeight:600, color:MUTED, display:"inline-flex", alignItems:"center", gap:6, letterSpacing:"0.06em", textTransform:"uppercase" }}>Destination Marketing →</a>
              <a href="#media-buying" style={{ fontSize:13, fontWeight:600, color:MUTED, display:"inline-flex", alignItems:"center", gap:6, letterSpacing:"0.06em", textTransform:"uppercase" }}>Media Buying →</a>
            </div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }} className="four-col">
            {[["9+","Years operating events"],["$1M+","Monthly ad spend managed"],["39K+","Owned social followers"],["100%","Client retention rate"]].map(([val,label]) => (
              <div key={label} style={{ padding:"1.5rem", background:NAVY_CARD, borderRadius:16, border:BORDER, textAlign:"center", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:GRAD }}/>
                <div style={{ ...DC, fontSize:36, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", paddingTop:4 }}>{val}</div>
                <div style={{ fontSize:10, color:DIM, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENT OPERATIONS */}
      <section id="event-operations" style={{ padding:"5rem 1.5rem", background:NAVY_MID }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:"3rem" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:"0.75rem" }}>Category 01</div>
            <h2 style={{ ...DC, fontSize:"clamp(32px,5vw,56px)", lineHeight:0.95, letterSpacing:1, marginBottom:"0.75rem" }}>EVENT OPERATIONS</h2>
            <p style={{ fontSize:16, color:MUTED, fontWeight:300, maxWidth:580 }}>The infrastructure that makes every event run flawlessly — from the permit application to the final headcount report.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.25rem" }} className="three-col">
            {EVENT_SERVICES.map(s => <ServiceCard key={s.title} s={s}/>)}
          </div>
        </div>
      </section>

      {/* DESTINATION MARKETING */}
      <section id="destination-marketing" style={{ padding:"5rem 1.5rem", background:NAVY }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:"3rem" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#8B3CF7", marginBottom:"0.75rem" }}>Category 02</div>
            <h2 style={{ ...DC, fontSize:"clamp(32px,5vw,56px)", lineHeight:0.95, letterSpacing:1, marginBottom:"0.75rem" }}>DESTINATION<br/>MARKETING</h2>
            <p style={{ fontSize:16, color:MUTED, fontWeight:300, maxWidth:640 }}>We don't just run your event — we build the audience before the first ticket goes on sale. Owned platforms, paid media, influencers, and press working as one system.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.25rem", marginBottom:"4rem" }} className="three-col">
            {MARKETING_SERVICES.map(s => <ServiceCard key={s.title} s={s}/>)}
          </div>

          {/* ThingsToDoInAustin */}
          <div style={{ background:NAVY_CARD, borderRadius:24, overflow:"hidden", border:"0.5px solid rgba(139,60,247,0.35)" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }} className="two-col">
              <div style={{ padding:"3rem" }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#8B3CF7", marginBottom:12 }}>Live Proof of Concept</div>
                <div style={{ ...DC, fontSize:"clamp(26px,4vw,44px)", lineHeight:0.95, letterSpacing:1, marginBottom:"1rem" }}>THINGS TO DO<br/>IN AUSTIN</div>
                <p style={{ fontSize:15, color:MUTED, lineHeight:1.75, fontWeight:300, marginBottom:"1.5rem" }}>
                  We didn't just pitch destination marketing — we built it. ThingsToDoInAustin.com is a live discovery platform we created and operate, proving the model before we bring it to your city.
                </p>
                <p style={{ fontSize:15, color:MUTED, lineHeight:1.75, fontWeight:300, marginBottom:"1.5rem" }}>
                  When we run an event in Austin, it hits 39,000+ people who are actively looking for things to do. That's the difference between renting someone else's audience and owning yours.
                </p>
                <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", marginBottom:"2rem" }}>
                  {["Event discovery","Weekend plans","Local events","Dining guides","Things to do"].map(tag => (
                    <span key={tag} style={{ fontSize:11, padding:"4px 14px", borderRadius:100, background:"rgba(139,60,247,0.12)", color:"#8B3CF7", border:"0.5px solid rgba(139,60,247,0.3)" }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
                  <GradientBtn href="https://thingstodoinaustin.com" size="md">Visit the Platform →</GradientBtn>
                  <a href="#contact" style={{ fontSize:13, fontWeight:600, color:MUTED, display:"inline-flex", alignItems:"center", gap:6, letterSpacing:"0.06em", textTransform:"uppercase" }}>Build this for my city →</a>
                </div>
              </div>
              <div style={{ background:`linear-gradient(135deg,rgba(139,60,247,0.12) 0%,rgba(33,150,243,0.08) 100%)`, padding:"3rem", display:"flex", flexDirection:"column", justifyContent:"center", gap:"1.25rem", borderLeft:"0.5px solid rgba(139,60,247,0.2)" }}>
                <div style={{ fontSize:13, fontWeight:700, color:SAND, marginBottom:4 }}>Platform Stats</div>
                {[
                  { val:"11.4K", label:"Instagram followers", icon:"📸", color:"#E86B9A" },
                  { val:"18K", label:"Facebook Group members", icon:"👥", color:BLUE },
                  { val:"10K", label:"Facebook Page fans", icon:"📘", color:BLUE },
                  { val:"39K+", label:"Total owned audience", icon:"🎯", color:"#8B3CF7" },
                ].map(s => (
                  <div key={s.label} style={{ display:"flex", alignItems:"center", gap:14, padding:"1.25rem", background:"rgba(226,232,240,0.04)", borderRadius:12, border:"0.5px solid rgba(226,232,240,0.08)" }}>
                    <span style={{ fontSize:22, flexShrink:0 }}>{s.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ ...DC, fontSize:32, background:`linear-gradient(90deg,${s.color},#8B3CF7)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.val}</div>
                      <div style={{ fontSize:12, color:MUTED, marginTop:1, fontWeight:300 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
                <div style={{ padding:"1rem", background:"rgba(139,60,247,0.08)", borderRadius:12, border:"0.5px solid rgba(139,60,247,0.2)" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#8B3CF7", marginBottom:4 }}>The pitch to your city:</div>
                  <div style={{ fontSize:13, color:MUTED, lineHeight:1.6, fontStyle:"italic" }}>"We can build this for your market — a permanent audience asset that promotes every activation you run for years."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEDIA BUYING */}
      <section id="media-buying" style={{ padding:"5rem 1.5rem", background:NAVY_MID }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ marginBottom:"3rem" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:ORANGE, marginBottom:"0.75rem" }}>Category 03</div>
            <h2 style={{ ...DC, fontSize:"clamp(32px,5vw,56px)", lineHeight:0.95, letterSpacing:1, marginBottom:"0.75rem" }}>MEDIA BUYING</h2>
            <p style={{ fontSize:16, color:MUTED, fontWeight:300, maxWidth:640 }}>We don't just run events — we run campaigns. With $1M+ in monthly ad spend managed across enterprise accounts, we bring performance marketing discipline to every city activation we touch.</p>
          </div>

          {/* Proof bar */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", marginBottom:"3rem" }} className="four-col">
            {[
              ["$1M+","Monthly ad spend managed","💰"],
              ["Meta + Google","Primary platforms","🎯"],
              ["TikTok + YouTube","Video & social","📱"],
              ["Enterprise-level","Campaign management","🏢"],
            ].map(([val,label,icon]) => (
              <div key={label} style={{ padding:"1.5rem", background:NAVY_CARD, borderRadius:14, border:BORDER, textAlign:"center", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${ORANGE},#8B3CF7)` }}/>
                <div style={{ fontSize:22, marginBottom:8, paddingTop:4 }}>{icon}</div>
                <div style={{ ...DC, fontSize:24, color:SAND, marginBottom:4 }}>{val}</div>
                <div style={{ fontSize:11, color:DIM, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.25rem", marginBottom:"3rem" }} className="three-col">
            {[
              { icon:"📺", title:"Traditional Media Buying", color:ORANGE, tagline:"TV, radio, OOH — all coordinated.", desc:"Local TV spots, radio placements, outdoor/billboard, and print buys coordinated around your event launch for maximum market penetration.", includes:["Local TV placement","Radio buys","Billboard & OOH","Print coordination","Reach & frequency planning","Market analysis"] },
              { icon:"🎯", title:"Programmatic & Digital", color:BLUE, tagline:"Precision targeting at scale.", desc:"Display, video, connected TV, and audio programmatic campaigns targeting event-goers by location, behavior, and intent signals.", includes:["Programmatic display","Connected TV (CTV)","Streaming audio","Retargeting","Geo-fencing","Audience segmentation"] },
              { icon:"📲", title:"Social & Search Buying", color:"#8B3CF7", tagline:"The platforms that move tickets.", desc:"Meta (Facebook/Instagram), Google Search & Display, TikTok, and YouTube campaigns built to drive ticket sales and event awareness.", includes:["Meta Ads (FB/IG)","Google Search & Display","TikTok Ads","YouTube pre-roll","Campaign strategy","Weekly reporting"] },
              { icon:"🤳", title:"Influencer Media", color:"#E86B9A", tagline:"Authentic reach, measurable results.", desc:"Paid influencer amplification layered on top of organic partnerships — boosting the best-performing content to expand reach.", includes:["Paid post amplification","Story takeovers","Creator whitelisting","Content boosting","Reach tracking","ROI reporting"] },
              { icon:"📊", title:"Campaign Strategy & Planning", color:ORANGE, tagline:"Media mix built for your market.", desc:"Full media plan development — budget allocation, channel mix, flight dates, and KPIs — tailored to your event size and city market.", includes:["Market analysis","Budget allocation","Channel mix planning","Flight scheduling","KPI framework","Competitive review"] },
              { icon:"📈", title:"Analytics & Reporting", color:BLUE, tagline:"Every dollar accounted for.", desc:"Cross-channel attribution, ROAS tracking, and weekly performance reports so you always know what's working and what's not.", includes:["Cross-channel attribution","ROAS tracking","Weekly reports","Pixel setup","Conversion tracking","Post-campaign analysis"] },
            ].map(s => <ServiceCard key={s.title} s={s}/>)}
          </div>

          {/* Enterprise credibility callout */}
          <div style={{ background:NAVY_CARD, borderRadius:20, padding:"2.5rem", border:`0.5px solid rgba(255,107,43,0.3)`, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", alignItems:"center" }} className="two-col">
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:ORANGE, marginBottom:12 }}>Enterprise-Tested, City-Focused</div>
              <h3 style={{ ...DC, fontSize:"clamp(24px,3.5vw,40px)", lineHeight:0.95, letterSpacing:1, marginBottom:"1rem" }}>MEDIA BUYING AT<br/>ENTERPRISE SCALE</h3>
              <p style={{ fontSize:15, color:MUTED, lineHeight:1.75, fontWeight:300, marginBottom:"1.5rem" }}>
                Our media buying capabilities are forged from managing paid media at the enterprise level — Fortune 500 brands, global campaigns, $1M+ monthly budgets. We bring that same rigor and platform expertise to every city activation we run.
              </p>
              <p style={{ fontSize:15, color:MUTED, lineHeight:1.75, fontWeight:300 }}>
                Most event companies outsource their digital marketing. We own it — which means faster execution, tighter feedback loops, and better results for your activation.
              </p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {[
                { icon:"🏢", title:"Fortune 500 experience", body:"Platform expertise built managing campaigns for global enterprise brands at scale." },
                { icon:"⚡", title:"No agency middleman", body:"We buy directly — faster execution, no markup, full transparency on every spend." },
                { icon:"🔄", title:"Ops + media in sync", body:"Event operations and media campaigns run from the same team, coordinated from day one." },
                { icon:"📋", title:"Full reporting included", body:"Weekly performance dashboards, post-event attribution, and clear ROI for every dollar spent." },
              ].map(item => (
                <div key={item.title} style={{ display:"flex", gap:12, padding:"1rem", background:NAVY_MID, borderRadius:12, border:BORDER }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:SAND, marginBottom:3 }}>{item.title}</div>
                    <div style={{ fontSize:13, color:MUTED, lineHeight:1.6, fontWeight:300 }}>{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FULL FUNNEL */}
      <section style={{ padding:"5rem 1.5rem", background:NAVY_MID }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:"0.75rem" }}>The Combined Advantage</div>
            <h2 style={{ ...DC, fontSize:"clamp(32px,5vw,56px)", lineHeight:0.95, letterSpacing:1, marginBottom:"1rem" }}>THE FULL FUNNEL</h2>
            <p style={{ fontSize:16, color:MUTED, fontWeight:300, maxWidth:560, margin:"0 auto" }}>No other vendor offers both sides. Most cities manage 5–9 vendors to replicate what we do as one team.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.75rem", marginBottom:"2rem" }} className="four-col">
            {[
              { step:"01", icon:"📍", title:"Audience First", body:"Local platforms and social audiences primed before your event launches.", color:BLUE },
              { step:"02", icon:"🎟", title:"Event Launch", body:"Full operations — permits, staffing, ticketing, traffic, and site planning.", color:"#8B3CF7" },
              { step:"03", icon:"📢", title:"Drive Demand", body:"Paid media, influencers, email, and press from owned and paid channels.", color:ORANGE },
              { step:"04", icon:"📊", title:"Prove & Scale", body:"Data, press, attendance reports. Then rebook and grow the activation.", color:BLUE },
            ].map((item,i) => (
              <div key={i} style={{ padding:"2rem", background:NAVY_CARD, borderRadius:16, border:BORDER, textAlign:"center", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:GRAD }}/>
                <div style={{ fontSize:11, fontWeight:700, color:item.color, marginBottom:8, paddingTop:4 }}>{item.step}</div>
                <div style={{ fontSize:26, marginBottom:"0.75rem" }}>{item.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:SAND, marginBottom:"0.5rem" }}>{item.title}</div>
                <div style={{ fontSize:13, color:MUTED, lineHeight:1.6, fontWeight:300 }}>{item.body}</div>
              </div>
            ))}
          </div>

          {/* One partner vs many vendors */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", marginTop:"4rem" }} className="two-col">
            <div>
              <h3 style={{ ...DC, fontSize:28, letterSpacing:1, marginBottom:"1.5rem" }}>ONE PARTNER VS. FIVE VENDORS</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                {["Single point of contact — one call resolves everything","Marketing and ops aligned from day one, not day 60","Audience data owned by you, not fragmented across agencies","Budget efficiency — no overlap, no duplication","Accountability — we own the outcome, not just the deliverable"].map(item => (
                  <div key={item} style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:14, color:MUTED, fontWeight:300 }}>
                    <span style={{ color:BLUE, flexShrink:0, marginTop:2, fontWeight:700 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:NAVY_CARD, borderRadius:16, overflow:"hidden", border:BORDER }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", background:NAVY_MID, padding:"0.875rem 1.25rem", borderBottom:BORDER }}>
                <div style={{ fontSize:10, fontWeight:700, color:DIM }}>What you need</div>
                <div style={{ fontSize:10, fontWeight:700, color:DIM, textAlign:"center" }}>Typical</div>
                <div style={{ fontSize:10, fontWeight:700, color:BLUE, textAlign:"center" }}>FlowState</div>
              </div>
              {[["Event production","Event company","✓"],["Permits & compliance","Law firm","✓"],["Ticketing","3rd party","✓"],["Staffing","Agency","✓"],["Paid media","Digital agency","✓"],["Social & content","Social agency","✓"],["Influencers","Platform","✓"],["Press & PR","PR firm","✓"],["Destination platform","Dev + SEO","✓"],["Media buying","Media agency","✓"]].map(([need,typ,us]) => (
                <div key={need} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"0.75rem 1.25rem", borderBottom:BORDER }}>
                  <div style={{ fontSize:12, fontWeight:600, color:SAND }}>{need}</div>
                  <div style={{ fontSize:11, color:DIM, textAlign:"center" }}>{typ}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:BLUE, textAlign:"center" }}>{us}</div>
                </div>
              ))}
              <div style={{ padding:"0.875rem 1.25rem", background:"rgba(33,150,243,0.06)", display:"flex", justifyContent:"space-between" }}>
                <div style={{ fontSize:13, fontWeight:700, color:SAND }}>Total vendors</div>
                <div style={{ fontSize:12, color:DIM }}>5–9</div>
                <div style={{ fontSize:14, fontWeight:900, color:BLUE }}>1</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:"5rem 1.5rem", background:NAVY }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ marginBottom:"2.5rem" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:BLUE, marginBottom:8 }}>Start the Conversation</div>
            <h2 style={{ ...DC, fontSize:"clamp(32px,5vw,56px)", lineHeight:0.95, letterSpacing:1, marginBottom:"0.75rem" }}>GET A STRATEGY<br/>PROPOSAL</h2>
            <p style={{ fontSize:15, color:MUTED, fontWeight:300 }}>Tell us your city, your goals, and your timeline. We'll respond within 48 hours with a full activation strategy — events, marketing, and audience.</p>
          </div>
          <EventInquiryForm/>
        </div>
      </section>

      <SiteFooter/>
    </div>
  );
}
