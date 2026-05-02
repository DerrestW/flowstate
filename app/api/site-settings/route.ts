import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const { data, error } = await sb.from("site_settings").select("*").order("sort_order", {ascending:true});
  if (error) { const { data: d2, error: e2 } = await sb.from("site_settings").select("*").order("created_at", {ascending:false}); return NextResponse.json(d2 || []); }
  return NextResponse.json(data || []);
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await sb.from("site_settings").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  // Handle both { id, ...updates } and { settings: Record<key,value> }
  if (body.settings && typeof body.settings === "object") {
    // Upsert each key-value pair
    const rows = Object.entries(body.settings as Record<string,string>).map(([key, value]) => ({
      key, value, updated_at: new Date().toISOString()
    }));
    const { error } = await sb.from("site_settings").upsert(rows, { onConflict: "key" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await sb.from("site_settings").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await sb.from("site_settings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
