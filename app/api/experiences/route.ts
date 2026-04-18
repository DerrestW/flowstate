import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    if (error) return NextResponse.json(null);
    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const { error } = await supabase
    .from("experiences")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = body.title?.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"") || "";
  const { data, error } = await supabase
    .from("experiences")
    .insert({ ...body, slug })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
