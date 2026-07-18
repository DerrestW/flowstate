import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 300;

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APIFY_TOKEN = process.env.APIFY_API_TOKEN!;

const TITLE_SEARCHES = [
  "special events director",
  "special events coordinator", 
  "parks and recreation director",
  "event manager city",
  "procurement director city",
  "recreation director",
];

function getDepartment(title: string): string {
  const t = (title || "").toLowerCase();
  if (t.includes("park") || t.includes("recreation")) return "Parks & Recreation";
  if (t.includes("procure") || t.includes("purchas")) return "Procurement";
  if (t.includes("tour")) return "Tourism";
  return "Special Events";
}

async function waitForRun(runId: string, maxWaitSecs = 180): Promise<any[]> {
  const polls = Math.ceil(maxWaitSecs / 5);
  for (let i = 0; i < polls; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const res = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    const s = await res.json();
    const status = s?.data?.status;
    if (status === "SUCCEEDED") {
      const d = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=50`);
      return await d.json();
    }
    if (["FAILED","ABORTED","TIMED-OUT"].includes(status)) {
      console.error("Run failed:", status, s?.data?.statusMessage);
      return [];
    }
  }
  return [];
}

async function searchLinkedIn(searchQuery: string, location: string): Promise<any[]> {
  const res = await fetch(
    `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-search/runs?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "basic",
        searchQuery,
        locations: [location],
        maxResults: 10,
        scrapeFullProfile: false,
      }),
    }
  );
  if (!res.ok) {
    console.error("LinkedIn scraper start failed:", res.status, await res.text());
    return [];
  }
  const run = await res.json();
  return waitForRun(run?.data?.id, 120);
}

export async function POST(req: NextRequest) {
  const { city, state } = await req.json();
  if (!city || !state) return NextResponse.json({ error: "City and state required" }, { status: 400 });
  if (!APIFY_TOKEN) return NextResponse.json({ error: "Apify token not configured" }, { status: 500 });

  try {
    const location = `${city}, ${state}`;
    const allPeople: any[] = [];

    // Run searches for each title sequentially to avoid hammering the API
    for (const title of TITLE_SEARCHES) {
      const query = `${title} city of ${city}`;
      const results = await searchLinkedIn(query, location);
      allPeople.push(...results);
      // Small delay between searches
      await new Promise(r => setTimeout(r, 1000));
    }

    if (allPeople.length === 0) {
      return NextResponse.json({
        success: true, found: 0, saved: 0,
        message: `No LinkedIn profiles found for ${city}, ${state}.`,
      });
    }

    // Build contacts from LinkedIn profiles
    const contacts = allPeople
      .filter((p: any) => p.firstName || p.name || p.fullName)
      .map((p: any) => ({
        name: p.fullName || p.name || `${p.firstName || ""} ${p.lastName || ""}`.trim(),
        email: p.email || p.emailAddress || `unknown-${p.id || Math.random().toString(36).substring(2,8)}@noemail.placeholder`,
        title: p.headline || p.jobTitle || p.currentPosition || "City Official",
        department: getDepartment(p.headline || p.jobTitle || ""),
        city, state,
        source_url: p.linkedinUrl || p.profileUrl || p.url || "",
        email_verified: p.email ? "unknown" : "invalid",
        email_status: "uncontacted",
        notes: `LinkedIn: ${p.currentCompany || `City of ${city}`}${p.email ? "" : " — no email, use LinkedIn to contact"}`,
      }));

    // Deduplicate by LinkedIn URL or name
    const seen = new Set<string>();
    const unique = contacts.filter((c: any) => {
      const key = c.source_url || c.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Skip existing
    const { data: existing } = await sb.from("prospects").select("email, source_url");
    const existingEmails = new Set((existing||[]).map((e:any) => e.email));
    const existingUrls = new Set((existing||[]).map((e:any) => e.source_url).filter(Boolean));
    const newContacts = unique.filter((c: any) => 
      !existingEmails.has(c.email) && !existingUrls.has(c.source_url)
    );

    if (newContacts.length > 0) await sb.from("prospects").insert(newContacts);

    return NextResponse.json({
      success: true,
      found: allPeople.length,
      unique: unique.length,
      saved: newContacts.length,
    });

  } catch (e: any) {
    console.error("Scan error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
