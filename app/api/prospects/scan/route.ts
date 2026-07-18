import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APOLLO_KEY = process.env.APOLLO_API_KEY!;

const TARGET_TITLES = [
  "special events director",
  "special events coordinator",
  "director of special events",
  "parks and recreation director",
  "parks director",
  "event manager",
  "procurement manager",
  "procurement director",
  "recreation director",
  "festivals coordinator",
  "community events manager",
  "tourism director",
];

async function searchPeople(city: string, state: string): Promise<any[]> {
  const people: any[] = [];

  // Search in batches of titles - params go in URL query string
  const titlesQuery = TARGET_TITLES.map(t => `person_titles[]=${encodeURIComponent(t)}`).join("&");
  const locationQuery = `person_locations[]=${encodeURIComponent(`${city}, ${state}, US`)}`;
  
  const url = `https://api.apollo.io/api/v1/mixed_people/api_search?${titlesQuery}&${locationQuery}&per_page=25&page=1`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "X-Api-Key": APOLLO_KEY,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apollo search failed: ${res.status} ${text.substring(0, 200)}`);
  }

  const data = await res.json();
  return data?.people || [];
}

async function enrichPerson(personId: string): Promise<string | null> {
  // Enrich to get email - costs 1 credit per person
  const res = await fetch("https://api.apollo.io/api/v1/people/match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": APOLLO_KEY,
    },
    body: JSON.stringify({ id: personId }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.person?.email || null;
}

export async function POST(req: NextRequest) {
  const { city, state } = await req.json();
  if (!city || !state) {
    return NextResponse.json({ error: "City and state required" }, { status: 400 });
  }

  if (!APOLLO_KEY) {
    return NextResponse.json({ error: "Apollo API key not configured" }, { status: 500 });
  }

  try {
    // Step 1: Search for people (free, no credits)
    const people = await searchPeople(city, state);

    if (people.length === 0) {
      return NextResponse.json({
        success: true, found: 0, saved: 0,
        message: `No contacts found in Apollo for ${city}, ${state}. Try a larger city or different state.`,
      });
    }

    // Step 2: Check which ones already exist
    const { data: existing } = await sb
      .from("prospects")
      .select("email")
      .not("email", "is", null);
    const existingEmails = new Set((existing || []).map((e: any) => e.email));

    // Step 3: Enrich up to 10 new people to get emails (uses credits)
    const contacts: any[] = [];
    let enriched = 0;

    for (const person of people) {
      if (enriched >= 10) break; // Cap enrichments per scan to save credits

      // Some people already have email in search results
      let email = person.email || null;

      if (!email && person.id) {
        email = await enrichPerson(person.id);
        enriched++;
        await new Promise(r => setTimeout(r, 200)); // Rate limit
      }

      if (!email || existingEmails.has(email)) continue;

      contacts.push({
        name: `${person.first_name || ""} ${person.last_name || ""}`.trim() || "City Official",
        email: email.toLowerCase(),
        title: person.title || "City Official",
        department: getDepartment(person.title || ""),
        city,
        state,
        source_url: person.linkedin_url || "",
        email_verified: "valid",
        email_status: "uncontacted",
        notes: `Apollo: ${person.organization?.name || `City of ${city}`}`,
      });
    }

    if (contacts.length > 0) {
      await sb.from("prospects").insert(contacts);
    }

    return NextResponse.json({
      success: true,
      found: people.length,
      enriched,
      saved: contacts.length,
      skipped: people.length - contacts.length,
    });
  } catch (e: any) {
    console.error("Scan error:", e);
    return NextResponse.json({ error: e.message || "Scan failed" }, { status: 500 });
  }
}

function getDepartment(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("park")) return "Parks & Recreation";
  if (t.includes("procure") || t.includes("purchas")) return "Procurement";
  if (t.includes("tour")) return "Tourism";
  return "Special Events";
}
