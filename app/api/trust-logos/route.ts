import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const TABLE = "trust_logos";
export async function GET() {
  const { data, error } = await sb.from(TABLE).select("*").order("sort_order", {ascending:true}).order("created_at", {ascending:false});
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await sb.from(TABLE).insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const { error } = await sb.from(TABLE).update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await sb.from(TABLE).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
