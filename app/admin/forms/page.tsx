"use client";
import { useState, useEffect } from "react";

type Inquiry = { id:string; name:string; email:string; phone?:string; organization?:string; city:string; state:string; event_date?:string; expected_attendance?:number; budget_range?:string; message?:string; experience_interest?:string[]; status:string; notes?:string; created_at:string; };

const GRAD = "linear-gradient(90deg, #2196F3 0%, #8B3CF7 50%, #FF6B2B 100%)";
const BLUE = "#2196F3";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: "#E3F2FD", text: "#1565C0" },
  contacted: { bg: "#E8EAF6", text: "#283593" },
  proposal_sent: { bg: "#FFF8E1", text: "#F57F17" },
  closed_won: { bg: "#E8F5E9", text: "#1B5E20" },
  closed_lost: { bg: "#FFEBEE", text: "#B71C1C" },
};

const STATUSES = ["new", "contacted", "proposal_sent", "closed_won", "closed_lost"];

export default function FormEntriesPage() {
  const [entries, setEntries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "attendance">("newest");
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  const D: React.CSSProperties = { fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", fontWeight: 900 };
  const input: React.CSSProperties = { width: "100%", padding: "9px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid rgba(6,7,8,0.15)", background: "#F8F6F2", fontFamily: "'Barlow',sans-serif", outline: "none" };

  useEffect(() => { load(); }, []);

  async function load() {
    const r = await fetch("/api/inquiries"); const data = await r.json();
    setEntries(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    /* TODO: use API */
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  }

  async function saveNotes(id: string) {
    setSaving(true);
    /* TODO: use API */
    setEntries(prev => prev.map(e => e.id === id ? { ...e, notes } : e));
    setSaving(false);
  }

  async function deleteEntry(id: string) {
    if (!confirm("Delete this form entry permanently?")) return;
    /* TODO: use API */
    setEntries(prev => prev.filter(e => e.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function exportCSV() {
    const headers = ["Name", "Email", "Phone", "Organization", "City", "State", "Event Date", "Attendance", "Budget", "Experiences", "Message", "Status", "Submitted"];
    const rows = filtered.map(e => [
      e.name, e.email, e.phone || "", e.organization || "",
      e.city, e.state, e.event_date || "", e.expected_attendance || "",
      e.budget_range || "", (e.experience_interest || []).join("; "),
      (e.message || "").replace(/,/g, ";"), e.status,
      new Date(e.created_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `flowstate-entries-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  let filtered = entries
    .filter(e => statusFilter === "all" || e.status === statusFilter)
    .filter(e => !search || [e.name, e.email, e.city, e.organization, e.state].some(f => f?.toLowerCase().includes(search.toLowerCase())));

  if (sortBy === "oldest") filtered = [...filtered].reverse();
  if (sortBy === "attendance") filtered = [...filtered].sort((a, b) => (b.expected_attendance || 0) - (a.expected_attendance || 0));

  const newCount = entries.filter(e => e.status === "new").length;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* LIST PANEL */}
      <div style={{ flex: selected ? "0 0 58%" : "1", borderRight: "0.5px solid rgba(6,7,8,0.1)", overflow: "auto", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "1.75rem 2rem 1rem", background: "#F0EDE8", borderBottom: "0.5px solid rgba(6,7,8,0.08)", flexShrink: 0, position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: BLUE, marginBottom: 4 }}>Contact Form</div>
              <h1 style={{ ...D, fontSize: 32, letterSpacing: 1 }}>FORM ENTRIES</h1>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {newCount > 0 && (
                <div style={{ fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 100, background: "#E3F2FD", color: BLUE }}>
                  {newCount} new
                </div>
              )}
              <button onClick={exportCSV} style={{ fontSize: 12, fontWeight: 600, padding: "8px 18px", borderRadius: 100, border: "0.5px solid rgba(6,7,8,0.2)", background: "#fff", cursor: "pointer", fontFamily: "'Barlow',sans-serif" }}>
                Export CSV ↓
              </button>
            </div>
          </div>

          {/* Search + filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, city, email..."
              style={{ ...input, flex: 1, minWidth: 200, background: "#fff" }}
            />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...input, width: "auto", cursor: "pointer" }}>
              <option value="all">All statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ ...input, width: "auto", cursor: "pointer" }}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="attendance">By attendance</option>
            </select>
          </div>

          {/* Count */}
          <div style={{ fontSize: 11, color: "rgba(6,7,8,0.4)", marginTop: 10, fontWeight: 500 }}>
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"} {statusFilter !== "all" ? `· ${statusFilter.replace("_", " ")}` : ""} {search ? `· "${search}"` : ""}
          </div>
        </div>

        {/* Entries list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ ...D, fontSize: 28, letterSpacing: 1, background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", padding: "4rem 2rem", textAlign: "center" }}>
              LOADING...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <div style={{ ...D, fontSize: 24, color: "rgba(6,7,8,0.2)", marginBottom: 8 }}>NO ENTRIES FOUND</div>
              <div style={{ fontSize: 13, color: "rgba(6,7,8,0.35)" }}>
                {entries.length === 0 ? "Form submissions will appear here." : "Try adjusting your search or filter."}
              </div>
            </div>
          ) : (
            filtered.map((entry, i) => {
              const sc = STATUS_COLORS[entry.status] || STATUS_COLORS.new;
              const isSelected = selected?.id === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => { setSelected(isSelected ? null : entry); setNotes(entry.notes || ""); }}
                  style={{ padding: "1.25rem 2rem", cursor: "pointer", background: isSelected ? "#fff" : i % 2 === 0 ? "transparent" : "rgba(6,7,8,0.015)", borderBottom: "0.5px solid rgba(6,7,8,0.06)", transition: "background 0.1s" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {/* Avatar initials */}
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                          {entry.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{entry.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(6,7,8,0.45)" }}>{entry.organization || entry.email}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, background: sc.bg, color: sc.text, fontWeight: 700, textTransform: "capitalize" }}>
                        {entry.status.replace("_", " ")}
                      </span>
                      <span style={{ fontSize: 11, color: "rgba(6,7,8,0.3)" }}>
                        {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", paddingLeft: 44 }}>
                    <span style={{ fontSize: 12, color: "rgba(6,7,8,0.55)" }}>📍 {entry.city}, {entry.state}</span>
                    {entry.expected_attendance && <span style={{ fontSize: 12, color: "rgba(6,7,8,0.55)" }}>👥 {Number(entry.expected_attendance).toLocaleString()}</span>}
                    {entry.budget_range && <span style={{ fontSize: 12, color: "rgba(6,7,8,0.55)" }}>💰 {entry.budget_range}</span>}
                    {entry.event_date && <span style={{ fontSize: 12, color: "rgba(6,7,8,0.55)" }}>📅 {entry.event_date}</span>}
                  </div>

                  {(entry.experience_interest?.length ?? 0) > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", paddingLeft: 44, marginTop: 6 }}>
                      {(entry.experience_interest||[]).slice(0, 4).map(e => (
                        <span key={e} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "rgba(33,150,243,0.08)", color: BLUE, fontWeight: 600, border: "0.5px solid rgba(33,150,243,0.2)" }}>{e}</span>
                      ))}
                      {(entry.experience_interest||[]).length > 4 && <span style={{ fontSize: 10, color: "rgba(6,7,8,0.35)" }}>+{(entry.experience_interest||[]).length - 4} more</span>}
                    </div>
                  )}

                  {entry.message && !isSelected && (
                    <div style={{ paddingLeft: 44, marginTop: 6, fontSize: 12, color: "rgba(6,7,8,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
                      "{entry.message}"
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DETAIL PANEL */}
      {selected && (
        <div style={{ flex: "0 0 42%", overflow: "auto", background: "#fff", display: "flex", flexDirection: "column" }}>
          {/* Detail header */}
          <div style={{ padding: "1.5rem", borderBottom: "0.5px solid rgba(6,7,8,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                  {selected.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: 11, color: "rgba(6,7,8,0.4)" }}>{selected.organization || "No org listed"}</div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "rgba(6,7,8,0.35)", padding: 4 }}>✕</button>
          </div>

          <div style={{ padding: "1.5rem", flex: 1, overflow: "auto" }}>
            {/* Status pipeline */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 8 }}>Pipeline Status</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {STATUSES.map(s => {
                  const sc = STATUS_COLORS[s];
                  const active = selected.status === s;
                  return (
                    <button key={s} onClick={() => updateStatus(selected.id, s)} style={{ fontSize: 11, padding: "6px 14px", borderRadius: 100, cursor: "pointer", background: active ? sc.bg : "transparent", color: active ? sc.text : "rgba(6,7,8,0.4)", border: `0.5px solid ${active ? sc.text + "50" : "rgba(6,7,8,0.15)"}`, fontFamily: "'Barlow',sans-serif", fontWeight: active ? 700 : 400, textTransform: "capitalize", transition: "all 0.15s" }}>
                      {s.replace("_", " ")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {[
                ["Email", selected.email, `mailto:${selected.email}`],
                ["Phone", selected.phone || "—", selected.phone ? `tel:${selected.phone}` : null],
                ["City", `${selected.city}, ${selected.state}`, null],
                ["Organization", selected.organization || "—", null],
                ["Event Date", selected.event_date || "—", null],
                ["Est. Attendance", selected.expected_attendance ? Number(selected.expected_attendance).toLocaleString() : "—", null],
                ["Budget Range", selected.budget_range || "—", null],
                ["Submitted", new Date(selected.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), null],
              ].map(([label, value, href]) => (
                <div key={label as string} style={{ padding: "0.75rem", background: "rgba(6,7,8,0.03)", borderRadius: 8 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 4 }}>{label}</div>
                  {href ? (
                    <a href={href as string} style={{ fontSize: 13, fontWeight: 600, color: BLUE, wordBreak: "break-all" }}>{value}</a>
                  ) : (
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{value as string}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Experiences requested */}
            {(selected.experience_interest?.length ?? 0) > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 8 }}>Requested Experiences</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(selected.experience_interest||[]).map(e => (
                    <span key={e} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 100, background: "rgba(33,150,243,0.08)", color: BLUE, fontWeight: 600, border: "0.5px solid rgba(33,150,243,0.2)" }}>{e}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            {selected.message && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 8 }}>Their Message</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(6,7,8,0.65)", padding: "1rem", background: "rgba(6,7,8,0.03)", borderRadius: 8, borderLeft: "3px solid #2196F3" }}>
                  {selected.message}
                </p>
              </div>
            )}

            {/* Internal notes */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(6,7,8,0.35)", marginBottom: 8 }}>Internal Notes</div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add your notes about this lead..."
                style={{ width: "100%", minHeight: 100, padding: "10px 12px", fontSize: 13, borderRadius: 8, border: "0.5px solid rgba(6,7,8,0.15)", background: "#FAFAF9", resize: "vertical", fontFamily: "'Barlow',sans-serif", lineHeight: 1.6, outline: "none" }}
              />
              <button
                onClick={() => saveNotes(selected.id)}
                disabled={saving}
                style={{ marginTop: 8, fontSize: 12, fontWeight: 600, padding: "8px 20px", borderRadius: 100, background: saving ? "rgba(6,7,8,0.2)" : "#04080F", color: "#F8F6F2", border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "'Barlow',sans-serif" }}
              >
                {saving ? "Saving..." : "Save Notes"}
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, paddingTop: "1.25rem", borderTop: "0.5px solid rgba(6,7,8,0.08)" }}>
              <a
                href={`mailto:${selected.email}?subject=FlowState Experiences — Your Event Inquiry`}
                style={{ flex: 1, fontSize: 13, fontWeight: 700, padding: "11px", borderRadius: 100, background: GRAD, color: "#fff", textAlign: "center", textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontStyle: "italic", letterSpacing: 0.5 }}
              >
                REPLY VIA EMAIL →
              </a>
              <button
                onClick={() => deleteEntry(selected.id)}
                style={{ fontSize: 12, padding: "11px 18px", borderRadius: 100, background: "#FFEBEE", color: "#B71C1C", border: "0.5px solid #FFCDD2", cursor: "pointer", fontFamily: "'Barlow',sans-serif", fontWeight: 600 }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
