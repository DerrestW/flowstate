import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const { data, error } = await sb.from("seo_pages").select("*").order("sort_order", {ascending:true});
  if (error) { const { data: d2, error: e2 } = await sb.from("seo_pages").select("*").order("created_at", {ascending:false}); return NextResponse.json(d2 || []); }
  return NextResponse.json(data || []);
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await sb.from("seo_pages").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const { error } = await sb.from("seo_pages").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await sb.from("seo_pages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
