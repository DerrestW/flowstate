import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOutreach, businessDaysBetween } from "@/lib/email/sendOutreach";

// Daily outreach job — Vercel runs it Mon–Fri (see vercel.json). Protected by CRON_SECRET in middleware.
//
// 1. Follow-ups: anyone whose last email was the Urban Slide pitch, sent FOLLOWUP_BUSINESS_DAYS+ work days ago,
//    and who hasn't replied/unsubscribed, gets Email 2. Nobody gets the follow-up without the pitch first.
// 2. New pitches (off by default): if DAILY_PITCH_COUNT > 0, the next N "Not contacted" prospects get Email 1,
//    Parks & Rec / events people first, at most 2 per city per day.
export const maxDuration = 300;

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function titleRank(title: string) {
  const t = (title || "").toLowerCase();
  if (/park|recreat|event|tourism|visitor|main street/.test(t)) return 0;
  if (/(city|town|township|village|county) (manager|administrator)/.test(t)) return 1;
  if (/economic dev/.test(t)) return 2;
  if (/mayor/.test(t)) return 4;
  return 3;
}

export async function GET() {
  const now = new Date();
  const dow = now.getUTCDay();
  if (dow === 0 || dow === 6) return NextResponse.json({ skipped: "weekend" });

  const followupDays = Math.max(1, Number(process.env.FOLLOWUP_BUSINESS_DAYS || 4));
  const pitchCount = Math.max(0, Math.min(200, Number(process.env.DAILY_PITCH_COUNT || 0)));

  // ---- 1. Follow-ups due --------------------------------------------------
  const { data: pitched, error: e1 } = await sb
    .from("prospects")
    .select("*")
    .eq("email_status", "emailed")
    .eq("last_template", "urban_slide")
    .not("last_emailed_at", "is", null)
    .order("last_emailed_at", { ascending: true })
    .limit(1000);
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });

  const due = (pitched || [])
    .filter(p => businessDaysBetween(new Date(p.last_emailed_at), now) >= followupDays)
    .slice(0, 150);
  const followups = due.length ? await sendOutreach(sb, due, "follow_up") : { sent: 0, failed: 0, skipped: 0, errors: [] };

  // ---- 2. New pitches (opt-in) ---------------------------------------------
  let pitches: any = { sent: 0, failed: 0, skipped: 0, errors: [], note: "DAILY_PITCH_COUNT is 0 — new pitches are off" };
  if (pitchCount > 0) {
    const { data: fresh, error: e2 } = await sb
      .from("prospects")
      .select("*")
      .eq("email_status", "uncontacted")
      .order("created_at", { ascending: true })
      .limit(1000);
    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

    const perCity = new Map<string, number>();
    const picked: any[] = [];
    for (const p of [...(fresh || [])].sort((a, b) => titleRank(a.title) - titleRank(b.title))) {
      if (!p.email || !p.email.includes("@")) continue;
      const key = `${(p.city || "").toLowerCase()}|${(p.state || "").toLowerCase()}`;
      if ((perCity.get(key) || 0) >= 2) continue;
      perCity.set(key, (perCity.get(key) || 0) + 1);
      picked.push(p);
      if (picked.length >= pitchCount) break;
    }
    pitches = await sendOutreach(sb, picked, "urban_slide");
  }

  return NextResponse.json({ ranAt: now.toISOString(), followupDays, followups, pitchCount, pitches });
}
