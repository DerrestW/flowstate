"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase, Experience } from "@/lib/supabase";
import { useParams } from "next/navigation";

const CAT_COLORS: Record<string, string> = { water: "#4ECBA0", run: "#E86B9A", rental: "#F4A460", event: "#7B9EE8", logistics: "#9B87F5" };

export default function ExperiencePage() {
  const params = useParams();
  const [exp, setExp] = useState<Experience | null>(null);
  const [related, setRelated] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("experiences").select("*").eq("slug", params.slug).single();
      setExp(data);
      if (data) {
        const { data: rel } = await supabase.from("experiences").select("*").eq("category", data.category).neq("id", data.id).eq("published", true).limit(3);
        setRelated(rel || []);
      }
      setLoading(false);
    }
    load();
  }, [params.slug]);

  const D: React.CSSProperties = { fontFamily: "'Bebas Neue', cursive" };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#060708", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...D, fontSize: 32, color: "#4ECBA0", letterSpacing: 2 }}>LOADING...</div>
    </div>
  );

  if (!exp) return (
    <div style={{ minHeight: "100vh", background: "#060708", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
      <div style={{ ...D, fontSize: 48, color: "#F9F7F3", letterSpacing: 2 }}>404</div>
      <Link href="/" style={{ color: "#4ECBA0" }}>← Back to FlowState</Link>
    </div>
  );

  const color = CAT_COLORS[exp.category] || "#4ECBA0";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#060708", color: "#F9F7F3" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0} a{text-decoration:none;color:inherit}`}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2.5rem", height: 68, background: "rgba(6,7,8,0.96)", backdropFilter: "blur(12px)", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
        <Link href="/" style={{ ...D, fontSize: 22, letterSpacing: 2 }}>FLOW<span style={{ color: "#4ECBA0" }}>STATE</span></Link>
        <Link href="/#contact" style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "9px 22px", borderRadius: 100, background: "#4ECBA0", color: "#060708" }}>Get a Quote</Link>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 68, minHeight: "55vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "68px 2.5rem 5rem", background: `linear-gradient(160deg, ${color}08 0%, #060708 60%)`, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(78,203,160,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(78,203,160,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 800 }}>
          <Link href="/#experiences" style={{ fontSize: 12, color: "rgba(249,247,243,0.35)", letterSpacing: "0.06em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: "2rem" }}>← All Activations</Link>
          <div style={{ display: "inline-flex", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 100, border: `0.5px solid ${color}40`, color, marginBottom: "1.25rem" }}>{exp.category}</div>
          <h1 style={{ ...D, fontSize: "clamp(56px, 8vw, 100px)", lineHeight: 0.95, letterSpacing: 2, marginBottom: "1.25rem" }}>{exp.title.toUpperCase()}</h1>
          <p style={{ fontSize: 20, fontWeight: 300, color: "rgba(249,247,243,0.55)", maxWidth: 540, lineHeight: 1.65 }}>{exp.tagline}</p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "5rem 2.5rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "5rem" }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 300, color: "rgba(249,247,243,0.75)", lineHeight: 1.8, marginBottom: "3rem" }}>
              {exp.long_description || exp.description}
            </p>
            {/* What's included */}
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{ ...D, fontSize: 32, letterSpacing: 1, marginBottom: "1.5rem" }}>WHAT'S INCLUDED</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {["Full permitting support", "Traffic control", "Day-of operations crew", "Insurance documentation", "Site plan design", "Equipment & transport", "Safety staff", "Post-event recap"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(249,247,243,0.7)", padding: "10px 0", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ color, fontSize: 16, flexShrink: 0 }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ background: "#0D0F11", borderRadius: 16, padding: "2rem", border: "0.5px solid rgba(255,255,255,0.07)", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(249,247,243,0.35)", marginBottom: "1.25rem" }}>Quick Facts</div>
              {[
                { label: "Starting at", value: exp.price_starting ? `$${exp.price_starting.toLocaleString()} ${exp.price_unit}` : "Custom quote" },
                { label: "Duration", value: exp.duration || "4–8 hours typical" },
                { label: "Capacity", value: exp.capacity_min && exp.capacity_max ? `${exp.capacity_min.toLocaleString()}–${exp.capacity_max.toLocaleString()} people` : "Scales to your event" },
                { label: "Category", value: exp.category.charAt(0).toUpperCase() + exp.category.slice(1) },
              ].map(f => (
                <div key={f.label} style={{ padding: "0.875rem 0", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, color: "rgba(249,247,243,0.35)", marginBottom: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>{f.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{f.value}</div>
                </div>
              ))}
            </div>

            <Link href="/#contact" style={{
              display: "block", textAlign: "center", fontSize: 13, fontWeight: 500,
              letterSpacing: "0.06em", textTransform: "uppercase",
              padding: "16px", borderRadius: 100, background: "#4ECBA0", color: "#060708",
            }}>Get a Quote for This →</Link>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: "4rem 2.5rem", borderTop: "0.5px solid rgba(255,255,255,0.06)", maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ ...D, fontSize: 32, letterSpacing: 1, marginBottom: "2rem" }}>RELATED ACTIVATIONS</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {related.map(r => (
              <Link key={r.id} href={`/experiences/${r.slug}`} style={{ background: "#0D0F11", borderRadius: 12, padding: "1.5rem", border: "0.5px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: CAT_COLORS[r.category] || color, marginBottom: 8 }}>{r.category}</div>
                <div style={{ ...D, fontSize: 22, letterSpacing: 1, marginBottom: 6 }}>{r.title}</div>
                <div style={{ fontSize: 13, color: "rgba(249,247,243,0.4)", lineHeight: 1.6 }}>{r.tagline}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ padding: "2.5rem", borderTop: "0.5px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ ...D, fontSize: 18, letterSpacing: 2 }}>FLOW<span style={{ color: "#4ECBA0" }}>STATE</span></Link>
        <div style={{ fontSize: 12, color: "rgba(249,247,243,0.25)" }}>© 2025 FlowState Experiences LLC</div>
      </footer>
    </div>
  );
}
