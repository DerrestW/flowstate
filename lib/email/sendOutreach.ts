// Shared outreach sender used by the admin "Send" button and the daily cron.
import { Resend } from "resend";
import type { SupabaseClient } from "@supabase/supabase-js";
import { urbanSlidePitch, urbanSlideFollowUp } from "@/lib/email/urbanSlide";

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "derrest@cityactivations.com";
export const FROM_NAME = "Derrest Williams | FlowState Experiences";

// Statuses that must never receive another email
export const DO_NOT_EMAIL = ["unsubscribed", "bounced", "replied", "not_interested", "meeting", "closed"];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Resend tag values may only contain ASCII letters, numbers, underscores and dashes
export function tagValue(v: unknown) {
  return String(v ?? "").normalize("NFKD").replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 256) || "none";
}

export type OutreachTemplate = "urban_slide" | "follow_up";

export function renderOutreach(template: OutreachTemplate, prospect: any) {
  return template === "follow_up" ? urbanSlideFollowUp(prospect) : urbanSlidePitch(prospect);
}

/** Business days (Mon–Fri) elapsed between two dates. */
export function businessDaysBetween(from: Date, to: Date) {
  let days = 0;
  const d = new Date(from);
  d.setUTCHours(12, 0, 0, 0);
  const end = new Date(to);
  end.setUTCHours(12, 0, 0, 0);
  while (d < end) {
    d.setUTCDate(d.getUTCDate() + 1);
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) days++;
  }
  return days;
}

/**
 * Sends one outreach template to each prospect, pacing under Resend's rate limit,
 * and records what was sent. Skips anyone who shouldn't get this email.
 */
export async function sendOutreach(
  sb: SupabaseClient,
  prospects: any[],
  template: OutreachTemplate,
  render: (p: any) => { subject: string; html: string; text?: string } = p => renderOutreach(template, p),
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const results = { sent: 0, failed: 0, skipped: 0, errors: [] as string[] };

  for (const prospect of prospects) {
    const status = String(prospect.email_status || "uncontacted");
    const alreadyPitched = status !== "uncontacted";
    const alreadyFollowedUp = prospect.last_template === "follow_up";
    if (
      !prospect.email || DO_NOT_EMAIL.includes(status) ||
      (template === "urban_slide" && alreadyPitched) ||
      (template === "follow_up" && (!alreadyPitched || alreadyFollowedUp))
    ) {
      results.skipped++;
      continue;
    }
    if (results.sent + results.failed > 0) await sleep(600);

    try {
      const content = render(prospect);
      const { error } = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: prospect.email,
        replyTo: FROM_EMAIL,
        subject: content.subject,
        html: content.html,
        ...(content.text ? { text: content.text } : {}),
        headers: { "List-Unsubscribe": "<mailto:derrest@cityactivations.com?subject=Unsubscribe>" },
        tags: [
          { name: "prospect_id", value: tagValue(prospect.id) },
          { name: "template", value: tagValue(template) },
          { name: "city", value: tagValue(prospect.city) },
        ],
      });
      if (error) {
        results.failed++;
        results.errors.push(`${prospect.email}: ${error.message}`);
        continue;
      }
      results.sent++;
      await sb.from("prospects").update({
        email_status: "emailed",
        last_emailed_at: new Date().toISOString(),
        last_template: template,
        ...(template === "urban_slide" ? { open_count: 0, opened_at: null, clicked_at: null } : {}),
      }).eq("id", prospect.id);
    } catch (e: any) {
      results.failed++;
      results.errors.push(`${prospect.email}: ${e.message}`);
    }
  }
  return results;
}
