import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "homepage";
  const { data, error } = await sb
    .from("page_content")
    .select("*")
    .eq("page_slug", page);
  if (error) return NextResponse.json({}, { status: 500 });
  // Convert rows to nested object: { section: { key: value } }
  const result: Record<string, Record<string, string>> = {};
  (data || []).forEach((row: any) => {
    if (!result[row.section]) result[row.section] = {};
    result[row.section][row.key] = row.value;
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const { page = "homepage", section, data } = await req.json();
  // Upsert each key
  const rows = Object.entries(data as Record<string, string>).map(([key, value]) => ({
    page_slug: page,
    section,
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await sb
    .from("page_content")
    .upsert(rows, { onConflict: "page_slug,section,key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
