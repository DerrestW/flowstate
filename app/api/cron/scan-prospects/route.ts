import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Cities to scan on rotation — add more as you expand
const TARGET_CITIES = [
  { city: "Hampton", state: "VA" },
  { city: "Austin", state: "TX" },
  { city: "Houston", state: "TX" },
  { city: "Dallas", state: "TX" },
  { city: "San Antonio", state: "TX" },
  { city: "Charlotte", state: "NC" },
  { city: "Nashville", state: "TN" },
  { city: "Atlanta", state: "GA" },
  { city: "Jacksonville", state: "FL" },
  { city: "Tampa", state: "FL" },
  { city: "Orlando", state: "FL" },
  { city: "Memphis", state: "TN" },
  { city: "Louisville", state: "KY" },
  { city: "Columbus", state: "OH" },
  { city: "Indianapolis", state: "IN" },
  { city: "Kansas City", state: "MO" },
  { city: "Oklahoma City", state: "OK" },
  { city: "New Orleans", state: "LA" },
  { city: "Richmond", state: "VA" },
  { city: "Raleigh", state: "NC" },
];

export async function GET(req: NextRequest) {
  // Verify this is called by Vercel Cron (or our secret)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Pick 2 cities to scan today (rotate through the list)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const startIdx = (dayOfYear * 2) % TARGET_CITIES.length;
  const citiesToScan = [
    TARGET_CITIES[startIdx],
    TARGET_CITIES[(startIdx + 1) % TARGET_CITIES.length],
  ];

  const results = [];
  for (const target of citiesToScan) {
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://cityactivations.com"}/api/prospects/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      });
      const result = await r.json();
      results.push({ ...target, ...result });

      // Log the scan
      try {
        await sb.from("prospect_scans").insert({
          city: target.city,
          state: target.state,
          contacts_found: result.found || 0,
          contacts_saved: result.saved || 0,
          scanned_at: new Date().toISOString(),
        });
      } catch {} // table might not exist yet, ignore

    } catch (e: any) {
      results.push({ ...target, error: e.message });
    }
  }

  return NextResponse.json({ success: true, scanned: citiesToScan, results });
}
