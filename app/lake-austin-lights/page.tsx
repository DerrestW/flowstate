import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter, DC, GRAD, BLUE, ORANGE, NAVY, NAVY_MID, NAVY_CARD, SAND, MUTED, DIM } from "@/components/shared";
import { LAKE_AUSTIN_LIGHTS as E } from "@/lib/events/lakeAustinLights";

const URL_PATH = `/${E.slug}`;
const TITLE = "Lake Austin Lights 2026 — Holiday Boat Cruise in Austin, TX | Tickets";
const DESC = `Cruise through 80-foot tunnels of holiday lights on Lake Austin. ${E.datesLabel} from Hula Hut. Tickets from $19.95 kids, $34.95 adults; private boats for up to 25.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL_PATH },
  keywords: ["Lake Austin Lights", "Austin holiday lights", "holiday boat cruise Austin", "Christmas lights boat tour Austin", "Hula Hut lights", "things to do in Austin December"],
  openGraph: {
    title: "Lake Austin Lights — Holiday Boat Cruise",
    description: DESC,
    url: URL_PATH,
    type: "website",
    images: [{ url: E.gallery[0].src, alt: E.gallery[0].alt }],
  },
  twitter: { card: "summary_large_image", title: "Lake Austin Lights — Holiday Boat Cruise", description: DESC, images: [E.gallery[0].src] },
};

// schema.org Event markup so Google can show dates, place and ticket prices
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: E.name,
  description: E.description,
  startDate: E.startDate,
  endDate: E.endDate,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  image: [E.heroImage, ...E.gallery.map(g => g.src)],
  location: {
    "@type": "Place",
    name: E.venue,
    address: { "@type": "PostalAddress", streetAddress: E.street, addressLocality: E.city, addressRegion: E.region, postalCode: E.postal, addressCountry: "US" },
  },
  organizer: [
    { "@type": "Organization", name: "Lake Austin Lights", url: E.website },
    { "@type": "Organization", name: "FlowState Experiences", url: "https://cityactivations.com" },
  ],
  offers: [...E.tickets, ...E.privateBoats.map(b => ({ ...b, name: `Private boat — ${b.name}` }))].map(t => ({
    "@type": "Offer",
    name: t.name,
    price: t.amount.toFixed(2),
    priceCurrency: "USD",
    url: t.name.startsWith("Private") ? E.privateUrl : E.ticketsUrl,
    availability: "https://schema.org/InStock",
  })),
};

const btn = (bg: string): React.CSSProperties => ({ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:15, fontWeight:900, fontStyle:"italic", letterSpacing:"0.04em", textTransform:"uppercase", padding:"14px 28px", borderRadius:100, background:bg, color:"#fff", fontFamily:"'Barlow Condensed',sans-serif", textDecoration:"none" });
const label: React.CSSProperties = { fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:DIM, marginBottom:8 };

export default function LakeAustinLightsPage() {
  return (
    <div style={{ fontFamily:"'Barlow',sans-serif", background:NAVY, color:SAND }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0} a{color:inherit}
        @media(max-width:860px){ .lal-grid{grid-template-columns:1fr!important} .lal-gallery{grid-template-columns:1fr 1fr!important} }
      `}</style>
      <SiteNav/>

      {/* Hero */}
      <header style={{ position:"relative", minHeight:"82vh", display:"flex", alignItems:"flex-end", padding:"8rem 1.5rem 4rem", overflow:"hidden" }}>
        <img src={E.heroImage} alt="The illuminated Lake Austin Lights tunnel and boats reflected on Lake Austin" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 35%" }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(17,24,39,0.97) 15%, rgba(17,24,39,0.6) 55%, rgba(17,24,39,0.45))" }}/>
        <div style={{ position:"relative", maxWidth:1100, margin:"0 auto", width:"100%" }}>
          <nav aria-label="Breadcrumb" style={{ fontSize:12, color:MUTED, marginBottom:14 }}>
            <Link href="/" style={{ textDecoration:"none" }}>Home</Link> / <Link href="/live" style={{ textDecoration:"none" }}>Live</Link> / <span style={{ color:SAND }}>{E.name}</span>
          </nav>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:100, background:"rgba(255,107,43,0.15)", border:"0.5px solid rgba(255,107,43,0.4)", fontSize:12, fontWeight:700, color:"#FFB089", marginBottom:16 }}>
            🎄 {E.datesLabel} · Austin, TX
          </div>
          <h1 style={{ ...DC, fontSize:"clamp(44px,9vw,104px)", lineHeight:0.9, letterSpacing:1 }}>LAKE AUSTIN<br/><span style={{ background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>LIGHTS</span></h1>
          <p style={{ fontSize:"clamp(16px,2.4vw,20px)", color:"rgba(241,245,249,0.85)", maxWidth:620, margin:"1rem 0 1.75rem", lineHeight:1.6, fontWeight:300 }}>{E.tagline} A 45-minute holiday boat cruise from Hula Hut through floating tunnels of light.</p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <a href={E.ticketsUrl} target="_blank" rel="noopener noreferrer" style={btn(GRAD)}>🎟 Buy Tickets →</a>
            <a href={E.privateUrl} target="_blank" rel="noopener noreferrer" style={{ ...btn("transparent"), border:"1px solid rgba(241,245,249,0.4)" }}>Book a Private Boat</a>
          </div>
          <p style={{ fontSize:13, color:"#FFB089", marginTop:14, fontWeight:600 }}>{E.onSale}</p>
        </div>
      </header>

      {/* Details */}
      <main style={{ padding:"4rem 1.5rem" }}>
        <div className="lal-grid" style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:"2.5rem" }}>
          <section>
            <h2 style={{ ...DC, fontSize:36, letterSpacing:0.5, marginBottom:"1rem" }}>THE CRUISE</h2>
            <p style={{ fontSize:16, color:MUTED, lineHeight:1.8, fontWeight:300, marginBottom:"1.75rem" }}>{E.description}</p>
            <div style={label}>What&apos;s included</div>
            <ul style={{ listStyle:"none", display:"grid", gap:10, marginBottom:"2rem" }}>
              {E.included.map(i => <li key={i} style={{ display:"flex", gap:10, fontSize:15, color:SAND }}><span style={{ color:BLUE }}>✓</span>{i}</li>)}
            </ul>
            <div className="lal-gallery" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {E.gallery.map(g => <img key={g.src} src={g.src} alt={g.alt} loading="lazy" style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", borderRadius:12, display:"block" }}/>)}
            </div>
          </section>

          <aside style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
            <div style={{ background:NAVY_CARD, borderRadius:16, padding:"1.5rem", border:"0.5px solid rgba(226,232,240,0.08)" }}>
              <div style={label}>Individual tickets</div>
              {E.tickets.map(t => (
                <div key={t.name} style={{ display:"flex", justifyContent:"space-between", fontSize:15, padding:"8px 0", borderBottom:"0.5px solid rgba(226,232,240,0.06)" }}>
                  <span style={{ color:MUTED }}>{t.name}</span><strong style={{ color:SAND }}>{t.price}</strong>
                </div>
              ))}
              <a href={E.ticketsUrl} target="_blank" rel="noopener noreferrer" style={{ ...btn(GRAD), width:"100%", marginTop:"1.25rem" }}>Buy Tickets →</a>
            </div>

            <div style={{ background:NAVY_CARD, borderRadius:16, padding:"1.5rem", border:"0.5px solid rgba(226,232,240,0.08)" }}>
              <div style={label}>Private boats</div>
              {E.privateBoats.map(t => (
                <div key={t.name} style={{ display:"flex", justifyContent:"space-between", fontSize:15, padding:"8px 0", borderBottom:"0.5px solid rgba(226,232,240,0.06)" }}>
                  <span style={{ color:MUTED }}>{t.name}</span><strong style={{ color:SAND }}>{t.price}</strong>
                </div>
              ))}
              <a href={E.privateUrl} target="_blank" rel="noopener noreferrer" style={{ ...btn(ORANGE), width:"100%", marginTop:"1.25rem" }}>Book a Private Boat →</a>
            </div>

            <div style={{ background:NAVY_MID, borderRadius:16, padding:"1.5rem", border:"0.5px solid rgba(226,232,240,0.08)", fontSize:14, color:MUTED, lineHeight:1.7 }}>
              <div style={label}>When &amp; where</div>
              <p><strong style={{ color:SAND }}>{E.datesLabel}</strong></p>
              <p>{E.duration} · {E.arrive}</p>
              <p style={{ marginTop:10 }}><strong style={{ color:SAND }}>{E.venue}</strong><br/>{E.street}, {E.city}, {E.region} {E.postal}</p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(`${E.venue}, ${E.street}, ${E.city}, ${E.region} ${E.postal}`)}`} target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", marginTop:10, color:BLUE, fontWeight:600 }}>📍 Get directions</a>
              <p style={{ marginTop:14 }}>Questions? <a href={`tel:+15128933131`} style={{ color:SAND }}>{E.phone}</a> · <a href={`mailto:${E.email}`} style={{ color:SAND }}>{E.email}</a></p>
              <p style={{ marginTop:6 }}><a href={E.website} target="_blank" rel="noopener noreferrer" style={{ color:BLUE }}>lakeaustinlights.com →</a></p>
            </div>
          </aside>
        </div>
      </main>

      <section style={{ padding:"0 1.5rem 5rem" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", borderRadius:20, padding:"2.5rem", background:NAVY_MID, display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1.5rem", flexWrap:"wrap" }}>
          <div>
            <div style={{ ...DC, fontSize:30 }}>WANT A LIGHT SHOW IN YOUR CITY?</div>
            <p style={{ color:MUTED, marginTop:6 }}>FlowState produces waterfront and holiday light activations for cities and venues.</p>
          </div>
          <Link href="/#contact" style={btn(GRAD)}>Get a Quote</Link>
        </div>
      </section>
      <SiteFooter/>
    </div>
  );
}
