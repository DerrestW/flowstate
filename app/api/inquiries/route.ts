import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function sendEmailNotification(inquiry: Record<string, unknown>) {
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL || "derrestwilliams@gmail.com";
  if (!resendKey) return;

  const experiencesList = (inquiry.experience_interest as string[] || []).join(", ") || "Not specified";
  const rows = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone || "—"],
    ["Organization", inquiry.organization || "—"],
    ["Location", `${inquiry.city}, ${inquiry.state}`],
    ["Event Date", inquiry.event_date || "—"],
    ["Attendance", inquiry.expected_attendance ? Number(inquiry.expected_attendance).toLocaleString() : "—"],
    ["Budget", inquiry.budget_range || "—"],
    ["Experiences", experiencesList],
  ] as [string, unknown][];

  const tableRows = rows.map(([label, value]) =>
    `<tr><td style="padding:8px 0;color:rgba(238,240,245,0.45);font-size:11px;text-transform:uppercase;letter-spacing:.08em;width:140px;vertical-align:top;">${label}</td><td style="padding:8px 0;color:#EEF0F5;font-weight:500;">${value}</td></tr>`
  ).join("");

  const messageBlock = inquiry.message
    ? `<div style="margin-top:20px;padding:16px;background:rgba(238,240,245,0.06);border-radius:8px;border-left:3px solid #2196F3;"><p style="margin:0;color:rgba(238,240,245,0.8);font-size:14px;line-height:1.6;">${inquiry.message}</p></div>`
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
          <a href="https://flowstateexperiences.com/admin/forms" style="display:inline-block;padding:12px 28px;background:linear-gradient(90deg,#2196F3,#FF6B2B);color:#fff;text-decoration:none;border-radius:100px;font-size:13px;font-weight:700;">View in Admin</a>
        </div>
      </div>
    </div>
  `;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FlowState Inquiries <inquiries@flowstateexperiences.com>",
        to: [notifyEmail],
        reply_to: inquiry.email as string,
        subject: `New Inquiry: ${inquiry.name} — ${inquiry.city}, ${inquiry.state}`,
        html,
      }),
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, organization, city, state,
      event_date, expected_attendance, budget_range,
      message, experience_interest,
      website, // honeypot — bots fill this
    } = body;

    // Honeypot check — if filled, silently discard
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !city || !state) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const inquiry = {
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 200),
      phone: phone ? String(phone).slice(0, 30) : null,
      organization: organization ? String(organization).slice(0, 200) : null,
      city: String(city).slice(0, 100),
      state: String(state).slice(0, 2),
      event_date: event_date || null,
      expected_attendance: expected_attendance ? parseInt(expected_attendance) : null,
      budget_range: budget_range || null,
      message: message ? String(message).slice(0, 2000) : null,
      experience_interest: Array.isArray(experience_interest) ? experience_interest : [],
      status: "new",
    };

    const { data, error } = await supabase
      .from("inquiries")
      .insert(inquiry)
      .select()
      .single();

    if (error) console.error("Supabase error:", error);

    sendEmailNotification(inquiry).catch(console.error);

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
