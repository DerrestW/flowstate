"use client";
import { SiteNav, SiteFooter, DC, GRAD, BLUE, ORANGE, NAVY, NAVY_MID, NAVY_CARD, SAND, MUTED, DIM, BORDER, EventInquiryForm } from "@/components/shared";
import Link from "next/link";

export type ActivationPageProps = {
  title: string;
  cat: string;
  catColor: string;
  tagline: string;
  heroImg: string;
  galleryImgs?: string[];
  videoId?: string;
  about: string;
  includes: string[];
  capacity?: string;
  duration?: string;
  pricing?: string;
  parentHref: string;
  parentLabel: string;
  stats?: { value: string; label: string }[];
};

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,22,35,0.94)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 900, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: -44, right: 0, background: "none", border: "none", color: SAND, fontSize: 28, cursor: "pointer" }}>✕</button>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 16, overflow: "hidden" }}>
          <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} allow="autoplay; fullscreen" allowFullScreen/>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function ActivationPage(props: ActivationPageProps) {
  const { title, cat, catColor, tagline, heroImg, galleryImgs, videoId, about, includes, capacity, duration, pricing, parentHref, parentLabel, stats } = props;
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const allImgs = Array.isArray(galleryImgs) && galleryImgs.length ? galleryImgs : [heroImg];

  return (
    <div style={{ fontFamily: "'Barlow',sans-serif", background: NAVY, color: SAND }}>
      <SiteNav/>
      {videoOpen && videoId && <VideoModal videoId={videoId} onClose={() => setVideoOpen(false)}/>}

      {/* Breadcrumb */}
      <div style={{ paddingTop: 88, padding: "88px 2.5rem 0" }}>
        <Link href={parentHref} style={{ fontSize: 12, color: DIM, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>← {parentLabel}</Link>
      </div>

      {/* Hero + Sidebar layout */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 2.5rem 0", display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "2rem", alignItems: "start" }}>

        {/* Left: images */}
        <div>
          {/* Main image */}
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", height: 460, marginBottom: "0.75rem" }}>
            <img src={allImgs[activeImg]} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,22,35,0.6) 0%, transparent 60%)" }}/>
            {videoId && (
              <button onClick={() => setVideoOpen(true)} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.5)", backdropFilter: "blur(8px)", cursor: "pointer", fontSize: 20, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${catColor}CC`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)"; }}>
                ▶
              </button>
            )}
            <div style={{ position: "absolute", bottom: 16, left: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 100, border: `0.5px solid ${catColor}60`, color: catColor, background: "rgba(15,22,35,0.75)" }}>{cat}</span>
            </div>
          </div>
          {/* Thumbnails */}
          {allImgs.length > 1 && (
            <div style={{ display: "flex", gap: 8 }}>
              {allImgs.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{ width: 80, height: 60, borderRadius: 8, overflow: "hidden", cursor: "pointer", border: `2px solid ${activeImg === i ? catColor : "transparent"}`, transition: "border-color 0.15s", flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                </div>
              ))}
            </div>
          )}

          {/* About */}
          <div style={{ marginTop: "2.5rem" }}>
            <h2 style={{ ...DC, fontSize: 32, letterSpacing: 1, marginBottom: "1rem" }}>ABOUT THIS ACTIVATION</h2>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.8, fontWeight: 300 }}>{about}</p>
          </div>

          {/* What's included */}
          <div style={{ marginTop: "2.5rem" }}>
            <h2 style={{ ...DC, fontSize: 28, letterSpacing: 1, marginBottom: "1.25rem" }}>WHAT'S INCLUDED</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.75rem" }}>
              {includes.map(inc => (
                <div key={inc} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: NAVY_CARD, borderRadius: 10, border: BORDER }}>
                  <span style={{ color: catColor, fontSize: 14, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: MUTED, fontWeight: 400 }}>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "1rem", marginTop: "2.5rem" }}>
              {stats.map(s => (
                <div key={s.label} style={{ padding: "1.5rem", background: NAVY_CARD, borderRadius: 14, border: BORDER, textAlign: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: GRAD }}/>
                  <div style={{ ...DC, fontSize: 36, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", paddingTop: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: DIM, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: sidebar */}
        <div style={{ position: "sticky", top: 88 }}>
          <div style={{ background: NAVY_MID, borderRadius: 18, padding: "2rem", border: `0.5px solid rgba(238,240,245,0.1)`, marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: `${catColor}18`, color: catColor, border: `0.5px solid ${catColor}40` }}>{cat}</span>
            </div>
            <h1 style={{ ...DC, fontSize: "clamp(28px,3vw,40px)", lineHeight: 0.95, letterSpacing: 1, marginBottom: "0.5rem" }}>{title}</h1>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: "1.5rem", fontStyle: "italic", fontWeight: 300 }}>{tagline}</p>

            {([capacity ? ["Capacity", capacity] : null, duration ? ["Duration", duration] : null, pricing ? ["Pricing", pricing] : null] as ([string,string]|null)[]).filter((x): x is [string,string] => x !== null).map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: BORDER }}>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: DIM }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: SAND }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="#inquiry" style={{ display: "block", textAlign: "center", fontSize: 14, fontWeight: 900, fontStyle: "italic", letterSpacing: "0.06em", textTransform: "uppercase", padding: "13px", borderRadius: 100, background: GRAD, color: "#fff", fontFamily: "'Barlow Condensed',sans-serif" }}>
                Get a Quote →
              </a>
              <a href="/#contact" style={{ display: "block", textAlign: "center", fontSize: 13, fontWeight: 600, padding: "11px", borderRadius: 100, border: `0.5px solid rgba(238,240,245,0.2)`, color: MUTED }}>
                Ask a Question
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry form */}
      <section id="inquiry" style={{ padding: "6rem 2.5rem", background: NAVY_MID }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: BLUE, marginBottom: 8 }}>Book This Activation</div>
            <h2 style={{ ...DC, fontSize: "clamp(32px,4vw,52px)", lineHeight: 0.95, letterSpacing: 1 }}>HOST {title.toUpperCase()}<br/>IN YOUR CITY</h2>
          </div>
          <EventInquiryForm defaultExperience={title}/>
        </div>
      </section>

      <SiteFooter/>
    </div>
  );
}
