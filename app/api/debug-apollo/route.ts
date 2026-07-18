import { NextResponse } from "next/server";

export async function GET() {
  const APOLLO_KEY = process.env.APOLLO_API_KEY;
  
  if (!APOLLO_KEY) {
    return NextResponse.json({ error: "No Apollo key found in env" });
  }

  // Test with simplest possible search - just a location
  const url = `https://api.apollo.io/api/v1/mixed_people/api_search?person_titles[]=special+events+director&person_locations[]=Austin%2C+TX%2C+US&per_page=5&page=1`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": APOLLO_KEY,
      },
    });

    const text = await res.text();
    let parsed: any;
    try { parsed = JSON.parse(text); } catch { parsed = text; }

    return NextResponse.json({
      status: res.status,
      keyPrefix: APOLLO_KEY.substring(0, 8) + "...",
      url,
      response: typeof parsed === "object" ? {
        total_entries: parsed.total_entries,
        people_count: parsed.people?.length,
        pagination: parsed.pagination,
        error: parsed.error,
        message: parsed.message,
        first_person: parsed.people?.[0] ? {
          name: `${parsed.people[0].first_name} ${parsed.people[0].last_name}`,
          title: parsed.people[0].title,
          email: parsed.people[0].email,
          org: parsed.people[0].organization?.name,
        } : null,
      } : parsed.substring(0, 500),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
