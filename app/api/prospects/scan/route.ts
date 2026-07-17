import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APIFY_TOKEN = process.env.APIFY_API_TOKEN!;
const ABSTRACT_KEY = process.env.ABSTRACT_API_KEY;

// Job titles we're looking for
const TARGET_TITLES = [
  "special events director",
  "special events coordinator",
  "director of special events",
  "parks and recreation director",
  "parks director",
  "event manager",
  "city events manager",
  "procurement manager",
  "procurement director",
  "director of parks",
  "recreation director",
  "festivals coordinator",
  "community events",
  "city manager",
  "parks manager",
];

async function verifyEmail(email: string): Promise<"valid" | "invalid" | "unknown"> {
  if (!ABSTRACT_KEY) return "unknown";
  try {
    const r = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_KEY}&email=${encodeURIComponent(email)}`
    );
    const data = await r.json();
    if (data.deliverability === "DELIVERABLE") return "valid";
    if (data.deliverability === "UNDELIVERABLE") return "invalid";
    return "unknown";
  } catch {
    return "unknown";
  }
}

async function runApifyScraper(city: string, state: string): Promise<any[]> {
  // Use Apify's Google Search Scraper to find government contacts
  const searchQueries = [
    `"${city}" "${state}" "special events director" site:${city.toLowerCase().replace(/\s/g, "")}.gov email`,
    `"${city} ${state}" "parks and recreation director" email contact`,
    `"${city}" "event coordinator" "city of" email -linkedin`,
    `site:${city.toLowerCase().replace(/\s/g, "")}.gov "special events" contact`,
    `"city of ${city}" "${state}" procurement director email`,
  ];

  const contacts: any[] = [];

  for (const query of searchQueries) {
    try {
      // Start Apify actor run
      const runRes = await fetch(
        `https://api.apify.com/v2/acts/apify~google-search-scraper/runs?token=${APIFY_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            queries: query,
            maxPagesPerQuery: 2,
            resultsPerPage: 10,
            mobileResults: false,
            languageCode: "en",
            maxConcurrency: 1,
          }),
        }
      );

      if (!runRes.ok) continue;
      const run = await runRes.json();
      const runId = run.data?.id;
      if (!runId) continue;

      // Poll for results (max 30 seconds)
      let results = null;
      for (let i = 0; i < 6; i++) {
        await new Promise(r => setTimeout(r, 5000));
        const statusRes = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
        );
        const status = await statusRes.json();
        if (status.data?.status === "SUCCEEDED") {
          const dataRes = await fetch(
            `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${APIFY_TOKEN}`
          );
          results = await dataRes.json();
          break;
        }
        if (["FAILED", "ABORTED"].includes(status.data?.status)) break;
      }

      if (!results) continue;

      // Parse search results for contact info
      for (const item of results) {
        const text = `${item.title || ""} ${item.description || ""} ${item.url || ""}`;

        // Extract emails from text
        const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];

        // Try to identify person name and title from text
        const titleMatch = TARGET_TITLES.find(t =>
          text.toLowerCase().includes(t.toLowerCase())
        );

        for (const email of emailMatches) {
          // Filter out generic/no-reply emails
          if (email.match(/noreply|no-reply|info@|admin@|webmaster@/i)) continue;
          // Must have .gov or city domain
          if (!email.match(/\.gov$|city\.|cityof/i) && !email.includes(city.toLowerCase().replace(/\s/g, ""))) continue;

          // Extract name from email (e.g. john.smith@austin.gov → John Smith)
          const namePart = email.split("@")[0];
          const guessedName = namePart
            .replace(/[._-]/g, " ")
            .replace(/\d+/g, "")
            .trim()
            .split(" ")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          contacts.push({
            name: guessedName || "Unknown",
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
            notes: `Found via: "${query.substring(0, 80)}..."`,
          });
        }
      }
    } catch (e) {
      console.error("Apify query error:", e);
    }
  }

  return contacts;
}

export async function POST(req: NextRequest) {
  const { city, state } = await req.json();

  if (!city || !state) {
    return NextResponse.json({ error: "City and state required" }, { status: 400 });
  }

  try {
    // Run the scraper
    const rawContacts = await runApifyScraper(city, state);

    if (rawContacts.length === 0) {
      return NextResponse.json({
        success: true,
        found: 0,
        saved: 0,
        message: "No contacts found. Try a larger city or different search.",
      });
    }

    // Deduplicate by email
    const seen = new Set<string>();
    const unique = rawContacts.filter(c => {
      if (seen.has(c.email)) return false;
      seen.add(c.email);
      return true;
    });

    // Verify emails
    const verified = await Promise.all(
      unique.map(async (c) => ({
        ...c,
        email_verified: await verifyEmail(c.email),
      }))
    );

    // Filter out invalid emails
    const valid = verified.filter(c => c.email_verified !== "invalid");

    // Check which emails already exist in DB
    const { data: existing } = await sb
      .from("prospects")
      .select("email")
      .in("email", valid.map(c => c.email));

    const existingEmails = new Set((existing || []).map((e: any) => e.email));
    const newContacts = valid.filter(c => !existingEmails.has(c.email));

    // Insert new contacts
    if (newContacts.length > 0) {
      await sb.from("prospects").insert(newContacts);
    }

    return NextResponse.json({
      success: true,
      found: rawContacts.length,
      unique: unique.length,
      valid: valid.length,
      saved: newContacts.length,
      skipped: valid.length - newContacts.length,
    });
  } catch (e: any) {
    console.error("Scan error:", e);
    return NextResponse.json({ error: e.message || "Scan failed" }, { status: 500 });
  }
}
