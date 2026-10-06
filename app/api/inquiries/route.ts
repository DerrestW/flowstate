import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------------------------------------------------------------
// Bot protection for the public contact form
//   1. Honeypot field ("website") — hidden from humans
//   2. Time trap — real people take more than a few seconds to fill the form
//   3. Per-IP rate limit
//   4. Content checks — link-stuffed or non-text spam is dropped
// Bots that trip 1, 2 or 4 get a fake "success" so they don't learn to adapt.
// ---------------------------------------------------------------------------

const MIN_FILL_MS = 3000;
const RATE_LIMIT = 5;                 // submissions…
const RATE_WINDOW_MS = 60 * 60 * 1000; // …per hour per IP
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > RATE_LIMIT;
}

const BUDGETS = new Set(["Under $25K", "$25K–$50K", "$50K–$100K", "$100K+"]);
const STATES = new Set("AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" "));
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i;

function clean(v: unknown, max: number): string {
  // strip control characters, collapse whitespace, cap length
  return String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

function looksLikeSpam(fields: string[], message: string): boolean {
  const links = (message.match(/https?:\/\/|www\./gi) || []).length;
  if (links > 2) return true;
  if (fields.some(f => /https?:\/\/|www\.|<a\s|\[url/i.test(f))) return true; // links in name/city/org
  if (/\[url=|<a\s+href/i.test(message)) return true;
  return false;
}

function esc(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

async function sendEmailNotification(inquiry: Record<string, unknown>) {
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL || "derrestwilliams@gmail.com";
  const fromEmail = process.env.INQUIRY_FROM_EMAIL || "FlowState Inquiries <inquiries@cityactivations.com>";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://cityactivations.com").trim().replace(/\/+$/, "");
  if (!resendKey) return;

  const experiencesList = (inquiry.experience_interest as string[] || []).join(", ") || "Not specified";
  const rows = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone || "—"],
    ["Organization", inquiry.organization || "—"],
    ["Location", `${inquiry.city}, ${inquiry.state}`],
    ["Event Date", inquiry.event_date || "—"],
    ["Budget", inquiry.budget_range || "—"],
    ["Interested In", experiencesList],
  ] as [string, unknown][];

  const tableRows = rows.map(([label, value]) =>
    `<tr><td style="padding:8px 0;color:rgba(238,240,245,0.45);font-size:11px;text-transform:uppercase;letter-spacing:.08em;width:140px;vertical-align:top;">${label}</td><td style="padding:8px 0;color:#EEF0F5;font-weight:500;">${esc(value)}</td></tr>`
  ).join("");

  const messageBlock = inquiry.message
    ? `<div style="margin-top:20px;padding:16px;background:rgba(238,240,245,0.06);border-radius:8px;border-left:3px solid #2196F3;"><p style="margin:0;color:rgba(238,240,245,0.8);font-size:14px;line-height:1.6;white-space:pre-wrap;">${esc(inquiry.message)}</p></div>`
    : "";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(90deg,#2196F3,#FF6B2B);padding:3px;border-radius:8px 8px 0 0;"></div>
      <div style="background:#0F1623;padding:32px;border-radius:0 0 8px 8px;color:#EEF0F5;">
        <h2 style="margin:0 0 4px;font-size:24px;font-style:italic;">NEW INQUIRY</h2>
        <p style="color:rgba(238,240,245,0.5);margin:0 0 24px;font-size:13px;">FlowState Experiences — submitted via website</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">${tableRows}</table>
        ${messageBlock}
        <div style="margin-top:24px;padding-top:20px;border-top:.5px solid rgba(238,240,245,0.1);">
          <a href="${siteUrl}/admin/forms" style="display:inline-block;padding:12px 28px;background:linear-gradient(90deg,#2196F3,#FF6B2B);color:#fff;text-decoration:none;border-radius:100px;font-size:13px;font-weight:700;">View in Admin</a>
        </div>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to: [notifyEmail],
        reply_to: inquiry.email as string,
        subject: `New Inquiry: ${inquiry.name} — ${inquiry.city}, ${inquiry.state}`,
        html,
      }),
    });
    if (!res.ok) console.error("Resend error:", res.status, await res.text());
  } catch (err) {
    console.error("Email send error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // 1. Honeypot  2. Time trap → pretend success, store nothing
    const elapsed = Number(body.elapsed_ms);
    if (body.website || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
      return NextResponse.json({ success: true });
    }

    const name = clean(body.name, 100);
    const email = clean(body.email, 200).toLowerCase();
    const phone = clean(body.phone, 30);
    const organization = clean(body.organization, 200);
    const city = clean(body.city, 100);
    const state = clean(body.state, 2).toUpperCase();
    const message = clean(body.message, 2000);
    const event_date = /^\d{4}-\d{2}-\d{2}$/.test(String(body.event_date || "")) ? String(body.event_date) : null;
    const budget_range = BUDGETS.has(String(body.budget_range)) ? String(body.budget_range) : null;
    const experience_interest = Array.isArray(body.experience_interest)
      ? body.experience_interest.slice(0, 20).map((x: unknown) => clean(x, 60)).filter(Boolean)
      : [];

    if (!name || !email || !city || !state) {
      return NextResponse.json({ error: "Please fill in your name, email, city and state." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
    }
    if (!STATES.has(state)) {
      return NextResponse.json({ error: "Please choose a state." }, { status: 400 });
    }
    if (phone && !/^[\d\s()+.\-x]{7,30}$/i.test(phone)) {
      return NextResponse.json({ error: "That phone number doesn't look right." }, { status: 400 });
    }

    // 4. Content checks → pretend success, store nothing
    if (looksLikeSpam([name, city, organization], message)) {
      return NextResponse.json({ success: true });
    }

    const inquiry = {
      name, email,
      phone: phone || null,
      organization: organization || null,
      city, state, event_date, budget_range,
      message: message || null,
      experience_interest,
      status: "new",
    };

    const { data, error } = await supabase.from("inquiries").insert(inquiry).select().single();
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "We couldn't save your inquiry." }, { status: 500 });
    }

    await sendEmailNotification(inquiry);

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Inquiry error:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await supabase
    .from("inquiries")
    .update(updates)
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
