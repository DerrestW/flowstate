import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 300;

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APIFY_TOKEN = process.env.APIFY_API_TOKEN!;

const TARGET_TITLES = [
  "special events", "event coordinator", "event director", "event manager",
  "parks and recreation", "parks director", "recreation director",
  "procurement", "purchasing director", "purchasing manager",
  "city manager", "community events", "festivals", "tourism director",
];

function getDepartment(title: string): string {
  const t = (title || "").toLowerCase();
  if (t.includes("park") || t.includes("recreation")) return "Parks & Recreation";
  if (t.includes("procure") || t.includes("purchas")) return "Procurement";
  if (t.includes("tour")) return "Tourism";
  return "Special Events";
}

function titleMatches(title: string): boolean {
  const t = (title || "").toLowerCase();
  return TARGET_TITLES.some(target => t.includes(target));
}

async function runActorAndGetResults(actorId: string, input: any, waitSecs = 120): Promise<any[]> {
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );
  if (!startRes.ok) {
    const err = await startRes.text();
    throw new Error(`Apify start failed: ${startRes.status} ${err.substring(0,200)}`);
  }
  const runData = await startRes.json();
  const runId = runData?.data?.id;
  if (!runId) throw new Error("No run ID from Apify");

  // Poll for completion
  const polls = Math.ceil(waitSecs / 5);
  for (let i = 0; i < polls; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    const status = await statusRes.json();
    const runStatus = status?.data?.status;
    if (runStatus === "SUCCEEDED") {
      const dataRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=100`);
      return await dataRes.json();
    }
    if (["FAILED", "ABORTED", "TIMED-OUT"].includes(runStatus)) {
      throw new Error(`Apify run ${runStatus}`);
    }
  }
  throw new Error("Apify run timed out");
}

export async function POST(req: NextRequest) {
  const { city, state } = await req.json();
  if (!city || !state) return NextResponse.json({ error: "City and state required" }, { status: 400 });
  if (!APIFY_TOKEN) return NextResponse.json({ error: "Apify token not configured" }, { status: 500 });

  try {
    // Strategy: scrape LinkedIn company employees for "City of [city]"
    // using apify/linkedin-company-employees - no login required
    const companyName = `City of ${city}`;
    const linkedinCompanyUrl = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(companyName)}`;

    let items: any[] = [];

    try {
      items = await runActorAndGetResults("apify~linkedin-company-employees", {
        company: companyName,
        location: `${city}, ${state}`,
        maxResults: 50,
        proxyConfiguration: { useApifyProxy: true },
      }, 120);
    } catch (e1) {
      console.log("LinkedIn company employees failed, trying Google search scraper:", e1);

      // Fallback: Google search for city government staff directory pages
      const queries = [
        `"${city}" "${state}" "special events director" OR "parks director" OR "procurement director" email @${city.toLowerCase().replace(/\s/g,"")}.gov`,
        `site:${city.toLowerCase().replace(/\s+/g,"")}.gov staff directory contact`,
        `"city of ${city}" staff directory "special events" OR "parks" email`,
      ];

      for (const q of queries) {
        try {
          const results = await runActorAndGetResults("apify~google-search-scraper", {
            queries: q,
            maxPagesPerQuery: 2,
            resultsPerPage: 10,
          }, 60);
          items.push(...results);
        } catch (e2) {
          console.log("Google search failed for query:", q, e2);
        }
      }
    }

    // Extract contacts from results
    const contacts: any[] = [];
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.(gov|us|org)/gi;

    for (const item of items) {
      // Handle LinkedIn employee format
      if (item.firstName || item.name) {
        const title = item.title || item.jobTitle || item.headline || "";
        if (!titleMatches(title)) continue;

        const email = item.email || item.emailAddress || null;
        const name = item.name || `${item.firstName || ""} ${item.lastName || ""}`.trim();

        contacts.push({
          name: name || "City Official",
          email: email || `${(name.toLowerCase().replace(/\s+/g,"."))}.noemail@${city.toLowerCase().replace(/\s+/g,"")}.placeholder`,
          title,
          department: getDepartment(title),
          city, state,
          source_url: item.linkedinUrl || item.profileUrl || "",
          email_verified: email ? "unknown" : "invalid",
          email_status: "uncontacted",
          notes: `LinkedIn: ${companyName}${email ? "" : " (no email found)"}`,
        });
        continue;
      }

      // Handle Google search result format - extract emails from text
      const text = `${item.title||""} ${item.description||""} ${item.url||""}`;
      const emails = text.match(emailRegex) || [];

      for (const email of emails) {
        if (/noreply|donotreply|info@|webmaster@|admin@/i.test(email)) continue;
        const localPart = email.split("@")[0];
        const nameParts = localPart.replace(/[._\-]/g, " ").split(" ")
          .filter(p => p.length > 1 && !/\d/.test(p))
          .map(p => p.charAt(0).toUpperCase() + p.slice(1));
        const titleMatch = TARGET_TITLES.find(t => text.toLowerCase().includes(t));

        contacts.push({
          name: nameParts.join(" ") || "City Official",
          email: email.toLowerCase(),
          title: titleMatch ? titleMatch.split(" ").map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(" ") : "City Official",
          department: getDepartment(titleMatch || ""),
          city, state,
          source_url: item.url || "",
          email_verified: "unknown",
          email_status: "uncontacted",
          notes: `Google: ${(item.url||"").substring(0,100)}`,
        });
      }
    }

    if (contacts.length === 0) {
      return NextResponse.json({
        success: true, found: 0, saved: 0,
        message: `No contacts found for ${city}, ${state}.`,
      });
    }

    // Deduplicate by email
    const seen = new Set<string>();
    const unique = contacts.filter(c => {
      if (seen.has(c.email)) return false;
      seen.add(c.email);
      return true;
    });

    // Skip existing
    const { data: existing } = await sb.from("prospects").select("email");
    const existingEmails = new Set((existing || []).map((e: any) => e.email));
    const newContacts = unique.filter(c => !existingEmails.has(c.email));

    if (newContacts.length > 0) await sb.from("prospects").insert(newContacts);

    return NextResponse.json({
      success: true,
      found: contacts.length,
      saved: newContacts.length,
      skipped: unique.length - newContacts.length,
    });

  } catch (e: any) {
    console.error("Scan error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
