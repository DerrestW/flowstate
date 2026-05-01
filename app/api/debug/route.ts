import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const sb = createClient(url!, serviceKey!);

  // Test read
  const { data: readData, error: readError } = await sb
    .from("experiences")
    .select("id, slug, title")
    .limit(1);

  // Test update
  let updateResult = null;
  if (readData?.[0]) {
    const { data: ud, error: ue } = await sb
      .from("experiences")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", readData[0].id)
      .select("id, updated_at")
      .single();
    updateResult = ue ? { error: ue.message, code: ue.code } : { success: true, data: ud };
  }

  return NextResponse.json({
    env: {
      hasUrl: !!url,
      hasServiceKey: !!serviceKey,
      keyPrefix: serviceKey?.substring(0, 25),
    },
    read: readError ? { error: readError.message, code: readError.code } : { ok: true, record: readData?.[0]?.slug },
    update: updateResult,
  });
}
