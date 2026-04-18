"use client";
import { useState, useEffect } from "react";

type Inquiry = { id:string; name:string; email:string; phone?:string; organization?:string; city:string; state:string; event_date?:string; expected_attendance?:number; budget_range?:string; message?:string; experience_interest?:string[]; status:string; notes?:string; created_at:string; };

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: "#E3F2FD", text: "#1565C0" },
  contacted: { bg: "#E6F1FB", text: "#185FA5" },
  proposal_sent: { bg: "#FAEEDA", text: "#854F0B" },
  closed_won: { bg: "#E1F5EE", text: "#1565C0" },
  closed_lost: { bg: "#FCEBEB", text: "#A32D2D" },
};

const STATUSES = ["new", "contacted", "proposal_sent", "closed_won", "closed_lost"];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    const r = await fetch("/api/inquiries"); const data = await r.json();
    setInquiries(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    /* TODO: use API */
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  }

  async function saveNotes(id: string) {
    setSaving(true);
    /* TODO: use API */
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, notes } : i));
    setSaving(false);
  }

  const filtered = filter === "all" ? inquiries : inquiries.filter(i => i.status === filter);
  const D: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900 };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* List */}
      <div style={{ flex: selected ? "0 0 55%" : "1", borderRight: "0.5px solid rgba(6,7,8,0.1)", overflow: "auto" }}>
        <div style={{ padding: "2rem 1.5rem", borderBottom: "0.5px solid rgba(6,7,8,0.08)", background: "#F0EDE8", position: "sticky", top: 0, zIndex: 10 }}>
          <h1 style={{ ...D, fontSize: 36, letterSpacing: 1, marginBottom: "1rem" }}>INQUIRIES</h1>
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {["all", ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                fontSize: 11, padding: "5px 12px", borderRadius: 100, border: "0.5px solid",
                cursor: "pointer", fontFamily: "inherit",
                background: filter === s ? "#060708" : "transparent",
                borderColor: filter === s ? "#060708" : "rgba(6,7,8,0.2)",
                color: filter === s ? "#F9F7F3" : "rgba(6,7,8,0.5)",
                textTransform: "capitalize",
              }}>{s.replace("_", " ")} {filter !== s && s !== "all" && `(${inquiries.filter(i => i.status === s).length})`}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900, fontSize: 28, letterSpacing: 1, background: "linear-gradient(90deg,#2196F3,#FF6B2B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", padding: "3rem 2rem", textAlign: "center" }}>LOADING...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "rgba(6,7,8,0.35)" }}>No inquiries found.</div>
        ) : (
          filtered.map(inq => {
            const sc = STATUS_COLORS[inq.status] || STATUS_COLORS.new;
            const isSelected = selected?.id === inq.id;
            return (
              <div key={inq.id} onClick={() => { setSelected(isSelected ? null : inq); setNotes(inq.notes || ""); }} style={{
                padding: "1.25rem 1.5rem", cursor: "pointer",
                background: isSelected ? "#fff" : "transparent",
                borderBottom: "0.5px solid rgba(6,7,8,0.06)",
                transition: "background 0.15s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{inq.name}</span>
                    {inq.organization && <span style={{ fontSize: 12, color: "rgba(6,7,8,0.4)", marginLeft: 8 }}>{inq.organization}</span>}
                  </div>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: sc.bg, color: sc.text, fontWeight: 500, flexShrink: 0 }}>{inq.status?.replace("_", " ")}</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(6,7,8,0.5)", marginBottom: 4 }}>
                  {inq.city}, {inq.state} · {inq.experience_interest?.join(", ") || "No experience selected"}
                </div>
                <div style={{ fontSize: 12, color: "rgba(6,7,8,0.3)" }}>
                  {new Date(inq.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {inq.expected_attendance && ` · Est. ${inq.expected_attendance.toLocaleString()} attendees`}
                  {inq.budget_range && ` · ${inq.budget_range}`}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ flex: "0 0 45%", overflow: "auto", background: "#fff", padding: "2rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: 18, fontWeight: 500 }}>{selected.name}</h2>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "rgba(6,7,8,0.4)" }}>✕</button>
          </div>

          {/* Status update */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 8 }}>Status</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {STATUSES.map(s => {
                const sc = STATUS_COLORS[s];
                const active = selected.status === s;
                return (
                  <button key={s} onClick={() => updateStatus(selected.id, s)} style={{
                    fontSize: 11, padding: "5px 12px", borderRadius: 100, cursor: "pointer",
                    background: active ? sc.bg : "transparent",
                    color: active ? sc.text : "rgba(6,7,8,0.4)",
                    border: `0.5px solid ${active ? sc.text + "40" : "rgba(6,7,8,0.15)"}`,
                    fontFamily: "inherit", fontWeight: active ? 500 : 400,
                    textTransform: "capitalize",
                  }}>{s.replace("_", " ")}</button>
                );
              })}
            </div>
          </div>

          {/* Details grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Email", value: selected.email },
              { label: "Phone", value: selected.phone || "—" },
              { label: "Organization", value: selected.organization || "—" },
              { label: "Location", value: `${selected.city}, ${selected.state}` },
              { label: "Event Date", value: selected.event_date || "—" },
              { label: "Attendance", value: selected.expected_attendance ? selected.expected_attendance.toLocaleString() : "—" },
              { label: "Budget", value: selected.budget_range || "—" },
              { label: "Submitted", value: new Date(selected.created_at).toLocaleDateString() },
            ].map(f => (
              <div key={f.label} style={{ padding: "0.75rem", background: "rgba(6,7,8,0.03)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{f.value}</div>
              </div>
            ))}
          </div>

          {/* Experiences */}
          {(selected.experience_interest?.length ?? 0) > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 8 }}>Experiences Interested In</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(selected.experience_interest||[]).map(e => (
                  <span key={e} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 100, background: "#E3F2FD", color: "#1565C0", border: "0.5px solid #90CAF9" }}>{e}</span>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          {selected.message && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 8 }}>Their Message</div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(6,7,8,0.7)", padding: "1rem", background: "rgba(6,7,8,0.03)", borderRadius: 8, borderLeft: "2px solid rgba(6,7,8,0.1)" }}>{selected.message}</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 8 }}>Internal Notes</div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this inquiry..."
              style={{ width: "100%", minHeight: 100, padding: "10px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid rgba(6,7,8,0.15)", background: "#F8F6F2", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, outline: "none" }}
            />
            <button onClick={() => saveNotes(selected.id)} disabled={saving} style={{
              marginTop: 8, fontSize: 12, fontWeight: 500, padding: "8px 20px", borderRadius: 100,
              background: "#060708", color: "#F9F7F3", border: "none", cursor: "pointer", fontFamily: "inherit",
            }}>{saving ? "Saving..." : "Save Notes"}</button>
          </div>

          {/* Email link */}
          <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "0.5px solid rgba(6,7,8,0.08)" }}>
            <a href={`mailto:${selected.email}?subject=FlowState Experiences — Your Inquiry`} style={{
              fontSize: 13, fontWeight: 500, padding: "10px 24px", borderRadius: 100,
              background: "#2196F3", color: "#060708", display: "inline-block",
            }}>Reply via Email →</a>
          </div>
        </div>
      )}
    </div>
  );
}
