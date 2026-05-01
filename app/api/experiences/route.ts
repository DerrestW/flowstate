import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Always use service role key — never fall back to anon (anon gets blocked by RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const admin = searchParams.get("admin"); // ?admin=1 returns all including unpublished

  if (slug) {
    // Public fetch by slug — only published
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) return NextResponse.json(null);
    return NextResponse.json(data);
  }

  // Admin fetch returns ALL records; public fetch returns published only
  let query = supabase.from("experiences").select("*").order("sort_order");
  if (!admin) query = query.eq("published", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { data, error } = await supabase
    .from("experiences")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("PATCH experiences error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = body.slug || body.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "";
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
