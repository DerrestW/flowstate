import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APIFY_TOKEN = process.env.APIFY_API_TOKEN!;
const ABSTRACT_KEY = process.env.ABSTRACT_API_KEY;

const TARGET_TITLES = [
  "special events director","special events coordinator","director of special events",
  "parks and recreation director","parks director","event manager","city events manager",
  "procurement manager","procurement director","director of parks","recreation director",
  "festivals coordinator","community events","city manager","parks manager",
];

async function verifyEmail(email: string): Promise<"valid"|"invalid"|"unknown"> {
  if (!ABSTRACT_KEY) return "unknown";
  try {
    const r = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_KEY}&email=${encodeURIComponent(email)}`);
    const d = await r.json();
    if (d.deliverability === "DELIVERABLE") return "valid";
    if (d.deliverability === "UNDELIVERABLE") return "invalid";
    return "unknown";
  } catch { return "unknown"; }
}

async function runApifySearch(query: string): Promise<any[]> {
  // Start the actor run
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/apify~google-search-scraper/runs?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queries: query,
        maxPagesPerQuery: 1,
        resultsPerPage: 5,
        mobileResults: false,
        languageCode: "en",
        maxConcurrency: 1,
      }),
    }
  );
  if (!startRes.ok) return [];
  const run = await startRes.json();
  const runId = run.data?.id;
  if (!runId) return [];

  // Poll for up to 45 seconds (stay under Vercel's 60s timeout)
  for (let i = 0; i < 9; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    const status = await statusRes.json();
    if (status.data?.status === "SUCCEEDED") {
      const dataRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`);
      return await dataRes.json();
    }
    if (["FAILED","ABORTED","TIMED-OUT"].includes(status.data?.status)) break;
  }
  return [];
}

function extractContacts(results: any[], city: string, state: string, titleHint?: string) {
  const contacts: any[] = [];
  for (const item of results) {
    const text = `${item.title||""} ${item.description||""} ${item.url||""}`;
    const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const titleMatch = titleHint || TARGET_TITLES.find(t => text.toLowerCase().includes(t));

    for (const email of emailMatches) {
      if (email.match(/noreply|no-reply|webmaster@|support@|info@/i)) continue;
      const domain = email.split("@")[1]?.toLowerCase() || "";
      if (!domain.includes(".gov") && !domain.includes("hampton") && !domain.includes(city.toLowerCase().replace(/\s/g,""))) continue;

      const namePart = email.split("@")[0].replace(/[._-]/g," ").replace(/\d+/g,"").trim();
      const name = namePart.split(" ").map((w:string) => w.charAt(0).toUpperCase()+w.slice(1)).join(" ") || "City Official";

      contacts.push({
        name,
        email,
        title: titleMatch || "City Official",
        department: titleMatch?.includes("park") ? "Parks & Recreation" :
          titleMatch?.includes("procurement") ? "Procurement" :
          titleMatch?.includes("event") ? "Special Events" : "City Government",
        city,
        state,
        source_url: item.url || "",
        email_verified: "unknown",
        email_status: "uncontacted",
        notes: `Scraped from: ${(item.url||"").substring(0,80)}`,
      });
    }
  }
  return contacts;
}

export const maxDuration = 55; // Vercel max for hobby plan

export async function POST(req: NextRequest) {
  const { city, state } = await req.json();
  if (!city || !state) return NextResponse.json({ error: "City and state required" }, { status: 400 });

  const allContacts: any[] = [];

  // Run 2 searches in parallel to stay under timeout
  const queries = [
    `"${city}" "${state}" "special events director" site:.gov email`,
    `"city of ${city}" "${state}" "parks director" OR "procurement director" email contact`,
  ];

  const results = await Promise.all(queries.map(q => runApifySearch(q)));
  for (const r of results) {
    allContacts.push(...extractContacts(r, city, state));
  }

  // Deduplicate by email
  const seen = new Set<string>();
  const unique = allContacts.filter(c => { if (seen.has(c.email)) return false; seen.add(c.email); return true; });

  if (unique.length === 0) {
    return NextResponse.json({ success: true, found: 0, saved: 0, message: "No contacts found. Try a larger city." });
  }

  // Verify emails (limit to 10 to stay under Abstract free tier)
  const toVerify = unique.slice(0, 10);
  const verified = await Promise.all(toVerify.map(async c => ({ ...c, email_verified: await verifyEmail(c.email) })));
  const valid = verified.filter(c => c.email_verified !== "invalid");

  // Skip already existing emails
  const { data: existing } = await sb.from("prospects").select("email").in("email", valid.map(c => c.email));
  const existingSet = new Set((existing||[]).map((e:any) => e.email));
  const newOnes = valid.filter(c => !existingSet.has(c.email));

  if (newOnes.length > 0) await sb.from("prospects").insert(newOnes);

  return NextResponse.json({ success: true, found: unique.length, saved: newOnes.length, skipped: valid.length - newOnes.length });
}
