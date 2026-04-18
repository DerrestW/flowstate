"use client";
import { SiteNav, SiteFooter, GradientBtn, DC, GRAD, BLUE, NAVY, NAVY_MID, NAVY_CARD, SAND, MUTED, DIM, BORDER } from "@/components/shared";
import Link from "next/link";

export type ActivationItem = {
  title: string;
  href: string;
  cat: string;
  img: string;
  color: string;
  tagline: string;
  desc: string;
  includes?: string[];
};

type Props = {
  eyebrow: string;
  headline: string;
  subline: string;
  heroImg: string;
  items: ActivationItem[];
  formTitle?: string;
};

export default function CategoryPage({ eyebrow, headline, subline, heroImg, items, formTitle }: Props) {
  return (
    <div style={{ fontFamily: "'Barlow',sans-serif", background: NAVY, color: SAND }}>
      <SiteNav/>

      {/* Hero */}
      <section style={{ height: 420, position: "relative", display: "flex", alignItems: "flex-end", padding: "0 2.5rem 4rem" }}>
        <img src={heroImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,22,35,1) 0%, rgba(15,22,35,0.5) 60%, rgba(15,22,35,0.2) 100%)" }}/>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: BLUE, marginBottom: 8 }}>{eyebrow}</div>
          <h1 style={{ ...DC, fontSize: "clamp(48px,7vw,88px)", lineHeight: 0.9, letterSpacing: 2, marginBottom: "1rem" }}>{headline}</h1>
          <p style={{ fontSize: 17, color: MUTED, maxWidth: 540, fontWeight: 300, lineHeight: 1.7 }}>{subline}</p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "6rem 2.5rem", background: NAVY }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
            {items.map(item => (
              <Link key={item.href} href={item.href} style={{ display: "flex", flexDirection: "column", background: NAVY_CARD, borderRadius: 18, overflow: "hidden", border: `0.5px solid rgba(238,240,245,0.08)`, transition: "transform 0.2s, border-color 0.2s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.borderColor = `${item.color}40`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.borderColor = "rgba(238,240,245,0.08)"; }}>
                <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
                  <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                    onMouseEnter={e => (e.target as HTMLElement).style.transform = "scale(1.06)"}
                    onMouseLeave={e => (e.target as HTMLElement).style.transform = "scale(1)"}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,35,56,0.85) 0%, transparent 60%)" }}/>
                  <span style={{ position: "absolute", top: 14, left: 14, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100, border: `0.5px solid ${item.color}50`, color: item.color, background: "rgba(15,22,35,0.75)" }}>{item.cat}</span>
                </div>
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <h3 style={{ ...DC, fontSize: 26, letterSpacing: 0.5 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: MUTED, fontStyle: "italic", fontWeight: 300 }}>{item.tagline}</p>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65, fontWeight: 300, flex: 1 }}>{item.desc}</p>
                  {item.includes && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                      {item.includes.slice(0,3).map(inc => (
                        <span key={inc} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: `${item.color}14`, color: item.color, border: `0.5px solid ${item.color}30` }}>{inc}</span>
                      ))}
                    </div>
                  )}
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.color, marginTop: 8 }}>View details →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "6rem 2.5rem", background: NAVY_MID }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...DC, fontSize: "clamp(36px,5vw,60px)", lineHeight: 0.95, marginBottom: "1rem" }}>{formTitle || "HOST ONE IN YOUR CITY"}</h2>
          <p style={{ fontSize: 15, color: MUTED, marginBottom: "2.5rem", fontWeight: 300 }}>Tell us about your event, venue, and goals. We'll respond within 48 hours.</p>
          <GradientBtn href="/#contact" size="lg">Submit an Inquiry</GradientBtn>
        </div>
      </section>

      <SiteFooter/>
    </div>
  );
}
