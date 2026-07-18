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
  "community events", "festivals", "tourism", "city manager",
];

function getDepartment(title: string): string {
  const t = (title || "").toLowerCase();
  if (t.includes("park") || t.includes("recreation")) return "Parks & Recreation";
  if (t.includes("procure") || t.includes("purchas")) return "Procurement";
  if (t.includes("tour")) return "Tourism";
  return "Special Events";
}

async function waitForRun(runId: string, maxWaitSecs = 120): Promise<any[]> {
  const polls = Math.ceil(maxWaitSecs / 5);
  for (let i = 0; i < polls; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const res = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    const s = await res.json();
    if (s?.data?.status === "SUCCEEDED") {
      const d = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}&limit=100`);
      return await d.json();
    }
    if (["FAILED","ABORTED","TIMED-OUT"].includes(s?.data?.status)) return [];
  }
  return [];
}

async function startRun(actorId: string, input: any): Promise<string | null> {
  const res = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/runs?token=${APIFY_TOKEN}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data?.id || null;
}

export async function POST(req: NextRequest) {
  const { city, state } = await req.json();
  if (!city || !state) return NextResponse.json({ error: "City and state required" }, { status: 400 });
  if (!APIFY_TOKEN) return NextResponse.json({ error: "Apify token not configured" }, { status: 500 });

  try {
    // Step 1: Google search to find the RIGHT pages
    const queries = [
      `site:${city.toLowerCase().replace(/\s+/g,"")}.gov staff directory`,
      `site:${city.toLowerCase().replace(/\s+/g,"")}.gov contact departments`,
      `"${city}" "${state}" "special events director" email`,
      `"${city}" "${state}" "parks director" email`,
      `"${city}" "${state}" "procurement director" email`,
    ].join("\n");

    const searchRunId = await startRun("apify~google-search-scraper", {
      queries,
      maxPagesPerQuery: 2,
      resultsPerPage: 5,
    });

    const searchResults = searchRunId ? await waitForRun(searchRunId, 60) : [];

    // Extract URLs from search results
    const urlsToScrape = new Set<string>();
    const citySlug = city.toLowerCase().replace(/\s+/g, "");

    // Always include known gov staff pages directly
    [
      `https://www.${citySlug}.gov/directory`,
      `https://www.${citySlug}.gov/staff`,
      `https://www.${citySlug}.gov/departments`,
      `https://www.${citySlug}.gov/contact`,
      `https://www.${citySlug}.gov/government`,
      `https://www.${citySlug}tx.gov`,
      `https://www.${citySlug}va.gov`,
      `https://www.${citySlug}nc.gov`,
      `https://www.${citySlug}fl.gov`,
    ].forEach(u => urlsToScrape.add(u));

    // Extract actual page URLs from Google organic results (NOT top-level item.url which is a Google URL)
    for (const item of searchResults) {
      const organics = item.organicResults || item.items || [];
      for (const organic of organics) {
        const url = organic.url || organic.link || organic.displayedUrl || "";
        if (!url || url.includes("google.com")) continue;
        if (url.includes(".gov") || url.includes(citySlug) || url.includes(city.toLowerCase())) {
          urlsToScrape.add(url);
        }
      }
    }
    
    console.log("URLs to scrape:", [...urlsToScrape].slice(0, 5));

    // Step 2: Crawl those pages with the Contact Info Scraper
    const crawlRunId = await startRun("apify~contact-info-scraper", {
      startUrls: [...urlsToScrape].slice(0, 20).map(url => ({ url })),
      maxDepth: 2,
      maxPagesPerStartUrl: 5,
      proxyConfiguration: { useApifyProxy: true },
    });

    const crawlResults = crawlRunId ? await waitForRun(crawlRunId, 150) : [];

    // Step 3: Extract contacts from crawl results
    const contacts: any[] = [];
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/gi;

    for (const page of crawlResults) {
      const emails = page.emails || [];
      const text = page.text || page.content || "";
      const pageUrl = page.url || "";

      for (const email of emails) {
        if (!email || /noreply|donotreply|webmaster|info@|admin@|spam|example/i.test(email)) continue;

        // Try to find context around this email
        const idx = text.indexOf(email);
        const surrounding = idx >= 0 ? text.substring(Math.max(0, idx-300), idx+300) : "";

        // Look for name and title near email
        const nameMatch = surrounding.match(/([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
        const titleMatch = TARGET_TITLES.find(t => surrounding.toLowerCase().includes(t));

        const name = nameMatch?.[1] || email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

        contacts.push({
          name,
          email: email.toLowerCase(),
          title: titleMatch?.split(" ").map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(" ") || "City Official",
          department: getDepartment(titleMatch || ""),
          city, state,
          source_url: pageUrl,
          email_verified: "unknown",
          email_status: "uncontacted",
          notes: `Scraped: ${pageUrl.substring(0, 100)}`,
        });
      }
    }

    // Also check Google snippets for emails (sometimes they appear)
    for (const item of searchResults) {
      const text = `${item.title||""} ${item.description||""} ${item.url||""}`;
      const emails = text.match(emailRegex) || [];
      for (const email of emails) {
        if (/noreply|donotreply|webmaster|info@/i.test(email)) continue;
        const domain = email.split("@")[1] || "";
        if (!domain.includes(".gov") && !domain.includes(citySlug)) continue;
        const titleMatch = TARGET_TITLES.find(t => text.toLowerCase().includes(t));
        contacts.push({
          name: email.split("@")[0].replace(/[._\-]/g," ").replace(/\b\w/g,(l:string)=>l.toUpperCase()),
          email: email.toLowerCase(),
          title: titleMatch?.split(" ").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ") || "City Official",
          department: getDepartment(titleMatch||""),
          city, state,
          source_url: item.url||"",
          email_verified: "unknown",
          email_status: "uncontacted",
          notes: `Google snippet: ${item.url?.substring(0,100)||""}`,
        });
      }
    }

    if (contacts.length === 0) {
      return NextResponse.json({
        success: true, found: 0, saved: 0,
        debug: {
          searchResults: searchResults.length,
          urlsScraped: urlsToScrape.size,
          crawlResults: crawlResults.length,
        },
        message: `No email contacts found for ${city}, ${state}. The city may use contact forms instead of email addresses.`,
      });
    }

    // Deduplicate
    const seen = new Set<string>();
    const unique = contacts.filter(c => { if (seen.has(c.email)) return false; seen.add(c.email); return true; });

    // Skip existing
    const { data: existing } = await sb.from("prospects").select("email");
    const existingEmails = new Set((existing||[]).map((e:any)=>e.email));
    const newContacts = unique.filter(c => !existingEmails.has(c.email));

    if (newContacts.length > 0) await sb.from("prospects").insert(newContacts);

    return NextResponse.json({
      success: true,
      found: contacts.length,
      unique: unique.length,
      saved: newContacts.length,
    });

  } catch (e: any) {
    console.error("Scan error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
