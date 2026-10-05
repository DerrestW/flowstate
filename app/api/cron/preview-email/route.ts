import { NextResponse } from "next/server";
import { Resend } from "resend";
import { urbanSlidePitch, urbanSlideFollowUp } from "@/lib/email/urbanSlide";

// Sends the current outreach emails to the admin's own inbox (ADMIN_NOTIFY_EMAIL) only.
// Protected by middleware: requires CRON_SECRET bearer token or an admin login.
export async function POST() {
  const to = process.env.ADMIN_NOTIFY_EMAIL || "derrestwilliams@gmail.com";
  const from = `Derrest Williams | FlowState Experiences <${process.env.RESEND_FROM_EMAIL || "derrest@cityactivations.com"}>`;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const sample = { name: "Derrest Williams", city: "San Marcos", state: "TX" };
  const results: Record<string, string> = {};
  for (const [label, email] of [["pitch", urbanSlidePitch(sample)], ["follow_up", urbanSlideFollowUp(sample)]] as const) {
    const { error } = await resend.emails.send({
      from, to, replyTo: process.env.RESEND_FROM_EMAIL || "derrest@cityactivations.com",
      subject: `[PREVIEW] ${email.subject}`, html: email.html, text: email.text,
    });
    results[label] = error ? `failed: ${error.message}` : "sent";
  }
  return NextResponse.json({ to, results });
}
