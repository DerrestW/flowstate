import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state");
  const city = searchParams.get("city");
  const status = searchParams.get("status");

  // Supabase returns at most 1,000 rows per request, so page through everything
  const PAGE = 1000;
  const data: any[] = [];
  let error: any = null;
  for (let from = 0; from < 20000; from += PAGE) {
    let query = sb.from("prospects").select("*").order("created_at", { ascending: false }).order("id").range(from, from + PAGE - 1);
    if (state) query = query.eq("state", state);
    if (city) query = query.eq("city", city);
    if (status) query = query.eq("email_status", status);
    const res = await query;
    if (res.error) { error = res.error; break; }
    data.push(...(res.data || []));
    if (!res.data || res.data.length < PAGE) break;
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await sb
    .from("prospects")
    .insert({ ...body, created_at: new Date().toISOString() })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await sb
    .from("prospects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await sb.from("prospects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
